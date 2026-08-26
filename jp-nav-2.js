(() => {
  'use strict';

  const menu = document.querySelector('[data-global-menu]');
  const openers = [...document.querySelectorAll('[data-menu-open], [data-menu-open-bottom]')];
  const closeButton = document.querySelector('[data-menu-close]');
  const header = document.querySelector('[data-global-header]');
  let returnFocus = null;

  if (!menu || !openers.length || !closeButton) return;

  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openMenu(source) {
    returnFocus = source || document.activeElement;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-is-open');
    openers.forEach(button => button.setAttribute('aria-expanded', 'true'));
    window.requestAnimationFrame(() => closeButton.focus());
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-is-open');
    openers.forEach(button => button.setAttribute('aria-expanded', 'false'));
    if (restoreFocus && returnFocus instanceof HTMLElement) returnFocus.focus();
  }

  function keepFocusInside(event) {
    if (event.key !== 'Tab' || !menu.classList.contains('is-open')) return;
    const focusable = [...menu.querySelectorAll(focusableSelector)].filter(element => !element.hasAttribute('hidden'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  openers.forEach(button => button.addEventListener('click', () => openMenu(button)));
  closeButton.addEventListener('click', () => closeMenu());
  menu.addEventListener('click', event => {
    if (event.target === menu) closeMenu();
    if (event.target.closest('a[href]')) closeMenu({ restoreFocus: false });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
    keepFocusInside(event);
  });

  function updateHeader() {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
})();
