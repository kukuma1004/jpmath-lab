const assert = require('node:assert/strict');
const fs = require('node:fs');

const pages = [
  ['미적분1/미적분1_극대극소.html', ['peak', 'sign']],
  ['미적분1/미적분1_삼차함수그래프.html', ['cubicshape', 'cubiccond']],
  ['미적분1/미적분1_사차함수그래프.html', ['quarticcount', 'quarticmatch']]
];

for (const [file, gameIds] of pages) {
  const html = fs.readFileSync(file, 'utf8');
  assert.match(html, /jp-game-telemetry\.js/);
  assert.match(html, /data-final-accuracy/);
  assert.match(html, /data-final-best/);
  assert.match(html, /data-final-play-index/);
  assert.match(html, /data-replay>바로 다시하기/);
  assert.match(html, /data-change-mode/);
  assert.match(html, /gameId:`calculus-\$\{cfg\.id\}`/);
  for (const gameId of gameIds) assert.match(html, new RegExp(`id:'${gameId}'`));

  const inline = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));
  assert.doesNotThrow(() => new Function(inline), `${file} 인라인 스크립트 문법`);
}

console.log('calculus arcade loop tests: ok');
