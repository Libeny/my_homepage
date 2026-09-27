# Agent 跑到一半网页刷新了，然后呢？

做 AI 应用的人对这个场景不陌生：Agent 跑了八分钟，调了六次工具，写了一半代码。用户手滑刷新页面，SSE 断了，中间过程全没。只能把请求重发一遍，再等八分钟。token 烧了，用户走了。

这个 bug 的根源不在网络，在设计：我们把 Agent Run 当成了一次 HTTP 请求。请求会断，断了就重来。

Linear 不用重来。它的客户端断网照样改数据，重新联网后自动追平。支撑这个体验的是它的同步引擎 LSE（Linear Sync Engine）。前段时间有人把 LSE 逆向成了一份文档（GitHub: wzhudev/reverse-linear-sync-engine），Linear CTO 公开说它是"现存最好的文档，包括内部文档"。我把文档和代码读了一遍，又顺着讨论往 AI 应用的方向推了一步。

LSE 的核心是三件事：本地事务队列、全局序号增量同步、按需加载。下面逐个说，每件事先说它解决什么痛。

## 一、本地事务队列：先改内存，再排队

第一个问题：用户点了一下，要不要等网络？

Linear 的回答是不要。用户把 Issue 负责人改成 Bob，内存里的模型立即变，界面马上显示 Bob。同时生成一条 Transaction，持久化进 IndexedDB 的队列，之后批量发给服务端。

```text
用户操作
   ↓
内存模型立即改        ← 用户看到的
   ↓
Transaction 入队      ← IndexedDB 持久化
   ↓
批量发 Server
```

注意一个细节：乐观更新的是内存，不是本地数据库。本地数据库只写服务端确认过的状态。这个区分决定了失败处理有多简单。

失败分两类，处理方式完全不同。

网络失败：服务端根本没收到。Transaction 还躺在队列里，网络恢复后重发。重启 App 也丢不掉，队列是持久化的。所以断网时用户可以继续干活，操作一条条攒着。

服务端拒绝：权限不够、状态不允许。这才是 Transaction 失败。Transaction 里存着修改前的旧值，执行 rollback，内存状态撤回去。因为本地数据库从没被提前改过，撤回只动内存，不牵扯数据修复。

一句话：网络失败走 Retry，服务端拒绝走 Rollback。

还有一种中间态：你的 Transaction 还没轮到，别人的修改先到了。服务端把别人的 Delta 推给你，如果直接覆盖内存，你刚改的 Bob 就没了。LSE 的做法是 Rebase：把你那条"从 Tom 改成 Bob"的 Transaction，重新解释成"从 Alice 改成 Bob"。界面继续显示 Bob，你的意图不被别人的修改冲掉。

## 二、全局序号：一个数字追平世界

第二个问题：多端同时在线，客户端怎么知道自己缺了哪些数据？

LSE 给服务端的每个变更分配一个全局递增的 syncId。客户端只记一个数字：lastSyncId。

```text
Server:  100 ─ 101 ─ 102 ─ 103 ─ 104
                ↑
Client:  lastSyncId = 100，补齐 101~104
```

断线重连、换设备、打开半年没用的电脑，都是同一句话：给我 lastSyncId 之后的变更。实时推送走 WebSocket，syncId 是游标，用来发现遗漏和补课。

这里要把两个东西分开：Transaction 是"我要做什么"，Delta 是"服务端实际发生了什么"。你发一条创建 Issue 的 Transaction，服务端执行时可能顺手生成 history、activity、更新计数器。回来的 Delta 比你的 Transaction 多出一串副作用。客户端以 Delta 为准，不以自己的请求为准。

冲突也好办。服务端把所有 Transaction 排成一个全序，同一字段的并发修改，后执行的赢（Last Writer Wins）。注意是后到达服务端，不是后点击。A 在 10:00:00 点 Done，B 在 10:00:01 点 Cancelled，如果 B 的网络先到，B 是 100，A 是 101，最终显示 Done。

所以分工是：服务端定胜负，客户端 Rebase 只管在胜负出来之前别让界面乱。

## 三、按需加载：一百万条数据不进浏览器

第三个问题：一个 workspace 几十万对象，客户端装不下。

LSE 在两个维度上控制数据。

Sync Scope 决定能不能同步：权限、workspace、sync group，没资格的数据根本不下发。

Load Strategy 决定什么时候加载。每个模型的元数据里写着加载策略：instant 启动就载，lazy 用到才载，partial 只载一部分，explicitlyRequested 明确请求才载，local 只存在本地。Issue 的标题和状态是 instant，history 是 explicitlyRequested。用户打开首页，拿到的只是列表需要的那几个字段。

一句话区分：Sync Engine 管"哪些数据要保持一致"，Lazy Loading 管"哪些数据现在值得加载"。

## 把这三件套搬到 AI Agent

回到开头的场景。Agent Run 是一次请求吗？不是。它创建任务、做计划、调工具、拿结果、再推理，跑几分钟到几小时，中间不断产生状态。这是一条持续演进的状态流，按请求设计就会得到开头那个 bug。

三件套几乎可以平移：

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

写法跟着变。不要 `POST /agent/run` 然后挂着 SSE 干等。拆成两步：

```text
POST /tasks        → 拿到 Task ID = 123
```

之后服务端持续产生带序号的事件：

```text
seq=100  task.created
seq=101  agent.started
seq=102  planning.completed
seq=103  tool.call
seq=104  tool.result
...
```

客户端只记一个 lastSeq。断了，刷新页面了，换手机了，都是同一个请求：

```text
GET /tasks/123/events?after=105
```

服务端把 106 之后的事件补给你，界面接着演。Agent 不用重跑。

SSE 和 WebSocket 在这个架构里只是实时传输通道，断了就断了。可靠性不靠连接活着，靠四样东西：事件、序号、本地状态、重放。

AI 应用比 Linear 多一层，也是最值得想的一层。Linear 同步的对象是数据：Issue、Comment、Project。AI Agent 要同步的对象是数据加过程：任务、计划、每次工具调用、每段推理、每个审批。你需要的不只是一个 Sync Engine，是一个 Agent Sync Engine。

## 带走一张检查清单

给你的 AI 应用过一遍：

- Agent Run 有全局递增的事件序号吗？
- 断线后能 after=lastSeq 补齐吗，还是只能重跑？
- 用户输入在断网时能排队吗，重发还是丢了？
- 页面刷新后，工具调用的中间结果还在吗？
- 换一个设备打开，能看到同一个任务跑到哪一步吗？

五条里缺一条，缺的那条就是 LSE 三件套里对应的那件。

把 Agent Run 从"长连接请求"改写成"可同步、可恢复、可回放的状态流"，重连、刷新、多端、回放、审计，全都变成顺带的。
