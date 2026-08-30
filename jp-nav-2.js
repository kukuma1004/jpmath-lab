(() => {
  'use strict';

  const navScript = document.currentScript || document.querySelector('script[src*="jp-nav-2.js"]');
  const siteRoot = new URL('.', navScript?.src || document.baseURI);
  const sectionName = navScript?.dataset.jpSection || '';

  function siteHref(path = '') {
    return new URL(path, siteRoot).href;
  }

  function safeText(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function buildInjectedNavigation() {
    if (document.querySelector('[data-global-menu]')) return;
    const locationLabel = sectionName ? `JP / ${safeText(sectionName)}` : 'JP MATH LAB';
    const markup = `
      <header class="global-header" data-global-header data-theme="light">
        <a class="global-brand" href="${siteHref('')}" aria-label="JP Math Lab 홈">
          <span class="global-brand-mark" aria-hidden="true">JP</span>
          <span class="global-brand-name">${locationLabel}</span>
        </a>
        <button class="menu-open" type="button" aria-haspopup="dialog" aria-controls="globalMenu" aria-expanded="false" data-menu-open>
          <span>메뉴</span><span class="menu-open-icon" aria-hidden="true"><i></i><i></i></span>
        </button>
      </header>
      <div class="global-header-spacer" aria-hidden="true"></div>
      <div class="global-menu" id="globalMenu" role="dialog" aria-modal="true" aria-labelledby="globalMenuTitle" aria-hidden="true" data-global-menu>
        <div class="global-menu-top">
          <p id="globalMenuTitle"><span>JP</span> 공간 선택</p>
          <button class="menu-close" type="button" aria-label="전체 메뉴 닫기" data-menu-close><span aria-hidden="true"></span></button>
        </div>
        <nav class="global-menu-nav" aria-label="JP Math Lab 전체 메뉴">
          <section class="menu-group" style="--group-index:0">
            <p class="menu-group-label"><span>01</span> 배우기</p>
            <div class="menu-group-links">
              <a href="${siteHref('미적분1/')}"><strong>미적분Ⅰ</strong><small>변화를 움직여 보기</small></a>
              <a href="${siteHref('기하/')}"><strong>기하</strong><small>공간을 직접 만지기</small></a>
              <a href="${siteHref('경제수학/')}"><strong>경제수학</strong><small>계산하고 선택하기</small></a>
            </div>
          </section>
          <section class="menu-group" style="--group-index:1">
            <p class="menu-group-label"><span>02</span> 도전하기</p>
            <div class="menu-group-links">
              <a href="${siteHref('미적분1/오늘의_미적분.html')}"><strong>오늘의 도전</strong><small>미적분Ⅰ · 오늘의 함수 하나</small></a>
              <a href="${siteHref('경제수학/live/room.html')}"><strong>친구방 LIVE</strong><small>경제수학 · 각자 휴대폰으로</small></a>
              <a href="${siteHref('보스전/')}"><strong>보스전</strong><small>수학 실력을 데미지로 바꾸기</small></a>
            </div>
          </section>
          <section class="menu-group" style="--group-index:2">
            <p class="menu-group-label"><span>03</span> 탐구하기</p>
            <div class="menu-group-links">
              <a href="${siteHref('수능문제/')}"><strong>수능 문제 탐구</strong><small>조건을 질문으로 바꾸기</small></a>
              <a href="${siteHref('주제탐구/')}"><strong>주제탐구</strong><small>호기심을 탐구로 연결하기</small></a>
            </div>
          </section>
          <section class="menu-group menu-group-teacher" style="--group-index:3">
            <p class="menu-group-label"><span>04</span> 교사용</p>
            <div class="menu-group-links"><a href="${siteHref('수업창고/')}"><strong>수업창고</strong><small>수업 자료와 탐구 운영</small></a></div>
          </section>
        </nav>
        <p class="global-menu-foot">수학을 보고 · 움직이고 · 직접 발견하는 공간</p>
      </div>`;
    document.body.insertAdjacentHTML('afterbegin', markup);
    document.body.classList.add('jp-global-nav-ready');
  }

  buildInjectedNavigation();

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
