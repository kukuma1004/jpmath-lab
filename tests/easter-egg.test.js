/* 숨은 손님이 사이트 어디에나 붙어 있는지 본다.

   이스터에그는 아무도 안내하지 않으므로 조용히 깨져도 아무도 모른다.
   그래서 여기서 세 가지를 지킨다 — 모든 페이지에 붙어 있는가, 예순네 종을
   손으로 옮겨 적지 않았는가, 그리고 홈으로 가는 길을 막지 않았는가. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

const js = read('jp-easter.js');
const css = read('jp-easter.css');
const nav = read('jp-nav-2.js');

/* 쉰다섯 장의 HTML 에 줄을 더하는 대신 머리띠가 불러 준다.
   머리띠는 모든 페이지에 있으므로 이스터에그도 모든 페이지에 있다. */
assert.match(nav, /jp-easter\.js\?v=\d+/, '머리띠가 이스터에그를 불러와야 한다.');
assert.match(nav, /jp-easter\.css\?v=\d+/, '겉모습도 같이 불러와야 한다.');

// 판이 어긋나면 고쳐도 옛것이 돈다. 실제로 한 번 겪었다.
const jsVersion = /jp-easter\.js\?v=(\d+)/.exec(nav)[1];
const cssVersion = /jp-easter\.css\?v=(\d+)/.exec(nav)[1];
assert.ok(Number(jsVersion) >= 1 && Number(cssVersion) >= 1, '판 번호가 있어야 한다.');

// 머리띠를 쓰는 모든 페이지가 같은 판을 봐야 한다
const pages = fs.readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .map((f) => f)
  .concat(fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')
    .flatMap((d) => fs.readdirSync(path.join(ROOT, d.name))
      .filter((f) => f.endsWith('.html'))
      .map((f) => `${d.name}/${f}`)));

const withNav = pages.filter((p) => read(p).includes('jp-nav-2.js'));
assert.ok(withNav.length >= 50, `머리띠를 쓰는 페이지가 쉰 장은 넘어야 한다 — 지금 ${withNav.length}장`);
const navVersions = new Set(withNav.map((p) => /jp-nav-2\.js\?v=(\d+)/.exec(read(p))?.[1]));
assert.equal(navVersions.size, 1,
  `머리띠 판이 페이지마다 다르면 일부만 옛 코드를 본다 — ${[...navVersions].join(', ')}`);

/* 보스는 그림 목록에서 가져온다. 예순네 종을 여기 옮겨 적으면
   보스를 더할 때마다 어긋난다. */
assert.match(js, /boss-image-manifest\.json/, '보스 목록은 그림 목록에서 가져와야 한다.');
const manifest = JSON.parse(read('assets/bosses/boss-image-manifest.json'));
const entries = Object.values(manifest.images);
assert.equal(entries.length, 64, '그림 목록은 예순네 종이어야 한다.');
for (const [id, v] of Object.entries(manifest.images)) {
  assert.ok(v.thumb, `${id}에 작은 그림이 없다.`);
  assert.ok(v.name, `${id}에 이름이 없다. 이스터에그가 이름을 부른다.`);
  assert.ok(fs.existsSync(path.join(ROOT, 'assets/bosses', v.thumb)), `그림 파일이 없다: ${v.thumb}`);
}

/* 머리띠의 JP 는 홈으로 가는 링크다. 두드림을 세느라 이동을 붙들었으므로,
   더 두드리지 않으면 반드시 홈으로 보내 주어야 한다. */
assert.match(js, /window\.location\.href = link\.href/, '더 두드리지 않으면 홈으로 가야 한다.');
assert.match(js, /metaKey \|\| event\.ctrlKey/, '새 탭으로 열려는 클릭은 막지 않는다.');
assert.match(js, /\.global-brand-mark/, '동그란 JP 마크만 잡아야 한다. 옆 글자는 곧장 이동한다.');

// 두드림 횟수는 우연히 닿지 않을 만큼, 그러나 포기하지 않을 만큼
const taps = Number(/TAPS_NEEDED = (\d+)/.exec(js)[1]);
assert.ok(taps >= 5 && taps <= 10, `두드림 횟수가 ${taps}번이면 너무 쉽거나 너무 멀다.`);

// 화면을 가리면 안 된다 — 층은 클릭을 통과시키고 보스만 눌린다
assert.match(css, /\.jp-easter-layer\{[^}]*pointer-events:none/, '이스터에그 층은 클릭을 통과시켜야 한다.');
assert.match(css, /\.jp-easter-boss\{[^}]*pointer-events:auto/, '보스 자신은 눌려야 한다.');

// 움직임을 줄여 달라는 사람에게는 걷지 않는다
assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{[\s\S]{0,400}jpEasterFade/,
  '움직임을 줄이는 설정에서는 걷지 않고 잠깐 나타났다 사라진다.');

// 읽는 기계에게는 장식일 뿐이다
assert.match(js, /aria-hidden/, '이스터에그 층은 읽는 기계에서 빠져야 한다.');

console.log(`이스터에그 검사 통과 — 머리띠를 쓰는 ${withNav.length}장 · 보스 ${entries.length}종 · ${taps}번 두드림`);
