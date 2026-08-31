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
assert.match(skillHtml, /미적분1_계산스킬\.js\?v=17/);
assert.match(skillHtml, /미적분1_계산스킬\.css\?v=20/);
assert.match(skillJs, /differentiate_polynomial:\{name:'미분의 철갑수'/);
assert.match(skillJs, /limit_factor:\{name:'인수분해의 문지기'/);
assert.match(skillJs, /limit_rationalize:\{name:'켤레의 연금술사'/);
assert.match(skillJs, /limit_infinity_ratio:\{name:'무한비의 거신'/);
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
assert.match(skillJs, /infinite-ratio-colossus\.jpg/);
assert.match(skillJs, /degree-grade/);
assert.match(skillJs, /A등급.*최고차항 관통/);
assert.match(skillJs, /limit_infinity_diff:\{name:'미정형의 혼돈수'/);
assert.match(skillJs, /indeterminate-chaos-beast\.jpg/);
assert.match(skillJs, /chaos-split/);
assert.match(skillJs, /빠른 융합!/);
assert.match(skillJs, /questionStartedAt/);
assert.match(skillJs, /limit_one_sided:\{name:'양면의 경계자'/);
assert.match(skillJs, /two-faced-boundary-warden\.jpg/);
assert.match(skillJs, /side-switch/);
assert.match(skillJs, /경계 관통!/);
assert.match(skillJs, /forcedSide/);
assert.match(skillJs, /continuity_parameter:\{name:'연속의 봉합사'/);
assert.match(skillJs, /continuity-stitcher\.jpg/);
assert.match(skillJs, /continuity-stitch/);
assert.match(skillJs, /봉합 완료!/);
assert.match(skillJs, /launchBossHealFx/);
assert.match(skillJs, /stitchBattle&&!completingStitch\?Math\.max\(1,nextHp\)/,'연속의 봉합사는 세 번째 봉합 공격으로만 쓰러져야 한다.');
assert.match(skillJs, /squeeze_limit:\{name:'압착의 쌍벽'/);
assert.match(skillJs, /squeeze-twin-walls\.jpg/);
assert.match(skillJs, /squeeze-twin-walls-mobile-v3\.jpg/);
assert.match(skillJs, /squeeze-walls/);
assert.match(skillJs, /압착 회피!/);
assert.match(skillJs, /safeWindows:\[5\.5,4\.7,4\]/);
assert.match(skillJs, /boss\.wallGap=Math\.max\(0,100-questionElapsed\/windowLimit\*100\)/,'상·하한 벽 간격이 실제 응답 시간에 따라 줄어야 한다.');
assert.match(skillJs, /function makeQuestion\(id,level=currentLevel,forcedSide=null\)/,'보스 페이즈 난도와 접근 방향이 실제 문제 생성기에 전달되어야 한다.');
assert.match(skillJs, /currentBossV2Limit/);
assert.match(skillJs, /바로 다시 도전/);
assert.match(skillJs, /params\.get\('mode'\)==='boss'/);
assert.match(skillJs, /calculus-skill-boss-differentiate-polynomial/);
assert.match(skillJs, /telemetry\.finishPlay/);

console.log('challenge and boss battle 2.2 tests: ok');
