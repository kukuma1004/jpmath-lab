const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('기하/기하_내신스킬.html', 'utf8');
const js = fs.readFileSync('기하/기하_내신스킬.js', 'utf8');
const css = fs.readFileSync('기하/기하_내신스킬.css', 'utf8');

assert.match(html, /기하_내신스킬\.js\?v=4/);
assert.match(html, /기하_내신스킬\.css\?v=5/);
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
