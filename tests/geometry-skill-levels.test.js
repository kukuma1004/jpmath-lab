const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('기하/기하_내신스킬.html', 'utf8');
const js = fs.readFileSync('기하/기하_내신스킬.js', 'utf8');

/* 보스전 홀은 ?mode=boss 로 보낸다. 페이지가 그것을 읽지 않으면
   보스를 눌러도 원리 화면이 열린다 — 실제로 그랬다. */
assert.match(js, /params\.get\('mode'\)==='boss'\)showPanel\('boss'\)/,
  '홀에서 ?mode=boss 로 들어오면 전투 화면을 열어야 한다.');
/* 난이도를 바꿀 때 옛 보스 화면을 손대면 엔진이 그려 둔 안내를 덮는다. */
assert.doesNotMatch(js, /data-boss-body|data-boss-start/,
  '보스 화면은 공용 엔진이 만든다. 페이지가 직접 손대면 안내가 덮인다.');
const css = fs.readFileSync('기하/기하_내신스킬.css', 'utf8');

assert.match(html, /기하_내신스킬\.js\?v=9/);
assert.match(html, /기하_내신스킬\.css\?v=6/);
assert.match(js, /const LEVELS=\[/);
assert.match(js, /id:'basic'/);
assert.match(js, /id:'applied'/);
assert.match(js, /id:'deep'/);
assert.match(js, /questionComplexity/);
assert.match(js, /saved\.byLevel/);
assert.match(js, /const rec=/);
assert.match(js, /JPGeoSkillProbe/);
assert.match(css, /\.skill-level-bar/);
assert.match(css, /prefers-reduced-motion/);

console.log('geometry skill level tests: ok');
