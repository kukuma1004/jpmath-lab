(function () {
  'use strict';

  function boot() {
    var deck = document.querySelector('.deck');
    var slides = Array.prototype.slice.call(document.querySelectorAll('.deck .slide'));
    if (!deck || !slides.length || document.querySelector('.mobile-deck-nav')) return;

    var nav = document.createElement('nav');
    nav.className = 'mobile-deck-nav';
    nav.setAttribute('aria-label', '오리엔테이션 슬라이드 이동');

    var previous = document.createElement('button');
    previous.type = 'button';
    previous.setAttribute('aria-label', '이전 슬라이드');
    previous.textContent = '‹';

    var count = document.createElement('span');
    count.className = 'mobile-deck-count';
    count.setAttribute('aria-live', 'polite');

    var next = document.createElement('button');
    next.type = 'button';
    next.setAttribute('aria-label', '다음 슬라이드');
    next.textContent = '›';

    nav.appendChild(previous);
    nav.appendChild(count);
    nav.appendChild(next);
    document.body.appendChild(nav);

    var lastIndex = -1;

    function activeIndex() {
      var current = document.querySelector('.deck .slide.is-active');
      var index = current ? slides.indexOf(current) : -1;
      if (index < 0) {
        var matched = String(location.hash || '').match(/^#\/(\d+)$/);
        index = matched ? Math.max(0, Math.min(slides.length - 1, Number(matched[1]) - 1)) : 0;
      }
      return index;
    }

    function sync() {
      var index = activeIndex();
      count.textContent = (index + 1) + ' / ' + slides.length;
      count.title = slides[index].getAttribute('data-title') || '';
      previous.disabled = index === 0;
      next.disabled = index === slides.length - 1;
      if (lastIndex !== index && window.matchMedia('(max-width: 700px)').matches) {
        slides[index].scrollTop = 0;
      }
      lastIndex = index;
    }

    function move(key) {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: key,
        code: key,
        keyCode: key === 'ArrowRight' ? 39 : 37,
        bubbles: true
      }));
      window.setTimeout(sync, 40);
    }

    previous.addEventListener('click', function () { move('ArrowLeft'); });
    next.addEventListener('click', function () { move('ArrowRight'); });
    window.addEventListener('hashchange', sync);

    var observer = new MutationObserver(sync);
    slides.forEach(function (slide) {
      observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
    });

    var copy = document.getElementById('copyBasket');
    var actions = document.querySelector('.basket-actions');
    if (copy && actions) {
      var status = document.createElement('p');
      status.className = 'copy-basket-status';
      status.id = 'copyBasketStatus';
      status.setAttribute('role', 'status');
      actions.parentNode.appendChild(status);
      copy.setAttribute('aria-describedby', status.id);
      copy.addEventListener('click', function () {
        window.setTimeout(function () {
          var selected = document.querySelectorAll('.basket-list .bitem').length;
          status.textContent = selected
            ? '선택한 ' + selected + '개를 복사했습니다. 활동지에서 길게 눌러 붙여넣으세요.'
            : '먼저 관심 가는 주제를 눌러 최대 3개까지 골라 주세요.';
        }, 80);
      });
    }

    sync();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
}());

