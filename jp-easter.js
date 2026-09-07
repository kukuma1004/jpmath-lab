/* 숨은 손님.

   사이트 어디에서나 머리띠의 JP 마크를 일곱 번 두드리면 보스 하나가 깨어나
   화면 아래를 어슬렁 지나간다. 눌러 주면 폴짝 뛰고 달아난다.

   어디에도 안내하지 않는다 — 찾아낸 사람만 보는 것이라 그렇다.
   만난 보스는 이 브라우저에 적어 두고, 다시 만나면 아는 척을 한다.

   그림과 이름은 assets/bosses/boss-image-manifest.json 에서 가져온다.
   예순네 종을 여기 옮겨 적으면 보스를 더할 때마다 어긋나기 때문이다.
   목록은 처음 깨울 때 한 번만 받아 온다(9KB).

   jp-nav-2.js 가 머리띠를 만든 뒤 이 파일을 불러온다. */
(() => {
  'use strict';

  const script = document.currentScript || document.querySelector('script[src*="jp-easter.js"]');
  const siteRoot = new URL('.', script?.dataset.siteRoot || script?.src || document.baseURI);
  const asset = (path) => new URL(path, siteRoot).href;

  const TAPS_NEEDED = 7;        // 일곱 번
  const TAP_WINDOW = 4000;      // 4초 안에
  const MET_KEY = 'jp_easter_met_v1';

  const quiet = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // ── 만난 보스 기록 ──────────────────────────────────────────────
  // 브라우저가 막아 둔 경우가 있으므로 실패해도 그냥 넘어간다.
  function readMet() {
    try { return JSON.parse(localStorage.getItem(MET_KEY) || '[]'); } catch (e) { return []; }
  }
  function writeMet(list) {
    try { localStorage.setItem(MET_KEY, JSON.stringify(list)); } catch (e) { /* 안 되면 만다 */ }
  }

  // ── 보스 목록 ───────────────────────────────────────────────────
  let roster = null, rosterPromise = null;
  function loadRoster() {
    if (roster) return Promise.resolve(roster);
    if (!rosterPromise) {
      rosterPromise = fetch(asset('assets/bosses/boss-image-manifest.json'))
        .then((r) => r.json())
        .then((data) => {
          roster = Object.entries(data.images || {})
            .filter(([, v]) => v && v.thumb && v.name)
            .map(([id, v]) => ({ id, name: v.name, thumb: asset('assets/bosses/' + v.thumb) }));
          return roster;
        })
        .catch(() => (roster = []));
    }
    return rosterPromise;
  }

  // ── 무대 ────────────────────────────────────────────────────────
  let layer = null;
  function ensureLayer() {
    if (layer && document.body.contains(layer)) return layer;
    layer = document.createElement('div');
    layer.className = 'jp-easter-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    return layer;
  }

  const FIRST_LINES = [
    '어… 여기까지 찾아왔네?',
    '누가 날 불렀지.',
    '잠깐 산책 중이야.',
    '문제는 안 낼 테니 걱정 마.',
    '오늘은 쉬는 날이거든.'
  ];
  const AGAIN_LINES = [
    '또 만났네.',
    '자꾸 부르면 정든다?',
    '이번엔 무슨 일이야.',
    '나 아직 안 잊었구나.'
  ];
  const POKED_LINES = [
    '앗! 놀랐잖아.',
    '간지러워!',
    '보스전에서 보자고.',
    '이건 반칙인데.',
    '도망간다!'
  ];
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  let walking = false;
  function wakeOne(boss, { delay = 0, silent = false, bottom = null, dir = null, seconds = null } = {}) {
    const stage = ensureLayer();
    const fromLeft = dir ? dir === 'left' : Math.random() < 0.5;

    const who = document.createElement('div');
    who.className = `jp-easter-boss ${fromLeft ? 'from-left' : 'from-right'}`;
    who.style.setProperty('--jp-easter-bottom',
      `${bottom === null ? 8 + Math.round(Math.random() * 12) : bottom}vh`);
    who.style.animationDelay = `${delay}ms`;
    if (seconds) who.style.animationDuration = `${seconds}s`;

    const met = readMet();
    const known = met.includes(boss.id);
    const line = silent ? '' : (known ? pick(AGAIN_LINES) : pick(FIRST_LINES));

    who.innerHTML =
      `<img src="${boss.thumb}" alt="" width="192" height="192" decoding="async">`
      + (line ? `<b class="jp-easter-say"><em>${boss.name}</em>${line}</b>` : '');

    // 눌러 주면 폴짝 뛰고 달아난다
    who.addEventListener('click', () => {
      if (who.classList.contains('poked')) return;
      who.classList.add('poked');
      const say = who.querySelector('.jp-easter-say');
      if (say) say.lastChild.textContent = pick(POKED_LINES);
      setTimeout(() => who.remove(), 1400);
    });

    stage.appendChild(who);
    who.addEventListener('animationend', (e) => {
      if (e.animationName === 'jpEasterWalk' || e.animationName === 'jpEasterFade') who.remove();
    });

    if (!known) { met.push(boss.id); writeMet(met); }
    return who;
  }

  function summon() {
    if (walking) return;
    walking = true;
    loadRoster().then((list) => {
      if (!list.length) { walking = false; return; }
      wakeOne(list[Math.floor(Math.random() * list.length)]);
      setTimeout(() => { walking = false; }, quiet ? 4200 : 9500);
    });
  }

  /* 대행진. 자판이 있는 화면에서만 닿는 숨은 길이다.

     처음에는 자리와 방향을 저마다 굴렸더니 화면 한쪽에 겹쳐 쌓였다.
     같은 방향으로 걷게 하고, 높이를 골고루 나누고, 걸음 속도를 조금씩
     달리해 줄을 지어 지나가게 한다. */
  function parade() {
    loadRoster().then((list) => {
      if (!list.length) return;
      const line = [...list].sort(() => Math.random() - 0.5).slice(0, 8);
      const dir = Math.random() < 0.5 ? 'left' : 'right';
      line.forEach((boss, i) => wakeOne(boss, {
        delay: i * 520,
        silent: i > 0,
        dir,
        bottom: 7 + i * 4,                       // 7 ~ 35vh 에 층층이
        seconds: 8.4 + (i % 3) * 0.9             // 걸음 속도를 조금씩 달리
      }));
    });
  }

  /* ── 두드림 세기 ─────────────────────────────────────────────────

     머리띠의 JP 는 홈으로 가는 링크다. 그냥 세기만 하면 첫 번째 두드림에
     페이지가 넘어가 일곱 번을 채울 수가 없다.

     그래서 동그란 JP 마크만 잡는다. 마크를 누르면 이동을 잠깐 붙들어 두고,
     320밀리초 안에 다음 두드림이 없으면 그때 홈으로 보낸다. 옆의 글자
     ("JP / 보스전")는 손대지 않았으므로 곧장 이동한다 — 급한 사람은
     그쪽을 누르면 된다. */
  const NEXT_TAP_WAIT = 320;
  let taps = [], goHomeTimer = 0;
  function onMarkTap(event) {
    const mark = event.currentTarget;
    const link = mark.closest('a[href]');
    // 새 탭으로 열려는 사람의 길은 막지 않는다
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopPropagation();
    clearTimeout(goHomeTimer);

    const now = Date.now();
    taps = taps.filter((t) => now - t < TAP_WINDOW);
    taps.push(now);

    // 다섯 번째부터 마크가 흔들려 "뭔가 있다" 는 것만 알린다
    if (taps.length >= 5 && taps.length < TAPS_NEEDED) {
      mark.classList.remove('jp-easter-wiggle');
      void mark.offsetWidth;
      mark.classList.add('jp-easter-wiggle');
    }

    if (taps.length >= TAPS_NEEDED) {
      taps = [];
      mark.classList.remove('jp-easter-wiggle');
      summon();
      return;
    }
    // 더 두드리지 않으면 원래 하려던 일 — 홈으로 간다
    if (link) goHomeTimer = setTimeout(() => { window.location.href = link.href; }, NEXT_TAP_WAIT);
  }

  // ── 자판으로 부르는 길 ──────────────────────────────────────────
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let typed = [];
  function onKey(event) {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
    typed.push(event.key.length === 1 ? event.key.toLowerCase() : event.key);
    if (typed.length > KONAMI.length) typed.shift();
    if (typed.length === KONAMI.length && typed.every((k, i) => k === KONAMI[i])) {
      typed = [];
      parade();
    }
  }

  // ── 붙이기 ──────────────────────────────────────────────────────
  function attach() {
    const mark = document.querySelector('.global-brand-mark');
    if (!mark || mark.dataset.jpEaster) return false;
    mark.dataset.jpEaster = '1';
    mark.style.cursor = 'pointer';
    mark.addEventListener('click', onMarkTap);
    return true;
  }

  if (!attach()) {
    // 머리띠가 아직 없으면 생길 때까지 기다린다
    const watcher = new MutationObserver(() => { if (attach()) watcher.disconnect(); });
    watcher.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => watcher.disconnect(), 8000);
  }
  document.addEventListener('keydown', onKey);
})();
