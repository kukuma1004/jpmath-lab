(function () {
  const catalog = window.JPEconomyAllGames;
  const runtime = window.JPEconomyGameRuntime;
  const realtime = window.JPEconomyRealtime;
  const toolkit = window.JPEconomyMathToolkit;
  const motion = window.JPEconomyMotion;
  const $ = selector => document.querySelector(selector);
  const fallbackColors = ['#1f6b50', '#315f78', '#d96f32', '#8c6aa5'];
  let connection = null;
  let roomCode = null;
  let myUid = null;
  let isHost = false;
  let onlineRoom = null;
  let game = catalog[0];
  let selectedAllocation = null;
  let selectedQuestion = '';
  let selectedTools = new Set();
  let toolkitController = null;
  let lastAllocation = null;
  let submittedRound = null;
  let editingRound = null;
  let stopRoomWatch = null;
  let stopChoiceWatch = null;
  let choiceWatchRound = null;
  let settling = false;
  let announcedRound = null;
  let lastNewsKey = null;
  let lastRevealKey = null;

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }
  function strategyColor(strategy, index) { return strategy.color || fallbackColors[index % fallbackColors.length]; }
  function currentEvent() { return runtime.resolveEvent(game, (onlineRoom.eventOrder || [])[onlineRoom.round], onlineRoom.round); }
  function playersArray() { return Object.entries((onlineRoom && onlineRoom.players) || {}).map(([uid, player]) => ({ uid, ...player })).sort((a, b) => (b.score || 0) - (a.score || 0)); }

  function showError(message) {
    const box = $('[data-room-error]');
    box.textContent = message;
    box.hidden = false;
    if (window.jpMotionFeedback) window.jpMotionFeedback('error', message);
  }
  function friendlyError(error) {
    const key = error && error.message;
    if (key === 'room-not-found') return '해당 방을 찾지 못했습니다. 6자리 코드를 다시 확인해 주세요.';
    if (key === 'game-already-started') return '이미 시작된 방입니다. 진행자에게 새 방을 요청해 주세요.';
    if (key === 'room-full') return '이 방에는 이미 6명이 참여하고 있습니다.';
    if (key === 'config-missing') return 'Firebase 연결 정보가 아직 설정되지 않았습니다.';
    if (key === 'database-url-missing' || key === 'database-not-created') return 'Firebase에서 Realtime Database를 먼저 만들어 주세요.';
    if (key === 'auth/operation-not-allowed' || key === 'auth/configuration-not-found') return 'Firebase Authentication에서 익명 로그인을 활성화해 주세요.';
    return '친구방 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.';
  }

  function setConnectionCard(status) {
    const card = $('[data-connection-card]');
    card.setAttribute('aria-busy', 'false');
    card.classList.toggle('ready', status.available);
    card.classList.toggle('error', !status.available);
    if (status.available) {
      $('[data-connection-title]').textContent = '실시간 친구방에 연결되었습니다.';
      $('[data-connection-copy]').textContent = '8개 게임의 1% 비율·수학 도구 사용·결과를 각 휴대폰에서 실시간으로 주고받습니다.';
    } else if (status.reason === 'config-missing') {
      $('[data-connection-title]').textContent = '친구방 연결 정보가 필요합니다.';
      $('[data-connection-copy]').textContent = '현재는 8개 게임의 한 기기 체험판을 이용할 수 있습니다.';
    } else if (status.reason === 'auth/operation-not-allowed' || status.reason === 'auth/configuration-not-found') {
      $('[data-connection-title]').textContent = '익명 로그인을 켜 주세요.';
      $('[data-connection-copy]').textContent = 'Firebase Authentication의 로그인 방식에서 익명을 활성화하면 됩니다.';
    } else if (status.reason === 'database-url-missing' || status.reason === 'database-not-created') {
      $('[data-connection-title]').textContent = 'Realtime Database를 만들어 주세요.';
      $('[data-connection-copy]').textContent = '데이터베이스 생성 후 준비된 보안 규칙을 게시하면 친구방이 연결됩니다.';
    } else {
      $('[data-connection-title]').textContent = '실시간 서버에 연결하지 못했습니다.';
      $('[data-connection-copy]').textContent = '인터넷 연결과 Firebase 설정을 확인해 주세요.';
    }
    $('[data-create-room]').disabled = !status.available;
    $('[data-join-room]').disabled = !status.available;
    if (status.available && window.jpMotionFeedback) window.jpMotionFeedback('success', '실시간 친구방이 준비되었습니다.');
  }

  function switchTab(key) {
    document.querySelectorAll('[data-entry-tab]').forEach(button => {
      const active = button.dataset.entryTab === key;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    $('[data-create-panel]').hidden = key !== 'create';
    $('[data-join-panel]').hidden = key !== 'join';
    $('[data-room-error]').hidden = true;
  }

  async function createRoom() {
    const nickname = $('[data-host-name]').value.trim();
    const gameId = $('[data-game-select]').value;
    if (!nickname) { showError('진행자 닉네임을 입력해 주세요.'); return; }
    try {
      $('[data-create-room]').disabled = true;
      if (window.jpMotionBusy) window.jpMotionBusy($('[data-create-room]'), true, '방을 만들고 있습니다');
      const created = await realtime.createRoom(gameId, nickname);
      roomCode = created.code; myUid = created.uid; isHost = true;
      game = catalog.find(item => item.id === gameId) || catalog[0];
      await realtime.hostUpdate(roomCode, { eventOrder: runtime.createScenario(game, roomCode) });
      if (window.jpMotionBusy) window.jpMotionBusy($('[data-create-room]'), false);
      await enterRoom();
    } catch (error) {
      showError(friendlyError(error));
      if (window.jpMotionBusy) window.jpMotionBusy($('[data-create-room]'), false);
      $('[data-create-room]').disabled = !connection.available;
    }
  }

  async function joinRoom() {
    const code = $('[data-join-code]').value.replace(/\D/g, '').slice(0, 6);
    const nickname = $('[data-join-name]').value.trim();
    if (code.length !== 6 || !nickname) { showError('6자리 방 코드와 닉네임을 모두 입력해 주세요.'); return; }
    try {
      $('[data-join-room]').disabled = true;
      if (window.jpMotionBusy) window.jpMotionBusy($('[data-join-room]'), true, '방을 찾고 있습니다');
      const joined = await realtime.joinRoom(code, nickname);
      roomCode = joined.code; myUid = joined.uid; isHost = joined.isHost;
      game = catalog.find(item => item.id === joined.room.gameId) || catalog[0];
      if (window.jpMotionBusy) window.jpMotionBusy($('[data-join-room]'), false);
      await enterRoom();
    } catch (error) {
      showError(friendlyError(error));
      if (window.jpMotionBusy) window.jpMotionBusy($('[data-join-room]'), false);
      $('[data-join-room]').disabled = !connection.available;
    }
  }

  async function enterRoom() {
    $('[data-entry]').hidden = true;
    $('[data-live-code]').textContent = roomCode;
    $('[data-game-code]').textContent = roomCode;
    document.documentElement.style.setProperty('--selected-accent', game.accent);
    stopRoomWatch = await realtime.watchRoom(roomCode, value => {
      if (!value) { location.reload(); return; }
      onlineRoom = value;
      game = catalog.find(item => item.id === value.gameId) || game;
      isHost = value.hostId === myUid;
      renderOnlineState();
      if (isHost && value.status === 'turn') ensureChoiceWatch();
    });
  }

  function renderLobby() {
    $('[data-online-game]').hidden = true;
    $('[data-online-lobby]').hidden = false;
    $('[data-wait-game]').textContent = `${game.number} · ${game.title} · 8라운드`;
    const players = playersArray();
    $('[data-player-count]').textContent = players.length;
    $('[data-online-players]').innerHTML = players.map(player => `<div class="online-player"><b>${escapeHtml(player.nickname)}</b><span>${player.uid === onlineRoom.hostId ? '진행자' : player.connected === false ? '연결 끊김' : '참여 완료'}</span></div>`).join('');
    $('[data-host-start]').hidden = !isHost;
    $('[data-host-start]').disabled = players.length < 2;
    $('[data-guest-wait]').hidden = isHost;
  }

  function hideOnlinePanels() {
    $('[data-online-choice]').hidden = true;
    $('[data-online-waiting]').hidden = true;
    $('[data-online-reveal]').hidden = true;
    $('[data-online-final]').hidden = true;
    $('.online-news').hidden = false;
  }

  function renderEvent() {
    const event = currentEvent();
    $('[data-live-game-title]').textContent = game.title;
    $('[data-live-round]').textContent = onlineRoom.round + 1;
    $('[data-live-round-total]').textContent = game.rounds;
    $('[data-live-meter]').style.setProperty('--progress', `${(onlineRoom.round + 1) / game.rounds * 100}%`);
    $('[data-live-news-round]').textContent = `ROUND ${String(onlineRoom.round + 1).padStart(2, '0')} · ${event.roundType} · 변동계수 ${Math.round(event.factor * 100)}`;
    $('[data-live-event-title]').textContent = event.title;
    $('[data-live-event-copy]').textContent = event.copy;
    $('[data-live-signals]').innerHTML = event.signals.map(signal => `<span>${signal}</span>`).join('');
    const newsKey = `${game.id}-${onlineRoom.round}-${event.id}`;
    if (lastNewsKey !== newsKey) { lastNewsKey = newsKey; motion.enter($('.online-news')); }
  }

  function renderTurn() {
    $('[data-online-lobby]').hidden = true;
    $('[data-online-game]').hidden = false;
    hideOnlinePanels();
    renderEvent();
    if (announcedRound !== onlineRoom.round) {
      announcedRound = onlineRoom.round;
      motion.announceRound(onlineRoom.round, game.title, onlineRoom.round === game.rounds - 1 ? 'FINAL ROUND' : 'LIVE MARKET');
    }
    const me = onlineRoom.players[myUid];
    $('[data-my-name]').textContent = `${me.nickname} · ${game.scoreLabel} ${Number(me.score || 100).toFixed(1)}점`;
    if (submittedRound === onlineRoom.round) {
      $('[data-online-waiting]').hidden = false;
      $('[data-submitted-count]').textContent = onlineRoom.submittedCount || 1;
      $('[data-total-count]').textContent = playersArray().length;
      return;
    }
    $('[data-online-choice]').hidden = false;
    if (editingRound !== onlineRoom.round || !selectedAllocation) {
      editingRound = onlineRoom.round;
      selectedAllocation = lastAllocation ? { ...lastAllocation } : runtime.equalAllocation(game);
      selectedQuestion = currentEvent().question;
      selectedTools = new Set();
      toolkitController = toolkit.mount($('[data-math-toolkit]'), {
        game,
        round: onlineRoom.round,
        event: currentEvent(),
        onUse: (id, tools) => { selectedTools = new Set(tools); }
      });
      renderChoiceControls();
    }
    $('[data-live-control-title]').textContent = `${game.controlLabel} 100%를 직접 설계하세요.`;
    $('[data-live-allocation-label]').textContent = `내가 만든 ${game.controlLabel}`;
    $('[data-live-question]').textContent = selectedQuestion;
    renderChoiceAllocation();
  }

  function renderChoiceControls() {
    $('[data-live-allocation-controls]').innerHTML = game.strategies.map((strategy, index) => `<article class="allocation-control" style="--asset-color:${strategyColor(strategy, index)}"><header><div><span>${strategy.name}</span><small>${strategy.facts}</small></div><output data-live-allocation-output="${strategy.id}">${selectedAllocation[strategy.id]}%</output></header><div class="allocation-input-row"><button type="button" data-live-step="${strategy.id}" data-step="-1" aria-label="${strategy.name} 1% 줄이기">−</button><input type="range" min="0" max="100" step="1" value="${selectedAllocation[strategy.id]}" data-live-input="${strategy.id}" aria-label="${strategy.name} 배분 비율"><button type="button" data-live-step="${strategy.id}" data-step="1" aria-label="${strategy.name} 1% 늘리기">＋</button></div></article>`).join('');
    document.querySelectorAll('[data-live-input]').forEach(input => input.addEventListener('input', () => { selectedAllocation[input.dataset.liveInput] = Number(input.value); renderChoiceAllocation(); }));
    document.querySelectorAll('[data-live-step]').forEach(button => button.addEventListener('click', () => { const key = button.dataset.liveStep; selectedAllocation[key] = Math.max(0, Math.min(100, selectedAllocation[key] + Number(button.dataset.step))); renderChoiceAllocation(); }));
  }

  function renderChoiceAllocation() {
    const total = runtime.allocationTotal(selectedAllocation);
    const chart = $('[data-live-allocation-chart]');
    let cumulative = 0;
    game.strategies.forEach((strategy, index) => {
      const value = selectedAllocation[strategy.id] || 0;
      cumulative += value;
      chart.style.setProperty(`--stop-${index + 1}`, `${Math.min(100, cumulative)}%`);
      chart.style.setProperty(`--mix-color-${index + 1}`, strategyColor(strategy, index));
      const input = document.querySelector(`[data-live-input="${strategy.id}"]`);
      const output = document.querySelector(`[data-live-allocation-output="${strategy.id}"]`);
      if (input) input.value = value;
      if (output) output.textContent = `${value}%`;
    });
    $('[data-live-allocation-bars]').innerHTML = game.strategies.map((strategy, index) => `<div><span>${strategy.name}</span><i><span style="--w:${selectedAllocation[strategy.id] || 0}%;--bar-color:${strategyColor(strategy, index)}"></span></i><b>${selectedAllocation[strategy.id] || 0}%</b></div>`).join('');
    $('[data-live-allocation-total]').textContent = `${total}%`;
    $('[data-live-allocation-total-label]').textContent = `합계 ${total}%`;
    const difference = 100 - total;
    const status = $('[data-live-allocation-status]');
    status.className = total === 100 ? 'is-ready' : 'needs-work';
    status.textContent = total === 100 ? '100% 배분 완료 · 바로 제출하거나 수학 도구로 비교해 보세요.' : difference > 0 ? `${difference}%가 남았습니다.` : `${Math.abs(difference)}%를 줄여야 합니다.`;
    updateSubmitState();
  }

  function updateSubmitState() {
    $('[data-submit-live]').disabled = runtime.allocationTotal(selectedAllocation) !== 100;
  }

  async function submitChoice() {
    if (!selectedAllocation || runtime.allocationTotal(selectedAllocation) !== 100) return;
    $('[data-submit-live]').disabled = true;
    const choice = { strategyId: 'mix', allocation: { ...selectedAllocation }, question: selectedQuestion, tools: toolkitController ? toolkitController.getUsedTools() : Array.from(selectedTools) };
    await realtime.submitChoice(roomCode, onlineRoom.round, choice);
    lastAllocation = { ...selectedAllocation };
    submittedRound = onlineRoom.round;
    renderTurn();
  }

  async function ensureChoiceWatch() {
    if (choiceWatchRound === onlineRoom.round && stopChoiceWatch) return;
    if (stopChoiceWatch) stopChoiceWatch();
    choiceWatchRound = onlineRoom.round;
    stopChoiceWatch = await realtime.watchChoices(roomCode, onlineRoom.round, async choices => {
      if (!onlineRoom || onlineRoom.status !== 'turn') return;
      const count = Object.keys(choices).length;
      await realtime.hostUpdate(roomCode, { submittedCount: count });
      if (count >= playersArray().length && !settling) await publishResults(choices);
    });
  }

  async function publishResults(choices) {
    settling = true;
    const event = currentEvent();
    const results = {};
    const patch = { status: 'reveal', submittedCount: Object.keys(choices).length };
    playersArray().forEach(player => {
      const choice = choices[player.uid] || {};
      const allocation = choice.allocation || runtime.equalAllocation(game);
      const delta = runtime.weightedScore(event, allocation);
      const score = Math.max(0, Math.min(1000, Math.round(((player.score || 100) + delta) * 10) / 10));
      const focus = runtime.dominant(game, allocation);
      results[player.uid] = { strategyId: 'mix', allocation, question: choice.question || '', tools: Array.isArray(choice.tools) ? choice.tools.slice(0, 5) : [], dominantId: focus.id, delta, score };
      patch[`players/${player.uid}/score`] = score;
    });
    patch.results = results;
    await realtime.hostUpdate(roomCode, patch);
    settling = false;
  }

  function rankedResults() {
    const results = onlineRoom.results || {};
    return playersArray().map(player => ({ ...player, result: results[player.uid] || { delta: 0, score: player.score || 100, allocation: runtime.equalAllocation(game) } })).sort((a, b) => b.result.score - a.result.score);
  }

  function resultRows(final) {
    return rankedResults().map((player, index) => {
      const focus = runtime.dominant(game, player.result.allocation);
      const tools = player.result.tools && player.result.tools.length ? ` · ${player.result.tools.map(toolkit.label).join('·')}` : '';
      const detail = final ? `${game.scoreLabel} · 마지막 ${focus.name} ${focus.value}%${tools}` : `${focus.name} ${focus.value}% 중심 · ${player.result.delta >= 0 ? '+' : ''}${Number(player.result.delta).toFixed(1)}점${tools}`;
      return `<div class="rank-row"><span>${String(index + 1).padStart(2, '0')}</span><b>${escapeHtml(player.nickname)}</b><small>${detail}</small><strong class="${player.result.delta >= 0 ? 'gain' : 'loss'}">${Number(player.result.score).toFixed(1)}점</strong></div>`;
    }).join('');
  }

  function renderReveal() {
    $('[data-online-lobby]').hidden = true;
    $('[data-online-game]').hidden = false;
    hideOnlinePanels();
    renderEvent();
    const event = currentEvent();
    $('[data-online-reveal]').hidden = false;
    $('[data-online-result-round]').textContent = `ROUND ${String(onlineRoom.round + 1).padStart(2, '0')} · ${game.title}`;
    $('[data-online-payoffs]').innerHTML = game.strategies.map(strategy => { const value = event.payoffs[strategy.id]; return `<div class="payoff-card"><span>${strategy.name} 100%일 때</span><strong class="${value >= 0 ? 'up' : 'down'}" data-online-payoff="${value}">${value >= 0 ? '+' : ''}${Number(value).toFixed(1)}점</strong></div>`; }).join('');
    if (window.JPResultScene) window.JPResultScene.render($('[data-online-result-city]'), {
      players: rankedResults(),
      readPlayer(player) {
        const alloc = (player.result && player.result.allocation) || {};
        return {
          name: player.nickname || player.name || '참가자',
          value: (player.result && player.result.delta) || 0,
          label: (((player.result && player.result.delta) || 0) >= 0 ? '+' : '−') +
                 Math.abs(Number((player.result && player.result.delta) || 0)).toFixed(1) + '점',
          items: game.strategies.map((strategy, index) => ({
            key: strategy.id, name: strategy.name, color: strategyColor(strategy, index),
            alloc: alloc[strategy.id] || 0, ret: Number(event.payoffs[strategy.id]) || 0
          }))
        };
      }
    });
    $('[data-online-ranking]').innerHTML = resultRows(false);
    $('[data-online-explain]').textContent = event.explain;
    $('[data-online-formula]').textContent = event.formula;
    const used = new Set(rankedResults().flatMap(player => player.result.tools || []));
    $('[data-online-tools-used]').innerHTML = used.size ? Array.from(used).map(id => `<b>${toolkit.label(id)}</b>`).join('') : '<small>이번 라운드는 수학 도구 없이 판단했습니다.</small>';
    $('[data-host-next]').hidden = !isHost;
    $('[data-host-next]').innerHTML = onlineRoom.round === game.rounds - 1 ? '최종 결과 보기 <span>→</span>' : '다음 경제 사건 보기 <span>→</span>';
    $('[data-next-wait]').hidden = isHost;
    const revealKey = `${game.id}-${onlineRoom.round}-${event.id}`;
    if (lastRevealKey !== revealKey) {
      lastRevealKey = revealKey;
      document.querySelectorAll('[data-online-payoff]').forEach(element => motion.count(element, Number(element.dataset.onlinePayoff), value => `${value >= 0 ? '+' : ''}${Number(value).toFixed(1)}점`, 650));
      motion.enter($('[data-online-reveal]'));
    }
  }

  function renderFinal() {
    $('[data-online-lobby]').hidden = true;
    $('[data-online-game]').hidden = false;
    hideOnlinePanels();
    $('.online-news').hidden = true;
    $('[data-online-final]').hidden = false;
    const ranked = rankedResults();
    $('[data-online-final-game]').textContent = `${game.title} · 8라운드 최종 결과`;
    $('[data-online-winner]').textContent = ranked[0].nickname;
    $('[data-online-final-copy]').textContent = `승리 조건은 ‘${game.victory}’입니다. 사건의 강도와 직접 만든 조합에 따라 결과가 달라졌습니다.`;
    $('[data-online-final-ranking]').innerHTML = resultRows(true);
    $('[data-host-rematch]').hidden = !isHost;
  }

  function renderOnlineState() {
    if (onlineRoom.status === 'lobby') renderLobby();
    else if (onlineRoom.status === 'turn') renderTurn();
    else if (onlineRoom.status === 'reveal') renderReveal();
    else if (onlineRoom.status === 'final') renderFinal();
  }

  async function hostStart() {
    if (!isHost || playersArray().length < 2) return;
    const patch = { status: 'turn', round: 0, submittedCount: 0, results: null, eventOrder: runtime.createScenario(game, roomCode) };
    playersArray().forEach(player => { patch[`players/${player.uid}/score`] = 100; });
    submittedRound = null; editingRound = null; selectedAllocation = null; lastAllocation = null; selectedTools = new Set(); announcedRound = null; lastNewsKey = null; lastRevealKey = null;
    await realtime.hostUpdate(roomCode, patch);
  }

  async function hostNext() {
    if (!isHost) return;
    if (onlineRoom.round === game.rounds - 1) { await realtime.hostUpdate(roomCode, { status: 'final' }); return; }
    await realtime.clearRoundChoices(roomCode, onlineRoom.round);
    submittedRound = null; editingRound = null; selectedAllocation = null;
    await realtime.hostUpdate(roomCode, { status: 'turn', round: onlineRoom.round + 1, results: null, submittedCount: 0 });
  }

  async function hostRematch() {
    if (!isHost) return;
    await realtime.clearRoundChoices(roomCode, onlineRoom.round);
    submittedRound = null; editingRound = null; selectedAllocation = null; lastAllocation = null; selectedTools = new Set(); announcedRound = null; lastNewsKey = null; lastRevealKey = null;
    const patch = { status: 'turn', round: 0, results: null, submittedCount: 0, eventOrder: runtime.createScenario(game, `${roomCode}-${Date.now()}`) };
    playersArray().forEach(player => { patch[`players/${player.uid}/score`] = 100; });
    await realtime.hostUpdate(roomCode, patch);
  }

  async function leaveOnline() {
    try { await realtime.leaveRoom(roomCode); } catch (error) { /* page reset still continues */ }
    if (stopRoomWatch) stopRoomWatch();
    if (stopChoiceWatch) stopChoiceWatch();
    location.reload();
  }

  async function init() {
    $('[data-game-select]').innerHTML = catalog.map(item => `<option value="${item.id}">${item.number} · ${item.title} · 8라운드</option>`).join('');
    document.querySelectorAll('[data-entry-tab]').forEach(button => button.addEventListener('click', () => switchTab(button.dataset.entryTab)));
    $('[data-create-room]').addEventListener('click', createRoom);
    $('[data-join-room]').addEventListener('click', joinRoom);
    $('[data-host-start]').addEventListener('click', hostStart);
    $('[data-submit-live]').addEventListener('click', submitChoice);
    $('[data-host-next]').addEventListener('click', hostNext);
    $('[data-host-rematch]').addEventListener('click', hostRematch);
    $('[data-online-leave]').addEventListener('click', leaveOnline);
    $('[data-join-code]').addEventListener('input', event => { event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6); });
    connection = await realtime.connect();
    setConnectionCard(connection);
  }

  init();
}());
