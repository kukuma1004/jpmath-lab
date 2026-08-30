(function () {
  const game = window.JPEconomyGames.investmentKing;
  const engine = window.JPEconomyLiveEngine;
  const toolkit = window.JPEconomyMathToolkit;
  const motion = window.JPEconomyMotion;
  const $ = selector => document.querySelector(selector);
  const money = value => `${Math.round(value).toLocaleString('ko-KR')}원`;
  const signed = value => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  const storageKey = 'jp-economy-live-room-v4';
  const assetMeta = {
    deposit: { name: '예금', color: '#1f6b50', hint: '금리 수익 · 낮은 변동' },
    bond: { name: '채권', color: '#315f78', hint: '금리와 반대 방향의 가격 변화' },
    stock: { name: '주식', color: '#d96f32', hint: '성장 기대 · 높은 변동' },
    fx: { name: '외화', color: '#8c6aa5', hint: '원·달러 환율 변화' }
  };
  let room = null;
  let selectedAllocation = null;
  let selectedQuestion = '';
  let selectedTools = new Set();
  let toolkitController = null;
  let announcedRound = null;
  let lastNewsKey = null;
  let lastRevealKey = null;

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

  // 화면이 바뀌면 그 화면의 처음으로 데려간다.
  // 선택 화면은 길어서, 아래쪽 버튼을 누르면 문서가 크게 짧아진다. 브라우저는
  // 스크롤을 그대로 두므로 다음 안내가 화면 위로 밀려나고, 학생은 빈 곳을
  // 보다가 다시 올려야 했다. 이동 거리가 커서 부드럽게 굴리면 오히려 느리다.
  function focusStage(target){
    const el = target || $('[data-game-room]');
    if (!el || el.hidden) return;
    const box = document.scrollingElement || document.documentElement;
    const top = Math.max(0, window.scrollY + el.getBoundingClientRect().top - 72);
    const keep = box.style.scrollBehavior;
    box.style.scrollBehavior = 'auto';
    box.scrollTop = top;
    box.style.scrollBehavior = keep;
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
    $('[data-round-total]').textContent = game.rounds;
    $('[data-round-meter]').style.setProperty('--progress', `${(room.round + 1) / game.rounds * 100}%`);
    renderMarket(preview);
    $('[data-news-time]').textContent = `ROUND ${String(room.round + 1).padStart(2, '0')} · ${event.roundType}`;
    $('[data-event-title]').textContent = event.title;
    $('[data-event-copy]').textContent = event.copy;
    $('[data-signals]').innerHTML = event.signals.map(signal => `<span>${signal}</span>`).join('');
    const newsKey = `${room.round}-${event.id}`;
    if (lastNewsKey !== newsKey) { lastNewsKey = newsKey; motion.enter($('[data-news-card]')); }
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
    selectedAllocation = null;
    selectedQuestion = '';
    selectedTools = new Set();
    if (room.currentPlayer === 0 && announcedRound !== room.round) {
      announcedRound = room.round;
      motion.announceRound(room.round, game.title, room.round === game.rounds - 1 ? 'FINAL ROUND' : 'MARKET OPEN');
    }
    saveRoom();
      focusStage();
  }

  function openDecision() {
    const player = room.players[room.currentPlayer];
    const previous = player.history[player.history.length - 1];
    $('[data-turn-gate]').hidden = true;
    $('[data-decision]').hidden = false;
    $('[data-decision-player]').textContent = `${room.currentPlayer + 1}번째 결정 · ${player.name}`;
    $('[data-player-money]').textContent = money(player.money);
    selectedAllocation = previous && previous.allocation
      ? { ...previous.allocation }
      : { deposit: 25, bond: 25, stock: 25, fx: 25 };
    selectedQuestion = questionForPlayer(engine.getEvent(room), player);
    $('[data-decision-question]').textContent = selectedQuestion;
    selectedTools = new Set();
    toolkitController = toolkit.mount($('[data-math-toolkit]'), {
      game,
      round: room.round,
      event: engine.getEvent(room),
      onUse: (id, tools) => { selectedTools = new Set(tools); }
    });
    renderAllocationControls();
    renderAllocation();
    updateFlow(1);
  }

  function questionForPlayer(event, player) {
    if (event.question) return event.question;
    const questions = event.questions && event.questions.length ? event.questions : ['어떤 지표를 가장 중요하게 보고 이 비율을 정했나요?'];
    const seed = `${room.roomCode}-${room.round}-${player.id}-${event.id}`;
    const value = Array.from(seed).reduce((sum, char) => (sum * 33 + char.charCodeAt(0)) >>> 0, 5381);
    return questions[value % questions.length];
  }

  function allocationTotal() {
    return Object.values(selectedAllocation || {}).reduce((sum, value) => sum + Number(value || 0), 0);
  }

  // 한 자산을 움직이면 나머지가 현재 비중에 비례해 자동으로 조정되어
  // 합계는 항상 100%가 된다. 네 개를 따로 맞출 필요가 없다.
  function setShare(key, next) {
    const keys = Object.keys(assetMeta);
    const others = keys.filter(k => k !== key);
    next = Math.max(0, Math.min(100, Math.round(next)));
    const remain = 100 - next;
    const prev = others.map(k => Math.max(0, Number(selectedAllocation[k]) || 0));
    const prevSum = prev.reduce((s, v) => s + v, 0);
    const raw = prevSum > 0
      ? prev.map(v => v / prevSum * remain)
      : prev.map(() => remain / others.length);
    const out = { [key]: next };
    let acc = 0;
    raw.forEach((v, i) => { const r = Math.floor(v); out[others[i]] = r; acc += r; });
    // 내림하고 남은 몫은 소수 부분이 큰 자산부터 1%씩 돌려준다
    const order = others
      .map((k, i) => [k, raw[i] - Math.floor(raw[i])])
      .sort((a, b) => b[1] - a[1]);
    for (let left = remain - acc, i = 0; left > 0; left -= 1, i += 1) out[order[i % order.length][0]] += 1;
    selectedAllocation = out;
  }

  // 한 번에 한 가지 전략을 고르고 거기서부터 다듬는다
  const allocationPresets = [
    { id: 'safe', name: '안정형', hint: '예금·채권 중심', allocation: { deposit: 45, bond: 35, stock: 10, fx: 10 } },
    { id: 'balanced', name: '균형형', hint: '네 자산 고르게', allocation: { deposit: 25, bond: 25, stock: 25, fx: 25 } },
    { id: 'growth', name: '공격형', hint: '주식 비중을 높게', allocation: { deposit: 10, bond: 15, stock: 55, fx: 20 } },
    { id: 'hedge', name: '환분산형', hint: '외화로 위험 분산', allocation: { deposit: 20, bond: 25, stock: 20, fx: 35 } }
  ];

  function renderAllocationControls() {
    $('[data-allocation-controls]').innerHTML = `
      <div class="allocation-presets" role="group" aria-label="배분 전략 고르기">
        <span class="allocation-presets-label">빠른 시작</span>
        ${allocationPresets.map(p => `<button type="button" class="allocation-preset" data-allocation-preset="${p.id}"><b>${p.name}</b><small>${p.hint}</small></button>`).join('')}
      </div>
      ${Object.entries(assetMeta).map(([key, meta]) => `
      <article class="allocation-control" style="--asset-color:${meta.color}">
        <header><div><span>${meta.name}</span><small>${meta.hint}</small></div><output data-allocation-output="${key}">${selectedAllocation[key]}%</output></header>
        <div class="allocation-input-row">
          <button type="button" data-allocation-step="${key}" data-step="-5" aria-label="${meta.name} 5% 줄이기">−</button>
          <input type="range" min="0" max="100" step="1" value="${selectedAllocation[key]}" data-allocation-input="${key}" aria-label="${meta.name} 배분 비율">
          <button type="button" data-allocation-step="${key}" data-step="5" aria-label="${meta.name} 5% 늘리기">＋</button>
        </div>
      </article>`).join('')}`;

    document.querySelectorAll('[data-allocation-input]').forEach(input => input.addEventListener('input', () => {
      setShare(input.dataset.allocationInput, Number(input.value));
      renderAllocation();
    }));
    document.querySelectorAll('[data-allocation-step]').forEach(button => button.addEventListener('click', () => {
      const key = button.dataset.allocationStep;
      setShare(key, (Number(selectedAllocation[key]) || 0) + Number(button.dataset.step));
      renderAllocation();
    }));
    document.querySelectorAll('[data-allocation-preset]').forEach(button => button.addEventListener('click', () => {
      const preset = allocationPresets.find(p => p.id === button.dataset.allocationPreset);
      if (!preset) return;
      selectedAllocation = { ...preset.allocation };
      renderAllocation();
    }));
  }

  // 합계가 항상 100%이므로, 남은 %를 알려 주는 대신 지금 고른 배분이
  // 어떤 성격인지 한 줄로 읽어 준다.
  function allocationReading(values) {
    const risky = (values.stock || 0) + (values.fx || 0);
    const top = Object.entries(values).sort((a, b) => b[1] - a[1])[0];
    const shape = risky >= 60 ? '변동이 큰 자산에 무게를 실었습니다.'
      : risky <= 25 ? '변동을 줄이고 안정에 무게를 두었습니다.'
      : '안정과 성장을 절반씩 잡았습니다.';
    return `${assetMeta[top[0]].name} ${top[1]}%가 가장 큽니다 · ${shape}`;
  }

  function renderAllocation() {
    const values = selectedAllocation || { deposit: 0, bond: 0, stock: 0, fx: 0 };
    const total = allocationTotal();
    const chart = $('[data-allocation-chart]');
    let cumulative = 0;
    Object.entries(values).forEach(([key, value], index) => {
      cumulative += value;
      chart.style.setProperty(`--stop-${index + 1}`, `${Math.min(100, cumulative)}%`);
      const input = document.querySelector(`[data-allocation-input="${key}"]`);
      const output = document.querySelector(`[data-allocation-output="${key}"]`);
      if (input) input.value = value;
      if (output) output.textContent = `${value}%`;
    });
    $('[data-allocation-bars]').innerHTML = Object.entries(values).map(([key, value]) => `
      <div><span>${assetMeta[key].name}</span><i><span style="--w:${value}%;--bar-color:${assetMeta[key].color}"></span></i><b>${value}%</b></div>`).join('');
    $('[data-allocation-total]').textContent = `${total}%`;
    $('[data-allocation-total-label]').textContent = `합계 ${total}%`;
    const status = $('[data-allocation-status]');
    status.className = total === 100 ? 'is-ready' : 'needs-work';
    status.textContent = total === 100
      ? allocationReading(values)
      : `합계가 ${total}%입니다. 전략을 다시 골라 주세요.`;
    updateLockState();
  }

  function updateLockState() {
    $('[data-lock]').disabled = allocationTotal() !== 100;
  }

  function lockChoice() {
    if (!selectedAllocation || allocationTotal() !== 100) return;
    room.players[room.currentPlayer].choice = {
      id: 'custom',
      name: '직접 배분',
      allocation: { ...selectedAllocation },
      question: selectedQuestion,
      tools: toolkitController ? toolkitController.getUsedTools() : Array.from(selectedTools)
    };
    room.currentPlayer += 1;
    selectedAllocation = null;
    selectedQuestion = '';
    if (room.currentPlayer < room.players.length) renderTurn();
    else {
      engine.settleRound(room);
      saveRoom();
      renderReveal();
    }
  }

  function renderReturns() {
    $('[data-return-board]').innerHTML = Object.entries(room.lastReturns).map(([key, value]) => `
      <div><span>${assetMeta[key].name} 라운드 수익률</span><strong class="${value >= 0 ? 'positive' : 'negative'}" data-return-value="${value}">${signed(value)}</strong></div>`).join('');
    document.querySelectorAll('[data-return-value]').forEach(element => motion.count(element, Number(element.dataset.returnValue), signed, 720));
  }

  function rankRows(players, final) {
    return players.map((player, index) => {
      const last = player.history[player.history.length - 1];
      const change = last ? last.after - last.before : 0;
      const focus = last && last.allocation
        ? Object.entries(last.allocation).sort((a, b) => b[1] - a[1])[0]
        : ['deposit', 0];
      const decision = `${assetMeta[focus[0]].name} ${focus[1]}% 중심`;
      return `<div class="rank-row"><span>${String(index + 1).padStart(2, '0')}</span><b>${player.name}</b><small>${final ? `누적 ${player.history.length}라운드 · 마지막 ${decision}` : `${decision} · ${change >= 0 ? '+' : ''}${money(change)}`}</small><strong class="${change >= 0 ? 'gain' : 'loss'}">${money(player.money)}</strong></div>`;
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
    // 각자의 배분(바닥)과 시장 수익률(높이)을 한 장면으로 겹쳐 보여 준다
    if (window.JPResultScene) window.JPResultScene.render($('[data-result-city]'), {
      players: room.players,
      readPlayer(player) {
        const last = player.history[player.history.length - 1] || {};
        const alloc = last.allocation || {};
        return {
          name: player.name,
          value: last.weightedReturn || 0,
          label: signed(last.weightedReturn || 0),
          items: Object.keys(assetMeta).map(k => ({
            key: k, name: assetMeta[k].name, color: assetMeta[k].color,
            alloc: alloc[k] || 0, ret: room.lastReturns[k] || 0
          }))
        };
      }
    });
    $('[data-ranking]').innerHTML = rankRows(engine.rankedPlayers(room), false);
    const event = engine.getEvent(room);
    $('[data-explain-title]').textContent = event.explainTitle;
    $('[data-explain-copy]').textContent = event.explainCopy;
    $('[data-explain-formula]').textContent = event.formula;
    const used = new Set(room.players.flatMap(player => (player.history[player.history.length - 1] || {}).tools || []));
    $('[data-tools-used]').innerHTML = used.size ? Array.from(used).map(id => `<b>${toolkit.label(id)}</b>`).join('') : '<small>이번 라운드는 수학 도구 없이 판단했습니다.</small>';
    $('[data-next-round]').innerHTML = room.round === game.rounds - 1 ? '최종 결과 보기 <span>→</span>' : '다음 경제 뉴스 보기 <span>→</span>';
    updateFlow(3);
    const revealKey = `${room.round}-${event.id}`;
    if (lastRevealKey !== revealKey) { lastRevealKey = revealKey; motion.enter($('[data-reveal]')); }
    saveRoom();
      focusStage();
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

  // 한 층 = 그 라운드에 그 자산이 벌어준 돈 = 직전 자산 x 배분 x 수익률.
  // 돈으로 재면 라운드마다 더해지므로, 여덟 층을 더하면 실제로 늘어난 돈이 된다.
  // (수익률 %로 재면 복리라 더할 수 없다. 그래서 금액으로 쌓는다.)
  function skylineItems(player, returns) {
    const keys = Object.keys(assetMeta);
    const rounds = player.history.length || 1;
    const perRound = player.history.map(entry => {
      const rate = returns[entry.round - 1] || {};
      const raw = keys.map(key => entry.before * ((entry.allocation || {})[key] || 0) / 100 * (rate[key] || 0) / 100);
      const rawSum = raw.reduce((sum, value) => sum + value, 0);
      // 자산은 원 단위로 반올림되므로, 쪼갠 값의 합을 실제 증감에 맞춰 준다
      const actual = entry.after - entry.before;
      const fix = Math.abs(rawSum) > 1e-9 ? actual / rawSum : 0;
      return raw.map(value => value * fix);
    });
    return keys.map((key, index) => ({
      key, name: assetMeta[key].name, color: assetMeta[key].color,
      share: player.history.reduce((sum, entry) => sum + ((entry.allocation || {})[key] || 0), 0) / rounds,
      layers: perRound.map(values => values[index])
    }));
  }

  function renderFinal() {
    hidePlayPanels();
    room.phase = 'final';
    $('[data-news-card]').hidden = true;
    $('[data-final]').hidden = false;
    const ranked = engine.rankedPlayers(room);
    $('[data-winner]').textContent = ranked[0].name;
    const returns = engine.replayReturns(room);
    const start = (window.JPEconomyGames.investmentKing || {}).startingMoney || 10000000;
    if (window.JPResultScene) window.JPResultScene.renderSkyline($('[data-final-city]'), {
      players: ranked,
      step: 1,
      formatValue: value => `${value >= 0 ? '+' : '−'}${money(Math.abs(value))}`,
      readPlayer(player) {
        const gained = player.money - start;
        return {
          name: player.name, value: gained,
          label: `${gained >= 0 ? '+' : '−'}${money(Math.abs(gained))}`,
          items: skylineItems(player, returns)
        };
      }
    });
    $('[data-final-ranking]').innerHTML = rankRows(ranked, true);
    updateFlow(4);
    saveRoom();
      focusStage();
  }

  function rematch() {
    const names = room.players.map(player => player.name);
    room = engine.createRoom(names, makeRoomCode());
    announcedRound = null;
    lastNewsKey = null;
    lastRevealKey = null;
    $('[data-room-code]').textContent = room.roomCode;
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
      if (!saved || saved.version !== 4 || !Array.isArray(saved.players) || !saved.players.length) {
        localStorage.removeItem(storageKey);
        return;
      }
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
