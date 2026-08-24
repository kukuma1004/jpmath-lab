(function () {
  const investmentGame = {
    id: 'investment-king', number: '01', title: 'JP 투자왕', domain: '수와 경제', accent: '#1f6b50',
    subtitle: '금리·물가·성장률·환율을 읽고 자산을 배분합니다.', victory: '5라운드 뒤 최종 자산', scoreLabel: '투자 성과',
    strategies: [
      { id: 'safe', name: '안정 방어형', copy: '예금과 채권을 중심으로 변동을 줄입니다.', facts: '예금 50% · 채권 30%' },
      { id: 'balanced', name: '균형 분산형', copy: '네 자산에 위험을 나누어 담습니다.', facts: '예금·채권·주식·외화 분산' },
      { id: 'growth', name: '성장 집중형', copy: '경제성장과 기업 실적에 무게를 둡니다.', facts: '주식 60% · 변동 높음' },
      { id: 'currency', name: '환율 방어형', copy: '원화 가치 하락에 대비해 외화 비중을 높입니다.', facts: '외화 50% · 환율 민감' }
    ],
    events: [
      { title: '국제 유가가 급등했습니다', copy: '수입물가와 생산비가 오르고 원화 가치가 약해졌습니다.', signals: ['물가 +2%p', '성장 둔화', '환율 +4.5%'], payoffs: { safe: 5, balanced: 7, growth: -2, currency: 11 }, explain: '물가 충격은 현금의 실질가치와 기업 이익을 압박하고, 환율 상승은 외화의 원화 가치를 높입니다.', formula: '실질수익률 ≈ 명목수익률 − 물가상승률' },
      { title: '기준금리가 0.5%p 올랐습니다', copy: '새 예금 금리는 오르고 기존 채권과 성장주에는 부담이 생겼습니다.', signals: ['금리 +0.5%p', '채권가격 압박', '대출비용 상승'], payoffs: { safe: 9, balanced: 5, growth: -5, currency: 3 }, explain: '금리 상승은 새 예금에는 유리하지만 기존 채권과 미래 이익 비중이 큰 주식에는 부담이 될 수 있습니다.', formula: '금리 ↑ → 새 예금 수익 ↑ · 기존 채권 가격 ↓' },
      { title: 'AI 산업 투자가 빠르게 늘었습니다', copy: '생산성과 기업 이익의 성장 기대가 높아졌습니다.', signals: ['성장률 상승', '기술주 강세', '투자 확대'], payoffs: { safe: 2, balanced: 7, growth: 12, currency: 3 }, explain: '성장 기대가 실제 미래 이익으로 이어질수록 기업의 현재 평가도 높아질 수 있습니다.', formula: '주식 기대수익 ≈ 성장 효과 − 금리 부담' },
      { title: '물가가 안정되고 금리 인하가 예상됩니다', copy: '채권과 주식의 상대적 매력이 다시 높아지고 있습니다.', signals: ['물가 하락', '금리 인하 기대', '채권가격 상승'], payoffs: { safe: 8, balanced: 10, growth: 7, currency: 1 }, explain: '금리 하락 기대는 높은 이자를 약속한 기존 채권의 가치를 높이고 기업의 자금조달 부담을 낮춥니다.', formula: '실질가치 효과 = 명목수익 − 물가 효과' }
    ]
  };
  const catalog = [investmentGame, ...window.JPEconomyGameCatalog];
  const realtime = window.JPEconomyRealtime;
  const $ = selector => document.querySelector(selector);
  let connection = null;
  let roomCode = null;
  let myUid = null;
  let isHost = false;
  let onlineRoom = null;
  let game = catalog[0];
  let selectedStrategy = null;
  let submittedRound = null;
  let stopRoomWatch = null;
  let stopChoiceWatch = null;
  let choiceWatchRound = null;
  let settling = false;

  function seededOrder(length, seedText) {
    const order = Array.from({ length }, (_, index) => index);
    let seed = Array.from(seedText).reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 2166136261);
    for (let index = order.length - 1; index > 0; index -= 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const target = seed % (index + 1);
      [order[index], order[target]] = [order[target], order[index]];
    }
    return order;
  }

  function currentEvent() {
    const order = onlineRoom.eventOrder || [0, 1, 2, 3];
    return game.events[order[onlineRoom.round] ?? onlineRoom.round];
  }

  function playersArray() {
    return Object.entries((onlineRoom && onlineRoom.players) || {}).map(([uid, player]) => ({ uid, ...player })).sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  function showError(message) {
    const box = $('[data-room-error]');
    box.textContent = message;
    box.hidden = false;
  }

  function friendlyError(error) {
    const key = error && error.message;
    if (key === 'room-not-found') return '해당 방을 찾지 못했습니다. 6자리 코드를 다시 확인해 주세요.';
    if (key === 'game-already-started') return '이미 시작된 방입니다. 진행자에게 새 방을 요청해 주세요.';
    if (key === 'room-full') return '이 방에는 이미 6명이 참여하고 있습니다.';
    if (key === 'config-missing') return 'Firebase 연결 정보가 아직 설정되지 않았습니다.';
    return '친구방 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.';
  }

  function setConnectionCard(status) {
    const card = $('[data-connection-card]');
    card.classList.toggle('ready', status.available);
    card.classList.toggle('error', !status.available);
    if (status.available) {
      $('[data-connection-title]').textContent = '실시간 친구방에 연결되었습니다.';
      $('[data-connection-copy]').textContent = '이제 서로 다른 휴대폰에서 같은 방에 참여할 수 있습니다.';
    } else if (status.reason === 'config-missing') {
      $('[data-connection-title]').textContent = '친구방 연결 정보가 필요합니다.';
      $('[data-connection-copy]').textContent = '현재는 8개 게임의 한 기기 체험판을 이용할 수 있습니다.';
    } else {
      $('[data-connection-title]').textContent = '실시간 서버에 연결하지 못했습니다.';
      $('[data-connection-copy]').textContent = '인터넷 연결과 Firebase 설정을 확인해 주세요.';
    }
    $('[data-create-room]').disabled = !status.available;
    $('[data-join-room]').disabled = !status.available;
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
      const created = await realtime.createRoom(gameId, nickname);
      roomCode = created.code;
      myUid = created.uid;
      isHost = true;
      game = catalog.find(item => item.id === gameId);
      await realtime.hostUpdate(roomCode, { eventOrder: seededOrder(game.events.length, roomCode) });
      await enterRoom();
    } catch (error) { showError(friendlyError(error)); $('[data-create-room]').disabled = !connection.available; }
  }

  async function joinRoom() {
    const code = $('[data-join-code]').value.replace(/\D/g, '').slice(0, 6);
    const nickname = $('[data-join-name]').value.trim();
    if (code.length !== 6 || !nickname) { showError('6자리 방 코드와 닉네임을 모두 입력해 주세요.'); return; }
    try {
      $('[data-join-room]').disabled = true;
      const joined = await realtime.joinRoom(code, nickname);
      roomCode = joined.code;
      myUid = joined.uid;
      isHost = joined.isHost;
      game = catalog.find(item => item.id === joined.room.gameId) || catalog[0];
      await enterRoom();
    } catch (error) { showError(friendlyError(error)); $('[data-join-room]').disabled = !connection.available; }
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
    $('[data-wait-game]').textContent = `${game.number} · ${game.title}`;
    const players = playersArray();
    $('[data-player-count]').textContent = players.length;
    $('[data-online-players]').innerHTML = players.map(player => `<div class="online-player"><b>${player.nickname}</b><span>${player.uid === onlineRoom.hostId ? '진행자' : player.connected === false ? '연결 끊김' : '참여 완료'}</span></div>`).join('');
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
    $('[data-live-meter]').style.setProperty('--progress', `${(onlineRoom.round + 1) / game.events.length * 100}%`);
    $('[data-live-news-round]').textContent = `ROUND ${String(onlineRoom.round + 1).padStart(2, '0')}`;
    $('[data-live-event-title]').textContent = event.title;
    $('[data-live-event-copy]').textContent = event.copy;
    $('[data-live-signals]').innerHTML = event.signals.map(signal => `<span>${signal}</span>`).join('');
  }

  function renderTurn() {
    $('[data-online-lobby]').hidden = true;
    $('[data-online-game]').hidden = false;
    hideOnlinePanels();
    renderEvent();
    const me = onlineRoom.players[myUid];
    $('[data-my-name]').textContent = `${me.nickname} · ${game.scoreLabel} ${Math.round(me.score || 100)}점`;
    if (submittedRound === onlineRoom.round) {
      $('[data-online-waiting]').hidden = false;
      $('[data-submitted-count]').textContent = onlineRoom.submittedCount || 1;
      $('[data-total-count]').textContent = playersArray().length;
      return;
    }
    $('[data-online-choice]').hidden = false;
    selectedStrategy = null;
    $('[data-submit-live]').disabled = true;
    $('[data-live-strategies]').innerHTML = game.strategies.map((strategy, index) => `<button class="strategy-card" type="button" data-live-strategy="${strategy.id}"><span>STRATEGY ${String(index + 1).padStart(2, '0')}</span><b>${strategy.name}</b><p>${strategy.copy}</p><small>${strategy.facts}</small></button>`).join('');
    document.querySelectorAll('[data-live-strategy]').forEach(button => button.addEventListener('click', () => {
      selectedStrategy = button.dataset.liveStrategy;
      document.querySelectorAll('[data-live-strategy]').forEach(item => item.classList.toggle('selected', item === button));
      $('[data-submit-live]').disabled = false;
    }));
  }

  async function submitChoice() {
    if (!selectedStrategy) return;
    $('[data-submit-live]').disabled = true;
    await realtime.submitChoice(roomCode, onlineRoom.round, selectedStrategy);
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
      const strategyId = choices[player.uid] && choices[player.uid].strategyId;
      const delta = Number(event.payoffs[strategyId]) || 0;
      const score = (player.score || 100) + delta;
      results[player.uid] = { strategyId, delta, score };
      patch[`players/${player.uid}/score`] = score;
    });
    patch.results = results;
    await realtime.hostUpdate(roomCode, patch);
    settling = false;
  }

  function rankedResults() {
    const results = onlineRoom.results || {};
    return playersArray().map(player => ({ ...player, result: results[player.uid] || { delta: 0, score: player.score || 100 } })).sort((a, b) => b.result.score - a.result.score);
  }

  function strategyName(id) { return game.strategies.find(strategy => strategy.id === id)?.name || '선택 없음'; }

  function resultRows(final) {
    return rankedResults().map((player, index) => `<div class="rank-row"><span>${String(index + 1).padStart(2, '0')}</span><b>${player.nickname}</b><small>${final ? game.scoreLabel : `${strategyName(player.result.strategyId)} · ${player.result.delta >= 0 ? '+' : ''}${player.result.delta}점`}</small><strong class="${player.result.delta >= 0 ? 'gain' : 'loss'}">${Math.round(player.result.score)}점</strong></div>`).join('');
  }

  function renderReveal() {
    $('[data-online-lobby]').hidden = true;
    $('[data-online-game]').hidden = false;
    hideOnlinePanels();
    renderEvent();
    const event = currentEvent();
    $('[data-online-reveal]').hidden = false;
    $('[data-online-result-round]').textContent = `ROUND ${String(onlineRoom.round + 1).padStart(2, '0')} · ${game.title}`;
    $('[data-online-payoffs]').innerHTML = game.strategies.map(strategy => { const value = event.payoffs[strategy.id]; return `<div class="payoff-card"><span>${strategy.name}</span><strong class="${value >= 0 ? 'up' : 'down'}">${value >= 0 ? '+' : ''}${value}점</strong></div>`; }).join('');
    $('[data-online-ranking]').innerHTML = resultRows(false);
    $('[data-online-explain]').textContent = event.explain;
    $('[data-online-formula]').textContent = event.formula;
    $('[data-host-next]').hidden = !isHost;
    $('[data-host-next]').innerHTML = onlineRoom.round === game.events.length - 1 ? '최종 결과 보기 <span>→</span>' : '다음 경제 사건 보기 <span>→</span>';
    $('[data-next-wait]').hidden = isHost;
  }

  function renderFinal() {
    $('[data-online-lobby]').hidden = true;
    $('[data-online-game]').hidden = false;
    hideOnlinePanels();
    $('.online-news').hidden = true;
    $('[data-online-final]').hidden = false;
    const ranked = rankedResults();
    $('[data-online-final-game]').textContent = `${game.title} · 최종 결과`;
    $('[data-online-winner]').textContent = ranked[0].nickname;
    $('[data-online-final-copy]').textContent = `승리 조건은 ‘${game.victory}’입니다. 사건에 따라 유리한 전략이 달라졌습니다.`;
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
    const patch = { status: 'turn', round: 0, submittedCount: 0, results: null, eventOrder: seededOrder(game.events.length, roomCode) };
    playersArray().forEach(player => { patch[`players/${player.uid}/score`] = 100; });
    submittedRound = null;
    await realtime.hostUpdate(roomCode, patch);
  }

  async function hostNext() {
    if (!isHost) return;
    if (onlineRoom.round === game.events.length - 1) { await realtime.hostUpdate(roomCode, { status: 'final' }); return; }
    await realtime.clearRoundChoices(roomCode, onlineRoom.round);
    submittedRound = null;
    await realtime.hostUpdate(roomCode, { status: 'turn', round: onlineRoom.round + 1, results: null, submittedCount: 0 });
  }

  async function hostRematch() {
    if (!isHost) return;
    await realtime.clearRoundChoices(roomCode, onlineRoom.round);
    submittedRound = null;
    const patch = { status: 'turn', round: 0, results: null, submittedCount: 0, eventOrder: seededOrder(game.events.length, `${roomCode}${Date.now()}`) };
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
    $('[data-game-select]').innerHTML = catalog.map(item => `<option value="${item.id}">${item.number} · ${item.title}</option>`).join('');
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
