(function () {
  const catalog = window.JPEconomyGameCatalog;
  const runtime = window.JPEconomyGameRuntime;
  const toolkit = window.JPEconomyMathToolkit;
  const motion = window.JPEconomyMotion;
  const telemetry = window.JPGameTelemetry;
  const $ = selector => document.querySelector(selector);
  const storageKey = 'jp-economy-seven-games-v3';
  const fallbackColors = ['#1f6b50', '#315f78', '#d96f32', '#8c6aa5'];
  let game = catalog.find(item => item.id === new URLSearchParams(location.search).get('game')) || catalog.find(item => item.id === 'currency-war') || catalog[0];
  let room = null;
  let selectedAllocation = null;
  let selectedQuestion = '';
  let selectedTools = new Set();
  let toolkitController = null;
  let announcedRound = null;
  let lastNewsKey = null;
  let lastRevealKey = null;
  let profile = telemetry ? telemetry.getProfile() : null;
  let telemetrySessionId = telemetry ? telemetry.makeSessionId() : `session-${Date.now()}-economy`;
  let activePlay = null;
  let playStartedAt = 0;
  const sessionPlayCounts = new Map();

  function makeCode() {
    const buffer = new Uint32Array(1);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(buffer);
    else buffer[0] = Math.floor(Math.random() * 999999);
    return String(100000 + buffer[0] % 900000);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function saveRoom() { if (room) localStorage.setItem(storageKey, JSON.stringify(room)); }
  function clearRoom() { room = null; localStorage.removeItem(storageKey); }
  function currentEvent() { return runtime.resolveEvent(game, room.eventOrder[room.round], room.round); }
  function formatScore(value) { return `${Number(value).toFixed(1)}점`; }
  function strategyColor(strategy, index) { return strategy.color || fallbackColors[index % fallbackColors.length]; }

  function personalBestKey() {
    const userId = profile && profile.userId ? profile.userId : 'local-player';
    return `jp_economy_personal_best_${game.id}_${String(userId).replace(/[^a-zA-Z0-9가-힣_-]/g, '_')}`;
  }

  function loadPersonalBest() {
    try {
      const value = JSON.parse(localStorage.getItem(personalBestKey()));
      return value && Number.isFinite(Number(value.score)) ? value : null;
    } catch (_) { return null; }
  }

  function savePersonalBest(result) {
    try { localStorage.setItem(personalBestKey(), JSON.stringify(result)); } catch (_) {}
  }

  function beginTelemetry(retry, previousMeta) {
    if (!room || !room.players.length) return;
    profile = telemetry ? telemetry.saveProfile(room.players[0].name) : { userId: `local-${room.players[0].name}`, displayName: room.players[0].name };
    if (previousMeta && previousMeta.sessionId) telemetrySessionId = previousMeta.sessionId;
    const previousIndex = previousMeta ? Number(previousMeta.sessionPlayIndex || 0) : Number(sessionPlayCounts.get(game.id) || 0);
    const sessionPlayIndex = previousIndex + 1;
    sessionPlayCounts.set(game.id, sessionPlayIndex);
    playStartedAt = Date.now();
    activePlay = telemetry ? telemetry.startPlay({
      gameId: `economy-${game.id}`,
      sessionId: telemetrySessionId,
      retry: Boolean(retry),
      sessionPlayIndex
    }) : null;
    room.telemetry = {
      playId: activePlay && activePlay.playId,
      sessionId: telemetrySessionId,
      sessionPlayIndex,
      retry: Boolean(retry),
      startedAt: new Date(playStartedAt).toISOString(),
      finished: false
    };
    saveRoom();
  }

  function finishTelemetry(players) {
    const meta = room.telemetry || {};
    const own = room.players.find(player => profile && player.name === profile.displayName) || room.players[0];
    if (!own) return;
    let result = meta.result;
    if (!result) {
      const oldBest = loadPersonalBest();
      const personalBest = !oldBest || Number(own.score) > Number(oldBest.score || 0);
      result = {
        score: Number(own.score),
        best: personalBest ? Number(own.score) : Number(oldBest.score),
        personalBest,
        sessionPlayIndex: Number(meta.sessionPlayIndex || 1)
      };
      if (personalBest) savePersonalBest({ score: result.score, savedAt: new Date().toISOString() });
      if (telemetry && meta.playId && !meta.finished) telemetry.finishPlay(meta.playId, {
        endedAt: new Date().toISOString(),
        score: result.score,
        accuracy: 0,
        playTime: Math.max(1, Math.round((Date.now() - (Date.parse(meta.startedAt) || playStartedAt || Date.now())) / 1000)),
        retry: Boolean(meta.retry),
        sessionPlayIndex: result.sessionPlayIndex,
        personalBest
      });
      room.telemetry = { ...meta, finished: true, result };
      saveRoom();
    }
    $('[data-personal-best]').hidden = !result.personalBest;
    $('[data-own-score]').textContent = Number(result.score).toFixed(1);
    $('[data-own-best]').textContent = Number(result.best).toFixed(1);
    $('[data-session-play]').textContent = `${result.sessionPlayIndex}번째`;
    $('[data-loop-feedback]').textContent = result.personalBest
      ? `${own.name}님의 개인 최고 기록입니다. 같은 참가자와 바로 다시 하면 사건과 수치가 새롭게 조합됩니다.`
      : `${own.name}님의 개인 최고 ${Number(result.best).toFixed(1)}점까지 다시 도전해 보세요. 다음 판은 사건 순서와 수치가 달라집니다.`;
  }

  function renderCatalog() {
    $('[data-game-catalog]').innerHTML = catalog.map(item => `
      <button class="catalog-card" type="button" data-game="${item.id}" style="--game-accent:${item.accent}">
        <span>${item.number} · ${item.domain}</span><h3>${item.title}</h3><p>${item.subtitle}</p><b>${item.victory}</b><i>8라운드 체험하기 →</i>
      </button>`).join('');
    document.querySelectorAll('[data-game]').forEach(button => button.addEventListener('click', () => selectGame(button.dataset.game, true)));
  }

  function selectGame(id, scroll) {
    game = catalog.find(item => item.id === id) || game;
    document.documentElement.style.setProperty('--selected-accent', game.accent);
    $('[data-game-domain]').textContent = `${game.number} · ${game.domain}`;
    $('[data-game-title]').textContent = game.title;
    $('[data-game-subtitle]').textContent = game.subtitle;
    $('[data-game-victory]').textContent = game.victory;
    history.replaceState(null, '', `?game=${game.id}`);
    if (scroll) $('[data-lobby]').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function addPlayer() {
    const wrapper = $('[data-player-inputs]');
    const count = wrapper.children.length;
    if (count >= 6) return;
    const label = document.createElement('label');
    label.innerHTML = `<span>${count + 1}</span><input type="text" maxlength="12" autocomplete="off" aria-label="참가자 ${count + 1} 닉네임" placeholder="수업용 별명">`;
    wrapper.append(label);
    label.querySelector('input').focus();
    $('[data-add-player]').hidden = count + 1 >= 6;
  }

  function createLocalRoom(names) {
    const code = makeCode();
    return {
      version: 3, gameId: game.id, code, round: 0, phase: 'turn', currentPlayer: 0,
      eventOrder: runtime.createScenario(game, code),
      players: names.map((name, index) => ({ id: index + 1, name, score: 100, history: [], choice: null }))
    };
  }

  function startGame() {
    const names = Array.from(document.querySelectorAll('[data-player-inputs] input')).map(input => input.value.trim()).filter(Boolean);
    const error = $('[data-form-error]');
    if (names.length < 2) { error.textContent = '두 명 이상의 닉네임을 입력해 주세요.'; error.hidden = false; return; }
    if (new Set(names).size !== names.length) { error.textContent = '서로 다른 닉네임을 사용해 주세요.'; error.hidden = false; return; }
    error.hidden = true;
    room = createLocalRoom(names);
    beginTelemetry(false, null);
    saveRoom();
    openRoom();
  }

  function openRoom() {
    $('[data-lobby]').hidden = true;
    $('[data-room]').hidden = false;
    $('[data-room-title]').textContent = game.title;
    document.documentElement.style.setProperty('--selected-accent', game.accent);
    if (room.phase === 'reveal') renderReveal();
    else if (room.phase === 'final') renderFinal();
    else renderTurn();
    $('[data-room]').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function hidePanels() {
    $('[data-gate]').hidden = true;
    $('[data-decision]').hidden = true;
    $('[data-reveal]').hidden = true;
    $('[data-final]').hidden = true;
    $('.arena-news').hidden = false;
  }

  // 화면이 바뀌면 그 화면의 처음으로 데려간다.
  // 결정 화면은 길어서, 아래쪽 잠금 버튼을 누르면 문서가 2000px 가까이
  // 짧아진다. 브라우저는 스크롤을 그대로 두므로 다음 차례 안내가 화면 위로
  // 밀려나고, 학생은 빈 곳을 보다가 다시 올려야 했다.
  function focusArena(target){
    const el = target || $('[data-room]');
    if (!el || el.hidden) return;
    const box = document.scrollingElement || document.documentElement;
    const top = Math.max(0, window.scrollY + el.getBoundingClientRect().top - 72);
    // 2000px 넘게 이동하므로 부드럽게 굴리면 오히려 느리고 어지럽다. 바로 옮긴다.
    // scrollTo 의 객체 형식은 일부 환경에서 무시되므로 scrollTop 을 직접 쓴다.
    const keep = box.style.scrollBehavior;
    box.style.scrollBehavior = 'auto';
    box.scrollTop = top;
    box.style.scrollBehavior = keep;
  }

  function renderRound() {
    const event = currentEvent();
    $('[data-round]').textContent = room.round + 1;
    $('[data-round-total]').textContent = game.rounds;
    $('[data-meter]').style.setProperty('--progress', `${(room.round + 1) / game.rounds * 100}%`);
    $('[data-news-round]').textContent = `ROUND ${String(room.round + 1).padStart(2, '0')} · ${event.roundType} · 변동계수 ${Math.round(event.factor * 100)}`;
    $('[data-event-title]').textContent = event.title;
    $('[data-event-copy]').textContent = event.copy;
    $('[data-signals]').innerHTML = event.signals.map(signal => `<span>${signal}</span>`).join('');
    const newsKey = `${game.id}-${room.round}-${event.id}`;
    if (lastNewsKey !== newsKey) { lastNewsKey = newsKey; motion.enter($('.arena-news')); }
  }

  function renderTurn() {
    room.phase = 'turn';
    hidePanels();
    renderRound();
    selectedAllocation = null;
    selectedQuestion = '';
    selectedTools = new Set();
    const player = room.players[room.currentPlayer];
    $('[data-current-name]').textContent = player.name;
    $('[data-gate]').hidden = false;
    if (room.currentPlayer === 0 && announcedRound !== room.round) {
      announcedRound = room.round;
      motion.announceRound(room.round, game.title, room.round === game.rounds - 1 ? 'FINAL ROUND' : 'BREAKING NEWS');
    }
    saveRoom();
    focusArena();
  }

  function openDecision() {
    const player = room.players[room.currentPlayer];
    const previous = player.history[player.history.length - 1];
    const event = currentEvent();
    $('[data-gate]').hidden = true;
    $('[data-decision]').hidden = false;
    $('[data-player-label]').textContent = `${room.currentPlayer + 1}번째 결정 · ${player.name}`;
    $('[data-score-label]').textContent = `${game.scoreLabel} ${formatScore(player.score)}`;
    $('[data-control-title]').textContent = `${game.controlLabel} 100%를 직접 설계하세요.`;
    $('[data-allocation-label]').textContent = `내가 만든 ${game.controlLabel}`;
    selectedAllocation = previous && previous.allocation ? { ...previous.allocation } : runtime.equalAllocation(game);
    selectedQuestion = event.question;
    $('[data-decision-question]').textContent = selectedQuestion;
    selectedTools = new Set();
    toolkitController = toolkit.mount($('[data-math-toolkit]'), {
      game,
      round: room.round,
      event,
      onUse: (id, tools) => { selectedTools = new Set(tools); }
    });
    renderAllocationControls();
    renderAllocation();
    focusArena($('[data-decision]'));
  }

  function renderAllocationControls() {
    $('[data-allocation-controls]').innerHTML = game.strategies.map((strategy, index) => {
      const color = strategyColor(strategy, index);
      return `<article class="allocation-control" style="--asset-color:${color}">
        <header><div><span>${strategy.name}</span><small>${strategy.facts}</small></div><output data-allocation-output="${strategy.id}">${selectedAllocation[strategy.id]}%</output></header>
        <div class="allocation-input-row"><button type="button" data-allocation-step="${strategy.id}" data-step="-1" aria-label="${strategy.name} 1% 줄이기">−</button><input type="range" min="0" max="100" step="1" value="${selectedAllocation[strategy.id]}" data-allocation-input="${strategy.id}" aria-label="${strategy.name} 배분 비율"><button type="button" data-allocation-step="${strategy.id}" data-step="1" aria-label="${strategy.name} 1% 늘리기">＋</button></div>
      </article>`;
    }).join('');
    document.querySelectorAll('[data-allocation-input]').forEach(input => input.addEventListener('input', () => { selectedAllocation[input.dataset.allocationInput] = Number(input.value); renderAllocation(); }));
    document.querySelectorAll('[data-allocation-step]').forEach(button => button.addEventListener('click', () => {
      const key = button.dataset.allocationStep;
      selectedAllocation[key] = Math.max(0, Math.min(100, selectedAllocation[key] + Number(button.dataset.step)));
      renderAllocation();
    }));
  }

  function renderAllocation() {
    const total = runtime.allocationTotal(selectedAllocation);
    const chart = $('[data-allocation-chart]');
    let cumulative = 0;
    game.strategies.forEach((strategy, index) => {
      const value = selectedAllocation[strategy.id] || 0;
      cumulative += value;
      chart.style.setProperty(`--stop-${index + 1}`, `${Math.min(100, cumulative)}%`);
      chart.style.setProperty(`--mix-color-${index + 1}`, strategyColor(strategy, index));
      const input = document.querySelector(`[data-allocation-input="${strategy.id}"]`);
      const output = document.querySelector(`[data-allocation-output="${strategy.id}"]`);
      if (input) input.value = value;
      if (output) output.textContent = `${value}%`;
    });
    $('[data-allocation-bars]').innerHTML = game.strategies.map((strategy, index) => `<div><span>${strategy.name}</span><i><span style="--w:${selectedAllocation[strategy.id] || 0}%;--bar-color:${strategyColor(strategy, index)}"></span></i><b>${selectedAllocation[strategy.id] || 0}%</b></div>`).join('');
    $('[data-allocation-total]').textContent = `${total}%`;
    $('[data-allocation-total-label]').textContent = `합계 ${total}%`;
    const difference = 100 - total;
    const status = $('[data-allocation-status]');
    status.className = total === 100 ? 'is-ready' : 'needs-work';
    status.textContent = total === 100 ? '100% 배분 완료 · 바로 결정하거나 수학 도구로 비교해 보세요.' : difference > 0 ? `${difference}%가 남았습니다.` : `${Math.abs(difference)}%를 줄여야 합니다.`;
    updateLockState();
  }

  function updateLockState() {
    $('[data-lock]').disabled = runtime.allocationTotal(selectedAllocation) !== 100;
  }

  function lockChoice() {
    if (!selectedAllocation || runtime.allocationTotal(selectedAllocation) !== 100) return;
    room.players[room.currentPlayer].choice = { allocation: { ...selectedAllocation }, question: selectedQuestion, tools: toolkitController ? toolkitController.getUsedTools() : Array.from(selectedTools) };
    room.currentPlayer += 1;
    selectedAllocation = null;
    if (room.currentPlayer < room.players.length) renderTurn();
    else settleRound();
  }

  function settleRound() {
    const event = currentEvent();
    room.players.forEach(player => {
      const delta = runtime.weightedScore(event, player.choice.allocation);
      player.score = Math.max(0, Math.min(1000, Math.round((player.score + delta) * 10) / 10));
      player.history.push({ round: room.round + 1, allocation: { ...player.choice.allocation }, question: player.choice.question, tools: player.choice.tools || [], delta, score: player.score });
      player.choice = null;
    });
    room.phase = 'reveal';
    saveRoom();
    renderReveal();
  }

  function ranked() { return room.players.slice().sort((a, b) => b.score - a.score); }

  function rankRows(players, final) {
    return players.map((player, index) => {
      const last = player.history[player.history.length - 1];
      const focus = runtime.dominant(game, last && last.allocation);
      const tools = last && last.tools && last.tools.length ? ` · ${last.tools.map(toolkit.label).join('·')}` : '';
      const detail = final ? `누적 ${player.history.length}라운드 · 마지막 ${focus.name} ${focus.value}%${tools}` : `${focus.name} ${focus.value}% 중심 · ${last.delta >= 0 ? '+' : ''}${last.delta.toFixed(1)}점${tools}`;
      return `<div class="rank-row"><span>${String(index + 1).padStart(2, '0')}</span><b>${escapeHtml(player.name)}</b><small>${detail}</small><strong class="${!last || last.delta >= 0 ? 'gain' : 'loss'}">${formatScore(player.score)}</strong></div>`;
    }).join('');
  }

  // 라운드마다 사건 코드가 정해져 있으므로 지난 라운드의 성과도 그대로 다시 계산된다.
  // 그래서 배분만 기록해 두면 누적 화면을 언제든 복원할 수 있다.
  function eventsByRound() {
    return room.eventOrder.map((code, index) => runtime.resolveEvent(game, code, index));
  }

  function cityItems(allocation, event) {
    return game.strategies.map((strategy, index) => ({
      key: strategy.id, name: strategy.name, color: strategyColor(strategy, index),
      alloc: Number((allocation || {})[strategy.id]) || 0,
      ret: Number(event.payoffs[strategy.id]) || 0
    }));
  }

  // 한 층 = 그 라운드에 그 전략이 벌어준 점수. 바닥 = 그 전략에 건 평균 비율.
  function skylineItems(player, events) {
    const rounds = player.history.length || 1;
    const perRound = player.history.map(entry => {
      const event = events[entry.round - 1];
      return event ? runtime.contributions(event, entry.allocation || {}) : {};
    });
    return game.strategies.map((strategy, index) => {
      const layers = perRound.map(share => Number(share[strategy.id]) || 0);
      const share = player.history.reduce((sum, entry) => sum + (Number((entry.allocation || {})[strategy.id]) || 0), 0) / rounds;
      return { key: strategy.id, name: strategy.name, color: strategyColor(strategy, index), share, layers };
    });
  }

  function renderReveal() {
    hidePanels();
    room.phase = 'reveal';
    renderRound();
    const event = currentEvent();
    $('[data-reveal]').hidden = false;
    $('[data-result-round]').textContent = `ROUND ${String(room.round + 1).padStart(2, '0')} · ${game.title}`;
    $('[data-payoffs]').innerHTML = game.strategies.map(strategy => {
      const value = event.payoffs[strategy.id];
      return `<div class="payoff-card"><span>${strategy.name} 100%일 때</span><strong class="${value >= 0 ? 'up' : 'down'}" data-payoff-value="${value}">${value >= 0 ? '+' : ''}${Number(value).toFixed(1)}점</strong></div>`;
    }).join('');
    if (window.JPResultScene) window.JPResultScene.render($('[data-result-city]'), {
      players: ranked(),
      readPlayer(player) {
        const last = player.history[player.history.length - 1] || { allocation: {}, delta: 0 };
        const delta = Number(last.delta) || 0;
        return {
          name: escapeHtml(player.name), value: delta,
          label: (delta >= 0 ? '+' : '−') + Math.abs(delta).toFixed(1) + '점',
          items: cityItems(last.allocation, event)
        };
      }
    });
    $('[data-ranking]').innerHTML = rankRows(ranked(), false);
    $('[data-explain]').textContent = event.explain;
    $('[data-formula]').textContent = event.formula;
    const used = new Set(room.players.flatMap(player => (player.history[player.history.length - 1] || {}).tools || []));
    $('[data-tools-used]').innerHTML = used.size ? Array.from(used).map(id => `<b>${toolkit.label(id)}</b>`).join('') : '<small>이번 라운드는 수학 도구 없이 판단했습니다.</small>';
    $('[data-next]').innerHTML = room.round === game.rounds - 1 ? '최종 결과 보기 <span>→</span>' : '다음 경제 사건 보기 <span>→</span>';
    document.querySelectorAll('[data-payoff-value]').forEach(element => motion.count(element, Number(element.dataset.payoffValue), value => `${value >= 0 ? '+' : ''}${Number(value).toFixed(1)}점`, 650));
    const revealKey = `${game.id}-${room.round}-${event.id}`;
    if (lastRevealKey !== revealKey) { lastRevealKey = revealKey; motion.enter($('[data-reveal]')); }
    saveRoom();
    focusArena();
  }

  function nextRound() {
    if (room.round === game.rounds - 1) { room.phase = 'final'; saveRoom(); renderFinal(); return; }
    room.round += 1;
    room.currentPlayer = 0;
    renderTurn();
  }

  function renderFinal() {
    hidePanels();
    room.phase = 'final';
    $('.arena-news').hidden = true;
    $('[data-final]').hidden = false;
    const players = ranked();
    $('[data-final-game]').textContent = `${game.title} · 8라운드 최종 결과`;
    $('[data-winner]').textContent = players[0].name;
    $('[data-final-copy]').textContent = `승리 조건은 ‘${game.victory}’입니다. 같은 대응도 사건의 수치와 조합 비율에 따라 결과가 달라졌습니다.`;
    const events = eventsByRound();
    if (window.JPResultScene) window.JPResultScene.renderSkyline($('[data-final-city]'), {
      players,
      readPlayer(player) {
        const gained = Number(player.score) - 100;
        return {
          name: escapeHtml(player.name), value: gained,
          label: (gained >= 0 ? '+' : '−') + Math.abs(gained).toFixed(1) + '점',
          items: skylineItems(player, events)
        };
      }
    });
    $('[data-final-ranking]').innerHTML = rankRows(players, true);
    finishTelemetry(players);
    saveRoom();
    focusArena($('[data-final]'));
  }

  function rematch() {
    const previousMeta = room.telemetry;
    const names = room.players.map(player => player.name);
    room = createLocalRoom(names);
    announcedRound = null;
    lastNewsKey = null;
    lastRevealKey = null;
    beginTelemetry(true, previousMeta);
    saveRoom();
    renderTurn();
  }

  function pickAnother() {
    clearRoom();
    $('[data-room]').hidden = true;
    $('[data-lobby]').hidden = false;
    $('.catalog-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function leave() {
    if (!confirm('현재 게임을 끝내고 게임 선택 화면으로 돌아갈까요?')) return;
    pickAnother();
  }

  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      const savedGame = saved && catalog.find(item => item.id === saved.gameId);
      if (!saved || saved.version !== 3 || !savedGame || !Array.isArray(saved.players)) { localStorage.removeItem(storageKey); return; }
      game = savedGame;
      room = saved;
      if (telemetry && room.players[0]) profile = telemetry.saveProfile(room.players[0].name);
      if (room.telemetry) {
        activePlay = room.telemetry.playId ? { playId: room.telemetry.playId } : null;
        telemetrySessionId = room.telemetry.sessionId || telemetrySessionId;
        playStartedAt = Date.parse(room.telemetry.startedAt) || Date.now();
        sessionPlayCounts.set(game.id, Number(room.telemetry.sessionPlayIndex || 0));
      }
      selectGame(game.id, false);
      openRoom();
    } catch (error) { localStorage.removeItem(storageKey); }
  }

  renderCatalog();
  selectGame(game.id, false);
  if (profile) $('[data-player-inputs] input').value = profile.displayName;
  if (telemetry) telemetry.flush();
  $('[data-add-player]').addEventListener('click', addPlayer);
  $('[data-start]').addEventListener('click', startGame);
  $('[data-change-game]').addEventListener('click', () => $('.catalog-section').scrollIntoView({ behavior: 'smooth' }));
  $('[data-open]').addEventListener('click', openDecision);
  $('[data-lock]').addEventListener('click', lockChoice);
  $('[data-next]').addEventListener('click', nextRound);
  $('[data-rematch]').addEventListener('click', rematch);
  $('[data-pick-another]').addEventListener('click', pickAnother);
  $('[data-leave]').addEventListener('click', leave);
  restore();
}());
