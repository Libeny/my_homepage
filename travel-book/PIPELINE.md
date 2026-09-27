# 《旅册》动态生成管线契约

目标：用户在网页输入任意目的地（1–3 个），本地服务器真实检索资料、真实调用 agy 生成，前端日志逐行显示真实进度，最终渲染成一本旅行书。

## 进程

`python3 travel-book/server/serve.py [port]`（默认 8137）。同时承担静态文件服务（travel-book/app/ 目录，/assets/ 转发到仓库根）与生成 API。只允许用 Python 标准库 + 系统 curl + 本机 agy CLI，不引入任何第三方依赖。

目录约定：前端在 `travel-book/app/`（index.html / data.js / art/），服务端在 `travel-book/server/`（serve.py / prompt-template.txt）。前后端分离，app/ 可独立静态部署，server/ 只暴露 /api/*。

## API

### POST /api/generate

请求 JSON：`{"places": ["大理", "沙溪"], "traveler": "木鱼"}`（places 1–3 个， traveler 可空）

响应：`{"jobId": "xxxx"}`（立即返回，后台线程跑管线）

### GET /api/job?id=xxxx

响应：
```json
{
  "status": "running | done | error",
  "lines": ["正在检索：百科词条 · 大理 …", "..."],
  "book": null,
  "error": null
}
```
前端每 800ms 轮询一次，增量打印 lines。done 时 book 为完整 BOOK_DATA 结构（见下）。

## 管线步骤（每步都要追加日志行）

1. **检索**：对每个 place，抓取 `https://r.jina.ai/https://baike.baidu.com/item/<place>`（curl，超时 12s，失败不阻断，日志注明"未取到，用模型自有知识"），取前 ~2000 字作为事实锚点。日志：`正在检索：百科词条 · <place> … OK`
2. **生成**：调用 `agy -p "$(渲染后的提示词)" --dangerously-skip-permissions --print-timeout 240s`，提示词模板在 `travel-book/server/prompt-template.txt`，占位符 `{places_with_anchors}`。日志：`正在汇编：<place> 的章节 … OK`（逐目的地）+ `正在装订：N 章 · FIELD EDITION … OK`
3. **解析**：agy 输出可能带闲话，取首个 `{` 到末个 `}` 之间的 JSON。`json.loads` 失败则把错误原文塞进 error 并置 status=error（附带 agy 原始输出前 500 字便于排查）。
4. **校验补全**：确保结构有 destinations[]，每个 destination 有 id（拼音或 place_N）、name、region（可空字符串）、themeColor、coverLine、chapters[]（每章 no/tag/question/title/lesson{title,body,lookFor,source{name,url}}/mission{title,brief,tasks[3],photoHint}）。themeColor 由服务端从调色板按序指派：["#3d6b6e", "#b5763a", "#6e5a7e", "#7a6c3f"]。缺失字段给安全默认值，不给报错。review.lines 由模型生成 5-7 条。

## 内容生成规则（写进 prompt-template.txt）

- 每章回答一个旅行者会问的"笨问题"（question 字段）：名字由来/成因/为什么有这个现象/为什么这里的人这样做
- 每个目的地 2–3 章，全书不超过 8 章
- 文风：星球研究所式——冷静、具体、数字地名年代优先；禁止"你知道吗"开头、禁止"不是X而是Y"金句、禁止段尾讲道理、禁止"震撼/绝美/天花板"
- 事实锚点优先采用检索到的百科内容；锚点没有的领域可用模型自有知识，但数字类断言尽量保守
- source 字段：每章给检索到的百科 URL + 一个 B站搜索链接（https://search.bilibili.com/all?keyword=<URL编码的目的地+主题>）
- mission：3 个任务，动词开头（去找/拍/尝/问/记），禁止"作业""学习"字眼
- 要求 agy 只输出 JSON

## 前端对接（agent-4 负责，codex 不用管）

- 入口屏：目的地使用自由文本输入（tag 式，最多 3 个）；不设强制的城市/景区层级，也不预置经典路线或一键快选。
- 生成屏：轮询 /api/job，逐行打印真实日志（保留打字机质感），完成后用返回的 book 渲染书本体
- 生成的书没有插画：讲解页用孤独星球式排版块头（大章号+tag+标题）代替图位
- 生成的书整体存 localStorage（key travelbook-v4），可"再生成一本"

## 验收（codex 必须自测）

1. `pkill -f "serve.py 8137"` 后启动 server/serve.py 8137，curl 静态页 200
2. 实测：`curl -X POST localhost:8137/api/generate -d '{"places":["大理"],"traveler":"测试"}'`，轮询 job 直到 done，验证 book JSON 结构完整、日志行真实
3. 实测百科取不到的地方（如虚构地名"阿瓦隆"）：不崩溃，走模型自有知识
4. 全程贴出关键输出

## iOS 壳（Capacitor 8）

- 壳在 `travel-book/ios/`，配置 `travel-book/capacitor.config.json`（appId `com.muyu.travelbook`，webDir `app/`）。
- **开发模式**：config 里 `server.url` 指向局域网开发服务器（`http://192.168.1.5:8137`），App 内 WebView 直接加载它——改 app/ 前端代码不用重新构建，重启 App 即生效。serve.py 已绑 `0.0.0.0` 支持局域网访问。
- **打包模式**（正式上架用）：删掉 `server.url`，前端 fetch 走 `API_BASE`（app/index.html 顶部，capacitor:// 协议下指向已部署的服务端域名，现在是占位 `https://api.example.com`）。
- **SPM 离线依赖**：本机代理对 SPM 的 URLSession 不生效，GitHub 二进制下载必超时。xcframework 已离线下载到 `ios/Frameworks/`，本地包 `ios/Frameworks/capacitor-local/Package.swift` 替代官方 capacitor-swift-pm 8.5.1。注意 `cap sync`/`cap add` 会重写 `ios/App/CapApp-SPM/Package.swift`，若被重写需把依赖指回本地包。
- 构建运行：`cd travel-book/ios/App && xcodebuild -project App.xcodeproj -scheme App -destination 'platform=iOS Simulator,name=iPhone 17 Pro Max' build`，或直接用 XcodeBuildMCP 的 build_run_sim。
- 已踩的坑：WKWebView 里 `<button>` 内文字默认渲染成系统蓝，需全局 `button{color:inherit}`；页面安全区用 `env(safe-area-inset-top)` 处理刘海。
