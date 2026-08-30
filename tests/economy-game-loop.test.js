const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const sandbox = { window: {} };
vm.createContext(sandbox);
for (const file of ['경제수학/live/games.js', '경제수학/live/games-catalog.js', '경제수학/live/game-runtime.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
}

const investment = sandbox.window.JPEconomyGames.investmentKing;
const catalog = sandbox.window.JPEconomyGameCatalog;
const runtime = sandbox.window.JPEconomyGameRuntime;
assert.equal(investment.rounds, 8);
assert.equal(catalog.length, 7);
assert.equal(1 + catalog.length, 8);

for (const game of [investment, ...catalog]) {
  assert.ok(game.events.length >= 4, `${game.id}: 사건이 충분해야 함`);
  assert.ok(game.events.every(event => (event.questions || game.questions || []).length >= 3), `${game.id}: 발문이 3개 이상이어야 함`);
  const first = runtime.createScenario(game, 'first-play');
  const retry = runtime.createScenario(game, 'retry-play');
  assert.equal(first.length, 8, `${game.id}: 8라운드`);
  assert.equal(retry.length, 8, `${game.id}: 재경기도 8라운드`);
  assert.notDeepEqual(first, retry, `${game.id}: 재경기 사건·수치가 달라야 함`);
  const resolved = first.map((code, round) => runtime.resolveEvent(game, code, round));
  assert.equal(new Set(resolved.map(event => event.question)).size >= 3, true, `${game.id}: 라운드 발문 다양성`);
  assert.equal(new Set(resolved.map(event => event.factor)).size >= 2, true, `${game.id}: 수치 변화 다양성`);
}

const pages = [
  ['경제수학/live/index.html', '경제수학/live/app.js', 'economy-investment-king'],
  ['경제수학/live/games.html', '경제수학/live/games-app.js', 'economy-${game.id}'],
  ['경제수학/live/room.html', '경제수학/live/room-app.js', 'economy-live-${game.id}']
];
for (const [htmlFile, jsFile, gameId] of pages) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const js = fs.readFileSync(jsFile, 'utf8');
  assert.match(html, /jp-game-telemetry\.js/);
  assert.match(html, /한 판 더/);
  assert.ok(js.includes(gameId));
  assert.match(js, /sessionPlayIndex/);
  assert.match(js, /personalBest/);
  assert.match(js, /finishPlay/);
}

console.log('economy game loop tests: ok (8 games + realtime)');
