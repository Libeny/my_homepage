/* ==========================================================================
   MuYu Writing Article Interactions (Copy Prompt / Live Video Once / Outline)
   ========================================================================== */
(function () {
  'use strict';
  // Copy prompt template buttons
  document.querySelectorAll('[data-copy-target]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const target = document.getElementById(btn.getAttribute('data-copy-target'));
      if (!target) return;
      const text = target.innerText.trim();
      try {
        await navigator.clipboard.writeText(text);
        const old = btn.textContent;
        btn.textContent = '已复制 ✓';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = old;
          btn.classList.remove('copied');
        }, 1600);
      } catch {
        btn.textContent = '请手动选中复制';
      }
    });
  });

  // Play each Live figure ONCE when scrolled into view, then freeze on final frame; click or replay button restarts once
  const liveFigs = Array.from(document.querySelectorAll('[data-live-fig]'));
  liveFigs.forEach((fig) => {
    const stage = fig.querySelector('.live-stage');
    const video = fig.querySelector('video');
    const replayBtn = fig.querySelector('.replay-btn');
    if (!stage || !video) return;

    const replayFromStart = () => {
      video.dataset.playedOnce = '1';
      if (replayBtn) {
        replayBtn.textContent = '播放中…';
        replayBtn.classList.remove('is-done');
      }
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.addEventListener('ended', () => {
      if (replayBtn) {
        replayBtn.textContent = '↺ 重播';
        replayBtn.classList.add('is-done');
      }
    });

    stage.addEventListener('click', () => {
      if (video.ended || !video.dataset.playedOnce) {
        replayFromStart();
      } else if (video.paused) {
        video.play().catch(() => {});
        if (replayBtn) replayBtn.textContent = '播放中…';
      } else {
        video.pause();
        if (replayBtn) replayBtn.textContent = '▶ 继续';
      }
    });

    if (replayBtn) {
      replayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        replayFromStart();
      });
    }
  });

  if ('IntersectionObserver' in window && liveFigs.length) {
    const vio = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const fig = entry.target;
        const video = fig.querySelector('video');
        const replayBtn = fig.querySelector('.replay-btn');
        if (video && !video.dataset.playedOnce) {
          video.dataset.playedOnce = '1';
          if (replayBtn) replayBtn.textContent = '播放中…';
          video.play().catch(() => {});
        }
        vio.unobserve(fig);
      }
    }, { threshold: 0.4 });
    liveFigs.forEach((fig) => vio.observe(fig));
  }

  // Highlight active section in sticky outline
  const links = Array.from(document.querySelectorAll('.docs-outline-link'));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
        }
      }
    }, { rootMargin: '-20% 0px -65% 0px' });
    sections.forEach((sec) => io.observe(sec));
  }
})();
