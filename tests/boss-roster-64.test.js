const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('보스전/boss-catalog.js','utf8');
const context = {window:{}};
vm.runInNewContext(source,context);
const catalog=context.window.JPBossCatalog;

assert.ok(catalog,'보스 카탈로그가 전역에 공개되어야 한다.');
assert.equal(catalog.total,64,'보스는 미적분 28종과 기하 36종, 총 64종이어야 한다.');
assert.equal(catalog.bosses.filter(x=>x.subject==='calculus').length,28);
assert.equal(catalog.bosses.filter(x=>x.subject==='geometry').length,36);
assert.equal(new Set(catalog.bosses.map(x=>x.id)).size,64,'보스 ID는 중복되면 안 된다.');
assert.equal(new Set(catalog.bosses.map(x=>x.name)).size,64,'보스 이름은 모두 달라야 한다.');

for(const boss of catalog.bosses){
  for(const field of ['id','subject','skillId','code','skillTitle','name','mechanic','visual','palette','href']){
    assert.ok(boss[field],`${boss.id||'unknown'}의 ${field}가 비어 있다.`);
  }
}

const playable=catalog.bosses.filter(x=>x.status==='playable');
assert.equal(playable.length, 64, '64종이 모두 실제로 플레이 가능해야 한다.');
// 도전 가능 목록은 카탈로그가 진실이다. 이름을 손으로 옮겨 적으면
// 보스를 더할 때마다 어긋나므로, 64종 전체와 견준다.
assert.deepEqual([...playable.map(x=>x.name)].sort(),[...catalog.bosses.map(x=>x.name)].sort(),'64종이 모두 도전 가능해야 한다.');

const hall=fs.readFileSync('보스전/index.html','utf8');
const hallCss=fs.readFileSync('보스전/boss-hall.css','utf8');
// 모바일 조종석 스타일은 두 페이지가 나눠 쓰는 공용 파일에 있다.
const calcCss=fs.readFileSync('보스전/boss-engine.css','utf8');
assert.match(hall,/boss-catalog\.js\?v=16/);
assert.match(hall,/boss-hall\.js\?v=2/);
assert.match(hall,/boss-hall\.css\?v=3/);
// 전투 가능 수는 카탈로그에서 채우므로 페이지에 손으로 적지 않는다.
// 예전에는 "12 / 64" 가 박혀 있어 보스를 만들어도 그대로였다.
assert.match(hall,/data-boss-playable/,'전투 가능 수를 카탈로그에서 채워야 한다.');
assert.doesNotMatch(hall,/<strong>\d+ \/ 64<\/strong>/,'전투 가능 수를 페이지에 손으로 적으면 안 된다.');
assert.match(hall,/derivative-iron-beast\.webp/,'보스전 홀도 실제 철갑수 이미지를 사용해야 한다.');
assert.match(hallCss,/boss-archive-grid/);

/* 명단 나누기.

   64종을 한 줄로 늘어놓으면 카드 하나가 390px 라 모바일 스크롤이 2만
   픽셀을 넘었다. 과목을 먼저 고르고 단원으로 건너뛰게 바꾼 것을 지킨다. */
const hallJs=fs.readFileSync('보스전/boss-hall.js','utf8');
for(const boss of catalog.bosses){
  assert.ok(boss.unit,`${boss.id}에 단원이 없다. 홀이 단원으로 명단을 나눈다.`);
}
const units=[...new Set(catalog.bosses.map(x=>`${x.subject}/${x.unit}`))];
assert.equal(units.length,7,'단원은 미적분 4개와 기하 3개, 모두 일곱이어야 한다.');
for(const [subject,unit,n] of [
  ['calculus','극한과 연속',8],['calculus','미분법',4],['calculus','도함수의 활용',8],['calculus','적분',8],
  ['geometry','이차곡선',12],['geometry','공간도형과 공간좌표',11],['geometry','벡터',13]
]){
  assert.equal(catalog.bosses.filter(x=>x.subject===subject&&x.unit===unit).length,n,`${unit}은 ${n}종이어야 한다.`);
}
// 처음 열었을 때 64종이 아니라 한 과목만 보여야 한다.
assert.match(hall,/class="active" type="button" data-boss-filter="calculus"/,'명단은 미적분부터 보여야 한다.');
assert.match(hall,/data-unit-bar/,'단원 바로가기 띠가 있어야 한다.');
assert.match(hallJs,/unitId/,'단원마다 건너뛸 자리를 만들어야 한다.');
// 타일이 다시 커지면 스크롤 문제가 돌아온다.
const tile=/\.archive-card\{[^}]*min-height:(\d+)px/.exec(hallCss);
assert.ok(tile&&Number(tile[1])<=120,`명단 타일은 120px 이하여야 한다 — 지금 ${tile?tile[1]:'없음'}px`);
assert.match(hallCss,/@media\(max-width:600px\)\{\s*\.archive-cards\{grid-template-columns:repeat\(2/,'모바일 명단은 2열이어야 한다.');
assert.match(calcCss,/\.boss-v2 \.boss-arena\{position:sticky;top:68px/,'모바일 전투 중 보스 조종석이 상단에 남아야 한다.');
assert.match(calcCss,/\.boss-v2 \.answer-grid\{grid-template-columns:repeat\(2/,'모바일 보스 선택지는 2열이어야 한다.');
assert.ok(fs.existsSync('assets/bosses/factor-gate-guardian.jpg'),'인수분해의 문지기 캐릭터 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/conjugate-alchemist.jpg'),'켤레의 연금술사 캐릭터 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/infinite-ratio-colossus.jpg'),'무한비의 거신 캐릭터 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/indeterminate-chaos-beast.jpg'),'미정형의 혼돈수 캐릭터 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/two-faced-boundary-warden.jpg'),'양면의 경계자 캐릭터 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/continuity-stitcher.jpg'),'연속의 봉합사 캐릭터 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/squeeze-twin-walls.jpg'),'압착의 쌍벽 캐릭터 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/squeeze-twin-walls-mobile-v3.jpg'),'모바일에서도 두 수호자가 보이는 압착의 쌍벽 크롭 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/forbidden-differentiation-warlock.jpg'),'금단의 미분술사 캐릭터 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/forbidden-differentiation-warlock-mobile.jpg'),'금단의 미분술사 모바일 초상 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/difference-quotient-origin.jpg'),'차분몫의 원형 캐릭터 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/difference-quotient-origin-mobile.jpg'),'차분몫의 원형 모바일 초상 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/twin-blade-product-fiend.jpg'),'쌍날 곱셈귀 캐릭터 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/twin-blade-product-fiend-mobile.jpg'),'쌍날 곱셈귀 모바일 초상 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/tangent-sniper.jpg'),'접선의 저격수 캐릭터 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/tangent-sniper-mobile.jpg'),'접선의 저격수 모바일 초상 이미지가 있어야 한다.');

console.log('64 boss roster and mobile cockpit tests: ok');
