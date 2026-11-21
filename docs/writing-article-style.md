# 个人主页长文与写作本规范 · 「手札印本 · Warm Notebook Print」（`writing-article`）

> 风格命名：**手札印本（Warm Notebook Print）** —— 暖纸墨线 × 薄荷荧光高光 × 樱粉标签 × 实体卡片压影（硬边框配 `4–6px` 沉实底影，兼顾纸质笔记本温度与独立工程出版物克制感）。
> 基准样板：[`writing-fde-business-agent.html`](../writing-fde-business-agent.html) · 写作本列表：[`writing.html`](../writing.html)
> 共用样式与交互：[`assets/writing-article.css`](../assets/writing-article.css) · [`assets/writing-article.js`](../assets/writing-article.js)

这套样式从 `FDE 焚诀` 长文打磨沉淀而来，并已统一应用到写作本首页与全站 [`writing-*.html`](../writing.html) 图文长文。

---

## 1. 页面结构与克制原则

1. **极简顶栏（`.top-bar`）**：
   - **只保留左侧单个返回入口**（`<a class="brand-link" href="writing.html"><img src="assets/favicon.png" alt="木鱼拓哉"><span>← 返回写作本</span></a>`）。
   - 不在右侧堆砌装饰标签或额外跨站/换篇按钮；阅读单篇长文时读者只需专注正文与大纲。
   - `.brand-link:hover` 使用轻暖灰底（`rgba(105, 75, 64, 0.09)`），提供明确的点击可交互提示。
2. **两栏聚焦阅读壳（`.page-shell`）**：
   - `grid-template-columns: minmax(0, 740px) 240px; gap: 3rem;`
   - 正文单栏宽度收敛在 `740px`（约 38–42 中文字符行宽），右侧放 sticky `240px` 本页目录（`.docs-outline`），不放全局左侧文章列表树。
   - `@media (max-width: 900px)` 收拢为单栏并隐藏右侧 `.docs-outline`。
3. **色彩与字体系统**：
   - 纸面与网格背景：`#FBF2E3`（`--bg`）搭配右上薄荷 `#BDE7E5` / 左上樱粉 `#F4CFD6` 柔光，卡片白 `#FFFDF8`（`--paper`），主墨色 `#694B40`（`--ink`）。
   - 自托管字体：`MuYu Serif`（900 标题与节题）、`MuYu Sans`（400/700 正文）、`MuYu Mono`（英文小标/公式/代码），全部通过本地 `.woff2` 加载，不依赖外部 CDN。
   - **新增或改字后的硬性约束**：遵循 `AGENTS.md`，发布前必须运行 `/tmp/mupath-fonts-venv/bin/python scripts/build-font-subsets.py`。

---

## 2. 正文排版组件清单（直接在文章里复用）

- **文章头（`.post-head`）**：`.post-kicker` 小胶囊标签 + `h1.post-title`（关键词可用 `<mark>` 薄荷荧光笔划出）+ `.post-subtitle` + `.author-strip`（头像胶囊 + 原文来源 + 预计阅读时间）。
- **缘起说明卡（`.origin-card`）**：替代默认 `<blockquote>`，顶部带 `.origin-card-label` 胶囊与 `2px` 墨线卡片框。
- **分节标题（`.sec-head`）**：顶部 `60px` 薄荷短横线 + `.sec-num`  monospace 节号 + `h2`；二级小节 `h3` 配方形粉色点 `.h3-dot`。
- **底层公式/深棕总结面板（`.formula-panel` / `.skill-blueprint`）**：深咖色 `#5A4037` 背景配薄荷高对比小标（`.pillar-item strong { color: var(--blue); }`），公式行内关键词用 `span.eq-term`（粉底线 + `white-space: nowrap` 防止半词折行）。
- **Live 动态图解（`figure.fig-live[data-live-fig]`）**：16:9 容器，进入视口后自动播一遍并停在最后完整帧，支持点击画面或右下 `.replay-btn`（`↺ 重播`）。
- **对比表（`.compare-figure` + `.table-scroll > .comparison-table`）**：保留卡片外框与窄屏横向安全滚动。
- **一键复制提示词卡（`.prompt-card`）**：薄荷浅底标题条 `.prompt-head` 配 `button.copy-btn[data-copy-target="..."]`，`writing-article.js` 自动接管复制与 `已复制 ✓` 反馈。
- **强调批注 / 四格清单 / 要点（`.callout-note`、`.scenes-list`、`.feature-list`、`.takeaways`）**：统一暖纸卡片感，避免使用浏览器默认 `ul/ol` 圆点。

---

## 3. 旧文迁移到本规范的最简步骤

1. 在 `<head>` 引入 `<link rel="stylesheet" href="assets/writing-article.css">`，`<body/>` 前引入 `<script src="assets/writing-article.js" defer></script>`（删除各自内联的 `<style>`）。
2. 将顶部导航统一为单一 `.top-bar`（只留左侧 `← 返回写作本`）。
3. 将正文外框改为 `<div id="top" class="page-shell"><main class="post">...</main><aside class="docs-outline">...</aside></div>`。
4. 按组件清单替换 `<blockquote>`、对比表与提示词块。
5. 运行 `/tmp/mupath-fonts-venv/bin/python scripts/build-font-subsets.py`，并用 Playwright 验证桌面（`1280×800`）与手机（`390×844`）均无报错与横向溢出后再提交推送。
