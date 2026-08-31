const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const home = read('index.html');
const nav = read('jp-nav-2.js');
const live = read('경제수학/live/index.html');
const bossHall = read('보스전/index.html');
const skillHtml = read('미적분1/미적분1_계산스킬.html');
const skillJs = read('미적분1/미적분1_계산스킬.js');

for (const source of [home, nav]) {
  assert.match(source, /오늘의 도전/, '전역 도전 메뉴에 오늘의 도전이 있어야 한다.');
  assert.match(source, /친구방 LIVE/, '전역 도전 메뉴에 친구방 LIVE가 있어야 한다.');
  assert.match(source, /보스전/, '전역 도전 메뉴에 보스전 모음이 있어야 한다.');
  assert.doesNotMatch(source, /<strong>기하 아레나<\/strong>/, '전역 도전 메뉴에서 기존 기하 아레나를 제거한다.');
  assert.doesNotMatch(source, /<strong>미적분 아케이드<\/strong>/, '전역 도전 메뉴에서 기존 미적분 아케이드를 제거한다.');
}

assert.doesNotMatch(live, /ECONOMY LIVE MAP|live-roadmap|전체 8게임 체험하기/, '투자왕 아래 중복 게임 지도를 제거한다.');

assert.match(bossHall, /미분의 철갑수/);
assert.match(bossHall, /differentiate_polynomial&amp;mode=boss/);
assert.match(bossHall, /38초/);
assert.match(bossHall, /HP 2600/);

assert.match(skillHtml, /jp-game-telemetry\.js\?v=2/);
assert.match(skillHtml, /미적분1_계산스킬\.js\?v=11/);
assert.match(skillHtml, /미적분1_계산스킬\.css\?v=9/);
assert.match(skillJs, /differentiate_polynomial:\{name:'미분의 철갑수'/);
assert.match(skillJs, /limit_factor:\{name:'인수분해의 문지기'/);
assert.match(skillJs, /limit_rationalize:\{name:'켤레의 연금술사'/);
assert.match(skillJs, /const bossV2=!!bossConfig/);
assert.match(skillJs, /bossMultiplier\(\)/);
assert.match(skillJs, /bossQuestionLevel/);
assert.match(skillJs, /launchBossFx/);
assert.match(skillJs, /derivative-iron-beast\.webp/);
assert.match(skillJs, /factor-gate-guardian\.jpg/);
assert.match(skillJs, /factor-shield/);
assert.match(skillJs, /conjugate-alchemist\.jpg/);
assert.match(skillJs, /conjugate-reflect/);
assert.match(skillJs, /켤레 반사!/);
assert.match(skillJs, /currentBossV2Limit/);
assert.match(skillJs, /바로 다시 도전/);
assert.match(skillJs, /params\.get\('mode'\)==='boss'/);
assert.match(skillJs, /calculus-skill-boss-differentiate-polynomial/);
assert.match(skillJs, /telemetry\.finishPlay/);

console.log('challenge and boss battle 2.2 tests: ok');
