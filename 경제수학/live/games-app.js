(function () {
  const catalog = window.JPEconomyGameCatalog;
  const $ = selector => document.querySelector(selector);
  const storageKey = 'jp-economy-seven-games-v1';
  let game = catalog.find(item => item.id === new URLSearchParams(location.search).get('game')) || catalog.find(item => item.id === 'currency-war') || catalog[0];
  let room = null;
  let selectedStrategy = null;

  function seededOrder(items, seedText) {
    let seed = Array.from(seedText).reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 2166136261);
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const target = seed % (index + 1);
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function makeCode() {
    const buffer = new Uint32Array(1);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(buffer);
    else buffer[0] = Math.floor(Math.random() * 999999);
    return String(100000 + buffer[0] % 900000);
  }

  function saveRoom() { if (room) localStorage.setItem(storageKey, JSON.stringify(room)); }
  function clearRoom() { room = null; localStorage.removeItem(storageKey); }
  function currentEvent() {
    const key = room.eventOrder[room.round];
    return typeof key === 'number' ? game.events[key] : game.events.find(event => event.id === key) || game.events[room.round];
  }
  function formatScore(value) { return `${Math.round(value)}점`; }

  function renderCatalog() {
    $('[data-game-catalog]').innerHTML = catalog.map(item => `
      <button class="catalog-card" type="button" data-game="${item.id}" style="--game-accent:${item.accent}">
        <span>${item.number} · ${item.domain}</span><h3>${item.title}</h3><p>${item.subtitle}</p><b>${item.victory}</b><i>체험하기 →</i>
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

  function startGame() {
    const names = Array.from(document.querySelectorAll('[data-player-inputs] input')).map(input => input.value.trim()).filter(Boolean);
    const error = $('[data-form-error]');
    if (names.length < 2) { error.textContent = '두 명 이상의 닉네임을 입력해 주세요.'; error.hidden = false; return; }
    if (new Set(names).size !== names.length) { error.textContent = '서로 다른 닉네임을 사용해 주세요.'; error.hidden = false; return; }
    error.hidden = true;
    const code = makeCode();
    room = {
      version: 1, gameId: game.id, code, round: 0, phase: 'turn', currentPlayer: 0,
      eventOrder: seededOrder(game.events, code).map(event => event.id || game.events.indexOf(event)),
      players: names.map((name, index) => ({ id: index + 1, name, score: 100, history: [], choice: null }))
    };
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

  function renderRound() {
    const event = currentEvent();
    $('[data-round]').textContent = room.round + 1;
    $('[data-meter]').style.setProperty('--progress', `${(room.round + 1) / game.events.length * 100}%`);
    $('[data-news-round]').textContent = `ROUND ${String(room.round + 1).padStart(2, '0')}`;
    $('[data-event-title]').textContent = event.title;
    $('[data-event-copy]').textContent = event.copy;
    $('[data-signals]').innerHTML = event.signals.map(signal => `<span>${signal}</span>`).join('');
  }

  function renderTurn() {
    room.phase = 'turn';
    hidePanels();
    renderRound();
    selectedStrategy = null;
    const player = room.players[room.currentPlayer];
    $('[data-current-name]').textContent = player.name;
    $('[data-gate]').hidden = false;
    saveRoom();
  }

  function openDecision() {
    const player = room.players[room.currentPlayer];
    $('[data-gate]').hidden = true;
    $('[data-decision]').hidden = false;
    $('[data-player-label]').textContent = `${room.currentPlayer + 1}번째 결정 · ${player.name}`;
    $('[data-score-label]').textContent = `${game.scoreLabel} ${formatScore(player.score)}`;
    selectedStrategy = null;
    $('[data-lock]').disabled = true;
    renderStrategies();
  }

  function renderStrategies() {
    $('[data-strategies]').innerHTML = game.strategies.map((strategy, index) => `
      <button class="strategy-card${selectedStrategy && selectedStrategy.id === strategy.id ? ' selected' : ''}" type="button" data-strategy="${strategy.id}">
        <span>STRATEGY ${String(index + 1).padStart(2, '0')}</span><b>${strategy.name}</b><p>${strategy.copy}</p><small>${strategy.facts}</small>
      </button>`).join('');
    document.querySelectorAll('[data-strategy]').forEach(button => button.addEventListener('click', () => {
      selectedStrategy = game.strategies.find(strategy => strategy.id === button.dataset.strategy);
      $('[data-lock]').disabled = false;
      renderStrategies();
    }));
  }

  function lockChoice() {
    if (!selectedStrategy) return;
    room.players[room.currentPlayer].choice = selectedStrategy.id;
    room.currentPlayer += 1;
    selectedStrategy = null;
    if (room.currentPlayer < room.players.length) renderTurn();
    else settleRound();
  }

  function settleRound() {
    const event = currentEvent();
    room.players.forEach(player => {
      const delta = Number(event.payoffs[player.choice]) || 0;
      player.score += delta;
      player.history.push({ round: room.round + 1, strategy: player.choice, delta, score: player.score });
      player.choice = null;
    });
    room.phase = 'reveal';
    saveRoom();
    renderReveal();
  }

  function ranked() { return room.players.slice().sort((a, b) => b.score - a.score); }
  function strategyName(id) { return game.strategies.find(strategy => strategy.id === id)?.name || id; }

  function rankRows(players, final) {
    return players.map((player, index) => {
      const last = player.history[player.history.length - 1];
      const detail = final ? `누적 ${player.history.length}라운드` : `${strategyName(last.strategy)} · ${last.delta >= 0 ? '+' : ''}${last.delta}점`;
      return `<div class="rank-row"><span>${String(index + 1).padStart(2, '0')}</span><b>${player.name}</b><small>${detail}</small><strong class="${!last || last.delta >= 0 ? 'gain' : 'loss'}">${formatScore(player.score)}</strong></div>`;
    }).join('');
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
      return `<div class="payoff-card"><span>${strategy.name}</span><strong class="${value >= 0 ? 'up' : 'down'}">${value >= 0 ? '+' : ''}${value}점</strong></div>`;
    }).join('');
    $('[data-ranking]').innerHTML = rankRows(ranked(), false);
    $('[data-explain]').textContent = event.explain;
    $('[data-formula]').textContent = event.formula;
    $('[data-next]').innerHTML = room.round === game.events.length - 1 ? '최종 결과 보기 <span>→</span>' : '다음 경제 사건 보기 <span>→</span>';
    saveRoom();
  }

  function nextRound() {
    if (room.round === game.events.length - 1) { room.phase = 'final'; saveRoom(); renderFinal(); return; }
    room.round += 1;
    room.currentPlayer = 0;
    renderTurn();
    $('.arena-news').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function renderFinal() {
    hidePanels();
    room.phase = 'final';
    $('.arena-news').hidden = true;
    $('[data-final]').hidden = false;
    const players = ranked();
    $('[data-final-game]').textContent = `${game.title} · 최종 결과`;
    $('[data-winner]').textContent = players[0].name;
    $('[data-final-copy]').textContent = `이번 게임의 승리 조건은 ‘${game.victory}’입니다. 사건이 달라지면 유리한 전략도 달라졌습니다.`;
    $('[data-final-ranking]').innerHTML = rankRows(players, true);
    saveRoom();
  }

  function rematch() {
    const names = room.players.map(player => player.name);
    const code = makeCode();
    room = { version: 1, gameId: game.id, code, round: 0, phase: 'turn', currentPlayer: 0, eventOrder: seededOrder(game.events, code).map(event => event.id || game.events.indexOf(event)), players: names.map((name, index) => ({ id: index + 1, name, score: 100, history: [], choice: null })) };
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
      if (!saved || !savedGame || !Array.isArray(saved.players)) return;
      game = savedGame;
      room = saved;
      selectGame(game.id, false);
      openRoom();
    } catch (error) { localStorage.removeItem(storageKey); }
  }

  renderCatalog();
  selectGame(game.id, false);
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
