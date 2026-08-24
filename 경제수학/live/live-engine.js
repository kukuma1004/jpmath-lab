(function () {
  const assets = ['deposit', 'bond', 'stock', 'fx'];

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

  function seededOrder(items, seedText) {
    let seed = Array.from(seedText).reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 2166136261);
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i -= 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const j = seed % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function createRoom(names, roomCode) {
    const game = window.JPEconomyGames.investmentKing;
    return {
      version: 2,
      roomCode,
      gameId: game.id,
      round: 0,
      phase: 'turn',
      currentPlayer: 0,
      market: { rate: 3.5, inflation: 2.1, growth: 2.8, exchange: 1320 },
      players: names.map((name, index) => ({ id: index + 1, name, money: game.startingMoney, history: [], choice: null })),
      events: seededOrder(game.events, roomCode).slice(0, game.rounds).map(event => event.id)
    };
  }

  function getEvent(room) {
    const game = window.JPEconomyGames.investmentKing;
    const id = room.events[room.round];
    return game.events.find(event => event.id === id) || game.events[room.round % game.events.length];
  }

  function previewMarket(market, event) {
    return {
      rate: clamp(market.rate + event.delta.rate, 0.5, 9),
      inflation: clamp(market.inflation + event.delta.inflation, -1, 9),
      growth: clamp(market.growth + event.delta.growth, -5, 8),
      exchange: Math.round(market.exchange * (1 + event.delta.exchangePct / 100))
    };
  }

  function getReturns(market, previousMarket, event) {
    const rateChange = market.rate - previousMarket.rate;
    const inflationPressure = Math.max(0, market.inflation - 3);
    return {
      deposit: clamp(market.rate - market.inflation * 0.25, -1, 8),
      bond: clamp(3.2 - rateChange * 6 + event.delta.bondBoost - market.inflation * 0.15, -7, 10),
      stock: clamp(market.growth * 1.25 - rateChange * 3.5 - inflationPressure * 0.8 + event.delta.stockBoost, -9, 13),
      fx: clamp(event.delta.exchangePct, -8, 10)
    };
  }

  function settleRound(room) {
    const event = getEvent(room);
    const previousMarket = { ...room.market };
    room.market = previewMarket(room.market, event);
    const returns = getReturns(room.market, previousMarket, event);

    room.players.forEach(player => {
      const allocation = player.choice.allocation;
      const weightedReturn = assets.reduce((sum, asset) => sum + allocation[asset] / 100 * returns[asset], 0);
      const before = player.money;
      player.money = Math.round(before * (1 + weightedReturn / 100));
      player.history.push({
        round: room.round + 1,
        before,
        after: player.money,
        weightedReturn,
        strategy: player.choice.id,
        allocation: { ...allocation },
        question: player.choice.question || '',
        reason: player.choice.reason || ''
      });
      player.choice = null;
    });
    room.lastReturns = returns;
    room.phase = 'reveal';
    return room;
  }

  function rankedPlayers(room) { return room.players.slice().sort((a, b) => b.money - a.money); }

  window.JPEconomyLiveEngine = { createRoom, getEvent, previewMarket, settleRound, rankedPlayers };
}());
