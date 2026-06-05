(function () {
  const stages = [
    {
      id: "pool",
      title: "💭 想法池",
      subtitle: "还没开始，但想做的",
      tone: "purple",
    },
    {
      id: "exploring",
      title: "🔍 摸索中",
      subtitle: "在研究验证想方案",
      tone: "blue",
    },
    {
      id: "building",
      title: "⚡ 暴风开发",
      subtitle: "正在猛写代码",
      tone: "orange",
    },
    {
      id: "shipped",
      title: "🚀 上线了（凑合用）",
      subtitle: "上了但还不完美",
      tone: "green",
    },
  ];

  // ── 在这里维护你的进度数据 ──────────────────────────────
  const items = [
    {
      id: "kanban",
      stage: "building",
      title: "木鱼进度板",
      description: "把正在搞的事情做成一个公开看板，让访客看到我在做什么。neo-brutalist 风格，纯静态部署。",
      tag: "工具",
      tagTone: "mint",
    },
    {
      id: "nb-claude",
      stage: "shipped",
      title: "nb-claude 文章站",
      description: "用 Claude 写作、整理笔记的个人文章站，独立子站，持续更新中。",
      tag: "写作",
      tagTone: "cream",
    },
    {
      id: "homepage",
      stage: "shipped",
      title: "个人主页 v2",
      description: "重新设计的个人主页，漫画板 + 羊皮纸风格，展示项目和写作入口。",
      tag: "设计",
      tagTone: "peach",
    },
    {
      id: "ai-delivery",
      stage: "exploring",
      title: "AI 交付系统",
      description: "探索一套用 Claude 驱动的个人软件交付流水线，从需求到上线全流程自动化。",
      tag: "AI",
      tagTone: "matcha",
    },
    {
      id: "travel-log",
      stage: "pool",
      title: "旅行日志页",
      description: "把旅行照片和故事做成一个有意思的展示页，想要地图 + 时间线的形式。",
      tag: "生活",
      tagTone: "cyan",
    },
    {
      id: "reading-list",
      stage: "pool",
      title: "公开阅读清单",
      description: "把读过的书和想读的书整理成一个公开页面，附上简单的读后感。",
      tag: "阅读",
      tagTone: "lilac",
    },
  ];

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderDecor() {
    return `
      <div class="myn-blob"></div>
      <svg class="myn-decor spark" width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
        <path d="M22 2 C23 16 28 20 42 21 C28 22 23 27 22 42 C20 27 16 22 4 21 C16 19 20 16 22 2Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" />
        <circle cx="10" cy="35" r="3" fill="none" stroke="currentColor" stroke-width="3" />
        <circle cx="38" cy="8" r="2" fill="currentColor" />
      </svg>
      <svg class="myn-decor plus" width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <path d="M17 4v26M4 17h26" stroke="currentColor" stroke-width="7" stroke-linecap="round" />
      </svg>
      <svg class="myn-decor star" width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
        <path d="M22 3l5.6 12 13.1 1.6-9.7 9 2.6 12.9L22 32l-11.6 6.5 2.6-12.9-9.7-9L16.4 15 22 3Z" fill="currentColor" />
      </svg>
      <div class="myn-decor ring" aria-hidden="true"></div>
    `;
  }

  function renderCard(item) {
    const title = escapeHtml(item.title);
    return `
      <article
        class="myn-card t-avatar"
        data-id="${escapeHtml(item.id)}"
        tabindex="0"
        role="button"
        aria-label="查看：${title}"
      >
        <p class="myn-card-title">${title}</p>
        <div class="myn-card-meta">
          <span class="myn-tag myn-tag-${escapeHtml(item.tagTone)}">${escapeHtml(item.tag)}</span>
        </div>
      </article>
    `;
  }

  function renderStage(stage, stageItems) {
    return `
      <section class="myn-column" data-stage="${stage.id}">
        <div class="myn-column-head">
          <div class="myn-column-row">
            <div class="myn-stage-icon myn-stage-${stage.tone}">${stage.title.split(" ")[0]}</div>
            <h2>${escapeHtml(stage.title.replace(/^\S+\s/, ""))}</h2>
            <span class="myn-count">${stageItems.length}</span>
          </div>
          <div class="myn-column-subtitle">${escapeHtml(stage.subtitle)}</div>
        </div>
        <div class="myn-task-list t-avatar-group" data-stage-list="${stage.id}">
          ${stageItems.length
            ? stageItems.map(renderCard).join("")
            : '<div class="myn-empty">这里空空的</div>'}
        </div>
      </section>
    `;
  }

  function renderShell(target, state) {
    target.innerHTML = `
      <div class="myn-shell">
        ${renderDecor()}
        <div class="myn-inner">

          <div style="display:flex; justify-content:flex-end; margin-bottom:16px;">
            <a class="myn-back" href="../index.html">← 返回主页</a>
          </div>

          <header class="myn-hero">
            <div class="myn-hero-row t-stagger">
              <div class="myn-mark t-stagger-line t-stagger-line--1" aria-hidden="true">🐟</div>
              <h1 class="myn-title t-stagger-line t-stagger-line--2">
                木鱼
                <span class="myn-title-accent">进度板
                  <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M5 15 Q50 0 100 10 T195 5" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" />
                  </svg>
                </span>
              </h1>
            </div>
            <p class="myn-subtitle t-stagger t-stagger-line t-stagger-line--3">正在搞的、想搞的、搞出来的——都在这里</p>
          </header>

          <div class="myn-board-scroll">
            <div class="myn-board">
              ${stages.map((stage) =>
                renderStage(stage, state.items.filter((item) => item.stage === stage.id))
              ).join("")}
            </div>
          </div>

          <footer class="myn-footer">木鱼持续在搞事情 🐟</footer>
        </div>

        <div class="myn-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="mynModalTitle" aria-hidden="true">
          <section class="myn-modal">
            <button class="myn-modal-close" type="button" aria-label="关闭详情">×</button>
            <div class="myn-modal-line">
              <span class="myn-tag" data-modal-tag></span>
              <span class="myn-status-pill" data-modal-status></span>
            </div>
            <h3 id="mynModalTitle" data-modal-title></h3>
            <p class="myn-modal-desc" data-modal-desc></p>
          </section>
        </div>
      </div>
    `;
  }

  function findItem(state, id) {
    return state.items.find((item) => item.id === id);
  }

  function stageTitle(stageId) {
    const stage = stages.find((s) => s.id === stageId);
    return stage ? stage.title : stageId;
  }

  function syncModal(target, state) {
    const item = findItem(state, state.activeId);
    const modal = target.querySelector(".myn-modal-backdrop");
    if (!item || !modal) return;

    const tag = modal.querySelector("[data-modal-tag]");
    tag.textContent = item.tag;
    tag.className = `myn-tag myn-tag-${item.tagTone}`;
    modal.querySelector("[data-modal-status]").textContent = stageTitle(item.stage);
    modal.querySelector("[data-modal-title]").textContent = item.title;
    modal.querySelector("[data-modal-desc]").textContent = item.description;
  }

  function bindAvatarGroupHover(target) {
    target.querySelectorAll(".t-avatar-group").forEach((group) => {
      const cards = Array.from(group.querySelectorAll(".t-avatar"));
      if (cards.length === 0) return;

      const cs = getComputedStyle(document.documentElement);
      const num = (name, fb) => {
        const v = parseFloat(cs.getPropertyValue(name));
        return Number.isFinite(v) ? v : fb;
      };
      const ease = (name, fb) => cs.getPropertyValue(name).trim() || fb;

      function setShifts(activeIdx, phase) {
        const lift    = num("--avatar-lift", -4);
        const falloff = num("--avatar-falloff", 0.45);
        const scale   = num("--avatar-scale", 1.04);
        const tf = phase === "out"
          ? ease("--avatar-ease-out", "cubic-bezier(0.34, 3.85, 0.64, 1)")
          : ease("--avatar-ease-in",  "cubic-bezier(0.22, 1, 0.36, 1)");

        cards.forEach((el, i) => {
          el.style.transitionTimingFunction = tf;
          if (activeIdx == null) {
            el.style.setProperty("--shift", "0px");
            el.style.setProperty("--scale-active", "1");
            return;
          }
          const d = Math.abs(i - activeIdx);
          el.style.setProperty("--shift", (lift * Math.pow(falloff, d)).toFixed(3) + "px");
          el.style.setProperty("--scale-active", i === activeIdx ? String(scale) : "1");
        });
      }

      cards.forEach((el, i) => {
        el.addEventListener("mouseenter", () => setShifts(i, "in"));
      });
      group.addEventListener("mouseleave", () => setShifts(null, "out"));
    });
  }

  function bindStaggerReveal(target) {
    const blocks = target.querySelectorAll(".t-stagger");
    if (!blocks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-shown");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    blocks.forEach((block) => observer.observe(block));
  }

  function bindEvents(target, state) {
    const modal = target.querySelector(".myn-modal-backdrop");
    const close = target.querySelector(".myn-modal-close");

    target.querySelectorAll(".myn-card").forEach((card) => {
      const open = () => {
        state.activeId = card.dataset.id;
        state.lastFocus = card;
        modal.classList.add("is-open");
        modal.removeAttribute("aria-hidden");
        syncModal(target, state);
        close.focus();
      };
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });

    close.addEventListener("click", () => {
      state.activeId = null;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      state.lastFocus?.focus();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        state.activeId = null;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        state.lastFocus?.focus();
      }
    });

    const onEsc = (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        state.activeId = null;
        modal.classList.remove("is-open");
        state.lastFocus?.focus();
      }
    };
    window.addEventListener("keydown", onEsc);

    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !modal.classList.contains("is-open")) return;
      const focusable = Array.from(
        modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.disabled);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    bindAvatarGroupHover(target);
    bindStaggerReveal(target);
  }

  function mount(target) {
    const state = {
      items: items.map((item) => ({ ...item })),
      activeId: null,
      lastFocus: null,
    };
    renderShell(target, state);
    bindEvents(target, state);
  }

  document.querySelectorAll("[data-muyu-kanban]").forEach((el) => mount(el));
})();
