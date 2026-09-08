const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('보스전/boss-catalog.js','utf8');
const context = {window:{}};
vm.runInNewContext(source,context);
const catalog=context.window.JPBossCatalog;

assert.ok(catalog,'보스 카탈로그가 전역에 공개되어야 한다.');
/* 스킬 보스 64종(미적분 28 + 기하 36)에 대단원 총력전 6종(과목마다 3종)을
   더해 70종. 대단원은 제 문제를 갖지 않고 그 단원 스킬에서 뽑아 낸다. */
assert.equal(catalog.total,70,'보스는 스킬 64종과 대단원 6종, 모두 70종이어야 한다.');
assert.equal(catalog.bosses.filter(x=>x.subject==='calculus').length,31);
assert.equal(catalog.bosses.filter(x=>x.subject==='geometry').length,39);
assert.equal(new Set(catalog.bosses.map(x=>x.id)).size,70,'보스 ID는 중복되면 안 된다.');
assert.equal(new Set(catalog.bosses.map(x=>x.name)).size,70,'보스 이름은 모두 달라야 한다.');
assert.equal(new Set(catalog.bosses.map(x=>x.code)).size,70,'보스 코드도 겹치면 안 된다.');

for(const boss of catalog.bosses){
  for(const field of ['id','subject','skillId','code','skillTitle','name','mechanic','visual','palette','href']){
    assert.ok(boss[field],`${boss.id||'unknown'}의 ${field}가 비어 있다.`);
  }
}

const playable=catalog.bosses.filter(x=>x.status==='playable');
assert.equal(playable.length, 70, '70종이 모두 실제로 플레이 가능해야 한다.');
// 도전 가능 목록은 카탈로그가 진실이다. 이름을 손으로 옮겨 적으면
// 보스를 더할 때마다 어긋나므로, 64종 전체와 견준다.
assert.deepEqual([...playable.map(x=>x.name)].sort(),[...catalog.bosses.map(x=>x.name)].sort(),'64종이 모두 도전 가능해야 한다.');

const hall=fs.readFileSync('보스전/index.html','utf8');
const hallCss=fs.readFileSync('보스전/boss-hall.css','utf8');
// 모바일 조종석 스타일은 두 페이지가 나눠 쓰는 공용 파일에 있다.
const calcCss=fs.readFileSync('보스전/boss-engine.css','utf8');
const engineJs=fs.readFileSync('보스전/boss-engine.js','utf8');
assert.match(hall,/boss-catalog\.js\?v=18/);
assert.match(hall,/boss-hall\.js\?v=4/);
assert.match(hall,/data-unit-count/,'단원 수도 카탈로그에서 채워야 한다.');
assert.match(hall,/boss-hall\.css\?v=4/);
// 전투 가능 수는 카탈로그에서 채우므로 페이지에 손으로 적지 않는다.
// 예전에는 "12 / 64" 가 박혀 있어 보스를 만들어도 그대로였다.
assert.match(hall,/data-boss-playable/,'전투 가능 수를 카탈로그에서 채워야 한다.');
assert.doesNotMatch(hall,/<strong>\d+ \/ 64<\/strong>/,'전투 가능 수를 페이지에 손으로 적으면 안 된다.');
// 한 보스만 크게 걸어 두던 구획은 걷어냈다. 이제 명단이 예순네 얼굴을 다 보여 준다.
assert.doesNotMatch(hall,/featured-boss/,'보스 한 마리만 크게 거는 구획은 없어야 한다.');
assert.doesNotMatch(hallCss,/\.featured-boss|\.boss-portrait|\.roadmap-grid/,'걷어낸 구획의 스타일도 남기지 않는다.');

const hallJs=fs.readFileSync('보스전/boss-hall.js','utf8');
/* 명단의 얼굴.

   원본은 한 장에 200KB 가 넘어 예순네 장을 늘어놓을 수 없다. 192px webp 로
   줄인 것을 쓰고, 화면에 들어올 때 불러온다. */
const thumbDir='assets/bosses/thumbs';
let thumbBytes=0;
for(const boss of catalog.bosses){
  /* 대단원 총력전은 전투 화면에서 그 단원 보스들의 얼굴을 모아 붙이지만,
     명단의 작은 타일에는 모자이크가 들어가지 않으므로 단원의 첫 보스
     얼굴을 대표로 세운다. 얼굴이 없으면 명단에 깨진 그림이 뜬다. */
  assert.ok(boss.thumb,`${boss.id}에 작은 그림이 없다.`);
  const file=boss.thumb.replace('../','');
  assert.ok(fs.existsSync(file),`작은 그림 파일이 없다: ${file}`);
  assert.ok(file.startsWith(thumbDir),`작은 그림은 ${thumbDir} 아래에 있어야 한다: ${file}`);
  thumbBytes+=fs.statSync(file).size;
}
// 다시 무거워지면 명단이 열리다 만다. 원본 그대로 쓰면 13MB 가 넘는다.
assert.ok(thumbBytes<1.5*1024*1024,
  `명단 그림 전부가 1.5MB 이하여야 한다 — 지금 ${(thumbBytes/1024/1024).toFixed(1)}MB`);
assert.match(hallJs,/loading="lazy"/,'명단 그림은 화면에 들어올 때 불러와야 한다.');
assert.match(hallCss,/\.archive-face\{/,'명단 타일에 얼굴 자리가 있어야 한다.');
assert.match(hallCss,/boss-archive-grid/);

/* 명단 나누기.

   64종을 한 줄로 늘어놓으면 카드 하나가 390px 라 모바일 스크롤이 2만
   픽셀을 넘었다. 과목을 먼저 고르고 단원으로 건너뛰게 바꾼 것을 지킨다. */
for(const boss of catalog.bosses){
  assert.ok(boss.unit,`${boss.id}에 단원이 없다. 홀이 단원으로 명단을 나눈다.`);
}
const units=[...new Set(catalog.bosses.map(x=>`${x.subject}/${x.unit}`))];
assert.equal(units.length,9,'단원은 과목마다 대단원 하나씩을 더해 모두 아홉이어야 한다.');
for(const [subject,unit,n] of [
  ['calculus','대단원 총력전',3],
  ['calculus','극한과 연속',8],['calculus','미분법',4],['calculus','도함수의 활용',8],['calculus','적분',8],
  ['geometry','대단원 총력전',3],
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

/* 대단원 총력전.

   스킬 보스는 하나씩 잘게 쪼개져 있어 짧게 붙기는 좋은데 단원 전체를 한
   자리에서 겨루는 곳이 없었다. 과목마다 셋씩 두었다. 제 그림이 따로 없어서
   그 단원 보스들의 얼굴을 모아 초상으로 쓴다. */
{
  const read = (p) => fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');

  // 단원 명단과 보스 설정을 함께 실행해 실제 값으로 본다
  const loadConfigs = (js, label) => {
    const um = js.indexOf('  const UNIT_MEMBERS={');
    const ume = js.indexOf('\n  };', um) + 4;
    const cs = js.indexOf('  const BOSS_V2_CONFIGS={');
    const ce = js.indexOf('\n  };', cs) + 4;
    assert.ok(um > 0 && cs > 0, `${label}: 대단원 명단과 보스 설정이 있어야 한다.`);
    /* 명단이 설정보다 앞에 있어야 한다. 설정이 명단을 가져다 쓰므로 순서가
       뒤집히면 페이지가 통째로 안 뜬다 — 두 과목 모두 그렇게 한 번 깨졌다. */
    assert.ok(um < cs, `${label}: 대단원 명단은 보스 설정보다 앞에 있어야 한다.`);
    const box = {CONFIGS:null};
    vm.runInNewContext(js.slice(um,ume) + '\n'
      + js.slice(cs,ce).replace('const BOSS_V2_CONFIGS=','CONFIGS='), box);
    return box.CONFIGS;
  };

  const calcJs = read('미적분1/미적분1_계산스킬.js');
  const geoJs = read('기하/기하_내신스킬.js');

  /* 스킬 묶음이 진실이다. 손으로 옮겨 적으면 스킬을 더할 때 어긋난다.
     미적분은 S(...) 로, 기하는 defs 의 배열로 적혀 있다. */
  const calcGroup = {};
  for (const m of calcJs.matchAll(/S\('([a-z_]+)','([A-Z][0-9]+)',(?:'[^']*'|"[^"]*"),(?:'[^']*'|"[^"]*"),'([a-z]+)'/g)) {
    (calcGroup[m[3]] = calcGroup[m[3]] || []).push(m[1]);
  }
  const geoGroup = {};
  for (const m of geoJs.matchAll(/^ {4}\['([a-z_]+)','([a-z]+)','(S[0-9]+)'/gm)) {
    (geoGroup[m[2]] = geoGroup[m[2]] || []).push(m[1]);
  }

  const CASES = [
    ['미적분', loadConfigs(calcJs,'미적분'), calcGroup, {
      unit_limit: ['limit'],
      unit_differentiate: ['differentiate','graph'],
      unit_integral: ['integral']
    }],
    ['기하', loadConfigs(geoJs,'기하'), geoGroup, {
      unit_conic: ['conic'],
      unit_space: ['space'],
      unit_vector: ['vector']
    }]
  ];

  let seen = 0;
  for (const [label, CFG, groups, UNITS] of CASES) {
    for (const [id, gs] of Object.entries(UNITS)) {
      const cfg = CFG[id];
      assert.ok(cfg, `${label} ${id} 설정이 없다.`);
      const want = gs.flatMap(g => groups[g] || []);
      assert.ok(want.length, `${label} ${id}: 단원에 스킬이 없다.`);
      assert.deepEqual([...cfg.unitOf].sort(), [...want].sort(),
        `${cfg.name}이 뽑는 스킬이 단원과 다르다.`);
      assert.equal(cfg.mosaic.length, want.length,
        `${cfg.name}의 얼굴 수가 스킬 수와 다르다.`);
      for (const t of cfg.mosaic) {
        assert.ok(fs.existsSync(t.replace('../','')), `얼굴 그림이 없다: ${t}`);
      }
      // 대단원은 스킬 보스보다 길고 무거워야 한다
      assert.ok(cfg.hp >= 4000, `${cfg.name}의 체력이 스킬 보스와 다를 바 없다.`);
      assert.ok(cfg.lockSteps >= 4, `${cfg.name}의 묶음이 너무 짧다.`);
      // 홀에도 올라와 있어야 한다
      const inHall = catalog.bosses.find(x => x.skillId === id);
      assert.ok(inHall, `${cfg.name}이 보스전 홀에 없다.`);
      assert.equal(inHall.unit, '대단원 총력전', `${cfg.name}은 대단원으로 묶여야 한다.`);
      seen += 1;
    }
  }
  assert.equal(seen, 6, '대단원은 과목마다 셋씩 모두 여섯이어야 한다.');

  /* 한 묶음 안에서 같은 스킬을 두 번 내지 않는 것이 대단원의 핵심이다.
     이것이 빠지면 한 갈래만 판 학생도 통과한다. */
  assert.match(calcJs, /pickUnitSkill/, '미적분 대단원이 같은 갈래를 두 번 내면 안 된다.');
  assert.match(geoJs, /makeUnitAwareQuestion/, '기하 대단원이 같은 갈래를 두 번 내면 안 된다.');
  assert.match(engineJs, /cfg\.mosaic/, '엔진이 모아 붙인 초상을 그릴 줄 알아야 한다.');
}

console.log('70 boss roster and mobile cockpit tests: ok');
