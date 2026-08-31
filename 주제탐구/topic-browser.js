/* 탐구 주제 브라우저 — 오리엔테이션 슬라이드와 주제탐구 페이지가 함께 쓴다.
   주제 목록은 여기 한 곳에만 둔다. 두 곳에 두면 반드시 어긋난다. */
(function () {
  'use strict';

  var TOPICS = [
    {n:3, c:'calc', lv:'easy', t:'Limit Lab',              q:'점에 도달하지 않아도 그 점의 값을 말할 수 있는가?', b:'좌·우 접근값을 표로 보여 주는 극한 시뮬레이터'},
    {n:4, c:'calc', lv:'easy', t:'Continuity Lab',         q:'그래프가 이어져 보인다는 직관은 언제 틀리는가?',    b:'연속의 세 조건을 따로 판정하는 도구'},
    {n:5, c:'calc', lv:'', t:'Differentiability Lab',      q:'연속이면 언제나 미분 가능한가?',                    b:'좌·우 할선 기울기를 비교하는 미분가능성 탐지기'},
    {n:6, c:'calc', lv:'easy', t:'Secant → Tangent',       q:'순간변화율은 어떻게 탄생하는가?',                  b:'할선이 접선으로 수렴하는 시뮬레이터'},
    {n:7, c:'calc', lv:'easy', t:'Derivative Lab',         q:'도함수는 원함수에 대해 무엇을 말해 주는가?',        b:'도함수 생성기 + 수치미분 검산기'},
    {n:8, c:'calc', lv:'', t:'Function Detective',         q:'도함수만 보고 원함수를 알아낼 수 있는가?',          b:'도함수 부호로 그래프를 추리하는 게임'},
    {n:9, c:'calc', lv:'hard', t:'Mean Value Lab',         q:'평균변화율과 순간변화율은 왜 반드시 만나는가?',      b:'평균값정리의 조건을 조작하는 탐구기'},
    {n:10,c:'calc', lv:'hard', t:'Optimization Studio',    q:'최선의 선택은 어떻게 찾는가?',                      b:'제약조건을 넣은 최적화 모델러'},
    {n:11,c:'calc', lv:'easy', t:'Motion Lab',             q:'위치·속도·가속도는 어떻게 연결되는가?',             b:'세 그래프가 연동되는 운동 시뮬레이터'},
    {n:12,c:'calc', lv:'easy', t:'Riemann Sum Lab',        q:'넓이는 어떻게 무한한 합이 되는가?',                 b:'분할 수를 조절하는 리만합 시각화 도구'},
    {n:13,c:'calc', lv:'', t:'Definite Integral Lab',      q:'정적분은 넓이인가, 누적량인가?',                    b:'부호를 포함한 누적량 계산기'},
    {n:14,c:'calc', lv:'hard', t:'Fundamental Theorem Lab',q:'누적함수의 변화율은 왜 원래 함수인가?',             b:'미적분 기본정리를 눈으로 보는 도구'},
    {n:15,c:'calc', lv:'', t:'Integral Modeling',          q:'적분으로 현실의 무엇을 설명할 수 있는가?',          b:'실제 데이터를 누적하는 모델 앱'},
    {n:16,c:'calc', lv:'hard', t:'Calculus Synthesis',     q:'변화와 누적을 하나의 규칙으로 묶을 수 있는가?',      b:'미적분 종합 챌린지 작품'},
    {n:17,c:'geo',  lv:'easy', t:'Parabola Lab',           q:'포물선은 왜 포물선인가?',                          b:'초점·준선에서 자취를 생성하는 도구'},
    {n:18,c:'geo',  lv:'', t:'Ellipse & Hyperbola Lab',    q:'두 초점은 왜 두 종류의 자취를 만드는가?',           b:'거리의 합·차로 곡선을 그리는 생성기'},
    {n:19,c:'geo',  lv:'hard', t:'Conic Tangent Lab',      q:'접선은 곡선의 정보를 어떻게 담는가?',               b:'판별식으로 접선을 판정하는 도구'},
    {n:20,c:'geo',  lv:'', t:'3D Geometry Lab',            q:'공간의 위치 관계를 조건으로 쓸 수 있는가?',         b:'3차원 직선·평면 시각화 도구'},
    {n:21,c:'geo',  lv:'hard', t:'Projection Lab',         q:'정사영과 최단거리는 왜 같은 이야기인가?',           b:'투영 방향에 따른 도형 변화 탐구기'},
    {n:22,c:'geo',  lv:'easy', t:'3D Coordinate Lab',      q:'좌표만으로 공간을 계산할 수 있는가?',               b:'거리·내분점 인터랙션 계산기'},
    {n:23,c:'geo',  lv:'easy', t:'Vector Engine I',        q:'벡터는 이동을 어떻게 규칙으로 만드는가?',           b:'벡터로 움직이는 이동 엔진'},
    {n:24,c:'geo',  lv:'', t:'Vector Engine II',           q:'내적은 방향 관계를 어떻게 판정하는가?',             b:'내적 부호로 방향을 판정하는 도구'},
    {n:25,c:'geo',  lv:'hard', t:'Line & Plane Navigator', q:'직선과 평면을 벡터로 설계할 수 있는가?',            b:'벡터 기반 3D 내비게이터'},
    {n:26,c:'geo',  lv:'hard', t:'Geometry Synthesis',     q:'자취에서 공간 엔진까지 이을 수 있는가?',            b:'기하 종합 챌린지 작품'}
  ];

  // 오리엔테이션 슬라이드의 바구니와 같은 열쇠를 쓴다.
  // 수업에서 고른 3개가 주제탐구 페이지에서도 그대로 보여야 한다.
  var KEY = 'jp-orient-basket-v1';
  var LIMIT = 3;

  function readBasket() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function writeBasket(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }
  function subjectOf(t) { return t.c === 'calc' ? '미적분Ⅰ' : '기하'; }
  function levelOf(t) { return t.lv === 'hard' ? '도전' : (t.lv === 'easy' ? '입문' : '표준'); }
  function count(fn) { return TOPICS.filter(fn).length; }

  function mount(root, options) {
    if (!root) return null;
    var opts = options || {};
    var basket = readBasket();

    var filters = [
      { f: 'all', label: '전체', n: TOPICS.length },
      { f: 'calc', label: '미적분Ⅰ', n: count(function (t) { return t.c === 'calc'; }) },
      { f: 'geo', label: '기하', n: count(function (t) { return t.c === 'geo'; }) },
      { f: 'easy', label: '입문용', n: count(function (t) { return t.lv === 'easy'; }) },
      { f: 'hard', label: '도전용', n: count(function (t) { return t.lv === 'hard'; }) }
    ];

    root.innerHTML =
      '<div class="sf-filters" role="group" aria-label="주제 걸러보기">' +
        filters.map(function (x, i) {
          return '<button type="button" class="sf-filter' + (i === 0 ? ' on' : '') + '"' +
                 ' data-filter="' + x.f + '" aria-pressed="' + (i === 0) + '">' +
                 x.label + '<i>' + x.n + '</i></button>';
        }).join('') +
      '</div>' +
      '<div class="sf-body">' +
        '<div class="sf-scroll"><div class="sf-grid" role="list"></div></div>' +
        '<aside class="sf-basket">' +
          '<h3>내 탐구 경로</h3>' +
          '<p class="sf-basket-cap">최대 ' + LIMIT + '개까지 담긴다 · 이 브라우저에 저장된다</p>' +
          '<div class="sf-basket-list" aria-live="polite"></div>' +
          '<div class="sf-basket-actions">' +
            '<button type="button" class="sf-copy">활동지에 붙여넣기용 복사</button>' +
            '<button type="button" class="sf-clear">비우기</button>' +
          '</div>' +
        '</aside>' +
      '</div>';

    var grid = root.querySelector('.sf-grid');
    var list = root.querySelector('.sf-basket-list');
    var box = root.querySelector('.sf-basket');

    TOPICS.forEach(function (t, i) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'sf-card' + (t.c === 'geo' ? ' geo' : '');
      card.setAttribute('role', 'listitem');
      card.dataset.i = String(i);
      card.dataset.c = t.c;
      card.dataset.lv = t.lv;
      card.innerHTML =
        '<span class="sf-tag">' + t.n + '차시 · ' + subjectOf(t) + ' · ' + levelOf(t) + '</span>' +
        '<span class="sf-title">' + t.t + '</span>' +
        '<span class="sf-q">' + t.q + '</span>' +
        '<span class="sf-build">만들 것 · ' + t.b + '</span>' +
        '<span class="sf-pick" aria-hidden="true"></span>';
      card.addEventListener('click', function () { toggle(i); });
      grid.appendChild(card);
    });

    root.querySelectorAll('.sf-filter').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.dataset.filter;
        root.querySelectorAll('.sf-filter').forEach(function (x) {
          var on = x === b;
          x.classList.toggle('on', on);
          x.setAttribute('aria-pressed', String(on));
        });
        root.querySelectorAll('.sf-card').forEach(function (c) {
          var show = f === 'all' || c.dataset.c === f || c.dataset.lv === f;
          c.hidden = !show;
        });
        if (typeof opts.onFilter === 'function') opts.onFilter(f);
      });
    });

    function toggle(i) {
      var at = basket.indexOf(i);
      if (at > -1) basket.splice(at, 1);
      else {
        if (basket.length >= LIMIT) { flash(); return; }
        basket.push(i);
        if (typeof opts.onPick === 'function') opts.onPick(TOPICS[i]);
      }
      writeBasket(basket);
      render();
    }

    function flash() {
      box.classList.add('is-full');
      setTimeout(function () { box.classList.remove('is-full'); }, 420);
    }

    function render() {
      root.querySelectorAll('.sf-card').forEach(function (c) {
        var on = basket.indexOf(+c.dataset.i) > -1;
        c.classList.toggle('sel', on);
        c.setAttribute('aria-pressed', String(on));
      });
      if (!basket.length) {
        list.innerHTML = '<p class="sf-empty">아직 고른 주제가 없다.<br>궁금한 것 <b>3개</b>를 눌러보자.</p>';
        return;
      }
      list.innerHTML = '';
      basket.forEach(function (idx, k) {
        var t = TOPICS[idx];
        var el = document.createElement('div');
        el.className = 'sf-bitem';
        el.innerHTML =
          '<span class="sf-bn">' + (k + 1) + '</span>' +
          '<span class="sf-btext"><b>' + t.t + '</b><small>' + t.n + '차시 · ' + t.b + '</small></span>' +
          '<button type="button" class="sf-bx" aria-label="' + t.t + ' 빼기">×</button>';
        el.querySelector('.sf-bx').addEventListener('click', function (e) {
          e.stopPropagation(); toggle(idx);
        });
        list.appendChild(el);
      });
    }

    function copyText() {
      var lines = ['[주제탐구 수학] 내가 고른 탐구 주제', ''];
      basket.forEach(function (idx, k) {
        var t = TOPICS[idx];
        lines.push((k + 1) + ') ' + t.n + '차시 · ' + t.t + ' (' + subjectOf(t) + ')');
        lines.push('   핵심 질문: ' + t.q);
        lines.push('   만들 것: ' + t.b);
        lines.push('   고른 이유: ');
        lines.push('');
      });
      return lines.join('\n');
    }

    function fallbackCopy(text, cb) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-1000px;left:0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); cb(); } catch (e) { window.prompt('복사할 내용', text); }
      document.body.removeChild(ta);
    }

    var copyBtn = root.querySelector('.sf-copy');
    copyBtn.addEventListener('click', function () {
      if (!basket.length) { flash(); return; }
      var text = copyText();
      var done = function () {
        var old = copyBtn.textContent;
        copyBtn.textContent = '복사됨 · 활동지에 붙여넣기';
        setTimeout(function () { copyBtn.textContent = old; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else fallbackCopy(text, done);
    });
    root.querySelector('.sf-clear').addEventListener('click', function () {
      basket = []; writeBasket(basket); render();
    });

    render();
    return { render: render, topics: TOPICS };
  }

  window.JPTopics = TOPICS;
  window.JPTopicBrowser = { mount: mount, storageKey: KEY, limit: LIMIT };

  document.addEventListener('DOMContentLoaded', function () {
    var auto = document.querySelector('[data-topic-browser]');
    if (auto) mount(auto);
  });
}());
