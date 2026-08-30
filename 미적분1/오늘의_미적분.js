(function () {
  'use strict';

  const STORAGE_KEY = 'jp-calculus-daily-v1';
  const GAME_ID = 'calculus-daily-function';
  const $ = selector => document.querySelector(selector);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const rounded = value => Math.round(value * 10) / 10;
  const MISSION_COLORS = ['#d4553f', '#d1843d', '#168068', '#596bd8', '#8461a9'];

  function dateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  function hash(text) { return Array.from(String(text)).reduce((value, char) => (value * 33 + char.charCodeAt(0)) >>> 0, 5381); }
  function seeded(seedText) {
    let seed = hash(seedText);
    return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  }
  function ri(rng, min, max) { return min + Math.floor(rng() * (max - min + 1)); }
  function shuffle(items, rng) { const copy = items.slice(); for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(rng() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; }
  function signed(value) { return value < 0 ? `− ${Math.abs(value)}` : `+ ${value}`; }
  function term(coefficient, variable) {
    if (!coefficient) return '';
    const sign = coefficient < 0 ? '−' : '+';
    const size = Math.abs(coefficient);
    return `${sign} ${size === 1 && variable ? '' : size}${variable}`;
  }
  function shiftedX(h) { return h === 0 ? 'x' : `x ${signed(-h)}`; }
  function texShiftedX(h) { return h === 0 ? 'x' : h > 0 ? `x-${h}` : `x+${Math.abs(h)}`; }
  function renderMath(element, tex, fallback) {
    if (!element) return;
    if (window.katex) window.katex.render(tex, element, { throwOnError: false, displayMode: true, output: 'html' });
    else element.textContent = fallback || tex;
  }
  function formatAnswer(value) { return typeof value === 'number' ? String(rounded(value)) : String(value); }

  function buildDaily(key) {
    const rng = seeded(`jp-calculus-${key}`);
    const s = rng() < .5 ? -1 : 1;
    const h = ri(rng, -1, 1);
    const d = ri(rng, 1, 2);
    const c = ri(rng, -2, 2);
    const f = x => s * (x - h) ** 3 - 3 * s * d ** 2 * (x - h) + c;
    const fp = x => 3 * s * ((x - h) ** 2 - d ** 2);
    const base = shiftedX(h);
    const texBase = texShiftedX(h);
    const centered = `f(x) = ${s < 0 ? '−' : ''}(${base})³ ${term(-3 * s * d ** 2, `(${base})`)} ${c ? term(c, '') : ''}`.replace(/\s+/g, ' ').trim();
    const linearCoefficient = -3 * s * d ** 2;
    const tex = `f(x)=${s < 0 ? '-' : ''}(${texBase})^3${linearCoefficient < 0 ? '-' : '+'}${Math.abs(linearCoefficient) === 1 ? '' : Math.abs(linearCoefficient)}(${texBase})${c < 0 ? c : c > 0 ? `+${c}` : ''}`;
    const limitX = h + ri(rng, -2, 2);
    const tangentX = h + (rng() < .5 ? -d - 1 : d + 1);
    const testX = h + [-(d + 1), 0, d + 1][ri(rng, 0, 2)];
    const maxX = s > 0 ? h - d : h + d;
    const left = h - d;
    const right = h + d;
    const accumulation = f(right) - f(left);
    const limitChoices = [];
    [fp(limitX), fp(limitX) + 3, fp(limitX) - 3, -fp(limitX), f(limitX) + 1].forEach(value => { if (!limitChoices.includes(value) && limitChoices.length < 3) limitChoices.push(value); });

    const missions = [
      {
        id: 'limit', kind: 'choice', kicker: '01 · 극한 탐정', title: '사라진 점의 기울기',
        sense: '극한', goal: '두 점의 평균 기울기가 한 점의 접선 기울기로 가까워지는 과정',
        skillId: 'derivative_definition', skillTitle: '미분계수의 정의',
        prompt: `x가 ${limitX}에 가까워질 때 두 점을 잇는 기울기는 어디에 가까워질까요?`,
        formula: `lim [f(x) − f(${limitX})] ÷ (x − ${limitX})`, tex: `\\lim_{x\\to ${limitX}}\\frac{f(x)-f(${limitX})}{x-${limitX < 0 ? `(${limitX})` : limitX}}`, correct: fp(limitX),
        choices: shuffle(limitChoices, rng),
        explain: `차분몫의 극한은 f′(${limitX})입니다. 오늘 함수에서는 ${fp(limitX)}에 가까워집니다.`
      },
      {
        id: 'tangent', kind: 'slider', kicker: '02 · 접선 스나이퍼', title: '접선을 목표점에 맞혀라',
        sense: '접선', goal: '곡선의 순간 진행 방향과 접선의 기울기를 그래프로 맞추기',
        skillId: 'tangent_equation', skillTitle: '접선의 방정식',
        prompt: `x=${tangentX}에서 접선의 기울기를 조절하세요. 선이 곡선의 진행 방향과 가장 자연스럽게 겹치는 값을 찾으면 됩니다.`,
        x: tangentX, formula: `목표점 P(${tangentX}, ${f(tangentX)})`, tex: `P\\bigl(${tangentX},\\,${f(tangentX)}\\bigr)\\qquad f'(${tangentX})=?`, correct: fp(tangentX), tolerance: .35,
        range: [fp(tangentX) - 12, fp(tangentX) + 12], explain: `정확한 기울기는 f′(${tangentX})=${fp(tangentX)}입니다.`
      },
      {
        id: 'direction', kind: 'choice', kicker: '03 · 변화 방향', title: '지금 오르는 중일까?',
        sense: '증감', goal: '도함수의 부호를 원함수의 증가·감소 방향으로 번역하기',
        skillId: 'monotonic_interval', skillTitle: '도함수의 부호와 증감',
        prompt: `x=${testX} 부근에서 x가 증가할 때 함수값의 움직임을 판정하세요.`,
        x: testX, formula: `f′(${testX}) = ${fp(testX)}`, tex: `f'(${testX})=${fp(testX)}\\quad\\Longrightarrow\\quad \\operatorname{sign} f'(${testX})=?`, correct: fp(testX) > 0 ? '증가' : fp(testX) < 0 ? '감소' : '정지',
        choices: ['증가', '감소', '정지'], explain: `도함수의 부호가 ${fp(testX) > 0 ? '양수이므로 증가' : fp(testX) < 0 ? '음수이므로 감소' : '0이므로 순간적으로 정지'}합니다.`
      },
      {
        id: 'extreme', kind: 'choice', kicker: '04 · 극값 사냥', title: '가장 높은 봉우리를 찾아라',
        sense: '극값', goal: '도함수가 0인 점의 좌우 부호를 보고 극대와 극소 구분하기',
        skillId: 'extrema_sign', skillTitle: '극값과 도함수 부호',
        prompt: '도함수가 0인 두 지점 중 극대가 일어나는 x좌표를 선택하세요.',
        formula: `f′(x)=0 → x=${h - d}, ${h + d}`, tex: `f'(x)=0\\quad\\Longrightarrow\\quad x=${h - d},\\;${h + d}`, correct: maxX,
        choices: shuffle([h - d, h + d, h], rng), explain: `x=${maxX}의 좌우에서 f′의 부호가 +에서 −로 바뀌므로 극대입니다.`
      },
      {
        id: 'accumulation', kind: 'slider', kicker: '05 · 누적 변화', title: '도함수의 넓이를 원함수로',
        sense: '누적', goal: '도함수의 부호 있는 넓이를 원함수의 전체 변화량으로 연결하기',
        skillId: 'fundamental_theorem', skillTitle: '미적분의 기본정리',
        prompt: `x=${left}부터 x=${right}까지 f′(x)를 누적한 값을 맞혀 보세요. 그래프 위와 아래의 부호를 함께 생각해야 합니다.`,
        formula: `∫[${left}→${right}] f′(x)dx = f(${right}) − f(${left})`, tex: `\\int_{${left}}^{${right}} f'(x)\\,dx=f(${right})-f(${left})`, correct: accumulation, tolerance: .5,
        range: [accumulation - 18, accumulation + 18], explain: `미적분의 기본정리에 따라 누적 변화는 f(${right})−f(${left})=${accumulation}입니다.`
      }
    ];
    return { key, s, h, d, c, f, fp, formula: centered, tex, missions };
  }

  function scoreAttempt(mission, answer, seconds) {
    const numeric = typeof mission.correct === 'number';
    const error = numeric ? Math.abs(Number(answer) - mission.correct) : String(answer) === String(mission.correct) ? 0 : 1;
    const scale = mission.kind === 'slider' ? Math.max(1, Math.abs(mission.range[1] - mission.range[0]) * .16) : 1;
    const accuracy = mission.kind === 'slider' ? clamp(1 - error / scale, 0, 1) : error === 0 ? 1 : 0;
    const speed = accuracy >= .8 ? clamp(1 - seconds / 30, 0, 1) : 0;
    return { points: Math.round(160 * accuracy + 40 * speed), accuracy, success: error <= (mission.tolerance || 0) };
  }

  function buildResultProfile(missions, attempts) {
    const rows = missions.map((mission, index) => {
      const attempt = attempts.find(item => item.id === mission.id) || { accuracy: 0, points: 0, seconds: 0 };
      return { ...attempt, mission, index };
    });
    const weakest = rows.slice().sort((a, b) => a.accuracy - b.accuracy || a.points - b.points)[0];
    return { rows, weakest };
  }

  function readStore() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { plays: {}, streak: 0, lastDate: '' }; } catch (_) { return { plays: {}, streak: 0, lastDate: '' }; } }
  function previousKey(key) { const parts = key.split('-').map(Number); const date = new Date(parts[0], parts[1] - 1, parts[2] - 1, 12); return dateKey(date); }
  function saveResult(key, result) {
    const store = readStore();
    const old = store.plays[key];
    if (!old) {
      store.streak = store.lastDate === previousKey(key) ? Number(store.streak || 0) + 1 : store.lastDate === key ? Number(store.streak || 1) : 1;
      store.lastDate = key;
    }
    store.plays[key] = old && old.score > result.score ? old : { ...result, streak: store.streak, completedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return store;
  }

  function setupCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * ratio)); canvas.height = Math.max(1, Math.round(rect.height * ratio));
    const ctx = canvas.getContext('2d'); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, rect.width, rect.height);
    return { ctx, width: rect.width, height: rect.height };
  }
  function graphBounds(fn, minX, maxX) {
    const values = []; for (let i = 0; i <= 120; i += 1) values.push(fn(minX + (maxX - minX) * i / 120));
    let minY = Math.min(...values), maxY = Math.max(...values); const pad = Math.max(2, (maxY - minY) * .14); minY -= pad; maxY += pad;
    return { minX, maxX, minY, maxY };
  }
  function plot(ctx, fn, bounds, mapX, mapY, color, width = 3) {
    ctx.beginPath(); let started = false;
    for (let i = 0; i <= 240; i += 1) { const x = bounds.minX + (bounds.maxX - bounds.minX) * i / 240; const y = fn(x); if (!Number.isFinite(y)) { started = false; continue; } if (!started) { ctx.moveTo(mapX(x), mapY(y)); started = true; } else ctx.lineTo(mapX(x), mapY(y)); }
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  }
  function drawGraph(canvas, daily, mission, answer) {
    if (!canvas || !canvas.clientWidth) return;
    const { ctx, width, height } = setupCanvas(canvas); const pad = { l: 44, r: 18, t: 22, b: 35 };
    const minX = daily.h - daily.d - 3, maxX = daily.h + daily.d + 3;
    const fn = mission && mission.id === 'accumulation' ? daily.fp : daily.f;
    const bounds = graphBounds(fn, minX, maxX); const mapX = x => pad.l + (x - bounds.minX) / (bounds.maxX - bounds.minX) * (width - pad.l - pad.r); const mapY = y => pad.t + (bounds.maxY - y) / (bounds.maxY - bounds.minY) * (height - pad.t - pad.b);
    ctx.fillStyle = '#102a25'; ctx.fillRect(0, 0, width, height); ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1;
    for (let x = Math.ceil(bounds.minX); x <= bounds.maxX; x += 1) { ctx.beginPath(); ctx.moveTo(mapX(x), pad.t); ctx.lineTo(mapX(x), height - pad.b); ctx.stroke(); }
    for (let i = 0; i <= 6; i += 1) { const y = bounds.minY + (bounds.maxY - bounds.minY) * i / 6; ctx.beginPath(); ctx.moveTo(pad.l, mapY(y)); ctx.lineTo(width - pad.r, mapY(y)); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,255,255,.42)'; if (bounds.minY <= 0 && bounds.maxY >= 0) { ctx.beginPath(); ctx.moveTo(pad.l, mapY(0)); ctx.lineTo(width - pad.r, mapY(0)); ctx.stroke(); } if (bounds.minX <= 0 && bounds.maxX >= 0) { ctx.beginPath(); ctx.moveTo(mapX(0), pad.t); ctx.lineTo(mapX(0), height - pad.b); ctx.stroke(); }
    if (mission && mission.id === 'accumulation') {
      const a = daily.h - daily.d, b = daily.h + daily.d; ctx.beginPath(); ctx.moveTo(mapX(a), mapY(0));
      for (let i = 0; i <= 100; i += 1) { const x = a + (b - a) * i / 100; ctx.lineTo(mapX(x), mapY(daily.fp(x))); }
      ctx.lineTo(mapX(b), mapY(0)); ctx.closePath(); ctx.fillStyle = 'rgba(224,182,71,.28)'; ctx.fill();
    }
    plot(ctx, fn, bounds, mapX, mapY, mission && mission.id === 'accumulation' ? '#f0cb64' : '#7cd1b5', 3.2);
    if (mission && mission.id === 'tangent') {
      const x0 = mission.x; const y0 = daily.f(x0); const slope = Number(answer || 0);
      plot(ctx, x => y0 + slope * (x - x0), bounds, mapX, mapY, '#ef765d', 2.5); ctx.fillStyle = '#f0cb64'; ctx.beginPath(); ctx.arc(mapX(x0), mapY(y0), 5, 0, Math.PI * 2); ctx.fill();
    }
    if (mission && mission.id === 'direction') { const x = mission.x; ctx.fillStyle = '#f0cb64'; ctx.beginPath(); ctx.arc(mapX(x), mapY(daily.f(x)), 6, 0, Math.PI * 2); ctx.fill(); }
    if (mission && mission.id === 'extreme') { [daily.h - daily.d, daily.h + daily.d].forEach(x => { ctx.fillStyle = '#ef765d'; ctx.beginPath(); ctx.arc(mapX(x), mapY(daily.f(x)), 6, 0, Math.PI * 2); ctx.fill(); }); }
    ctx.fillStyle = 'rgba(255,255,255,.62)'; ctx.font = '11px IBM Plex Mono'; ctx.fillText(mission && mission.id === 'accumulation' ? "y=f′(x)" : 'y=f(x)', pad.l + 8, pad.t + 15);
  }

  function init() {
    const telemetry = window.JPGameTelemetry;
    const key = dateKey(); const daily = buildDaily(key); const store = readStore();
    const sessionId = telemetry ? telemetry.makeSessionId() : `session-${Date.now()}`;
    let profile = telemetry ? telemetry.getProfile() : null;
    let sessionPlayIndex = 0;
    let activePlay = null;
    let playStartedAt = 0;
    let index = 0, score = 0, combo = 0, bestCombo = 0, accuracySum = 0, answer = null, startedAt = 0, timer = 0, attempts = [];

    // 그래프를 실제로 만졌는지 기록한다. 슬라이더는 한 번 끌면 input 이 수십 번
    // 오므로, 짧은 간격은 한 번으로 묶는다. 재고 싶은 것은 횟수가 아니라
    // "만졌는가"와 "몇 번 시도했는가"이다.
    let lastMark = 0;
    function markLab() {
      if (!telemetry || !activePlay || !telemetry.mark) return;
      const now = Date.now();
      if (now - lastMark < 400) return;
      lastMark = now;
      telemetry.mark(activePlay.playId, 'lab_interaction');
    }

    function wireOutboundLinks() {
      const next = $('[data-recommend-link]');
      if (next && !next.dataset.marked) {
        next.dataset.marked = '1';
        next.addEventListener('click', () => {
          if (telemetry && activePlay && telemetry.mark) telemetry.mark(activePlay.playId, 'next_experience_click');
        });
      }
      const seed = $('[data-research-seed]');
      if (seed && !seed.dataset.marked) {
        seed.dataset.marked = '1';
        seed.addEventListener('toggle', () => {
          if (!seed.open) return;
          if (telemetry && activePlay && telemetry.mark) telemetry.mark(activePlay.playId, 'research_open');
        });
      }
    }

    function updatePlayerUi() {
      const name = profile ? profile.displayName : 'PLAYER';
      $('[data-player-name]').textContent = name;
      $('[data-player-greeting]').textContent = profile ? `${name}의 오늘 도전` : '오늘의 플레이어';
      $('[data-result-player]').textContent = name;
    }

    function openPlayerGate() {
      const gate = $('[data-player-gate]');
      gate.hidden = false;
      document.body.classList.add('player-gate-open');
      const input = $('[data-player-input]');
      input.value = profile ? profile.displayName : '';
      window.setTimeout(() => input.focus(), 60);
    }

    function closePlayerGate() {
      $('[data-player-gate]').hidden = true;
      document.body.classList.remove('player-gate-open');
      updatePlayerUi();
    }

    $('[data-player-form]').addEventListener('submit', event => {
      event.preventDefault();
      const value = $('[data-player-input]').value;
      profile = telemetry ? telemetry.saveProfile(value) : { userId: 'local-player', displayName: String(value).trim().slice(0, 12) };
      if (!profile || !profile.displayName) return;
      closePlayerGate();
    });

    $('[data-player-switch]').addEventListener('click', () => openPlayerGate());
    updatePlayerUi();
    if (!profile) openPlayerGate();
    if (telemetry) telemetry.flush();
    $('[data-today-label]').textContent = `${key.replaceAll('-', '.')} · CALCULUS DAILY`;
    renderMath($('[data-function-formula]'), daily.tex, daily.formula);
    renderMath($('[data-play-function]'), daily.tex, daily.formula);
    renderMath($('[data-result-function]'), daily.tex, daily.formula);
    const todayRecord = store.plays[key]; $('[data-saved-score]').textContent = todayRecord ? `${todayRecord.score}점` : '아직 없음'; $('[data-saved-streak]').textContent = `${store.streak || 0}일`;
    requestAnimationFrame(() => drawGraph($('[data-intro-canvas]'), daily)); window.addEventListener('resize', () => { if (!$('[data-screen="intro"]').hidden) drawGraph($('[data-intro-canvas]'), daily); else if (!$('[data-screen="play"]').hidden) drawGraph($('[data-mission-canvas]'), daily, daily.missions[index], answer); }, { passive: true });

    function show(name) {
      document.querySelectorAll('[data-screen]').forEach(screen => { screen.hidden = screen.dataset.screen !== name; });
      $('[data-player-switch]').disabled = name === 'play';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function tick() { if ($('[data-screen="play"]').hidden) return; $('[data-time]').textContent = `${((performance.now() - startedAt) / 1000).toFixed(1)}초`; timer = requestAnimationFrame(tick); }
    function start() {
      if (!profile) { openPlayerGate(); return; }
      sessionPlayIndex += 1;
      playStartedAt = Date.now();
      activePlay = telemetry ? telemetry.startPlay({
        gameId: GAME_ID,
        sessionId,
        dateKey: key,
        retry: sessionPlayIndex > 1,
        sessionPlayIndex
      }) : null;
      index = 0; score = 0; combo = 0; bestCombo = 0; accuracySum = 0; attempts = [];
      show('play'); renderMission();
    }
    function renderMission() {
      cancelAnimationFrame(timer); const mission = daily.missions[index]; answer = mission.kind === 'slider' ? clamp(0, mission.range[0], mission.range[1]) : null; startedAt = performance.now();
      $('[data-round-label]').textContent = `MISSION ${index + 1} / ${daily.missions.length}`; $('[data-progress]').style.width = `${(index + 1) / daily.missions.length * 100}%`; $('[data-score]').textContent = score; $('[data-combo]').textContent = `×${combo}`;
      document.querySelectorAll('[data-route]').forEach((item, routeIndex) => {
        item.classList.toggle('is-done', routeIndex < index);
        item.classList.toggle('is-active', routeIndex === index);
        if (routeIndex === index) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
      });
      $('[data-mission-kicker]').textContent = mission.kicker; $('[data-mission-title]').textContent = mission.title; $('[data-mission-prompt]').textContent = mission.prompt; $('[data-mission-goal]').textContent = mission.goal; renderMath($('[data-mission-formula]'), mission.tex, mission.formula); $('[data-graph-note]').textContent = index === 1 ? '슬라이더를 움직이면 접선이 회전합니다' : index === 4 ? '노란 영역은 부호를 가진 누적 변화입니다' : '그래프의 모양과 수치를 함께 보세요';
      const controls = $('[data-controls]'); controls.innerHTML = ''; const submit = $('[data-submit]'); submit.hidden = false; submit.disabled = mission.kind !== 'slider'; $('[data-next]').hidden = true; $('[data-feedback]').hidden = true;
      if (mission.kind === 'choice') { const grid = document.createElement('div'); grid.className = 'choice-grid'; mission.choices.forEach(value => { const button = document.createElement('button'); button.type = 'button'; button.className = 'choice-button'; button.textContent = typeof value === 'number' ? String(rounded(value)) : value; button.addEventListener('click', () => { markLab(); answer = value; grid.querySelectorAll('button').forEach(item => item.classList.toggle('selected', item === button)); submit.disabled = false; }); grid.appendChild(button); }); controls.appendChild(grid); }
      else { controls.innerHTML = `<div class="slider-control"><input type="range" min="${mission.range[0]}" max="${mission.range[1]}" step="0.1" value="${answer}" aria-label="${mission.title} 값 조절"><div class="slider-value"><span>나의 예측</span><strong>${rounded(answer)}</strong></div></div>`; const input = controls.querySelector('input'); input.addEventListener('input', () => { markLab(); answer = Number(input.value); controls.querySelector('strong').textContent = rounded(answer); drawGraph($('[data-mission-canvas]'), daily, mission, answer); }); }
      requestAnimationFrame(() => drawGraph($('[data-mission-canvas]'), daily, mission, answer)); timer = requestAnimationFrame(tick);
    }
    function submitMission() {
      cancelAnimationFrame(timer);
      const mission = daily.missions[index];
      const seconds = (performance.now() - startedAt) / 1000;
      const result = scoreAttempt(mission, answer, seconds);
      const attempt = { id: mission.id, answer, correct: mission.correct, seconds: rounded(seconds), points: result.points, accuracy: result.accuracy, success: result.success };
      attempts[index] = attempt;
      score += result.points; accuracySum += result.accuracy; combo = result.accuracy >= .8 ? combo + 1 : 0; bestCombo = Math.max(bestCombo, combo);
      $('[data-score]').textContent = score; $('[data-combo]').textContent = `×${combo}`;
      document.querySelectorAll('.choice-button').forEach(button => {
        if (button.textContent === formatAnswer(mission.correct)) button.classList.add('is-correct');
        else if (button.classList.contains('selected')) button.classList.add('is-wrong');
      });
      const feedback = $('[data-feedback]');
      const verdict = result.accuracy >= .8 ? `좋습니다 · +${result.points}점` : result.accuracy >= .4 ? `거의 도착했습니다 · +${result.points}점` : '그래프의 신호를 한 번 더 확인해 보세요.';
      feedback.className = `mission-feedback ${result.accuracy >= .8 ? 'good' : result.accuracy >= .4 ? 'mid' : 'bad'}`;
      feedback.innerHTML = `<div class="feedback-verdict"><span>나의 판단</span><strong>${formatAnswer(answer)} → 정답 ${formatAnswer(mission.correct)}</strong></div><div class="feedback-connection"><span>${verdict}</span><strong>${mission.explain}</strong></div>`;
      feedback.hidden = false;
      $('[data-submit]').hidden = true; $('[data-next]').hidden = false; $('[data-next]').textContent = index === daily.missions.length - 1 ? '오늘의 결과 보기 →' : '다음 미션 →';
      document.querySelectorAll('.choice-button,input[type="range"]').forEach(control => { control.disabled = true; });
    }
    function next() { if (index < daily.missions.length - 1) { index += 1; renderMission(); } else finish(); }
    function finish() {
      const accuracy = Math.round(accuracySum / daily.missions.length * 100);
      const abilitySummary = attempts.map(item => ({ id: item.id, accuracy: Math.round(item.accuracy * 100), points: item.points }));
      const previousRecord = readStore().plays[key];
      const personalBest = !previousRecord || score > previousRecord.score;
      const saved = saveResult(key, { score, accuracy, combo: bestCombo, abilities: abilitySummary });
      const record = saved.plays[key];
      const playTime = Math.max(1, Math.round((Date.now() - playStartedAt) / 1000));
      if (telemetry && activePlay) telemetry.finishPlay(activePlay.playId, {
        endedAt: new Date().toISOString(),
        score,
        accuracy,
        playTime,
        retry: sessionPlayIndex > 1,
        sessionPlayIndex,
        personalBest
      });
      wireOutboundLinks();
      $('[data-result-score]').textContent = score;
      $('[data-result-accuracy]').textContent = `${accuracy}%`;
      $('[data-result-combo]').textContent = `×${bestCombo}`;
      $('[data-result-streak]').textContent = `${saved.streak}일`;
      $('[data-result-best]').textContent = record.score;
      $('[data-result-session-play]').textContent = `${sessionPlayIndex}번째`;
      $('[data-result-pb]').hidden = !personalBest;
      $('[data-result-headline]').textContent = personalBest ? '개인 최고 기록입니다.' : '한 판 더 오를 수 있습니다.';
      $('[data-result-message]').textContent = personalBest
        ? `${score}점으로 오늘 최고 기록을 새로 썼습니다. 같은 함수를 더 빠르고 정확하게 읽어 보세요.`
        : accuracy >= 90
          ? `정확도 ${accuracy}%. 오늘 최고 ${record.score}점까지 한 번 더 도전해 보세요.`
          : accuracy >= 65
            ? '변화의 방향은 잘 잡았습니다. 바로 다시하면 방금 놓친 신호가 더 선명하게 보입니다.'
            : '오늘은 함수의 지도를 만든 첫 판입니다. 같은 함수를 한 번 더 읽으면 점수가 크게 오를 수 있습니다.';
      const resultProfile = buildResultProfile(daily.missions, attempts);
      $('[data-result-missions]').innerHTML = resultProfile.rows.map(row => {
        const percent = Math.round(row.accuracy * 100);
        return `<article class="reading-item" style="--item-color:${MISSION_COLORS[row.index]}"><span>${String(row.index + 1).padStart(2, '0')} · ${row.mission.sense}</span><strong>${row.points}점</strong><small>정확도 ${percent}% · ${row.seconds}초</small><div class="reading-meter"><i style="width:${percent}%"></i></div></article>`;
      }).join('');
      const weak = resultProfile.weakest;
      $('[data-recommend-title]').textContent = `${weak.mission.sense} 감각을 계산으로 굳혀 보세요.`;
      $('[data-recommend-text]').textContent = `${weak.mission.title}에서 확인한 연결을 ‘${weak.mission.skillTitle}’ 5문제로 짧게 반복하면, 다음 DAILY에서 그래프를 더 빠르게 읽을 수 있습니다.`;
      const recommendLink = $('[data-recommend-link]'); recommendLink.href = `미적분1_계산스킬.html?id=${weak.mission.skillId}`; recommendLink.textContent = `${weak.mission.skillTitle} 연습 시작 →`;
      if (window.jpMotionFeedback) window.jpMotionFeedback('success', personalBest ? `개인 최고 ${score}점!` : `이번 기록 ${score}점을 저장했습니다.`);
      show('result');
    }
    $('[data-start]').addEventListener('click', start); $('[data-submit]').addEventListener('click', submitMission); $('[data-next]').addEventListener('click', next); $('[data-replay]').addEventListener('click', start);
  }

  window.JPCalculusDaily = { buildDaily, scoreAttempt, buildResultProfile, dateKey };
  if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', init);
}());
