/* QR 공유 페이지를 지킨다.

   "QR 이 안 들어가진다" 는 말을 두 번 들었다.

   처음에는 담긴 주소가 문제였다. 파일을 더블클릭해서 열면 location.origin 이
   "null" 이라 null/C:/Users/... 가 담기고, 폰은 그것을 열 수 없다.

   두 번째는 QR 자체가 문제였다. 형식정보(오류정정 수준과 마스크 번호)를 놓는
   자리가 행과 열이 뒤바뀌어 있었다. 그런데 그때 이 파일은 직접 짠 해독기로
   검사했고, 그 해독기도 똑같이 뒤바뀐 자리를 읽었기 때문에 통과했다.
   만든 쪽과 읽는 쪽이 같은 착각을 하면 서로 맞다고 한다.

   그래서 이제 남이 만든 해독기 jsQR(tests/vendor, Apache-2.0)로 읽는다.
   우리 코드와 아무것도 공유하지 않는 해독기가 읽어야 통과다.

   세 가지를 본다.
     1) 폰에서 열리지 않는 주소면 배포 주소를 대신 담고, 그 사실을 알린다.
     2) 뼈대가 규격대로다 — 파인더·타이밍·고정 모듈·형식정보 두 사본.
     3) jsQR 이 실제로 읽는다 — 페이지가 그리는 SVG 를 그대로 되살려서. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const jsQR = require(path.join(__dirname, 'vendor', 'jsQR.js'));

// ── 1) 어느 주소를 담는가 ─────────────────────────────────────────
const page = read('공유.html');

const site = /data-site="([^"]+)"/.exec(page);
assert.ok(site, '배포 주소를 적어 둔 자리(data-site)가 있어야 한다.');
assert.match(site[1], /^https:\/\/.+\/$/, `배포 주소는 https 로 끝에 / 가 있어야 한다 — ${site[1]}`);

assert.match(page, /const HOME = reachable \? here : SITE;/,
  '폰에서 열리는 주소면 그것을, 아니면 배포 주소를 담아야 한다.');
assert.match(page, /data-warn/, '배포 주소를 대신 담았으면 화면에 알려야 한다.');

/* 페이지가 쓰는 판정을 그대로 떼어 내어 상황별로 돌려 본다.
   손으로 옮겨 적으면 페이지와 어긋나므로 소스에서 뽑는다. */
const privateRe = /const PRIVATE = (\/.+\/);/.exec(page);
assert.ok(privateRe, '내부망 판정 regex 를 찾지 못했다.');
const PRIVATE = vm.runInNewContext(privateRe[1]);
const SITE = site[1];
const pick = (protocol, hostname, origin, pathname) => {
  const here = origin + pathname.replace(/[^/]*$/, '');
  const reachable = /^https?:$/.test(protocol) && !PRIVATE.test(hostname);
  return reachable ? here : SITE;
};

const cases = [
  ['파일로 열기', pick('file:', '', 'null', '/C:/Users/x/공유.html'), SITE],
  ['로컬 서버', pick('http:', '127.0.0.1', 'http://127.0.0.1:8765', '/공유.html'), SITE],
  ['교실 내부망', pick('http:', '192.168.0.7', 'http://192.168.0.7:8080', '/공유.html'), SITE],
  ['사설망 10.x', pick('http:', '10.0.0.5', 'http://10.0.0.5', '/공유.html'), SITE],
  ['배포본', pick('https:', 'kukuma1004.github.io', 'https://kukuma1004.github.io', '/jpmath-lab/공유.html'),
    'https://kukuma1004.github.io/jpmath-lab/'],
  // 짧은 도메인을 새로 붙여도 페이지를 고칠 필요가 없어야 한다
  ['짧은 도메인', pick('https:', 'jpmath.kr', 'https://jpmath.kr', '/공유.html'), 'https://jpmath.kr/']
];
for (const [name, got, want] of cases) {
  assert.equal(got, want, `${name}: QR 에 ${want} 가 담겨야 하는데 ${got}`);
  assert.doesNotMatch(got, /^null|127\.0\.0\.1|localhost|^file:/, `${name}: 폰이 못 여는 주소가 담겼다 — ${got}`);
}

// 여백은 규격대로 4칸. 3칸으로 두었더니 까다로운 스캐너가 놓쳤다.
const marginMatch = /margin: (\d+)/.exec(page);
assert.ok(marginMatch && Number(marginMatch[1]) >= 4, `QR 여백은 4칸 이상이어야 한다 — 지금 ${marginMatch ? marginMatch[1] : '없음'}`);
const MARGIN = Number(marginMatch[1]);

// 인코더를 고치면 캐시 번호도 올려야 폰이 옛 파일을 버린다
assert.match(page, /vendor\/qr\.js\?v=([2-9]|\d{2,})/, '고친 qr.js 가 캐시에 막히지 않게 v= 를 올려야 한다.');

// ── 2) 뼈대가 규격대로인가 ────────────────────────────────────────
const box = { window: {} };
vm.runInNewContext(read('vendor/qr.js'), box);
const JPQR = box.window.JPQR;
assert.ok(JPQR && JPQR.matrix && JPQR.svg, 'vendor/qr.js 가 JPQR 을 내놓아야 한다.');

const m = JPQR.matrix(SITE, { ec: 'M' });
const n = m.length, version = (n - 17) / 4;
const at = (r, c) => (m[r][c] ? 1 : 0);

// 파인더·타이밍은 마스크와 무관하게 늘 같은 모양이다
const finder = (r0, c0) => {
  const want = [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]];
  for (let r = 0; r < 7; r += 1) for (let c = 0; c < 7; c += 1) if (at(r0 + r, c0 + c) !== want[r][c]) return false;
  return true;
};
assert.ok(finder(0, 0) && finder(0, n - 7) && finder(n - 7, 0), '파인더 패턴이 어긋났다.');
assert.ok([...Array(n - 16).keys()].every((i) => at(6, 8 + i) === (i % 2 === 0 ? 1 : 0)), '가로 타이밍 줄이 어긋났다.');
assert.ok([...Array(n - 16).keys()].every((i) => at(8 + i, 6) === (i % 2 === 0 ? 1 : 0)), '세로 타이밍 줄이 어긋났다.');
assert.equal(at(4 * version + 9, 8), 1, '고정 검은 모듈이 비어 있다.');

/* 형식정보 — 규격(ISO/IEC 18004) 자리에서 읽는다. [행, 열], 비트 0 이 최하위.
   첫 사본은 8열 위쪽 → (7,8) → (8,8) → (8,7) → 8행 왼쪽,
   둘째 사본은 8행 오른쪽 8칸과 8열 아래쪽 7칸이다. 비트 14 는 (8,0) 에 온다.
   예전에는 이 자리가 행과 열이 뒤바뀌어 있었다 — 그 자리를 여기서 다시
   읽으면 두 사본이 서로 어긋나므로 곧바로 걸린다. */
const firstPos = (i) => (i < 6 ? [i, 8] : i === 6 ? [7, 8] : i === 7 ? [8, 8] : i === 8 ? [8, 7] : [8, 14 - i]);
const secondPos = (i) => (i < 8 ? [8, n - 1 - i] : [n - 15 + i, 8]);
const readFormat = (posOf) => { let v = 0; for (let i = 0; i < 15; i += 1) { const [r, c] = posOf(i); v |= at(r, c) << i } return v };
const fmt1 = readFormat(firstPos), fmt2 = readFormat(secondPos);
assert.equal(fmt1, fmt2, '형식정보의 두 사본이 서로 다르다. 스캐너가 어느 쪽도 믿지 못한다.');
assert.equal(firstPos(14).join(','), '8,0', '형식정보 비트 14 는 (8행, 0열) 에 와야 한다.');
const un = fmt1 ^ 0x5412;
assert.equal({ 0: 'M', 1: 'L', 2: 'H', 3: 'Q' }[(un >> 13) & 3], 'M',
  '형식정보의 오류정정 수준이 만들 때와 다르다. 스캐너가 해독에 실패한다.');
let bch = (un >> 10) << 10;
for (let i = 4; i >= 0; i -= 1) if ((bch >> (i + 10)) & 1) bch ^= 0x537 << i;
assert.equal(((un >> 10) << 10) | bch, un, '형식정보의 오류정정 비트가 맞지 않는다.');
assert.equal((un >> 10) & 7, m.mask, '형식정보에 적힌 마스크 번호가 실제로 쓴 마스크와 다르다.');

// ── 3) 남이 만든 해독기가 읽는가 ──────────────────────────────────
/* 페이지가 화면에 올리는 것은 JPQR.svg() 의 결과다. 그 SVG 의 path 를 되읽어
   모듈 격자를 다시 세우고, 그것을 흰 바탕에 픽셀로 구워서 jsQR 에 넘긴다.
   matrix() 만 읽으면 svg() 가 조용히 깨져도 모른다. */
function svgToGrid(svg) {
  const vb = /viewBox="0 0 (\d+) (\d+)"/.exec(svg);
  const size = Number(vb[1]);
  const g = Array.from({ length: size }, () => new Array(size).fill(0));
  const d = /<path d="([^"]*)"/.exec(svg)[1];
  const seg = /M(\d+) (\d+)h(\d+)v1h-\d+z/g;
  let s;
  while ((s = seg.exec(d))) {
    const x = Number(s[1]), y = Number(s[2]), w = Number(s[3]);
    for (let k = 0; k < w; k += 1) g[y][x + k] = 1;
  }
  return g;
}
function decode(grid) {
  const px = 6, N = grid.length, W = N * px;
  const data = new Uint8ClampedArray(W * W * 4).fill(255);
  for (let y = 0; y < N; y += 1) for (let x = 0; x < N; x += 1) if (grid[y][x]) {
    for (let dy = 0; dy < px; dy += 1) for (let dx = 0; dx < px; dx += 1) {
      const i = ((y * px + dy) * W + x * px + dx) * 4;
      data[i] = data[i + 1] = data[i + 2] = 0;
    }
  }
  const r = jsQR(data, W, W);
  return r ? r.data : null;
}

// SVG 에서 되살린 격자가 matrix() 와 한 칸도 다르지 않아야 한다
const rebuilt = svgToGrid(JPQR.svg(SITE, { margin: MARGIN }));
assert.equal(rebuilt.length, n + 2 * MARGIN, 'SVG 의 크기가 여백까지 더한 칸 수와 다르다.');
for (let y = 0; y < n; y += 1) for (let x = 0; x < n; x += 1) {
  assert.equal(rebuilt[y + MARGIN][x + MARGIN], at(y, x), `SVG 의 (${y},${x}) 칸이 격자와 다르다.`);
}

/* 여러 길이·마스크를 두루 밟게 고른다. 한글 경로는 페이지가 퍼센트 인코딩해
   담지만, 날 한글이 들어가도 UTF-8 로 읽혀야 한다. */
const TEXTS = [
  SITE,
  'https://kukuma1004.github.io/jpmath-lab/AI%ED%82%AC%EB%9F%AC%EB%AC%B8%EC%A0%9C/',
  'https://kukuma1004.github.io/jpmath-lab/수업창고/',
  'https://jpmath.kr/',
  'hello',
  'JP Math Lab',
  'https://example.com/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r'
];
const masks = new Set();
for (const t of TEXTS) {
  const g = JPQR.matrix(t);
  masks.add(g.mask);
  const got = decode(svgToGrid(JPQR.svg(t, { margin: MARGIN })));
  assert.equal(got, t, `jsQR 이 읽지 못했다 (버전 ${g.version}, 마스크 ${g.mask}) — "${t}" 대신 ${JSON.stringify(got)}`);
}
assert.ok(masks.size >= 2, '여러 마스크를 밟아 봐야 한다 — 한 가지 마스크만으로는 형식정보 오류를 놓칠 수 있다.');

console.log(`QR 공유 검사 통과 — ${cases.length}가지 상황 · ${n}×${n} 칸 · jsQR 이 ${TEXTS.length}개를 읽음 (마스크 ${[...masks].sort().join(',')})`);
