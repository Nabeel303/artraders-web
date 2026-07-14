/* ==============================================================
   AR TRADERS DXP — main.js
   Minimal vanilla JavaScript. Two responsibilities only:
     1. Header scroll state (transparent → white)
     2. Mobile fullscreen menu (open / close / a11y)
   ============================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     1. HEADER SCROLL STATE
     Adds .is-scrolled once the page moves past a small threshold.
     rAF-throttled so the scroll handler stays cheap.
     ------------------------------------------------------------ */
  const header = document.getElementById('site-header');
  const SCROLL_THRESHOLD = 24; // px

  // Internal pages set `data-solid` on the header: their heroes are
  // dark images, so the header stays white instead of transparent.
  const alwaysSolid = header.hasAttribute('data-solid');

  let ticking = false;

  function updateHeader() {
    header.classList.toggle('is-scrolled', alwaysSolid || window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateHeader(); // correct state on load (e.g. refresh mid-page)

  /* ------------------------------------------------------------
     2. MOBILE MENU
     Fullscreen slide-in panel. Handles:
       - open / close buttons
       - Escape key
       - closing when a menu link is tapped
       - body scroll lock
       - `inert` + aria-expanded for accessibility
     ------------------------------------------------------------ */
  const menu = document.getElementById('mobile-menu');
  const openBtn = document.getElementById('menu-open');
  const closeBtn = document.getElementById('menu-close');

  function openMenu() {
    menu.removeAttribute('inert');
    menu.classList.remove('translate-x-full');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    closeBtn.focus();
  }

  function closeMenu() {
    menu.classList.add('translate-x-full');
    menu.setAttribute('inert', '');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    openBtn.focus();
  }

  openBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hasAttribute('inert')) closeMenu();
  });

  // Close the panel when any menu link is chosen
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();
