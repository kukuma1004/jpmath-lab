/* 숨은 손님.

   보스 하나가 깨어나 화면 아래를 어슬렁 지나간다. 눌러 주면 폴짝 뛰고
   달아난다. 어디에도 안내하지 않는다 — 찾아낸 사람만 보는 것이라 그렇다.

   부르는 길은 넷이다.

     ① 페이지 제목을 다섯 번 톡톡        어디서나
     ② 보스전 홀의 단원 머리글을 다섯 번  그 단원 보스들이 줄지어
     ③ 폰을 세게 흔들기                  대행진
     ④ 위위아래아래좌우좌우BA            대행진 (자판이 있는 화면)

   처음에는 머리띠의 JP 마크를 두드리게 했는데, 그것은 홈으로 가는 링크라
   두드리는 동안 이동을 붙들어야 했다. 홈이 느려지는 값을 치를 만한 장난이
   아니어서, 아무 데도 가지 않는 자리로 옮겼다. 제목은 어느 페이지에나 있고
   링크가 아니다.

   만난 보스는 이 브라우저에 적어 두고, 다시 만나면 아는 척을 한다.
   그림과 이름은 assets/bosses/boss-image-manifest.json 에서 가져온다 —
   일흔 종을 여기 옮겨 적으면 보스를 더할 때마다 어긋나기 때문이다.

   jp-nav-2.js 가 머리띠를 만든 뒤 이 파일을 불러온다. */
(() => {
  'use strict';

  const script = document.currentScript || document.querySelector('script[src*="jp-easter.js"]');
  const siteRoot = new URL('.', script?.dataset.siteRoot || script?.src || document.baseURI);
  const asset = (path) => new URL(path, siteRoot).href;

  const TAPS_NEEDED = 5;        // 다섯 번
  /* 다섯 번을 이 시간 안에 두드려야 한다. 3초로 두었더니 천천히 누르는
     사람은 첫 두드림이 창 밖으로 밀려나 아무리 눌러도 안 열렸다. */
  const TAP_WINDOW = 5000;      // 5초 안에
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

  /* 몇 마리를 만났는지. 다 모으면 말해 준다 — 이것도 안내하지 않는다. */
  function milestoneLine(metCount, total) {
    if (total && metCount >= total) return `일흔 마리 전부 만났네. 대단한걸.`;
    if (metCount === 10 || metCount === 25 || metCount === 50) return `${metCount}마리째야. 꽤 모았네.`;
    return null;
  }

  let walking = false;
  function wakeOne(boss, { delay = 0, silent = false, bottom = null, dir = null, seconds = null, line = null } = {}) {
    const stage = ensureLayer();
    const fromLeft = dir ? dir === 'left' : Math.random() < 0.5;

    const who = document.createElement('div');
    who.className = `jp-easter-boss ${fromLeft ? 'from-left' : 'from-right'}`;
    who.style.setProperty('--jp-easter-bottom',
      `${bottom === null ? 8 + Math.round(Math.random() * 12) : bottom}vh`);
    who.style.animationDelay = `${delay}ms`;
    if (seconds) who.style.animationDuration = `${seconds}s`;

    /* 만난 기록. 화면의 타일에서 읽어 온 손님은 id 가 없으므로 세지 않는다 —
       단원 행진으로 여덟씩 쓸어 담으면 모으는 재미가 없어진다. */
    const met = readMet();
    const known = !boss.id || met.includes(boss.id);
    if (boss.id && !known) { met.push(boss.id); writeMet(met); }
    const say = silent ? '' : (line
      || milestoneLine(met.length, roster ? roster.length : 0)
      || (known ? pick(AGAIN_LINES) : pick(FIRST_LINES)));

    who.innerHTML =
      `<img src="${boss.thumb}" alt="" width="192" height="192" decoding="async">`
      + (say ? `<b class="jp-easter-say"><em>${boss.name}</em>${say}</b>` : '');

    // 눌러 주면 폴짝 뛰고 달아난다
    who.addEventListener('click', () => {
      if (who.classList.contains('poked')) return;
      who.classList.add('poked');
      const bubble = who.querySelector('.jp-easter-say');
      if (bubble) bubble.lastChild.textContent = pick(POKED_LINES);
      setTimeout(() => who.remove(), 1400);
    });

    stage.appendChild(who);
    who.addEventListener('animationend', (e) => {
      if (e.animationName === 'jpEasterWalk' || e.animationName === 'jpEasterFade') who.remove();
    });
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

  /* 줄을 지어 지나간다. 같은 방향으로 걷게 하고, 높이를 층층이 나누고,
     걸음 속도를 조금씩 달리해야 한쪽에 겹쳐 쌓이지 않는다. */
  function parade(list, lead) {
    if (!list.length) return;
    const line = list.slice(0, 8);
    const dir = Math.random() < 0.5 ? 'left' : 'right';
    line.forEach((boss, i) => wakeOne(boss, {
      delay: i * 520,
      silent: i > 0,
      line: i === 0 ? lead : null,
      dir,
      bottom: 7 + i * 4,                       // 7 ~ 35vh 에 층층이
      seconds: 8.4 + (i % 3) * 0.9             // 걸음 속도를 조금씩 달리
    }));
  }
  function paradeAll() {
    loadRoster().then((list) => parade([...list].sort(() => Math.random() - 0.5)));
  }

  /* 보스전 홀에서 단원 머리글을 두드리면 그 단원 보스들이 줄지어 나온다.

     얼굴과 이름이 타일에 이미 있으므로 그림 목록을 거치지 않고 화면에서 바로
     읽는다. 대단원 총력전은 제 그림이 없어 목록에 자리가 없는데, 타일에서
     읽으면 그것까지 그대로 나온다. */
  function paradeUnit(section) {
    const mine = [...section.querySelectorAll('.archive-card')].map((card) => {
      const img = card.querySelector('img');
      const name = card.querySelector('b')?.textContent?.trim();
      if (!img || !img.getAttribute('src') || !name) return null;
      return { id: null, name, thumb: img.src };
    }).filter(Boolean);
    if (!mine.length) return;
    const title = section.querySelector('h3')?.textContent?.trim();
    parade(mine.sort(() => Math.random() - 0.5), title ? `${title}, 전원 집합!` : null);
  }

  // ── 두드림 세기 ─────────────────────────────────────────────────
  // 자리마다 따로 센다. 제목을 세 번 누르고 다른 데를 두 번 눌러도 안 된다.
  const taps = new WeakMap();
  function countTap(el) {
    const now = Date.now();
    const list = (taps.get(el) || []).filter((t) => now - t < TAP_WINDOW);
    list.push(now);
    taps.set(el, list);
    return list.length;
  }
  function nudge(el) {
    el.classList.remove('jp-easter-wiggle');
    void el.offsetWidth;                       // 같은 흔들림을 다시 태우려면 한 번 끊어야 한다
    el.classList.add('jp-easter-wiggle');
    setTimeout(() => el.classList.remove('jp-easter-wiggle'), 500);
  }

  /* 화면을 그리는 시점이 페이지마다 달라서(자바스크립트로 그리는 곳이 많다)
     문서에 한 번만 걸어 두고 눌린 자리를 거슬러 올라가 찾는다. */
  document.addEventListener('click', (event) => {
    if (event.target.closest('a,button,input,textarea,select,label')) return;

    // 보스전 홀의 단원 머리글 — 그 단원만 줄지어 나온다
    const unitHead = event.target.closest('.archive-unit > header');
    if (unitHead) {
      const n = countTap(unitHead);
      if (n >= 3 && n < TAPS_NEEDED) nudge(unitHead);
      if (n >= TAPS_NEEDED) { taps.set(unitHead, []); paradeUnit(unitHead.parentElement) }
      return;
    }

    // 페이지 제목 — 어느 페이지에나 있고 링크가 아니다
    const title = event.target.closest('h1');
    if (!title) return;
    const n = countTap(title);
    if (n >= 3 && n < TAPS_NEEDED) nudge(title);
    if (n >= TAPS_NEEDED) { taps.set(title, []); summon() }
  });

  // ── 흔들어 부르기 ───────────────────────────────────────────────
  /* 폰을 세게 흔들면 대행진. iOS 는 따로 허락을 받아야 해서 조용히 안 될 수
     있는데, 그때는 다른 길이 셋 있으니 굳이 물어보지 않는다. */
  let lastShake = 0, lastAccel = null;
  window.addEventListener('devicemotion', (event) => {
    const a = event.accelerationIncludingGravity;
    if (!a || a.x === null) return;
    if (lastAccel) {
      const jolt = Math.abs(a.x - lastAccel.x) + Math.abs(a.y - lastAccel.y) + Math.abs(a.z - lastAccel.z);
      const now = Date.now();
      if (jolt > 45 && now - lastShake > 6000) { lastShake = now; paradeAll() }
    }
    lastAccel = { x: a.x, y: a.y, z: a.z };
  });

  // ── 자판으로 부르는 길 ──────────────────────────────────────────
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let typed = [];
  document.addEventListener('keydown', (event) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
    typed.push(event.key.length === 1 ? event.key.toLowerCase() : event.key);
    if (typed.length > KONAMI.length) typed.shift();
    if (typed.length === KONAMI.length && typed.every((k, i) => k === KONAMI[i])) {
      typed = [];
      paradeAll();
    }
  });
})();
