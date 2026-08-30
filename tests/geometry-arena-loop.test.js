const assert = require('node:assert/strict');
const fs = require('node:fs');

const common = fs.readFileSync('기하/기하_공통.js', 'utf8');
const styles = fs.readFileSync('기하/기하_공통.css', 'utf8');

assert.doesNotThrow(() => new Function(common));
assert.match(common, /jp-game-telemetry\.js/);
assert.match(common, /gameId:`geometry-\$\{this\.c\.id\}`/);
assert.match(common, /data-final-accuracy/);
assert.match(common, /data-final-best/);
assert.match(common, /data-final-play-index/);
assert.match(common, /바로 다시하기/);
assert.match(common, /personalBest/);
assert.match(styles, /\.result-stats/);
assert.match(styles, /\.result-feedback/);

const lessonPages = fs.readdirSync('기하')
  .filter(name => name.endsWith('.html'))
  .filter(name => fs.readFileSync(`기하/${name}`, 'utf8').includes('기하_공통.js'));

assert.ok(lessonPages.length >= 12, '기하 단원 페이지들이 공통 아레나를 사용해야 한다.');

console.log(`geometry arena loop tests: ok (${lessonPages.length} pages)`);
