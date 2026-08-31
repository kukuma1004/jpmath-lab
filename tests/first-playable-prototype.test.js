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


// 매일 눈에 띄게 달라져야 한다. 상수항만 바뀌면 그래프가 세로로 한 칸 움직일 뿐이라
// 학생에게는 "안 바뀐" 것이다. 부호·중심·폭 중 하나는 반드시 달라야 한다.
function shapeKey(key) {
  const d = dailyApi.buildDaily(key);
  return [d.formula.startsWith('f(x) = −'), d.h, d.d].join('|');
}
for (let i = 0; i < 40; i += 1) {
  const day = new Date(2026, 0, 1 + i);
  const next = new Date(2026, 0, 2 + i);
  const k = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
  assert.notEqual(shapeKey(k(day)), shapeKey(k(next)), `${k(day)} 와 ${k(next)} 의 그래프 모양이 같다.`);
}

// 탐구 씨앗은 주제탐구 씨앗밭으로 옮겼다. 게임 결과 화면에는 그리로 가는 문만 남는다.
const resultHtml = fs.readFileSync('미적분1/오늘의_미적분.html', 'utf8');
assert.match(
  resultHtml,
  /<a class="research-seed" data-research-seed href="\.\.\/주제탐구\/#탐구씨앗">/,
  '결과 화면의 탐구 씨앗은 주제탐구 씨앗밭으로 이어져야 한다.'
);
assert.doesNotMatch(resultHtml, /<details class="research-seed"/, '씨앗 내용이 결과 화면에 남아 있으면 안 된다.');

// 씨앗밭은 주제탐구 첫 화면, 현재 탐구자 위에 있어야 한다.
const inquiryHtml = fs.readFileSync('주제탐구/index.html', 'utf8');
assert.match(inquiryHtml, /id="탐구씨앗"/, '주제탐구에 씨앗밭이 있어야 한다.');
assert.match(inquiryHtml, /data-seed-field/, '씨앗밭에 씨앗 목록이 붙어야 한다.');
assert.match(inquiryHtml, /seeds\.js/, '씨앗 데이터를 불러와야 한다.');
assert.match(inquiryHtml, /seed-field\.js/, '씨앗밭 화면을 불러와야 한다.');
assert.ok(
  inquiryHtml.indexOf('id="탐구씨앗"') < inquiryHtml.indexOf('현재 탐구자'),
  '씨앗밭은 현재 탐구자 위에 있어야 한다.'
);

// 전시 잠금은 학생 작품만 가린다. 씨앗밭은 통과해야 학생이 주제를 고를 수 있다.
const lockCss = fs.readFileSync('주제탐구/exhibition.css', 'utf8');
assert.match(lockCss, /\.exhibition-locked main > :not\(\.seed-field\)/, '잠금이 씨앗밭만 통과시켜야 한다.');

// ── 씨앗 자체 ──
// 아이디어 뱅크 v13 §7 의 구조를 갖췄는지, 마이닝 문서와 어긋나지 않는지 본다.
const seedCtx = { document: { addEventListener() {} } };
seedCtx.window = seedCtx;
vm.createContext(seedCtx);
vm.runInContext(fs.readFileSync('주제탐구/seeds.js', 'utf8'), seedCtx);
const DB = seedCtx.JPSeeds;

assert.equal(DB.seeds.length, 12, '마이닝 1차의 씨앗은 12개다.');
for (const key of ['calc', 'geo', 'econ']) {
  assert.equal(
    DB.seeds.filter((s) => s.subject === key).length, 4,
    `${DB.SUBJECT[key].label} 씨앗이 4개여야 한다.`
  );
}

for (const s of DB.seeds) {
  for (const field of ['id', 'title', 'question', 'phenomenon', 'concepts', 'domain', 'act', 'next']) {
    assert.ok(s[field], `${s.id} 의 ${field} 가 비어 있다.`);
  }
  assert.ok(DB.RELATION[s.relation], `${s.id} 의 교육과정 관계가 정의 밖이다.`);
  assert.ok(DB.LEVEL[s.entry] && DB.LEVEL[s.ceiling], `${s.id} 의 급이 정의 밖이다.`);
  // 입구는 낮고 천장은 높다. 뒤집히면 씨앗의 뜻이 사라진다.
  assert.ok(
    DB.LEVEL[s.ceiling].rank >= DB.LEVEL[s.entry].rank,
    `${s.id} 의 천장이 입구보다 낮다.`
  );
  // 아이디어 뱅크 §8 — 검증을 지나기 전에는 verified 로 올리지 않는다.
  assert.equal(s.status, 'candidate', `${s.id} 는 아직 검증 전이어야 한다.`);
  // 씨앗은 반드시 해볼 곳이 있어야 한다. 질문만 남으면 탐구가 시작되지 않는다.
  const target = s.asset.href.split('?')[0];
  assert.ok(
    fs.existsSync(require('node:path').join('주제탐구', target)),
    `${s.id} 가 가리키는 ${s.asset.href} 가 없다.`
  );
}

// 점수는 마이닝 문서가 매긴 상위 6개만 있다. 없는 점수를 지어내면 표가 쓸모없어진다.
const scored = DB.seeds.filter((s) => s.score);
assert.equal(scored.length, 6, '점수가 있는 씨앗은 상위 6개뿐이다.');
assert.deepEqual(
  // seeds.js 는 vm 안에서 돌아 배열의 프로토타입이 다르다. 호스트 배열로 옮겨 비교한다.
  Array.from(scored, (s) => s.score.rank).sort((a, b) => a - b),
  [1, 2, 3, 4, 5, 6],
  '제작 순위는 1위부터 6위까지 하나씩이어야 한다.'
);
for (const s of scored) {
  const sum = DB.AXES.reduce((acc, a) => acc + s.score[a.key], 0);
  assert.equal(s.score.total, sum, `${s.id} 의 합계가 7축의 합과 다르다.`);
}

// 차시별 제작 주제 24개는 씨앗이 아니다. 오리엔테이션 전용 데이터로만 남긴다.
const topicCtx = { document: { addEventListener() {} } };
topicCtx.window = topicCtx;
vm.createContext(topicCtx);
vm.runInContext(fs.readFileSync('주제탐구/topic-browser.js', 'utf8'), topicCtx);
assert.equal(topicCtx.JPTopics.length, 24, '차시별 제작 주제는 24개다.');
assert.equal(topicCtx.JPTopicBrowser, undefined, '주제 브라우저 UI 는 씨앗밭으로 대체됐다.');
assert.doesNotMatch(inquiryHtml, /topic-browser/, '주제탐구 첫 화면은 씨앗밭만 쓴다.');

const orientHtml = fs.readFileSync('주제탐구/orientation.html', 'utf8');
assert.doesNotMatch(orientHtml, /var TOPICS = \[/, '오리엔테이션이 주제 목록을 따로 갖고 있으면 안 된다.');
assert.match(orientHtml, /var TOPICS = \(window\.JPTopics/, '오리엔테이션은 공유 목록을 써야 한다.');


// ── 아이디어 뱅크에서 옮긴 씨앗 96개 ──
const bankCtx = { document: { addEventListener() {} } };
bankCtx.window = bankCtx;
vm.createContext(bankCtx);
vm.runInContext(fs.readFileSync('주제탐구/seeds-bank.js', 'utf8'), bankCtx);
vm.runInContext(fs.readFileSync('주제탐구/seeds.js', 'utf8'), bankCtx);

const bank = bankCtx.JPSeedsBank;
assert.equal(bank.length, 96, '뱅크에서 옮긴 씨앗은 96개다.');
assert.equal(bank.filter((s) => s.grade === 'S++').length, 32, '수학이 필요한 순간은 32개.');
assert.equal(bank.filter((s) => s.grade === 'S+').length, 64, 'S+ 후보는 64개.');

const merged = bankCtx.JPSeeds.all();
assert.equal(merged.length, 108, '마이닝 12 + 뱅크 96 = 108.');

for (const s of merged) {
  assert.ok(bankCtx.JPSeeds.SUBJECT[s.subject], `${s.id} 의 교과가 정의 밖이다.`);
  assert.ok(bankCtx.JPSeeds.GRADE[s.grade], `${s.id} 의 급이 정의 밖이다.`);
  // 씨앗은 붙잡을 문장이 하나는 있어야 한다.
  assert.ok(s.question || s.title, `${s.id} 에 질문도 제목도 없다.`);
}

// id 가 겹치면 화면에서 같은 씨앗이 두 번 나온다.
const ids = merged.map((s) => s.id);
assert.equal(new Set(ids).size, ids.length, '씨앗 id 가 겹친다.');

// 뱅크 파일은 손으로 고치지 않는다. 다시 뽑을 수 있어야 한다.
assert.ok(
  fs.existsSync('주제탐구/tools/seeds-from-bank.py'),
  '뱅크 씨앗을 다시 뽑는 도구가 저장소에 있어야 한다.'
);
assert.match(
  fs.readFileSync('주제탐구/seeds-bank.js', 'utf8'),
  /손으로 고치지 않는다/,
  '뱅크 파일에 손대지 말라는 표시가 있어야 한다.'
);
assert.match(inquiryHtml, /seeds-bank\.js/, '주제탐구가 뱅크 씨앗을 불러와야 한다.');


// 급은 제작 우선순위지 학생이 주제를 고르는 기준이 아니다.
// 학생에게는 감추고, 그 씨앗의 Deep Dive 가 열렸거나 교사 화면일 때만 보인다.
const fieldJs = fs.readFileSync('주제탐구/seed-field.js', 'utf8');
assert.match(fieldJs, /function showGrade\(/, '급을 언제 보일지 정하는 규칙이 있어야 한다.');
assert.match(
  fieldJs,
  /if \(showGrade\(s\)\)\s*\{[\s\S]{0,200}sd-gradechip/,
  '급 표시는 showGrade 를 통과할 때만 그려야 한다.'
);
assert.match(
  fieldJs,
  /if \(!s\.score \|\| !showGrade\(s\)\) return ''/,
  '제작 순위와 점수도 급과 같은 규칙으로 가려야 한다.'
);
assert.doesNotMatch(fieldJs, /data-value="S\+/, '급 거르개를 학생 화면에 두지 않는다.');
assert.match(fieldJs, /jp-classroom-access-v1/, '교사 화면에서는 급이 보여야 한다.');

const deepDiveJs = fs.readFileSync('주제탐구/deep-dive.js', 'utf8');
assert.match(deepDiveJs, /isOpen: isOpen/, 'Deep Dive 가 해금 여부를 알려 주어야 한다.');
assert.match(
  deepDiveJs,
  /jp-deep-dive-unlocked/,
  '해금되면 씨앗밭이 다시 그릴 수 있게 알려야 한다.'
);
assert.match(fieldJs, /jp-deep-dive-unlocked/, '씨앗밭이 해금 알림을 들어야 한다.');

console.log('first playable prototype tests: ok');
