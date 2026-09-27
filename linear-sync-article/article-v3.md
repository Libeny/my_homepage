# Agent 跑到一半网页刷新了，然后呢？

做 AI 应用的大多经历过这个场景：Agent 跑了八分钟，调了六次工具，刚写出一半代码，用户手滑刷新了页面。SSE 连接一断，中间状态全丢。只能把请求重新发一遍，再等八分钟。token 烧了，用户也走了。

根源在交互设计：我们习惯把耗时几分钟的 Agent Run 粗暴当成一次普通 HTTP 请求。连接断了，就只能从头重来。

Linear 不用重来。它的客户端断网照样改数据，重新联网后自动追平。这套体验靠的是它的同步引擎 LSE（Linear Sync Engine）。前段时间有人把 LSE 逆向成了一份文档（GitHub: wzhudev/reverse-linear-sync-engine），Linear CTO 公开评价它是「现存最好的文档，包括内部文档」。我把文档和源码读了一遍，顺着思路往 AI Agent 应用推了一步。

LSE 的核心是三件事：本地事务队列、全局递增序号同步、按需加载。

## 一、本地事务队列：先改内存，再排队

用户在界面上点一下，不应该等网络返回。

比如把 Issue 负责人改成 Bob，内存里的模型立即变，界面同步显示 Bob。同时把一条 Transaction 写进 IndexedDB 队列，随后批量发往服务端。

```text
用户操作
   ↓
内存模型立即改        ← 用户看到的
   ↓
Transaction 入队      ← IndexedDB 持久化
   ↓
批量发 Server
```

乐观更新只改内存，本地数据库（IndexedDB）只写服务端确认过的状态。这个边界把失败处理变得很干净。

失败分两类，处理方式完全不同：

- **网络失败**：服务端根本没收到。Transaction 还留在本地队列里，网络恢复后重发。重启 App 也丢不掉，队列已持久化在本地。断网时用户可以继续干活，操作一条条在本地攒着。
- **服务端拒绝**：权限不足或状态不允许。这才是真正的 Transaction 失败。Transaction 存着修改前的旧值，执行 rollback 把内存撤回去。本地数据库从没被提前修改过，撤回只动内存，不牵扯数据修复。

网络失败走 Retry，服务端拒绝走 Rollback。

还有一种并发中间态：你的 Transaction 还没被服务端处理，别人的修改先到了。服务端把别人的 Delta 推给你，如果直接覆盖内存，刚改的 Bob 就会被冲掉。LSE 的解法是 Rebase：把你那条「从 Tom 改成 Bob」的 Transaction，重新解释成「从 Alice 改成 Bob」。界面继续显示 Bob，保住你的修改意图。

## 二、全局序号：用一个递增数字追平状态

多端同时在线时，客户端必须清楚自己遗漏了哪些数据变更。

LSE 给服务端的每个变更分配一个全局递增的 syncId。客户端只需记录一个数字：lastSyncId。

```text
Server:  100 ─ 101 ─ 102 ─ 103 ─ 104
                ↑
Client:  lastSyncId = 100，补齐 101~104
```

断线重连、换设备、打开半年没用的电脑，都是同一句话：向服务端请求 lastSyncId 之后的变更。实时推送走 WebSocket，syncId 就是游标，专门用来对账和补课。

Transaction 代表客户端意图（「我要做什么」），Delta 代表服务端事实（「实际发生了什么」）。客户端发一条创建 Issue 的 Transaction，服务端执行时可能顺手写入 history、activity 并更新计数器。返回的 Delta 会比你的 Transaction 多出一长串副作用，客户端最终以 Delta 为准。

并发冲突由服务端仲裁。服务端把所有 Transaction 排成全序，同一字段的并发修改以「后到达服务端的为准」（Last Writer Wins）。注意这里的顺序由到达服务端的时间决定，不是点击时间。A 在 10:00:00 点击 Done，B 在 10:00:01 点击 Cancelled，若 B 的请求先抵达，B 分配到 100，A 分配到 101，最终状态是 Done。

服务端定胜负，客户端 Rebase 只管在结果出来之前别让界面乱掉。

## 三、按需加载：一百万条数据不进浏览器

一个大型 workspace 动辄几十万个对象，客户端装不下。

LSE 在两个维度上控制数据流向：

- **Sync Scope 决定能不能同步**：受权限、workspace、sync group 限制，不在授权范围内的变更不会推到客户端。
- **Load Strategy 决定什么时候加载**：每个模型的元数据中定义了加载策略：instant 启动即载，lazy 用到才载，partial 只载部分，explicitlyRequested 显式请求才载，local 只留本地。Issue 的标题和状态是 instant，history 则是 explicitlyRequested。用户打开首页，浏览器只拿渲染列表必需的几个字段。

Sync Engine 管「哪些数据要保持一致」，Lazy Loading 则管「哪些数据当下值得加载」。

## 把这三件套搬到 AI Agent

回到开头的故障场景。Agent Run 是一条持续演进的状态流：创建任务、制定计划、调度工具、获取结果、继续推理。整个过程持续几分钟到几小时，中间不断产生新状态。如果按普通请求来设计，连接一断，整个执行过程就全废了。

LSE 的三件套几乎可以原样平移到 AI Agent：

| Linear | AI Agent |
|---|---|
| Issue 状态 | Agent Task 状态 |
| Transaction | 用户操作 / Agent 动作 |
| syncId | 事件序号 |
| Delta | Agent 事件 |
| 本地数据库 | 本地 Agent State |
| Transaction Queue | 待发送的用户输入 |
| Rebase | 事件重放、状态对账 |
| Lazy Loading | 按需加载工具结果和上下文 |

接口设计上拆成两步，别挂着一个 `POST /agent/run` 的 SSE 长连接干等。

先创建任务：

```text
POST /tasks        → 拿到 Task ID = 123
```

服务端在后台执行并持续产生带序号的事件：

```text
seq=100  task.created
seq=101  agent.started
seq=102  planning.completed
seq=103  tool.call
seq=104  tool.result
...
```

客户端只需在本地记一个 lastSeq。网络中断、刷新页面或者切换到移动端，都统一发送同一个补齐请求：

```text
GET /tasks/123/events?after=105
```

服务端补齐 106 之后的事件，客户端界面接着往前走，Agent 不用重跑。

在这个架构里，SSE 或 WebSocket 只是实时管道，断了就断了。状态的可靠性立在四样东西上：事件流、递增序号、本地状态与重放机制。

AI Agent 比 Linear 还多一层：Linear 同步的是业务数据（Issue、Comment、Project），AI Agent 还要同步执行过程——任务计划、工具调用的入参和返回值、推理中间态以及人工审批断点。它同步的不只是最终结果，更是完整的执行现场。

## 带走一张检查清单

对照检查你的 AI 应用：

- Agent Run 有全局递增的事件序号吗？
- 断线或刷新后能用 after=lastSeq 增量补齐，还是只能从头重跑？
- 用户在断网或卡顿时输入，能在本地排队，还是直接丢了？
- 页面刷新后，已完成的工具调用入参和返回结果还在不在？
- 换一台设备登录，能否看到同一个任务走到哪一步？

五条里缺了哪一条，对应的就是 LSE 三件套里缺的那一块。

把 Agent Run 从单次长请求重构为带序号的状态流。网络重连、页面防刷与多端对账，便只是这套机制自然带出的基本能力。
