const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = vm.createContext({ window: {} });
for (const file of [
  '주제탐구/seeds-bank.js',
  '주제탐구/seeds.js',
  '주제탐구/seed-expand.js',
  '주제탐구/seeds-catalog-2000.js'
]) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}

const catalog = context.window.JPSeedCatalog;
const meta = context.window.JPSeedCatalogMeta;

assert.equal(catalog.length, 2000, '학생용 씨앗 카탈로그는 정확히 2,000개여야 한다.');
assert.equal(context.window.JPSeeds.all().length, 2000, '공통 데이터 API도 2,000개를 반환해야 한다.');
assert.equal(meta.curated, 108, '기존 엄선 씨앗 108개를 보존해야 한다.');
assert.equal(meta.generated, 1892, '확장 후보는 1,892개여야 한다.');
assert.equal(meta.baseTopics, 200, '핵심 수학 주제 200개를 유지해야 한다.');
assert.equal(meta.lenses.length, 10, '탐구 렌즈는 10종이어야 한다.');

const ids = new Set(catalog.map(seed => seed.id));
const questions = new Set(catalog.map(seed => seed.question.replace(/[\s\p{P}\p{S}]/gu, '').toLowerCase()));
assert.equal(ids.size, 2000, '씨앗 ID가 중복되면 안 된다.');
assert.equal(questions.size, 2000, '표기만 다른 동일 질문을 허용하지 않는다.');

const generatedText = catalog
  .filter(seed => seed.src === 'seed2000')
  .map(seed => [seed.title, seed.question, seed.act, seed.next].join(' '))
  .join('\n');
for (const malformed of ['이유은', '의미은', '관계은', '횟수을', '변수을', '비을', '이유를 만족']) {
  assert.ok(!generatedText.includes(malformed), `잘못되거나 어색한 자동 문구가 남아 있다: ${malformed}`);
}

function hasBatchim(text) {
  const chars = Array.from(String(text || '')).filter(char => /[가-힣]/.test(char));
  return chars.length > 0 && (chars.at(-1).charCodeAt(0) - 0xAC00) % 28 !== 0;
}

const quotedParticle = /‘([^’]+)’(이라는|라는|과|와|을|를)/g;
for (const seed of catalog.filter(item => item.src === 'seed2000')) {
  const fields = [seed.question, seed.act, seed.next];
  for (const text of fields) {
    for (const match of text.matchAll(quotedParticle)) {
      const batchim = hasBatchim(match[1]);
      const expected = {
        '이라는': true, '라는': false,
        '과': true, '와': false,
        '을': true, '를': false
      }[match[2]];
      assert.equal(batchim, expected, `${seed.id}의 조사가 어색하다: ${match[0]}`);
    }
  }
}

for (const seed of catalog) {
  for (const field of ['id', 'subject', 'title', 'question', 'phenomenon', 'act', 'next', 'status']) {
    assert.ok(seed[field], `${seed.id}의 ${field}가 비어 있다.`);
  }
  assert.ok(Array.isArray(seed.concepts) && seed.concepts.length, `${seed.id}에 수학 개념이 필요하다.`);
  assert.ok(Array.isArray(seed.domain) && seed.domain.length, `${seed.id}에 탐구 분류가 필요하다.`);
}

for (const subject of ['calc', 'geo', 'econ', 'algebra', 'prob', 'common', 'ai', 'culture']) {
  assert.ok(catalog.some(seed => seed.subject === subject), `${subject} 씨앗이 하나 이상 필요하다.`);
}

for (const topic of [
  '미분하면 다항식의 차수가 하나 내려가는 이유',
  '자연상수 e를 정의하는 서로 다른 방법',
  '삼차함수 밖의 한 점에서 그은 접선의 개수'
]) {
  assert.equal(catalog.filter(seed => seed.baseTopic === topic).length, 10, `${topic}은 10개 렌즈를 모두 가져야 한다.`);
}

const html = fs.readFileSync('주제탐구/index.html', 'utf8');
assert.ok(html.indexOf('seeds-catalog-2000.js') > html.indexOf('seeds.js'), '카탈로그는 기본 사전 다음에 읽어야 한다.');
// 확장 씨앗은 파일에 담겨 오지 않고 확장기가 만든다. 순서가 뒤집히면 카탈로그가 비어 버린다.
assert.ok(html.indexOf('seed-expand.js') > -1, '확장기를 불러와야 한다.');
assert.ok(html.indexOf('seeds-catalog-2000.js') > html.indexOf('seed-expand.js'), '카탈로그는 확장기 다음에 읽어야 한다.');
assert.ok(html.indexOf('seed-field.js') > html.indexOf('seeds-catalog-2000.js'), '학생 화면은 카탈로그 다음에 읽어야 한다.');

console.log('seed-catalog-2000 tests: OK');
