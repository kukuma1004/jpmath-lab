const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (file) => fs.readFileSync(file, 'utf8');
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return walk(full);
  return entry.isFile() && entry.name.endsWith('.html') ? [full] : [];
});

const motionJs = read('jp-motion.js');
const motionCss = read('jp-motion.css');
const boss = read('보스전/boss-engine.js');
const calcRush = read('미적분1/미적분1_계산스킬.js');
const calcTopics = read('미적분1/미적분1_확장개념.js');
const geoRush = read('기하/기하_내신스킬.js');
const ellipseRush = read('기하/기하_내신스킬_타원abc.js');
const geoArena = read('기하/기하_공통.js');

assert.match(motionJs, /version:'20261117-1'/, '공용 모션 버전을 올려 브라우저 캐시를 갱신해야 한다.');
assert.match(motionJs, /\.archive-unit,\.archive-card/, '동적으로 만들어지는 보스 카드도 등장 흐름에 포함한다.');
assert.match(motionJs, /function feedbackChanged/, '정답·오답·결과는 상태 변화에 맞는 피드백 모션을 가져야 한다.');
assert.match(motionJs, /target\.classList\.contains\('jp-inline-feedback'\)/, '기존 피드백 연출이 있는 페이지에서는 모션을 두 번 겹치지 않는다.');
assert.match(motionJs, /prefers-reduced-motion/, '공용 모션은 사용자 감속 설정을 존중해야 한다.');
assert.match(motionCss, /--jp-motion-quick:120ms/, '짧은 조작 피드백의 시간 토큰을 공유해야 한다.');
assert.match(motionCss, /@media\(prefers-reduced-motion:reduce\)/, 'CSS 모션도 감속 설정에서 꺼져야 한다.');

const motionPages = walk('.').filter((file) => {
  if (file.includes(`${path.sep}.git${path.sep}`) || file.includes(`${path.sep}node_modules${path.sep}`)) return false;
  return read(file).includes('jp-motion.js');
});
assert.equal(motionPages.length, 112, '공용 모션 대상 페이지 수가 의도치 않게 줄어들면 안 된다.');
for (const file of motionPages) {
  const source = read(file);
  const cssVersion = /jp-motion\.css\?v=([0-9-]+)/.exec(source)?.[1];
  const jsVersion = /jp-motion\.js\?v=([0-9-]+)/.exec(source)?.[1];
  assert.ok(cssVersion && jsVersion, `${file}: 공용 모션 자산 두 개가 모두 있어야 한다.`);
  assert.equal(cssVersion, jsVersion, `${file}: CSS와 JS 캐시 버전이 같아야 한다.`);
  assert.ok(['20261116-1','20261117-1'].includes(jsVersion), `${file}: 알려진 공용 모션 버전이어야 한다.`);
}

const studentWorks = walk('주제탐구/gallery/works');
assert.ok(studentWorks.length > 0, '학생 원본 작품 폴더가 있어야 한다.');
for (const file of studentWorks) {
  assert.doesNotMatch(read(file), /jp-motion\.(?:css|js)/, `${file}: 학생 원본 작품에 공용 코드를 강제로 주입하지 않는다.`);
}

assert.match(boss, /if\(boss\.locked\)\{renderBossHud\(\);boss\.raf=requestAnimationFrame\(tickBoss\);return\}/,
  '정답·오답 연출 동안에는 보스 제한시간을 차감하지 않아야 한다.');
assert.match(boss, /document\.addEventListener\('visibilitychange', handleBossVisibility\)/,
  '앱 전환이나 탭 숨김을 보스 엔진이 감지해야 한다.');
assert.match(boss, /boss\.questionStartedAt\+=pausedFor/,
  '압착 보스의 응답 창도 숨겨진 시간만큼 보정해야 한다.');
assert.match(boss, /Math\.min\(\.25,Math\.max\(0,\(now-boss\.last\)\/1000\)\)/,
  '한 프레임 지연이 보스 시간을 통째로 없애지 못하게 제한해야 한다.');

for (const [name, source] of [
  ['미적분 러시', calcRush],
  ['미적분 확장 게임', calcTopics],
  ['기하 러시', geoRush],
  ['타원 러시', ellipseRush]
]) {
  assert.match(source, /Math\.min\(\.25,Math\.max\(0,\(now-[^)]+\)\/1000\)\)/,
    `${name}: 백그라운드 복귀 시 큰 시간 점프를 막아야 한다.`);
}
assert.match(geoArena, /this\.timerRemaining=Math\.max\(0,this\.timerRemaining-elapsed\)/,
  '기하 아레나는 절대 시각이 아니라 안전한 프레임 누적으로 시간을 줄여야 한다.');
assert.match(geoArena, /Math\.min\(250,Math\.max\(0,now-last\)\)/,
  '기하 아레나도 한 프레임 최대 차감을 제한해야 한다.');

console.log('motion system and game timer safety tests: ok');
