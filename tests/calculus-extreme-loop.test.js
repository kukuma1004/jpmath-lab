const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const memory = new Map();
global.window = global;
global.localStorage = {
  getItem(key) { return memory.has(key) ? memory.get(key) : null; },
  setItem(key, value) { memory.set(key, String(value)); },
  removeItem(key) { memory.delete(key); }
};
global.crypto = require('node:crypto').webcrypto;

vm.runInThisContext(fs.readFileSync('jp-game-telemetry.js', 'utf8'), { filename: 'jp-game-telemetry.js' });

const telemetry = global.JPGameTelemetry;
const profile = telemetry.saveProfile('극값사냥꾼');
const sessionId = telemetry.makeSessionId();

const first = telemetry.startPlay({
  gameId: 'calculus-peak', sessionId, retry: false, sessionPlayIndex: 1
});
telemetry.finishPlay(first.playId, {
  score: 630, accuracy: 75, playTime: 54,
  retry: false, sessionPlayIndex: 1, personalBest: true
});

const retry = telemetry.startPlay({
  gameId: 'calculus-peak', sessionId, retry: true, sessionPlayIndex: 2
});
telemetry.finishPlay(retry.playId, {
  score: 710, accuracy: 88, playTime: 46,
  retry: true, sessionPlayIndex: 2, personalBest: true
});

const plays = telemetry.readLocalPlays();
assert.equal(profile.displayName, '극값사냥꾼');
assert.equal(plays.length, 2);
assert.equal(plays[0].gameId, 'calculus-peak');
assert.equal(plays[1].retry, true);
assert.equal(plays[1].sessionPlayIndex, 2);
assert.equal(plays[1].completed, true);
assert.equal(telemetry.summarize(plays).immediateRetryRate, 50);

const html = fs.readFileSync('미적분1/미적분1_극대극소.html', 'utf8');
assert.match(html, /data-final-accuracy/);
assert.match(html, /data-final-best/);
assert.match(html, /data-final-play-index/);
assert.match(html, /data-replay>바로 다시하기/);
assert.match(html, /gameId:`calculus-\$\{cfg\.id\}`/);
assert.match(html, /JPGameTelemetry/);

console.log('calculus extreme loop tests: ok');
