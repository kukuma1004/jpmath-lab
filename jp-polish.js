/* ===================================================================
   JP Math Lab · 공통 마감 레이어 (jp-polish)
   -------------------------------------------------------------------
   페이지의 기존 동작을 건드리지 않고 '움직임'만 얹는다.
   - 화면에 들어오는 블록을 차례로 올려 보여 준다
   - 탭을 바꾸면 새 패널이 부드럽게 나타난다
   - 값이 바뀐 수치에 짧은 강조를 준다
   - 슬라이더를 키보드/휠로도 세밀하게 움직일 수 있게 한다
   엔진이 나중에 DOM 을 그려도 따라붙도록 MutationObserver 로 감시한다.
   =================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. 진입 애니메이션 ────────────────────────────────── */

  // 이 선택자에 걸리는 블록만 대상으로 한다 (글자 한 줄까지 흔들지 않도록)
  var RISE = [
    '.theory-section', '.section', '.mini-card', '.visual-card',
    '.graph-card', '.lab-graph-card', '.concept-box', '.theorem-box',
    '.limit-box', '.question-card', '.q-card',
    '.lesson-block', '.step-block', '.panel-block'
  ].join(',');

  function reveal(el) {
    el.classList.remove('jp-pre');
    el.classList.add('jp-in');
  }

  var io = null;
  if (!reduce && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        reveal(en.target);
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0 });
  }

  function markRise(root) {
    if (reduce || !io) return;
    var nodes = (root || document).querySelectorAll(RISE);
    var lastParent = null, seq = 0;
    nodes.forEach(function (el) {
      if (el.hasAttribute('data-jp-rise')) return;
      if (el.closest('[data-jp-rise]')) return;      // 중첩되면 바깥만
      // 형제끼리는 차례로 (최대 5단계)
      if (el.parentElement === lastParent) { seq = Math.min(seq + 1, 5); }
      else { lastParent = el.parentElement; seq = 0; }
      el.setAttribute('data-jp-rise', '');
      if (seq) el.setAttribute('data-jp-delay', String(seq));
      // 화면 아래에 있는 블록만 잠깐 감췄다가 올라오게 한다.
      // 지금 보이는 것(또는 크기를 잴 수 없는 것)은 건드리지 않는다.
      var r = el.getBoundingClientRect();
      var measurable = r.width > 0 || r.height > 0;
      if (measurable && r.top >= window.innerHeight) {
        el.classList.add('jp-pre');
        io.observe(el);
      }
    });
  }

  /* ── 2. 탭 전환 ────────────────────────────────────────── */

  function flashPanels() {
    // 방금 보이게 된 패널을 찾아 한 번 흘려 넣는다
    var shown = document.querySelectorAll(
      '.tab-panel.active, .panel.active, [data-panel].active, .tab-pane.active'
    );
    shown.forEach(function (p) {
      p.classList.remove('jp-panel-in');
      void p.offsetWidth;                 // 애니메이션 재시작
      p.classList.add('jp-panel-in');
      markRise(p);
    });
    // 숨어 있던 패널 안에서 대기 중이던 블록을 바로 보여 준다
    queueSweep();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('.tab-btn, [data-tab], [role="tab"]');
    if (!t || reduce) return;
    setTimeout(flashPanels, 0);
    setTimeout(queueSweep, 120);
  }, true);

  /* ── 3. 값이 바뀐 수치에 짧은 강조 ─────────────────────── */

  function watchReadouts(root) {
    if (reduce) return;
    var outs = (root || document).querySelectorAll('.readout-box, output, .chip-value, [data-readout]');
    outs.forEach(function (el) {
      if (el.__jpWatched) return;
      el.__jpWatched = true;
      var mo = new MutationObserver(function () {
        el.classList.remove('jp-value-changed');
        void el.offsetWidth;
        el.classList.add('jp-value-changed');
      });
      mo.observe(el, { childList: true, characterData: true, subtree: true });
    });
  }

  /* ── 4. 슬라이더를 더 잘게 움직이게 ─────────────────────────
     step 이 커서 뚝뚝 끊기는 슬라이더만 골라 키보드·휠에서
     10배 세밀하게 움직이도록 한다. (기본 드래그 동작은 그대로 두어
     정수 단계를 전제로 만든 실험실이 깨지지 않게 한다.) */

  function fineTune(root) {
    var rs = (root || document).querySelectorAll('input[type=range]');
    rs.forEach(function (r) {
      if (r.__jpFine) return;
      r.__jpFine = true;

      var min = parseFloat(r.min || 0), max = parseFloat(r.max || 100);
      var step = parseFloat(r.step || 1);
      var span = max - min;
      if (!isFinite(span) || span <= 0) return;
      var coarse = step >= span / 24;            // 눈금이 24칸보다 성기면 '거친' 슬라이더

      // 휠로 미세 조정
      r.addEventListener('wheel', function (ev) {
        if (document.activeElement !== r) return;   // 포커스가 있을 때만
        ev.preventDefault();
        var d = (ev.deltaY < 0 ? 1 : -1) * step;
        r.value = Math.min(max, Math.max(min, parseFloat(r.value) + d));
        r.dispatchEvent(new Event('input', { bubbles: true }));
        r.dispatchEvent(new Event('change', { bubbles: true }));
      }, { passive: false });

      // 거친 슬라이더는 Shift+화살표로 1/10 단위 이동
      if (coarse) {
        r.addEventListener('keydown', function (ev) {
          if (!ev.shiftKey) return;
          var dir = (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') ? 1
                  : (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') ? -1 : 0;
          if (!dir) return;
          ev.preventDefault();
          var fine = step / 10;
          var v = Math.min(max, Math.max(min, parseFloat(r.value) + dir * fine));
          r.step = 'any';
          r.value = v;
          r.dispatchEvent(new Event('input', { bubbles: true }));
          r.dispatchEvent(new Event('change', { bubbles: true }));
        });
        if (!r.title) r.title = 'Shift + ← → : 더 잘게 움직이기 · 휠로도 조절됩니다';
      }
    });
  }

  /* ── 5. 앵커 이동을 부드럽게 (구형 대비) ────────────────── */

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });


  /* ═══════════════════════════════════════════════════════════
     탐구 경로 레일 — 1세대 페이지를 3세대 레이아웃으로
     .theory-h2 로 목차를 만들어 왼쪽에 세우고,
     읽고 있는 위치를 따라 표시한다. 내용은 건드리지 않는다.
     ═══════════════════════════════════════════════════════════ */
  function buildRail() {
    var wrap = document.querySelector('.wrap');
    if (!wrap || document.querySelector('.jp-rail')) return;

    var heads = [].slice.call(document.querySelectorAll('.theory-h2'));
    if (heads.length < 3) return;          // 목차가 될 만큼 없으면 켜지 않는다

    // 각 제목이 속한 블록(스크롤 목표)을 찾는다
    var targets = heads.map(function (h) {
      return h.closest('.theory-section') || h.parentElement || h;
    });

    var rail = document.createElement('nav');
    rail.className = 'jp-rail';
    rail.setAttribute('aria-label', '탐구 경로');

    var eyebrow = document.createElement('div');
    eyebrow.className = 'jp-rail-eyebrow';
    eyebrow.textContent = '탐구 경로';
    rail.appendChild(eyebrow);

    var ol = document.createElement('ol');
    var items = heads.map(function (h, idx) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      // 제목이 '1. 극한이란?' 형태라 앞의 번호는 떼고 원 번호로 대신 보여 준다
      var label = h.textContent.trim().replace(/^\s*\d+\s*[.)]\s*/, '');
      b.innerHTML = '<span class="n"></span><span class="t"></span>';
      b.querySelector('.n').textContent = String(idx + 1);
      b.querySelector('.t').textContent = label;
      b.addEventListener('click', function () {
        var y = window.scrollY + targets[idx].getBoundingClientRect().top - 96;
        window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      });
      li.appendChild(b);
      ol.appendChild(li);
      return li;
    });
    rail.appendChild(ol);

    var foot = document.createElement('div');
    foot.className = 'jp-rail-foot';
    foot.textContent = '왼쪽 항목을 누르면 그 대목으로 이동합니다.';
    rail.appendChild(foot);

    wrap.insertBefore(rail, wrap.firstChild);
    document.body.classList.add('jp-rail-on');

    // 읽기 진행 막대
    var bar = document.createElement('div');
    bar.className = 'jp-progress';
    bar.innerHTML = '<i></i>';
    document.body.appendChild(bar);
    var fill = bar.querySelector('i');

    // 지금 읽고 있는 대목 표시 + 진행률
    function spy() {
      var mid = window.innerHeight * 0.32;
      var cur = 0;
      for (var k = 0; k < targets.length; k++) {
        if (targets[k].getBoundingClientRect().top <= mid) cur = k;
      }
      items.forEach(function (li, k) {
        li.classList.toggle('on', k === cur);
        li.classList.toggle('done', k < cur);
      });
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      fill.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%';
    }

    var queued = false;
    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; spy(); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    spy();

    // 원리 탭에서만 레일을 보여 준다
    function syncTab() {
      var theory = document.getElementById('page-theory');
      var on = !theory || !theory.classList.contains('hidden');
      rail.style.visibility = on ? '' : 'hidden';
      bar.style.display = on ? '' : 'none';
      if (on) spy();
    }
    document.addEventListener('click', function (e) {
      if (e.target.closest('.tab-btn, [data-tab]')) setTimeout(syncTab, 20);
    }, true);
    syncTab();
  }

  /* ── 6. 부팅 + 엔진이 나중에 그린 것도 따라잡기 ─────────── */

  // 안전망 — 어떤 이유로든 화면 안에 있는데 아직 안 나타난 블록은 즉시 보여 준다.
  // (JS 가 나중에 hidden 을 푸는 카드가 투명한 채로 남는 사고를 막는다)
  function sweep() {
    if (reduce) return;
    var pend = document.querySelectorAll('[data-jp-rise].jp-pre');
    if (!pend.length) return;
    var h = window.innerHeight;
    pend.forEach(function (el) {
      var r = el.getBoundingClientRect();
      // 화면에 걸쳐 있으면 올려 보여 주고,
      // 크기를 잴 수 없게 된(숨은 탭 등) 것은 감춤을 아예 풀어 준다.
      if (r.width === 0 && r.height === 0) { el.classList.remove('jp-pre'); return; }
      if (r.top < h && r.bottom > 0) reveal(el);
    });
  }

  var sweepQueued = false;
  function queueSweep() {
    if (sweepQueued) return;
    sweepQueued = true;
    requestAnimationFrame(function () { sweepQueued = false; sweep(); });
  }
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });

  function scan(root) {
    markRise(root);
    watchReadouts(root);
    fineTune(root);
    queueSweep();
  }

  function buildDisplayTools() {
    if (document.querySelector('.jp-display-tools')) return;
    if (document.querySelector('main.bento')) return;

    var bodyMax = parseFloat(getComputedStyle(document.body).maxWidth);
    if (isFinite(bodyMax) && bodyMax > 0 && bodyMax <= 1400) {
      document.body.classList.add('jp-hub-page');
    }
    var directMain = document.body.querySelector(':scope > main');
    if (directMain && !isFinite(bodyMax) && directMain.getBoundingClientRect().width <= 1220) {
      document.body.classList.add('jp-wide-main');
    }

    var modes = {
      auto: { label: '자동', button: '화면 맞춤' },
      large: { label: '크게', button: '화면 크게' },
      xlarge: { label: '더 크게', button: '화면 더 크게' }
    };
    var saved = 'auto';
    try { saved = localStorage.getItem('jp-display-size') || 'auto'; } catch (e) {}
    if (!modes[saved]) saved = 'auto';

    var tools = document.createElement('div');
    tools.className = 'jp-display-tools';
    tools.innerHTML = '<div class="jp-display-menu" hidden></div>' +
      '<button class="jp-display-trigger" type="button" aria-expanded="false" aria-label="수업 화면 크기 선택"></button>';
    var menu = tools.querySelector('.jp-display-menu');
    var trigger = tools.querySelector('.jp-display-trigger');

    Object.keys(modes).forEach(function (key) {
      var button = document.createElement('button');
      button.type = 'button';
      button.dataset.displayMode = key;
      button.textContent = modes[key].label;
      menu.appendChild(button);
    });

    function applyMode(mode) {
      saved = modes[mode] ? mode : 'auto';
      document.documentElement.dataset.jpDisplay = saved;
      trigger.textContent = modes[saved].button;
      menu.querySelectorAll('button').forEach(function (button) {
        var active = button.dataset.displayMode === saved;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      try { localStorage.setItem('jp-display-size', saved); } catch (e) {}
      setTimeout(queueSweep, 30);
    }

    trigger.addEventListener('click', function () {
      var opening = menu.hidden;
      menu.hidden = !opening;
      trigger.setAttribute('aria-expanded', String(opening));
    });
    menu.addEventListener('click', function (event) {
      var button = event.target.closest('[data-display-mode]');
      if (!button) return;
      applyMode(button.dataset.displayMode);
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('click', function (event) {
      if (tools.contains(event.target)) return;
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    });

    document.body.appendChild(tools);
    applyMode(saved);
  }

  function applySectionTheme() {
    var path = '';
    try { path = decodeURIComponent(window.location.pathname); }
    catch (e) { path = window.location.pathname; }

    var section = '';
    if (path.indexOf('/미적분1/') !== -1) section = 'calculus';
    else if (path.indexOf('/기하/') !== -1) section = 'geometry';
    else if (path.indexOf('/경제수학/') !== -1) section = 'economy';
    else if (path.indexOf('/수능문제/') !== -1) section = 'csat';

    if (section) document.documentElement.dataset.jpSection = section;
  }

  function boot() {
    try { applySectionTheme(); } catch (e) { console.warn('jp-theme:', e); }
    try { buildDisplayTools(); } catch (e) { console.warn('jp-display:', e); }
    scan(document);
    try { buildRail(); } catch (e) { console.warn('jp-rail:', e); }

    // 레이아웃이 나중에 바뀌어(그림 로딩·접힘 펼침 등) 블록이 화면에 들어오는
    // 경우까지 잡기 위해, 초기 몇 차례와 크기 변화 때 한 번씩 더 쓸어 준다.
    [250, 800, 1800, 3200].forEach(function (t) { setTimeout(queueSweep, t); });
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () { queueSweep(); });
      ro.observe(document.body);
    }

    // 학습 엔진(기하_학습.js 등)이 나중에 DOM 을 채우는 경우가 많다
    var pending = null;
    var mo = new MutationObserver(function () {
      clearTimeout(pending);
      pending = setTimeout(function () { scan(document); }, 90);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

/* ===================================================================
   JP Design System · Motion UX v7
   입력 → 반응 → 결과 확인을 공통 규칙으로 연결한다.
   기존 페이지 로직과 데이터는 바꾸지 않고 시각 피드백만 관찰·추가한다.
   =================================================================== */
(function () {
  'use strict';

  var media = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduce = media && media.matches;
  var cardSelector = [
    '.tile', '.resource-card', '.overview-card', '.process-track > li',
    '.inquiry-card', '.inquiry-button', '.request-card', '.summary-card', '.curator-section',
    '.slide-step', '.skill-category', '.calc-category',
    '.mini-card', '.visual-card', '.graph-card', '.lab-graph-card',
    '.question-card', '.q-card', '.term-card', '.practice-card'
  ].join(',');
  var tabGroups = '.tabbar-inner, .subject-tabs, .filters, .filter-row, .inquiry-tabs, .prompt-modes, .tabs, .main-tabs';
  var tabItems = '.tab-btn, .filter, [data-filter], [data-subject], .inquiry-tab, [role="tab"]';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  function profile() {
    var path = '';
    try { path = decodeURIComponent(location.pathname); } catch (e) { path = location.pathname; }
    var value = path.indexOf('/수업창고/') !== -1 ? 'teacher'
      : path.indexOf('/주제탐구/') !== -1 ? 'dashboard' : 'lab';
    document.documentElement.dataset.jpMotion = value;
    return value;
  }

  function animateIn(element, index) {
    if (reduce || element.__jpMotionIn || !element.getClientRects().length) return;
    element.__jpMotionIn = true;
    var kind = document.documentElement.dataset.jpMotion;
    var distance = kind === 'lab' ? 16 : (kind === 'dashboard' ? 10 : 7);
    var duration = kind === 'lab' ? 330 : (kind === 'dashboard' ? 280 : 230);
    if (element.animate) {
      element.animate([
        { opacity: 0, transform: 'translate3d(0,' + distance + 'px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], {
        duration: duration,
        delay: Math.min(index || 0, 5) * (kind === 'lab' ? 42 : 28),
        easing: 'cubic-bezier(.16,1,.3,1)',
        fill: 'both'
      });
    }
  }

  function revealCards(root) {
    var nodes = Array.prototype.slice.call((root || document).querySelectorAll(cardSelector));
    nodes.forEach(function (node, index) { animateIn(node, index); });
  }

  function isActive(node) {
    return node.classList.contains('active') || node.classList.contains('is-active') ||
      node.classList.contains('on') || node.getAttribute('aria-selected') === 'true' ||
      node.getAttribute('aria-current') === 'true';
  }

  function updateTrack(group) {
    var indicator = group.querySelector(':scope > .jp-tab-indicator');
    if (!indicator) return;
    var items = Array.prototype.slice.call(group.querySelectorAll(tabItems));
    var active = items.find(isActive);
    if (!active || !active.getClientRects().length) {
      indicator.classList.remove('is-visible');
      return;
    }
    var groupBox = group.getBoundingClientRect();
    var box = active.getBoundingClientRect();
    indicator.style.width = box.width + 'px';
    indicator.style.height = box.height + 'px';
    indicator.style.transform = 'translate3d(' + (box.left - groupBox.left + group.scrollLeft) + 'px,' +
      (box.top - groupBox.top + group.scrollTop) + 'px,0)';
    indicator.classList.add('is-visible');
  }

  function wireTabTracks(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll(tabGroups), function (group) {
      var items = group.querySelectorAll(tabItems);
      if (items.length < 2) return;
      if (!group.__jpTrack) {
        group.__jpTrack = true;
        group.classList.add('jp-tab-track');
        var indicator = document.createElement('span');
        indicator.className = 'jp-tab-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        group.insertBefore(indicator, group.firstChild);
        if ('ResizeObserver' in window) {
          group.__jpTrackResize = new ResizeObserver(function () { updateTrack(group); });
          group.__jpTrackResize.observe(group);
        }
      }
      requestAnimationFrame(function () { updateTrack(group); });
    });
  }

  function countElement(node) {
    if (reduce || node.__jpCounted || node.dataset.jpCounting === 'true') return;
    var raw = node.textContent.trim().replace(/,/g, '');
    if (!/^\d+(?:\.\d+)?$/.test(raw)) return;
    var target = Number(raw);
    if (!isFinite(target)) return;
    node.__jpCounted = true;
    node.dataset.jpCounting = 'true';
    var decimals = raw.indexOf('.') >= 0 ? raw.split('.')[1].length : 0;
    var start = performance.now();
    function tick(now) {
      var progress = Math.min(1, (now - start) / 480);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      node.textContent = decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString('ko-KR');
      if (progress < 1) requestAnimationFrame(tick);
      else {
        node.textContent = target.toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        delete node.dataset.jpCounting;
      }
    }
    requestAnimationFrame(tick);
  }

  function wireCounts(root) {
    var selector = '.overview-card strong, .stats strong, [data-countup]';
    Array.prototype.forEach.call((root || document).querySelectorAll(selector), function (node) {
      countElement(node);
      if (node.__jpCountWatch) return;
      node.__jpCountWatch = new MutationObserver(function () { countElement(node); });
      node.__jpCountWatch.observe(node, { childList: true, characterData: true, subtree: true });
    });
  }

  function drawStaticGraphs(root) {
    if (reduce) return;
    var svgSelector = '.slide-art svg, .visual-card svg, .graph-card svg, [data-jp-draw] svg';
    Array.prototype.forEach.call((root || document).querySelectorAll(svgSelector), function (svg) {
      if (svg.__jpDrawn || !svg.getClientRects().length) return;
      svg.__jpDrawn = true;
      Array.prototype.forEach.call(svg.querySelectorAll('path.curve, path.strong, polyline'), function (path) {
        if (!path.getTotalLength || !path.animate) return;
        var length;
        try { length = path.getTotalLength(); } catch (e) { return; }
        if (!isFinite(length) || length < 12) return;
        path.animate([
          { strokeDasharray: length, strokeDashoffset: length, opacity: .35 },
          { strokeDasharray: length, strokeDashoffset: 0, opacity: 1 }
        ], { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
      });
      Array.prototype.forEach.call(svg.querySelectorAll('.bars rect'), function (bar, index) {
        if (!bar.animate) return;
        bar.style.transformBox = 'fill-box';
        bar.style.transformOrigin = 'center bottom';
        bar.animate([{ transform: 'scaleY(.05)', opacity: .35 }, { transform: 'scaleY(1)', opacity: 1 }], {
          duration: 360, delay: index * 38, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both'
        });
      });
    });
  }

  function wireDetails(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll('details'), function (detail) {
      if (detail.__jpDetail) return;
      detail.__jpDetail = true;
      detail.addEventListener('toggle', function () {
        if (reduce || !detail.open || !detail.animate) return;
        detail.animate([
          { opacity: .5, transform: 'translateY(-6px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 240, easing: 'cubic-bezier(.16,1,.3,1)' });
      });
    });
  }

  function toast(type, message) {
    if (!message) return;
    var region = document.querySelector('.jp-toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'jp-toast-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    var item = document.createElement('div');
    item.className = 'jp-toast is-' + (type || 'success');
    item.innerHTML = '<span class="jp-toast-mark" aria-hidden="true"></span><p></p>';
    item.querySelector('p').textContent = message;
    region.appendChild(item);
    requestAnimationFrame(function () { item.classList.add('is-visible'); });
    window.setTimeout(function () {
      item.classList.remove('is-visible');
      window.setTimeout(function () { item.remove(); }, 260);
    }, type === 'error' ? 4200 : 2600);
  }

  function pulse(node, className) {
    if (!node || reduce) return;
    node.classList.remove(className);
    void node.offsetWidth;
    node.classList.add(className);
  }

  function scan(root) {
    revealCards(root);
    wireTabTracks(root);
    wireCounts(root);
    wireDetails(root);
    drawStaticGraphs(root);
  }

  function boot() {
    profile();
    document.documentElement.classList.add('jp-motion-ready');
    requestAnimationFrame(function () { document.documentElement.classList.add('jp-page-entered'); });
    scan(document);

    document.addEventListener('jp:feedback', function (event) {
      var detail = event.detail || {};
      toast(detail.type || 'success', detail.message || '완료되었습니다.');
    });
    document.addEventListener('jp:data-change', function (event) {
      pulse(event.detail && event.detail.target, 'jp-data-changed');
    });
    document.addEventListener('click', function (event) {
      var tab = event.target.closest(tabItems);
      if (tab) window.setTimeout(function () {
        var group = tab.closest(tabGroups);
        if (group) updateTrack(group);
      }, 20);
    }, true);
    window.addEventListener('resize', function () {
      document.querySelectorAll('.jp-tab-track').forEach(updateTrack);
    }, { passive: true });

    var pending;
    var observer = new MutationObserver(function (records) {
      var visiblePanel = null;
      records.forEach(function (record) {
        if (record.type === 'attributes' && record.target.getClientRects().length) visiblePanel = record.target;
      });
      if (visiblePanel && !reduce && visiblePanel.animate) {
        visiblePanel.animate([{ opacity: .72 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
      }
      clearTimeout(pending);
      pending = window.setTimeout(function () { scan(document); }, 70);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden', 'aria-expanded', 'aria-selected'] });
  }

  window.jpMotionFeedback = function (type, message) { toast(type, message); };
  ready(boot);
}());
