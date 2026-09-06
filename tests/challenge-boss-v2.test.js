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
const skillCss = read('미적분1/미적분1_계산스킬.css');
// 보스 전투는 공용 엔진이 맡는다. 엔진 내부를 보는 검사는 이 파일에서 읽는다.
const engine = read('보스전/boss-engine.js');

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
assert.match(skillHtml, /미적분1_계산스킬\.js\?v=25/);
assert.match(skillHtml, /미적분1_계산스킬\.css\?v=25/);
assert.match(skillJs, /differentiate_polynomial:\{name:'미분의 철갑수'/);
assert.match(skillJs, /limit_factor:\{name:'인수분해의 문지기'/);
assert.match(skillJs, /limit_rationalize:\{name:'켤레의 연금술사'/);
assert.match(skillJs, /limit_infinity_ratio:\{name:'무한비의 거신'/);
assert.match(skillJs, /const bossV2=!!bossConfig/);
assert.match(engine, /bossMultiplier\(\)/);
assert.match(engine, /bossQuestionLevel/);
assert.match(engine, /function bossStartPhase\(\)\{return api\.level\(\)==='deep'\?3:api\.level\(\)==='applied'\?2:1\}/,'선택한 응용·심화 난도가 보스 시작 페이즈에 연결되어야 한다.');
assert.match(engine, /nextPhase=Math\.max\(bossStartPhase\(\),/,'보스 진행 중에도 사용자가 선택한 난도 아래로 내려가면 안 된다.');
assert.match(engine, /mechanic==='degree-grade'.*boss\.phase===3\?'deep'.*:api\.level\(\)/,'철갑수 외 보스는 전투 페이즈와 선택 난이도가 분리되어야 한다.');
for(const signature of [
  /FACTOR 0\/0 · 분모도 인수분해/,
  /RATIONALIZE · 분모가 이차/,
  /∞\/∞ · 근호와 부호/,
  /∞−∞ · x→−∞/,
  /ONE-SIDED · 이차식과 절댓값/,
  /미정계수 결정/,
  /SQUEEZE · 역조건/
]) assert.match(skillJs,signature,'기존 극한 보스의 심화 문제는 기본과 다른 구조를 가져야 한다.');
assert.match(engine, /launchBossFx/);
assert.match(skillJs, /derivative-iron-beast\.webp/);
assert.match(skillJs, /factor-gate-guardian\.jpg/);
assert.match(skillJs, /factor-shield/);
assert.match(skillJs, /conjugate-alchemist\.jpg/);
assert.match(skillJs, /conjugate-reflect/);
assert.match(engine, /켤레 반사!/);
assert.match(skillJs, /infinite-ratio-colossus\.jpg/);
assert.match(skillJs, /degree-grade/);
assert.match(skillJs, /A등급.*최고차항 관통/);
assert.match(skillJs, /limit_infinity_diff:\{name:'미정형의 혼돈수'/);
assert.match(skillJs, /indeterminate-chaos-beast\.jpg/);
assert.match(skillJs, /chaos-split/);
assert.match(engine, /빠른 융합!/);
assert.match(engine, /questionStartedAt/);
assert.match(skillJs, /limit_one_sided:\{name:'양면의 경계자'/);
assert.match(skillJs, /two-faced-boundary-warden\.jpg/);
assert.match(skillJs, /side-switch/);
assert.match(engine, /경계 관통!/);
assert.match(skillJs, /forcedSide/);
assert.match(skillJs, /continuity_parameter:\{name:'연속의 봉합사'/);
assert.match(skillJs, /continuity-stitcher\.jpg/);
assert.match(skillJs, /continuity-stitch/);
assert.match(engine, /봉합 완료!/);
assert.match(engine, /launchBossHealFx/);
assert.match(engine, /requiresFinisher=stitchBattle&&!completingStitch\|\|forbiddenBattle&&!breakingForbiddenSeal\|\|differenceBattle&&!exposingHCore\|\|productBattle&&!completingProduct/,'완성 공격이 필요한 보스는 고유 규칙을 충족해야만 쓰러져야 한다.');
assert.match(skillJs, /squeeze_limit:\{name:'압착의 쌍벽'/);
assert.match(skillJs, /squeeze-twin-walls\.jpg/);
assert.match(skillJs, /squeeze-twin-walls-mobile-v3\.jpg/);
assert.match(skillJs, /squeeze-walls/);
assert.match(engine, /압착 회피!/);
assert.match(skillJs, /safeWindows:\[5\.5,4\.7,4\]/);
assert.match(engine, /boss\.wallGap=Math\.max\(0,100-questionElapsed\/windowLimit\*100\)/,'상·하한 벽 간격이 실제 응답 시간에 따라 줄어야 한다.');
assert.match(skillJs, /lhopital:\{name:'금단의 미분술사'/);
assert.match(skillJs, /forbidden-differentiation-warlock\.jpg/);
assert.match(skillJs, /forbidden-seal/);
assert.match(skillJs, /makeForbiddenQuestion/);
assert.match(engine, /정석 봉인 해제!/);
assert.match(engine, /로피탈 지름길 사용/);
assert.match(engine, /String\(value\)\.includes\('로피탈'\)/,'로피탈 정리가 포함된 선택지를 실제로 골랐을 때만 금단 마력이 강화되어야 한다.');
assert.match(engine, /forbiddenBattle&&!breakingForbiddenSeal/,'금단의 미분술사는 세 번째 정석 각인 공격으로만 쓰러져야 한다.');
assert.match(skillJs, /derivative_definition:\{name:'차분몫의 원형'/);
assert.match(skillJs, /difference-quotient-origin\.jpg/);
assert.match(skillJs, /h-collapse/);
assert.match(skillJs, /makeDifferenceQuestion/);
assert.match(skillJs, /h 수축 · 이차함수/,'기본 문제는 이차함수 차분몫이어야 한다.');
assert.match(skillJs, /h 수축 · 삼차함수/,'응용 문제는 삼차함수 차분몫이어야 한다.');
assert.match(skillJs, /h 수축 · 배율 차분몫/,'심화 문제에는 kh 배율 차분몫이 있어야 한다.');
assert.match(skillJs, /h 수축 · 대칭 차분몫/,'심화 문제에는 대칭 차분몫이 있어야 한다.');
assert.match(engine, /h→0 완성! 접선 코어 노출/);
assert.match(engine, /boss\.hStep=Math\.max\(0,boss\.hStep-1\)/,'오답이면 h 고리가 한 단계 다시 벌어져야 한다.');
assert.match(engine, /differenceBattle&&!exposingHCore/,'접선 코어 노출 공격으로만 차분몫의 원형을 끝낼 수 있어야 한다.');
assert.match(skillJs, /product_rule:\{name:'쌍날 곱셈귀'/);
assert.match(skillJs, /twin-blade-product-fiend\.jpg/);
assert.match(skillJs, /product-blades/);
assert.match(skillJs, /function buildProductPair/,'같은 함수 쌍을 왼날과 오른날 문제가 공유해야 한다.');
assert.match(skillJs, /RIGHT BLADE · 역으로 항 복원/,'심화 오른날은 전체 도함수에서 빠진 항을 역으로 복원해야 한다.');
assert.match(engine, /쌍날 교차 베기!/);
assert.match(engine, /쌍날 연계 파괴 · 왼날부터 재시작/);
assert.match(engine, /productBattle&&!completingProduct/,'교차 베기 공격으로만 쌍날 곱셈귀를 끝낼 수 있어야 한다.');
// ── 접선의 저격수 ──────────────────────────────────────────────
// 접선은 접점과 기울기가 둘 다 있어야 그을 수 있다. 그 둘을 따로
// 조준한 뒤 합쳐야 레이저가 나가는 것이 이 보스의 규칙이다.
assert.match(skillJs, /tangent_equation:\{name:'접선의 저격수'/);
assert.match(skillJs, /sniper-lock/);
assert.match(skillJs, /function buildSniperTarget/,'세 문제가 같은 곡선과 같은 a 를 공유해야 한다.');
assert.match(skillJs, /keep=boss\.sniperLock>0&&boss\.sniperTarget/,'조준 중에는 목표 곡선이 바뀌면 안 된다.');
assert.match(skillJs, /if\(m===0\|\|m===a\)continue/,'기울기 0과 기울기=접점x 는 걸러야 한다.');
assert.match(skillJs, /접점의 y좌표 f\(/);
assert.match(skillJs, /접선의 기울기 f′\(/);
assert.match(engine, /조준 완료 · 접선 레이저 발사!/);
assert.match(engine, /sniperBattle&&!firingSniper/,'조준을 끝낸 발사로만 접선의 저격수를 쓰러뜨릴 수 있어야 한다.');
assert.match(engine, /boss\.sniperLock=0;boss\.sniperTarget=null;boss\.sniperResetOnNext=false;\$\('\[data-boss-stage\]'\)\.classList\.add\('boss-sniper-miss'\)/,'오답이면 조준이 통째로 풀려야 한다.');
assert.match(skillCss, /\.boss-v2\.boss-sniper /,'저격수 전용 겉모습이 있어야 한다.');
assert.match(skillJs, /tangent-sniper\.jpg/,'접선의 저격수 데스크톱 초상을 사용해야 한다.');
assert.match(skillJs, /tangent-sniper-mobile\.jpg/,'접선의 저격수 모바일 초상을 사용해야 한다.');
assert.match(engine, /조준 실패 · 접점부터 다시 포착/,'오답 피드백은 저격수 규칙을 직접 설명해야 한다.');

// ── 공통 단계잠금(step-lock) ────────────────────────────────────
// 보스마다 배선을 따로 하면 if 분기가 스물여덟 갈래가 된다. 정해진
// 횟수를 연속으로 맞히면 마무리 공격이 되고 틀리면 처음으로 돌아간다.
// 보스마다 다른 것은 횟수·이름·데미지·색이며 전부 설정에 적는다.
assert.match(skillJs, /mechanic:'step-lock'/);
assert.match(engine, /function stepLockLabel/);
assert.match(engine, /finishingStep=stepBattle&&boss\.lockStep===\(cfg\.lockSteps\|\|3\)-1/,'마무리 단계는 설정한 횟수에서 열려야 한다.');
assert.match(engine, /stepBattle&&!finishingStep/,'마무리 공격으로만 단계잠금 보스를 쓰러뜨릴 수 있어야 한다.');
assert.match(engine, /boss\.lockStep=0;boss\.lockBreaks\+=1/,'오답이면 단계가 처음으로 돌아가야 한다.');
assert.match(skillJs, /monotonic_interval:\{name:'부호표의 순찰자'/);
assert.match(skillJs, /extrema_sign:\{name:'극점의 전환자'/);
assert.match(skillJs, /cubic_extrema:\{name:'판별식의 삼두룡'/);
assert.match(skillJs, /quartic_shape:\{name:'사차의 봉우리왕'/);
assert.match(skillCss, /\.boss-v2\.boss-step /,'단계잠금 보스의 겉모습이 있어야 한다.');
assert.match(engine, /--boss-accent:\$\{cfg\.accent\}/,'보스마다 다른 강조색을 무대에 실어야 한다.');

assert.match(skillJs, /function makeQuestion\(id,level=currentLevel,forcedSide=null\)/,'보스 페이즈 난도와 접근 방향이 실제 문제 생성기에 전달되어야 한다.');
assert.match(engine, /currentBossV2Limit/);
assert.match(engine, /바로 다시 도전/);
assert.match(skillJs, /params\.get\('mode'\)==='boss'/);
assert.match(skillJs, /calculus-skill-boss-differentiate-polynomial/);
assert.match(engine, /telemetry\.finishPlay/);

console.log('challenge and boss battle 2.2 tests: ok');
