/* ==========================================================================
   MuYu Writing / Wiki Shell Interactive Controller (Kubai087 #008 Spec)
   Plain JS, zero dependencies.
   ========================================================================== */
(function () {
  'use strict';

  const STORAGE_KEY = 'muyu-docs-nav-scroll-v1';
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------------
     1. Header Floating Bar State Machine
        - Scrolls away with .docs-banner at the top.
        - Enters as floating fixed bar once .docs-banner bottom <= 0 (320ms).
        - Leaves in 120ms when scrolling back up to .docs-banner (cancels if
          reader scrolls down again during exit).
     ------------------------------------------------------------------------ */
  function initFloatingHeader() {
    const banner = document.querySelector('.docs-banner');
    const header = document.querySelector('.docs-header');
    if (!banner || !header) return;

    let state = 'top'; // 'top' | 'floating' | 'leaving'
    let leaveTimer = null;
    let rafPending = false;

    function updateHeader() {
      rafPending = false;
      const shouldFloat = banner.getBoundingClientRect().bottom <= 0;

      if (shouldFloat) {
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (state !== 'floating') {
          header.classList.remove('is-leaving');
          header.classList.add('is-floating');
          state = 'floating';
        }
      } else {
        if (state === 'floating') {
          if (reducedMotionQuery.matches) {
            header.classList.remove('is-floating', 'is-leaving');
            state = 'top';
          } else {
            state = 'leaving';
            header.classList.remove('is-floating');
            header.classList.add('is-leaving');
            leaveTimer = setTimeout(() => {
              header.classList.remove('is-leaving');
              state = 'top';
              leaveTimer = null;
            }, 120);
          }
        }
      }
    }

    function onScroll() {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateHeader);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateHeader();
  }

  /* ------------------------------------------------------------------------
     2. Left Page List: Independent Scroll, Edge Fade Masks, Round Arrows,
        SessionStorage Scroll Persistence, and "/" Search Shortcut
     ------------------------------------------------------------------------ */
  function initPageList() {
    const navWrap = document.querySelector('.docs-nav-wrap');
    const navScroll = document.querySelector('.docs-nav-scroll');
    const upArrow = document.querySelector('.docs-nav-arrow--up');
    const downArrow = document.querySelector('.docs-nav-arrow--down');
    const searchInput = document.querySelector('.docs-search-input');

    if (!navWrap || !navScroll) return;

    function updateEdges() {
      const scrollTop = Math.round(navScroll.scrollTop);
      const maxScroll = Math.round(navScroll.scrollHeight - navScroll.clientHeight);
      const moreAbove = scrollTop > 4;
      const moreBelow = maxScroll - scrollTop > 4;

      const aboveStr = String(moreAbove);
      const belowStr = String(moreBelow);
      navScroll.setAttribute('data-more-above', aboveStr);
      navScroll.setAttribute('data-more-below', belowStr);
      navWrap.setAttribute('data-more-above', aboveStr);
      navWrap.setAttribute('data-more-below', belowStr);
    }

    // Restore sessionStorage scroll position or bring active page into view
    const currentLink = navScroll.querySelector('a[aria-current="page"]');
    const savedScroll = sessionStorage.getItem(STORAGE_KEY);
    if (savedScroll !== null) {
      navScroll.scrollTop = parseInt(savedScroll, 10) || 0;
    }
    if (currentLink) {
      const wrapRect = navScroll.getBoundingClientRect();
      const linkRect = currentLink.getBoundingClientRect();
      if (linkRect.top < wrapRect.top + 28 || linkRect.bottom > wrapRect.bottom - 28) {
        currentLink.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
    updateEdges();

    navScroll.addEventListener(
      'scroll',
      () => {
        updateEdges();
        try {
          sessionStorage.setItem(STORAGE_KEY, String(Math.round(navScroll.scrollTop)));
        } catch (_) {}
      },
      { passive: true }
    );

    window.addEventListener('resize', updateEdges, { passive: true });

    if (upArrow) {
      upArrow.addEventListener('click', () => {
        const delta = Math.max(120, Math.round(navScroll.clientHeight * 0.6));
        navScroll.scrollBy({
          top: -delta,
          behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
        });
      });
    }

    if (downArrow) {
      downArrow.addEventListener('click', () => {
        const delta = Math.max(120, Math.round(navScroll.clientHeight * 0.6));
        navScroll.scrollBy({
          top: delta,
          behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
        });
      });
    }

    // "/" keyboard shortcut to focus search box & real-time filter
    if (searchInput) {
      document.addEventListener('keydown', (e) => {
        if (
          e.key === '/' &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.altKey &&
          !/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '') &&
          !(document.activeElement && document.activeElement.isContentEditable)
        ) {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
      });

      const groups = [...navScroll.querySelectorAll('.docs-nav-group')];
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        groups.forEach((group) => {
          const links = [...group.querySelectorAll('.docs-nav-link')];
          let visibleCount = 0;
          links.forEach((link) => {
            const match = !q || link.textContent.toLowerCase().includes(q);
            link.hidden = !match;
            if (match) visibleCount++;
          });
          group.hidden = visibleCount === 0;
        });
        updateEdges();
      });
    }
  }

  /* ------------------------------------------------------------------------
     3. Outline ("On this page"): 20% Viewport Line Tracking + Mobile Dock Sync
     ------------------------------------------------------------------------ */
  function initOutlineAndSheets() {
    const desktopOutlineList = document.querySelector('.docs-outline-list');
    const sheetOutlineList = document.querySelector('#sheetOutline .docs-outline-list');
    const dockSectionLabel = document.querySelector('[data-current-section-label]');

    // Collect headings from .docs-main
    const headings = [
      ...document.querySelectorAll(
        '.docs-main .post > h2, .docs-main article > h2, .docs-main h2[id], .docs-main [data-outline-heading]'
      ),
    ];

    if (!headings.length) return;

    // Ensure every heading has an ID
    headings.forEach((h, i) => {
      if (!h.id) {
        h.id = `section-${String(i + 1).padStart(2, '0')}`;
      }
    });

    function cleanHeadingText(h) {
      return (h.getAttribute('data-outline-label') || h.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Populate outline lists if empty or synchronize links
    function ensureLinks(listEl) {
      if (!listEl) return [];
      const existing = [...listEl.querySelectorAll('.docs-outline-link')];
      if (existing.length === headings.length) {
        existing.forEach((a, idx) => {
          a.setAttribute('href', `#${headings[idx].id}`);
          a.textContent = cleanHeadingText(headings[idx]);
        });
        return existing;
      }
      listEl.innerHTML = '';
      return headings.map((h) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'docs-outline-link';
        a.href = `#${h.id}`;
        a.textContent = cleanHeadingText(h);
        li.appendChild(a);
        listEl.appendChild(li);
        return a;
      });
    }

    const desktopLinks = ensureLinks(desktopOutlineList);
    const mobileLinks = ensureLinks(sheetOutlineList);

    let rafId = null;

    function syncActiveHeading() {
      rafId = null;
      const thresholdLine = window.innerHeight * 0.2;
      let activeIndex = 0;

      headings.forEach((h, idx) => {
        if (h.getBoundingClientRect().top <= thresholdLine) {
          activeIndex = idx;
        }
      });

      desktopLinks.forEach((link, idx) => {
        if (idx === activeIndex) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });

      mobileLinks.forEach((link, idx) => {
        if (idx === activeIndex) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });

      if (dockSectionLabel && headings[activeIndex]) {
        dockSectionLabel.textContent = cleanHeadingText(headings[activeIndex]);
      }
    }

    function requestSync() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(syncActiveHeading);
    }

    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync, { passive: true });
    syncActiveHeading();

    // Dialog Bottom Sheets for Narrow Screens
    const sheetPages = document.getElementById('sheetPages');
    const sheetOutline = document.getElementById('sheetOutline');
    const btnOpenPages = document.querySelector('[data-open-sheet="pages"]');
    const btnOpenOutline = document.querySelector('[data-open-sheet="outline"]');

    function openSheet(dialog, currentSelector) {
      if (!dialog || typeof dialog.showModal !== 'function') return;
      dialog.showModal();
      const currentEl = dialog.querySelector(currentSelector);
      if (currentEl) {
        requestAnimationFrame(() => {
          currentEl.scrollIntoView({ block: 'center', behavior: 'instant' });
        });
      }
    }

    if (btnOpenPages && sheetPages) {
      btnOpenPages.addEventListener('click', () => {
        openSheet(sheetPages, 'a[aria-current="page"]');
      });
    }

    if (btnOpenOutline && sheetOutline) {
      btnOpenOutline.addEventListener('click', () => {
        syncActiveHeading();
        openSheet(sheetOutline, 'a[aria-current="location"]');
      });
    }

    [sheetPages, sheetOutline].filter(Boolean).forEach((dialog) => {
      // Close button
      dialog.querySelectorAll('[data-close-sheet]').forEach((btn) => {
        btn.addEventListener('click', () => dialog.close());
      });

      // Tap outside sheet (backdrop area on <dialog>)
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
          dialog.close();
        }
      });

      // Tap on any link inside the sheet closes it; section links scroll to heading
      dialog.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href') || '';
          if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.getElementById(href.slice(1));
            dialog.close();
            if (target) {
              target.scrollIntoView({
                behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
                block: 'start',
              });
              history.replaceState(null, '', href);
            }
          } else {
            dialog.close();
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initFloatingHeader();
      initPageList();
      initOutlineAndSheets();
    });
  } else {
    initFloatingHeader();
    initPageList();
    initOutlineAndSheets();
  }
})();
