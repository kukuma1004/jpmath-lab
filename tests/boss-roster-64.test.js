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
assert.equal(playable.length,3,'현재 실제 플레이 가능한 보스는 세 종이어야 한다.');
assert.deepEqual([...playable.map(x=>x.name)].sort(),['미분의 철갑수','인수분해의 문지기','켤레의 연금술사'].sort());

const hall=fs.readFileSync('보스전/index.html','utf8');
const hallCss=fs.readFileSync('보스전/boss-hall.css','utf8');
const calcCss=fs.readFileSync('미적분1/미적분1_계산스킬.css','utf8');
assert.match(hall,/boss-catalog\.js\?v=3/);
assert.match(hall,/boss-hall\.js\?v=1/);
assert.match(hall,/derivative-iron-beast\.webp/,'보스전 홀도 실제 철갑수 이미지를 사용해야 한다.');
assert.match(hallCss,/boss-archive-grid/);
assert.match(calcCss,/\.boss-v2 \.boss-arena\{position:sticky;top:68px/,'모바일 전투 중 보스 조종석이 상단에 남아야 한다.');
assert.match(calcCss,/\.boss-v2 \.answer-grid\{grid-template-columns:repeat\(2/,'모바일 보스 선택지는 2열이어야 한다.');
assert.ok(fs.existsSync('assets/bosses/factor-gate-guardian.jpg'),'인수분해의 문지기 캐릭터 이미지가 있어야 한다.');
assert.ok(fs.existsSync('assets/bosses/conjugate-alchemist.jpg'),'켤레의 연금술사 캐릭터 이미지가 있어야 한다.');

console.log('64 boss roster and mobile cockpit tests: ok');
