# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构个人主页，新增 THE FORGE（Agent体系展示）、Agent 产出卡片区、足迹改版（飞行弧线动画）、Footer 百度折叠区。

**Architecture:** 单文件 `index.html`，在现有结构的基础上替换 Section 3（军火库）为新的三大区块（THE FORGE + Agent产出 + 足迹改版），并升级 Footer。保留 Section 1/2 和 Marquee 不动。

**Tech Stack:** HTML + Tailwind CSS (CDN) + Vanilla JS + Leaflet.js (已有)，引入 Noto Serif SC / Noto Sans SC 字体。

---

## 文件结构

| 文件 | 操作 | 说明 |
|------|------|------|
| `index.html` | 修改 | 所有变更的唯一文件 |

具体改动位置：
- `<head>` 字体 import（第9行）：新增 Noto Serif SC / Noto Sans SC
- `<style>` 块（第58-165行）：新增 Anthropic 暖色 token + 足迹/卡片样式
- Section 3 军火库（第265-432行）：**整体替换**为 THE FORGE + Agent 产出
- Section 4 足迹（第434-494行）：**整体替换**为改版足迹
- Footer（第496-508行）：新增折叠百度经历
- `<script>` 块（第512-618行）：新增飞行动画逻辑，移除旧手风琴逻辑

---

## Task 1: 添加 Anthropic 字体 & CSS Token

**Files:**
- Modify: `index.html:9` (字体 link)
- Modify: `index.html:58-165` (`<style>` 块末尾追加)

- [ ] **Step 1: 在第9行字体 link 末尾，追加 Noto Serif / Noto Sans 的 import**

将第9行改为：
```html
<link href="https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@300;800&family=Kalam:wght@400;700&family=Orbitron:wght@900&family=ZCOOL+KuaiLe&family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500;600&display=swap" rel="stylesheet">
```

- [ ] **Step 2: 在 `</style>` 闭合标签前追加 Anthropic 设计 token**

```css
/* ===== Anthropic Warm System ===== */
:root {
    --parchment: #f5f4ed;
    --cream: #faf9f7;
    --charcoal: #4d4c48;
    --charcoal-light: #6b6a66;
    --terracotta: #c96442;
    --terracotta-dark: #a8523a;
    --terracotta-light: #e8a88e;
    --warm-border: #ddd9d0;
}

.warm-section {
    background: var(--parchment);
    color: var(--charcoal);
    font-family: 'Noto Sans SC', -apple-system, sans-serif;
}

.warm-section h2 {
    font-family: 'Noto Serif SC', Georgia, serif;
    color: var(--charcoal);
    font-size: 2.5rem;
    font-weight: 700;
    display: inline-block;
    border-bottom: 3px solid var(--terracotta);
    padding-bottom: 0.5rem;
    margin-bottom: 3rem;
}

.warm-section h3 {
    font-family: 'Noto Serif SC', Georgia, serif;
    font-size: 1.25rem;
    font-weight: 600;
}

/* Forge Accordion */
.forge-item {
    background: #fff;
    border: 1px solid var(--warm-border);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
    margin-bottom: 0.75rem;
}
.forge-item.active {
    border-left: 4px solid var(--terracotta);
    box-shadow: 0 4px 16px rgba(201, 100, 66, 0.08);
}
.forge-header {
    cursor: pointer;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    transition: background 0.2s;
}
.forge-header:hover { background: var(--cream); }
.forge-header .num {
    font-family: 'Noto Serif SC', serif;
    color: var(--terracotta);
    font-weight: 700;
    margin-right: 1rem;
    font-size: 1.1rem;
}
.forge-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0 1.5rem;
    background: var(--cream);
}
.forge-item.active .forge-content {
    max-height: 600px;
    padding: 1.5rem;
}
.forge-arrow { transition: transform 0.3s; color: var(--charcoal-light); }
.forge-item.active .forge-arrow { transform: rotate(180deg); }

/* Terracotta Button */
.btn-terra {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--terracotta);
    color: #fff;
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: background 0.2s;
}
.btn-terra:hover { background: var(--terracotta-dark); }
.btn-terra-outline {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: 1.5px solid var(--terracotta);
    color: var(--terracotta);
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
}
.btn-terra-outline:hover { background: var(--terracotta); color: #fff; }

/* Project Cards */
.project-card {
    background: #fff;
    border: 1px solid var(--warm-border);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(77,76,72,0.08);
}
.project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(77,76,72,0.12);
}
.project-card .card-img {
    width: 100%;
    aspect-ratio: 16/9;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--charcoal-light);
    font-size: 0.85rem;
    border-bottom: 1px solid var(--warm-border);
    overflow: hidden;
}
.project-card .card-img img { width: 100%; height: 100%; object-fit: cover; }
.project-card .card-body { padding: 1.25rem; }
.project-card .card-title {
    font-family: 'Noto Serif SC', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 0.5rem;
}
.project-card .card-desc {
    color: var(--charcoal-light);
    font-size: 0.875rem;
    line-height: 1.6;
    margin-bottom: 1rem;
}
.status-badge {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 99px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
}
.status-live { background: #d1fae5; color: #065f46; }
.status-wip { background: #fef3c7; color: #92400e; }

/* Station Tabs */
.station-tab {
    padding: 0.5rem 1.25rem;
    border: 1.5px solid var(--warm-border);
    border-radius: 99px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    color: var(--charcoal-light);
    background: #fff;
}
.station-tab.active, .station-tab:hover {
    border-color: var(--terracotta);
    color: var(--terracotta);
    background: rgba(201,100,66,0.05);
}

/* Plane icon on map */
.plane-marker {
    font-size: 18px;
    line-height: 1;
    transform-origin: center;
}

/* Travel content */
.travel-content {
    border-top: 1px solid var(--warm-border);
    padding-top: 1.5rem;
    margin-top: 1.5rem;
}
```

- [ ] **Step 3: 在 Tailwind config 里补充 Noto Serif 字体**

在 `tailwind.config` 的 `fontFamily` 里追加：
```js
serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
warm: ['"Noto Sans SC"', 'sans-serif'],
```

- [ ] **Step 4: 在浏览器打开 index.html，确认控制台无字体加载错误**

```bash
open /Users/limuyu/work/my_homepage/index.html
```

- [ ] **Step 5: Commit**

```bash
cd /Users/limuyu/work/my_homepage
git add index.html
git commit -m "style: add Anthropic warm design tokens and fonts"
```

---

## Task 2: 替换 Section 3 — THE FORGE（HTML + CSS）

**Files:**
- Modify: `index.html:265-432` (替换整个旧 Section 3 军火库)

- [ ] **Step 1: 定位并删除旧 Section 3**

找到 `<!-- SECTION 3: THE ARSENAL (ACCORDION) -->` 到对应 `</section>` 的整块（约第265-432行），替换为以下内容：

```html
<!-- SECTION 3: THE FORGE -->
<section id="forge" class="warm-section py-24 reveal">
    <div class="max-w-6xl mx-auto px-6">
        <h2>THE FORGE</h2>
        <p style="color:var(--charcoal-light); margin-top:-2rem; margin-bottom:2.5rem; font-size:0.95rem; line-height:1.8;">
            这里是我构建 AI 系统的方式——从团队设计到交付工作流，再到底层数字基建。
        </p>

        <div>
            <!-- [01] TEAM DESIGN -->
            <div class="forge-item" onclick="toggleForge(this)">
                <div class="forge-header">
                    <div style="display:flex; align-items:center;">
                        <span class="num">01</span>
                        <div>
                            <div style="font-weight:600; color:var(--charcoal); font-size:1rem;">TEAM DESIGN</div>
                            <div style="font-size:0.8rem; color:var(--charcoal-light);">Agent Team 构建与角色设计</div>
                        </div>
                    </div>
                    <svg class="forge-arrow w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </div>
                <div class="forge-content">
                    <p style="color:var(--charcoal-light); line-height:1.8; margin-bottom:1.25rem;">
                        如何设计一个能持续交付的 AI Agent 团队。包括角色分工、上下文管理、任务路由策略，
                        以及如何让 Agent 之间高效协作而不互相干扰。
                    </p>
                    <a href="https://github.com/Libeny/muyu-claw-team" target="_blank" class="btn-terra">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                        muyu-claw-team
                    </a>
                </div>
            </div>

            <!-- [02] HARNESS -->
            <div class="forge-item" onclick="toggleForge(this)">
                <div class="forge-header">
                    <div style="display:flex; align-items:center;">
                        <span class="num">02</span>
                        <div>
                            <div style="font-weight:600; color:var(--charcoal); font-size:1rem;">HARNESS</div>
                            <div style="font-size:0.8rem; color:var(--charcoal-light);">从设计到交付的全链路工作流</div>
                        </div>
                    </div>
                    <svg class="forge-arrow w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </div>
                <div class="forge-content">
                    <p style="color:var(--charcoal-light); line-height:1.8; margin-bottom:1rem;">
                        一套完整的 AI 辅助交付流程：需求设计 → 前端开发 → 后端开发 → 自动化测试。
                        每个环节都有对应的 Agent 介入点，减少重复劳动，保持交付节奏。
                    </p>
                    <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.25rem;">
                        <span style="padding:0.25rem 0.75rem; background:var(--parchment); border:1px solid var(--warm-border); border-radius:99px; font-size:0.8rem; color:var(--charcoal-light);">设计</span>
                        <span style="padding:0.25rem 0.75rem; background:var(--parchment); border:1px solid var(--warm-border); border-radius:99px; font-size:0.8rem; color:var(--charcoal-light);">前端</span>
                        <span style="padding:0.25rem 0.75rem; background:var(--parchment); border:1px solid var(--warm-border); border-radius:99px; font-size:0.8rem; color:var(--charcoal-light);">后端</span>
                        <span style="padding:0.25rem 0.75rem; background:var(--parchment); border:1px solid var(--warm-border); border-radius:99px; font-size:0.8rem; color:var(--charcoal-light);">测试</span>
                    </div>
                    <a href="#" class="btn-terra-outline">阅读完整工作流文章 →</a>
                </div>
            </div>

            <!-- [03] 数字基建 -->
            <div class="forge-item" onclick="toggleForge(this)">
                <div class="forge-header">
                    <div style="display:flex; align-items:center;">
                        <span class="num">03</span>
                        <div>
                            <div style="font-weight:600; color:var(--charcoal); font-size:1rem;">数字基建</div>
                            <div style="font-size:0.8rem; color:var(--charcoal-light);">CoT 系统 · 账号池 · 模型 API 服务</div>
                        </div>
                    </div>
                    <svg class="forge-arrow w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </div>
                <div class="forge-content">
                    <p style="color:var(--charcoal-light); line-height:1.8; margin-bottom:1rem;">
                        支撑整个 Agent 体系运转的底层服务。CoT 可视化系统让推理过程可观测；
                        账号池与模型换 API 服务解决多账号管理和模型切换的工程问题。
                    </p>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                        <div style="background:var(--parchment); padding:1rem; border-radius:8px; border:1px solid var(--warm-border);">
                            <div style="font-weight:600; color:var(--charcoal); font-size:0.875rem; margin-bottom:0.25rem;">CoT 可视化</div>
                            <div style="color:var(--charcoal-light); font-size:0.8rem;">让 Agent 的推理链路可视、可调试</div>
                        </div>
                        <div style="background:var(--parchment); padding:1rem; border-radius:8px; border:1px solid var(--warm-border);">
                            <div style="font-weight:600; color:var(--charcoal); font-size:0.875rem; margin-bottom:0.25rem;">账号池 & API</div>
                            <div style="color:var(--charcoal-light); font-size:0.8rem;">多模型统一接入，按需切换</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

- [ ] **Step 2: 在浏览器刷新，确认 THE FORGE 区块显示正常，三个手风琴条目可见**

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add THE FORGE section with Anthropic warm aesthetic"
```

---

## Task 3: THE FORGE 手风琴 JS

**Files:**
- Modify: `index.html` — `<script>` 块，添加 `toggleForge` 函数

- [ ] **Step 1: 在 `<script>` 块顶部（`toggleProject` 函数旁边）添加 `toggleForge`**

```javascript
function toggleForge(element) {
    const allItems = document.querySelectorAll('.forge-item');
    allItems.forEach(item => {
        if (item !== element) item.classList.remove('active');
    });
    element.classList.toggle('active');
}
```

- [ ] **Step 2: 删除旧的 `toggleProject` 函数**（因为旧军火库 Section 已被整体替换，该函数已无用）

在 `<script>` 里找到并删除：
```javascript
function toggleProject(element) {
    ...
}
```

- [ ] **Step 3: 在浏览器测试：点击每个 FORGE 条目，确认展开/收起正常，点击其他条目时当前条目收起**

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add forge accordion toggle logic"
```

---

## Task 4: Agent 产出区块

**Files:**
- Modify: `index.html` — 在 THE FORGE section 之后插入 Agent 产出 section

- [ ] **Step 1: 在 THE FORGE `</section>` 之后插入 Agent 产出区块**

```html
<!-- SECTION 4: AGENT 产出 -->
<section id="projects" class="warm-section py-24 reveal" style="background:var(--cream); border-top:1px solid var(--warm-border);">
    <div class="max-w-6xl mx-auto px-6">
        <h2>用这套体系，我们造了这些</h2>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem;">

            <!-- 卜灵 -->
            <div class="project-card">
                <div class="card-img">
                    <span style="font-size:2rem;">✦</span>
                </div>
                <div class="card-body">
                    <span class="status-badge status-live">上架中</span>
                    <div class="card-title">卜灵</div>
                    <div class="card-desc">AI 驱动的 App，用 Agent 工作流从零完成设计、开发、上架全流程。</div>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                        <a href="#" class="btn-terra" style="font-size:0.8rem; padding:0.4rem 1rem;">App Store</a>
                    </div>
                </div>
            </div>

            <!-- 牧途 -->
            <div class="project-card">
                <div class="card-img">
                    <span style="font-size:2rem;">✦</span>
                </div>
                <div class="card-body">
                    <span class="status-badge status-wip">开发中</span>
                    <div class="card-title">牧途</div>
                    <div class="card-desc">视觉辅助 AI，基于实时画面检测障碍物，为视障用户提供语音导航。</div>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                        <a href="#" class="btn-terra-outline" style="font-size:0.8rem; padding:0.4rem 1rem;">GitHub</a>
                    </div>
                </div>
            </div>

            <!-- 三国游戏 -->
            <div class="project-card">
                <div class="card-img">
                    <span style="font-size:2rem;">✦</span>
                </div>
                <div class="card-body">
                    <span class="status-badge status-wip">开发中</span>
                    <div class="card-title">三国版王国保卫战</div>
                    <div class="card-desc">用 Agent 工作流开发的策略塔防游戏，三国题材 × 现代游戏设计。</div>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                        <a href="#" class="btn-terra-outline" style="font-size:0.8rem; padding:0.4rem 1rem;">GitHub</a>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>
```

- [ ] **Step 2: 刷新浏览器，确认三张项目卡片排列整齐，hover 有上浮效果**

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add agent output project cards section"
```

---

## Task 5: 足迹区块 — 暖色 UI + 站点标签

**Files:**
- Modify: `index.html:434-494` (替换旧 Section 4 足迹)

- [ ] **Step 1: 替换旧足迹 Section 为新结构**

找到 `<!-- SECTION 4: FOOTPRINTS -->` 到对应 `</section>`，替换为：

```html
<!-- SECTION 5: 个人足迹 -->
<section id="travel-mode" class="warm-section py-24 reveal" style="border-top:1px solid var(--warm-border);">
    <div class="max-w-6xl mx-auto px-6">
        <h2>个人足迹</h2>
        <p style="color:var(--charcoal-light); margin-top:-2rem; margin-bottom:2rem; font-size:0.95rem;">
            常驻北京。点击一座城市，出发。
        </p>

        <!-- 地图 -->
        <div style="position:relative; border-radius:16px; overflow:hidden; border:1px solid var(--warm-border); box-shadow:0 4px 24px rgba(77,76,72,0.08); margin-bottom:1.5rem;">
            <div id="travel-map" style="height:420px; width:100%;"></div>
            <button onclick="returnToBeijing()" id="return-btn" style="display:none; position:absolute; top:1rem; right:1rem; z-index:500; background:#fff; border:1.5px solid var(--warm-border); color:var(--charcoal); padding:0.4rem 1rem; border-radius:99px; font-size:0.8rem; cursor:pointer; font-family:'Noto Sans SC',sans-serif; transition:all 0.2s;">
                ← 返回北京
            </button>
        </div>

        <!-- 站点标签 -->
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:2rem;" id="station-tabs">
            <button class="station-tab" onclick="flyTo('shanghai')">上海</button>
            <button class="station-tab" onclick="flyTo('chengdu')">成都</button>
            <button class="station-tab" onclick="flyTo('nagano')">长野</button>
        </div>

        <!-- 游记内容（点击后展示）-->
        <div id="travel-content" class="travel-content" style="display:none;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem; align-items:start;">
                <!-- 文字 -->
                <div>
                    <h3 id="travel-city-name" style="font-family:'Noto Serif SC',serif; font-size:1.5rem; color:var(--charcoal); margin-bottom:0.75rem;"></h3>
                    <p id="travel-city-desc" style="color:var(--charcoal-light); line-height:1.8; font-size:0.95rem;"></p>
                </div>
                <!-- 照片 -->
                <div style="display:flex; flex-direction:column; gap:0.75rem;" id="travel-photos"></div>
            </div>
        </div>
    </div>
</section>
```

- [ ] **Step 2: 刷新浏览器，确认暖色背景显示正常，地图加载，站点标签可见**

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: footprints section warm UI and station tabs"
```

---

## Task 6: 足迹区块 — 飞行弧线动画 JS

**Files:**
- Modify: `index.html` — `<script>` 块，替换旧地图逻辑，添加飞行动画

- [ ] **Step 1: 删除旧地图相关的全部 JS 代码**

删除 `<script>` 里从 `// Map Init` 到 `function resetMap()` 的所有内容（约第527-600行），替换为以下完整地图逻辑：

```javascript
// ===== FOOTPRINTS MAP =====
const BEIJING = [39.9042, 116.4074];

const map = L.map('travel-map', {
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: false,
    attributionControl: false,
}).setView(BEIJING, 5);

// 使用 CartoDB Voyager 暖色瓦片
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// 北京标记（常驻）
const beijingIcon = L.divIcon({
    className: '',
    html: '<div style="width:10px;height:10px;background:#c96442;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 3px rgba(201,100,66,0.3);"></div>',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
});
L.marker(BEIJING, { icon: beijingIcon }).addTo(map)
    .bindTooltip('北京（常驻）', { permanent: false, className: 'leaflet-tooltip-warm' });

const stations = {
    shanghai: {
        coords: [31.2304, 121.4737],
        name: '上海',
        desc: '魔都的节奏和北京完全不同。外滩的夜景、弄堂里的早点，还有那种天生的国际感。',
        photos: ['./travel1.jpg', './travel2.jpg']
    },
    chengdu: {
        coords: [30.5728, 104.0668],
        name: '成都',
        desc: '慢下来的城市。熊猫、火锅、和那些在茶馆里发呆一整个下午的人们。',
        photos: ['./travel1.jpg']
    },
    nagano: {
        coords: [36.6513, 138.1810],
        name: '长野',
        desc: '日本阿尔卑斯的入口。雪山、温泉、和静到能听见自己心跳的夜晚。',
        photos: ['./travel2.jpg']
    }
};

let currentArcLayer = null;
let planeMarker = null;
let currentStation = null;
let isAnimating = false;

// 生成贝塞尔弧线点
function getArcPoints(from, to, numPoints = 60) {
    const midLat = (from[0] + to[0]) / 2 + Math.abs(to[1] - from[1]) * 0.25;
    const midLng = (from[1] + to[1]) / 2;
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const lat = (1-t)*(1-t)*from[0] + 2*(1-t)*t*midLat + t*t*to[0];
        const lng = (1-t)*(1-t)*from[1] + 2*(1-t)*t*midLng + t*t*to[1];
        points.push([lat, lng]);
    }
    return points;
}

// 计算飞机朝向角度
function getBearing(from, to) {
    const dLng = (to[1] - from[1]) * Math.PI / 180;
    const lat1 = from[0] * Math.PI / 180;
    const lat2 = to[0] * Math.PI / 180;
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLng);
    return Math.atan2(y, x) * 180 / Math.PI;
}

// 清除上一次弧线和飞机
function clearFlight() {
    if (currentArcLayer) { map.removeLayer(currentArcLayer); currentArcLayer = null; }
    if (planeMarker) { map.removeLayer(planeMarker); planeMarker = null; }
}

// 动画飞行
function animateFlight(fromCoords, toCoords, onComplete) {
    if (isAnimating) return;
    isAnimating = true;
    clearFlight();

    const points = getArcPoints(fromCoords, toCoords);
    currentArcLayer = L.polyline([], {
        color: '#c96442',
        weight: 2,
        dashArray: '6, 4',
        opacity: 0.7
    }).addTo(map);

    const planeIcon = L.divIcon({
        className: '',
        html: '<div class="plane-marker">✈</div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
    planeMarker = L.marker(points[0], { icon: planeIcon, zIndexOffset: 1000 }).addTo(map);

    let step = 0;
    function step_anim() {
        if (step < points.length) {
            currentArcLayer.addLatLng(points[step]);
            planeMarker.setLatLng(points[step]);
            // 旋转飞机朝向
            if (step < points.length - 1) {
                const bearing = getBearing(points[step], points[step+1]);
                const el = planeMarker.getElement();
                if (el) el.style.transform = `rotate(${bearing}deg)`;
            }
            step++;
            setTimeout(step_anim, 25);
        } else {
            isAnimating = false;
            onComplete && onComplete();
        }
    }
    step_anim();
}

// 飞到某站
function flyTo(stationKey) {
    if (isAnimating) return;
    const station = stations[stationKey];
    if (!station) return;

    // 更新 tab 状态
    document.querySelectorAll('.station-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`[onclick="flyTo('${stationKey}')"]`);
    if (activeTab) activeTab.classList.add('active');

    // 地图范围包含北京和目的地
    const bounds = L.latLngBounds([BEIJING, station.coords]).pad(0.3);
    map.fitBounds(bounds, { animate: true, duration: 0.5 });

    currentStation = stationKey;
    document.getElementById('return-btn').style.display = 'block';

    setTimeout(() => {
        animateFlight(BEIJING, station.coords, () => {
            showTravelContent(station);
        });
    }, 600);
}

// 返回北京
function returnToBeijing() {
    if (isAnimating || !currentStation) return;
    const station = stations[currentStation];

    // 隐藏游记
    document.getElementById('travel-content').style.display = 'none';
    document.querySelectorAll('.station-tab').forEach(t => t.classList.remove('active'));

    animateFlight(station.coords, BEIJING, () => {
        clearFlight();
        map.flyTo(BEIJING, 5, { duration: 1 });
        document.getElementById('return-btn').style.display = 'none';
        currentStation = null;
    });
}

// 展示游记
function showTravelContent(station) {
    document.getElementById('travel-city-name').textContent = station.name;
    document.getElementById('travel-city-desc').textContent = station.desc;

    const photosEl = document.getElementById('travel-photos');
    photosEl.innerHTML = '';
    station.photos.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = 'width:100%; border-radius:8px; border:1px solid var(--warm-border);';
        photosEl.appendChild(img);
    });

    const content = document.getElementById('travel-content');
    content.style.display = 'block';
    content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
```

- [ ] **Step 2: 刷新浏览器，点击「上海」标签，确认：地图适配视野 → 弧线从北京画向上海 → 飞机图标沿线移动 → 停止后游记展示**

- [ ] **Step 3: 点击「返回北京」，确认弧线从上海画回北京，游记隐藏，地图复位**

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: footprints flight arc animation with return logic"
```

---

## Task 7: Footer — 百度折叠经历

**Files:**
- Modify: `index.html:496-508` (Footer 区块)

- [ ] **Step 1: 在 Footer 的联系按钮下方，追加折叠区块**

在 Footer `<div class="flex flex-wrap...">` 下方（联系按钮之后），追加：

```html
<!-- 百度经历折叠 -->
<div style="margin-top:3rem;">
    <button onclick="toggleBaidu(this)"
        style="font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:#555; background:transparent; border:1px solid #333; padding:0.4rem 1rem; border-radius:99px; cursor:pointer; transition:all 0.2s;"
        onmouseover="this.style.borderColor='#888'" onmouseout="this.style.borderColor='#333'">
        查看百度内项目经历 ▾
    </button>
    <div id="baidu-panel" style="max-height:0; overflow:hidden; transition:max-height 0.4s ease;">
        <div style="margin-top:1.5rem; padding:1.5rem; border:1px solid #222; border-radius:8px; text-align:left; max-width:500px; margin-left:auto; margin-right:auto;">
            <div style="font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:#555; margin-bottom:0.75rem;">BAIDU · 2023 — 2025</div>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
                <div style="border-left:2px solid #2932E1; padding-left:1rem;">
                    <div style="color:#93c5fd; font-size:0.875rem; font-weight:600; margin-bottom:0.25rem;">Coding Agent Infra</div>
                    <div style="color:#666; font-size:0.8rem; line-height:1.6;">负责公司内部 AI Coding Agent 基础设施建设，包括 CoT 可视化与 Agent 调度体系。</div>
                </div>
                <div style="border-left:2px solid #2932E1; padding-left:1rem;">
                    <div style="color:#93c5fd; font-size:0.875rem; font-weight:600; margin-bottom:0.25rem;">AIQA 代码知识建设</div>
                    <div style="color:#666; font-size:0.8rem; line-height:1.6;">推动 AI 驱动的质量保障体系，建立代码知识图谱与自动化测试覆盖。</div>
                </div>
            </div>
        </div>
    </div>
</div>
```

- [ ] **Step 2: 在 `<script>` 块中添加 `toggleBaidu` 函数**

```javascript
function toggleBaidu(btn) {
    const panel = document.getElementById('baidu-panel');
    const isOpen = panel.style.maxHeight !== '0px' && panel.style.maxHeight !== '';
    panel.style.maxHeight = isOpen ? '0' : '400px';
    btn.textContent = isOpen ? '查看百度内项目经历 ▾' : '收起 ▴';
}
```

- [ ] **Step 3: 刷新浏览器，点击「查看百度内项目经历」，确认面板展开/收起正常**

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: footer collapsible Baidu experience section"
```

---

## Task 8: 全页面联调 & Reveal 动画修复

**Files:**
- Modify: `index.html` — 确认新 section 都有 `reveal` class

- [ ] **Step 1: 检查所有新增 section 是否有 `reveal` class，没有则补上**

THE FORGE、Agent 产出、足迹三个 section 都应有 `class="... reveal"`。

- [ ] **Step 2: 全页从上到下滚动，确认各 section 动画正常触发**

- [ ] **Step 3: 在移动端（Chrome DevTools 375px 宽度）检查**
- THE FORGE 手风琴展开正常
- 项目卡片 Grid 在小屏变为单列（`auto-fit, minmax(280px, 1fr)` 自动处理）
- 足迹站点标签横向滚动
- 游记内容在小屏变为单列（需检查 `grid-template-columns` 是否需要加媒体查询）

- [ ] **Step 4: 如游记在移动端双列不适用，在 `<style>` 补充**

```css
@media (max-width: 640px) {
    #travel-content .travel-grid { grid-template-columns: 1fr !important; }
}
```

将游记内容的 `style="display:grid; grid-template-columns:1fr 1fr..."` 改为 `class="travel-grid"` 并加上述媒体查询。

- [ ] **Step 5: Final commit**

```bash
git add index.html
git commit -m "fix: mobile responsive adjustments and reveal animation check"
```

---

## 待确认内容（实现时用占位符，后续替换）

| 项目 | 需要 | 当前状态 |
|------|------|---------|
| 卜灵 App | 截图 + App Store 链接 | 用 `✦` 占位 |
| 牧途 | 截图 + GitHub 链接 | 用 `✦` 占位 |
| 三国游戏 | 截图 + GitHub 链接 | 用 `✦` 占位 |
| HARNESS 博客 | 文章 URL | 用 `href="#"` 占位 |
| muyu-claw-team | GitHub 链接 | 已填 `Libeny/muyu-claw-team` |
| 足迹游记 | 各城市文字内容 | 已有示例文案 |
| 足迹照片 | 各城市对应照片 | 复用 travel1/travel2.jpg |
