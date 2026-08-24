(function () {
  const game = window.JPEconomyGames.investmentKing;
  const engine = window.JPEconomyLiveEngine;
  const $ = selector => document.querySelector(selector);
  const money = value => `${Math.round(value).toLocaleString('ko-KR')}원`;
  const signed = value => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  const storageKey = 'jp-economy-live-room-v1';
  const assetMeta = {
    deposit: { name: '예금', color: '#1f6b50' },
    bond: { name: '채권', color: '#315f78' },
    stock: { name: '주식', color: '#d96f32' },
    fx: { name: '외화', color: '#8c6aa5' }
  };
  let room = null;
  let selectedStrategy = null;

  function saveRoom() {
    if (room) localStorage.setItem(storageKey, JSON.stringify(room));
  }

  function clearRoom() {
    localStorage.removeItem(storageKey);
    room = null;
  }

  function makeRoomCode() {
    if (window.crypto && crypto.getRandomValues) {
      const buffer = new Uint32Array(1);
      crypto.getRandomValues(buffer);
      return String(100000 + buffer[0] % 900000);
    }
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function updateFlow(step) {
    document.querySelectorAll('.live-flow li').forEach((item, index) => item.classList.toggle('active', index === step));
  }

  function addPlayerInput() {
    const wrapper = $('[data-player-inputs]');
    const count = wrapper.children.length;
    if (count >= 6) return;
    const label = document.createElement('label');
    label.innerHTML = `<span>${count + 1}</span><input type="text" maxlength="12" autocomplete="off" aria-label="참가자 ${count + 1} 닉네임" placeholder="수업용 별명">`;
    wrapper.append(label);
    label.querySelector('input').focus();
    $('[data-add-player]').hidden = count + 1 >= 6;
  }

  function startGame() {
    const names = Array.from(document.querySelectorAll('[data-player-inputs] input')).map(input => input.value.trim()).filter(Boolean);
    const error = $('[data-form-error]');
    if (names.length < 2) {
      error.textContent = '두 명 이상의 닉네임을 입력해 주세요.';
      error.hidden = false;
      return;
    }
    if (new Set(names).size !== names.length) {
      error.textContent = '서로 다른 닉네임을 사용해 주세요.';
      error.hidden = false;
      return;
    }
    error.hidden = true;
    room = engine.createRoom(names, makeRoomCode());
    saveRoom();
    openRoom();
  }

  function openRoom() {
    $('[data-lobby]').hidden = true;
    $('[data-game-room]').hidden = false;
    $('[data-room-code]').textContent = room.roomCode;
    if (room.phase === 'reveal') renderReveal();
    else if (room.phase === 'final') renderFinal();
    else renderTurn();
    $('[data-game-room]').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderMarket(market) {
    $('[data-rate]').textContent = `${market.rate.toFixed(1)}%`;
    $('[data-inflation]').textContent = `${market.inflation.toFixed(1)}%`;
    $('[data-growth]').textContent = `${market.growth.toFixed(1)}%`;
    $('[data-exchange]').textContent = `${Math.round(market.exchange).toLocaleString('ko-KR')}원`;
  }

  function renderRoundHeader() {
    const event = engine.getEvent(room);
    const preview = engine.previewMarket(room.market, event);
    $('[data-round-number]').textContent = room.round + 1;
    $('[data-round-meter]').style.setProperty('--progress', `${(room.round + 1) / game.rounds * 100}%`);
    renderMarket(preview);
    $('[data-news-time]').textContent = `ROUND ${String(room.round + 1).padStart(2, '0')}`;
    $('[data-event-title]').textContent = event.title;
    $('[data-event-copy]').textContent = event.copy;
    $('[data-signals]').innerHTML = event.signals.map(signal => `<span>${signal}</span>`).join('');
  }

  function hidePlayPanels() {
    $('[data-turn-gate]').hidden = true;
    $('[data-decision]').hidden = true;
    $('[data-reveal]').hidden = true;
    $('[data-final]').hidden = true;
    $('[data-news-card]').hidden = false;
  }

  function renderTurn() {
    room.phase = 'turn';
    hidePlayPanels();
    renderRoundHeader();
    updateFlow(room.currentPlayer ? 1 : 0);
    const player = room.players[room.currentPlayer];
    $('[data-current-name]').textContent = player.name;
    $('[data-turn-gate]').hidden = false;
    selectedStrategy = null;
    saveRoom();
  }

  function openDecision() {
    const player = room.players[room.currentPlayer];
    $('[data-turn-gate]').hidden = true;
    $('[data-decision]').hidden = false;
    $('[data-decision-player]').textContent = `${room.currentPlayer + 1}번째 결정 · ${player.name}`;
    $('[data-player-money]').textContent = money(player.money);
    $('[data-lock]').disabled = true;
    renderStrategies();
    renderAllocation(null);
    updateFlow(1);
  }

  function renderStrategies() {
    $('[data-strategies]').innerHTML = game.strategies.map((strategy, index) => `
      <button class="strategy-card${selectedStrategy && selectedStrategy.id === strategy.id ? ' selected' : ''}" type="button" data-strategy="${strategy.id}">
        <span>STRATEGY ${String(index + 1).padStart(2, '0')}</span><b>${strategy.name}</b><p>${strategy.copy}</p>
        <small>${Object.entries(strategy.allocation).map(([key, value]) => `${assetMeta[key].name} ${value}%`).join(' · ')}</small>
      </button>`).join('');
    document.querySelectorAll('[data-strategy]').forEach(button => button.addEventListener('click', () => chooseStrategy(button.dataset.strategy)));
  }

  function chooseStrategy(id) {
    selectedStrategy = game.strategies.find(strategy => strategy.id === id);
    renderStrategies();
    renderAllocation(selectedStrategy.allocation);
    $('[data-lock]').disabled = false;
  }

  function renderAllocation(allocation) {
    const values = allocation || { deposit: 0, bond: 0, stock: 0, fx: 0 };
    $('[data-allocation-bars]').innerHTML = Object.entries(values).map(([key, value]) => `
      <div><span>${assetMeta[key].name}</span><i><span style="--w:${value}%;--bar-color:${assetMeta[key].color}"></span></i><b>${value}%</b></div>`).join('');
  }

  function lockChoice() {
    if (!selectedStrategy) return;
    room.players[room.currentPlayer].choice = {
      id: selectedStrategy.id,
      name: selectedStrategy.name,
      allocation: { ...selectedStrategy.allocation }
    };
    room.currentPlayer += 1;
    selectedStrategy = null;
    if (room.currentPlayer < room.players.length) renderTurn();
    else {
      engine.settleRound(room);
      saveRoom();
      renderReveal();
    }
  }

  function renderReturns() {
    $('[data-return-board]').innerHTML = Object.entries(room.lastReturns).map(([key, value]) => `
      <div><span>${assetMeta[key].name} 라운드 수익률</span><strong class="${value >= 0 ? 'positive' : 'negative'}">${signed(value)}</strong></div>`).join('');
  }

  function rankRows(players, final) {
    return players.map((player, index) => {
      const last = player.history[player.history.length - 1];
      const change = last ? last.after - last.before : 0;
      return `<div class="rank-row"><span>${String(index + 1).padStart(2, '0')}</span><b>${player.name}</b><small>${final ? `누적 ${player.history.length}라운드` : `${last.strategy === 'safe' ? '안정 방어형' : last.strategy === 'balanced' ? '균형 분산형' : last.strategy === 'growth' ? '성장 집중형' : '환율 방어형'} · ${change >= 0 ? '+' : ''}${money(change)}`}</small><strong class="${change >= 0 ? 'gain' : 'loss'}">${money(player.money)}</strong></div>`;
    }).join('');
  }

  function renderReveal() {
    hidePlayPanels();
    room.phase = 'reveal';
    renderRoundHeader();
    renderMarket(room.market);
    $('[data-reveal]').hidden = false;
    $('[data-reveal-round]').textContent = String(room.round + 1).padStart(2, '0');
    renderReturns();
    $('[data-ranking]').innerHTML = rankRows(engine.rankedPlayers(room), false);
    const event = engine.getEvent(room);
    $('[data-explain-title]').textContent = event.explainTitle;
    $('[data-explain-copy]').textContent = event.explainCopy;
    $('[data-explain-formula]').textContent = event.formula;
    $('[data-next-round]').innerHTML = room.round === game.rounds - 1 ? '최종 결과 보기 <span>→</span>' : '다음 경제 뉴스 보기 <span>→</span>';
    updateFlow(3);
    saveRoom();
  }

  function nextRound() {
    if (room.round === game.rounds - 1) {
      room.phase = 'final';
      saveRoom();
      renderFinal();
      return;
    }
    room.round += 1;
    room.currentPlayer = 0;
    room.phase = 'turn';
    saveRoom();
    renderTurn();
    $('[data-news-card]').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function renderFinal() {
    hidePlayPanels();
    room.phase = 'final';
    $('[data-news-card]').hidden = true;
    $('[data-final]').hidden = false;
    const ranked = engine.rankedPlayers(room);
    $('[data-winner]').textContent = ranked[0].name;
    $('[data-final-ranking]').innerHTML = rankRows(ranked, true);
    updateFlow(4);
    saveRoom();
  }

  function rematch() {
    const names = room.players.map(player => player.name);
    room = engine.createRoom(names, makeRoomCode());
    saveRoom();
    renderTurn();
    $('[data-game-room]').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function leaveRoom() {
    if (!window.confirm('현재 게임을 끝내고 참가자 입력 화면으로 돌아갈까요?')) return;
    clearRoom();
    $('[data-game-room]').hidden = true;
    $('[data-lobby]').hidden = false;
    updateFlow(0);
    $('[data-lobby]').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function restoreRoom() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved || saved.version !== 1 || !Array.isArray(saved.players) || !saved.players.length) return;
      room = saved;
      openRoom();
    } catch (error) {
      localStorage.removeItem(storageKey);
    }
  }

  $('[data-add-player]').addEventListener('click', addPlayerInput);
  $('[data-start]').addEventListener('click', startGame);
  $('[data-open-decision]').addEventListener('click', openDecision);
  $('[data-lock]').addEventListener('click', lockChoice);
  $('[data-next-round]').addEventListener('click', nextRound);
  $('[data-rematch]').addEventListener('click', rematch);
  $('[data-leave]').addEventListener('click', leaveRoom);
  restoreRoom();
}());
