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
vm.runInThisContext(fs.readFileSync('미적분1/오늘의_미적분.js', 'utf8'), { filename: '오늘의_미적분.js' });

const telemetry = global.JPGameTelemetry;
const dailyApi = global.JPCalculusDaily;

assert.ok(telemetry, '행동 로그 API가 공개되어야 한다.');
assert.ok(dailyApi, '오늘의 미적분 순수 함수 API가 공개되어야 한다.');

const profile = telemetry.saveProfile('함수탐정');
assert.equal(profile.displayName, '함수탐정');
assert.ok(profile.userId.startsWith('user-'));

const sessionId = telemetry.makeSessionId();
const first = telemetry.startPlay({
  gameId: 'calculus-daily-function',
  sessionId,
  dateKey: '2026-08-30',
  retry: false,
  sessionPlayIndex: 1
});
telemetry.finishPlay(first.playId, {
  score: 720,
  accuracy: 84,
  playTime: 143,
  retry: false,
  sessionPlayIndex: 1,
  personalBest: true
});

const second = telemetry.startPlay({
  gameId: 'calculus-daily-function',
  sessionId,
  dateKey: '2026-08-30',
  retry: true,
  sessionPlayIndex: 2
});
telemetry.finishPlay(second.playId, {
  score: 690,
  accuracy: 76,
  playTime: 119,
  retry: true,
  sessionPlayIndex: 2,
  personalBest: false
});

// 이 실험이 재려는 것은 점수가 아니라 다음 행동으로 이어지는가이다.
// 첫 판은 조작만 하고 끝내고, 두 번째 판은 다음 경험과 탐구까지 연다.
telemetry.mark(first.playId, 'lab_interaction');
telemetry.mark(first.playId, 'lab_interaction');
telemetry.mark(second.playId, 'lab_interaction');
telemetry.mark(second.playId, 'next_experience_click');
telemetry.mark(second.playId, 'research_open');
assert.equal(telemetry.mark('없는-playId', 'lab_interaction'), null, '없는 판은 조용히 무시한다.');
assert.equal(telemetry.mark(first.playId, '엉뚱한이벤트'), null, '모르는 이벤트는 기록하지 않는다.');

const plays = telemetry.readLocalPlays();
assert.equal(plays.length, 2);
assert.equal(plays[0].labInteractions, 2);
assert.equal(plays[0].nextExperienceClick, false);
assert.equal(plays[0].researchOpen, false);
assert.equal(plays[1].labInteractions, 1);
assert.equal(plays[1].nextExperienceClick, true);
assert.equal(plays[1].researchOpen, true);
assert.equal(plays[0].userId, profile.userId);
assert.equal(plays[0].completed, true);
assert.equal(plays[1].retry, true);
assert.equal(plays[1].sessionPlayIndex, 2);

const summary = telemetry.summarize(plays);
assert.deepEqual(summary, {
  startedUsers: 1,
  starts: 2,
  completionRate: 100,
  immediateRetryRate: 50,
  averagePlaysPerStudent: 2,
  averagePlaysPerSession: 2,
  personalBestRate: 50,
  labInteractionRate: 100,
  averageLabInteractions: 1.5,
  nextExperienceRate: 50,
  researchOpenRate: 50,
  returningUsers: 0
});

const daily = dailyApi.buildDaily('2026-08-30');
assert.equal(daily.missions.length, 5);
assert.equal(daily.formula, dailyApi.buildDaily('2026-08-30').formula, '같은 날짜에는 같은 함수여야 한다.');
assert.notEqual(daily.formula, dailyApi.buildDaily('2026-08-31').formula, '다른 날짜에는 함수가 바뀔 수 있어야 한다.');
assert.equal(dailyApi.scoreAttempt({ correct: 3, kind: 'choice' }, 3, 5).success, true);

console.log('first playable prototype tests: ok');
