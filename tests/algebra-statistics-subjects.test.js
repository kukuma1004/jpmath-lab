const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const box = {window:{}};
vm.runInNewContext(fs.readFileSync('subject-expansion-data.js','utf8'), box);
const data = box.window.JPSubjectExpansion;
assert.ok(data, '공용 과목 데이터가 전역에 공개되어야 한다.');

const expected = {algebra:15, statistics:13};
for (const [subjectId, total] of Object.entries(expected)) {
  const subject = data.subjects[subjectId];
  assert.ok(subject, `${subjectId} 과목 데이터가 없다.`);
  assert.equal(subject.topics.length, total, `${subjectId}의 개념과 대단원 수가 어긋났다.`);
  assert.equal(subject.topics.filter(t => t.isUnit).length, 3, '과목마다 대단원 보스는 세 종이어야 한다.');
  assert.equal(new Set(subject.topics.map(t => t.id)).size, total, '과목 안에서 topic id가 겹치면 안 된다.');

  for (const topic of subject.topics) {
    assert.ok(topic.title && topic.unit && topic.code && topic.boss, `${subjectId}/${topic.id}의 설명이 비었다.`);
    const cfg = data.bossConfig(subjectId, topic.id);
    assert.equal(cfg.mechanic, 'step-lock');
    assert.ok(cfg.art.startsWith('data:image/svg+xml'), `${topic.id} 보스 그림은 자체 SVG여야 한다.`);
    assert.ok(cfg.hp >= (topic.isUnit?2100:1300), `${topic.id} 보스 체력이 너무 낮다.`);
    if (topic.isUnit) assert.ok(cfg.unitOf.length >= 3, `${topic.id}는 여러 개념을 섞어야 한다.`);

    for (let i=0; i<120; i++) {
      const q = data.question(subjectId, topic.id);
      assert.ok(q.equation && q.prompt && q.explanation, `${topic.id} 문제 설명이 비었다.`);
      assert.equal(q.choices.length, 4, `${topic.id} 선택지는 네 개여야 한다.`);
      assert.equal(new Set(q.choices.map(String)).size, 4, `${topic.id} 선택지가 중복되었다: ${q.choices.join(', ')}`);
      assert.ok(q.choices.map(String).includes(String(q.correct)), `${topic.id} 정답이 선택지에 없다.`);
    }
  }
}

for (const file of ['대수/index.html','대수/학습.html','대수/연산스킬.html','확률과통계/index.html','확률과통계/학습.html','확률과통계/연산스킬.html']) {
  const html = fs.readFileSync(file,'utf8');
  assert.match(html, /subject-expansion-data\.js\?v=1/);
  assert.match(html, /subject-expansion\.js\?v=1/);
  assert.match(html, /jp-motion\.js\?v=/);
}

const home = fs.readFileSync('index.html','utf8');
assert.match(home, /href="대수\/"/);
assert.match(home, /href="확률과통계\/"/);
const nav = fs.readFileSync('jp-nav-2.js','utf8');
assert.match(nav, /siteHref\('대수\/'\)/);
assert.match(nav, /siteHref\('확률과통계\/'\)/);

const catalogBox = {window:{}};
vm.runInNewContext(fs.readFileSync('보스전/boss-catalog.js','utf8'), catalogBox);
const bosses = catalogBox.window.JPBossCatalog.bosses;
assert.equal(bosses.length, 98);
assert.ok(bosses.filter(b=>b.subject==='algebra').every(b=>b.href.includes('대수/연산스킬.html')));
assert.ok(bosses.filter(b=>b.subject==='statistics').every(b=>b.href.includes('확률과통계/연산스킬.html')));

console.log('대수·확률과 통계 무작위 문제 3360회와 28종 보스 검사: ok');
