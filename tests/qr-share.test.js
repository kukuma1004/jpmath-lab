/* QR 공유 페이지를 지킨다.

   "QR 이 안 들어가진다" 는 말을 들었다. QR 자체는 멀쩡했다 — 화면에 그려진
   SVG 를 구워서 카메라처럼 읽어 보니 주소가 정확히 나왔다. 문제는 어느 주소를
   담느냐였다. 파일을 더블클릭해서 열면 location.origin 이 "null" 이라
   null/C:/Users/... 가 담기고, 폰은 그것을 열 수 없다.

   그래서 두 가지를 지킨다.
     1) 폰에서 열리지 않는 주소면 배포 주소를 대신 담고, 그 사실을 알린다.
     2) QR 자체가 규격에 맞는다 — 여백 4칸, 형식정보와 데이터가 제대로 나온다.
        생성기를 손대다 조용히 깨지면 아무도 모른다. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

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
const margin = /margin: (\d+)/.exec(page);
assert.ok(margin && Number(margin[1]) >= 4, `QR 여백은 4칸 이상이어야 한다 — 지금 ${margin ? margin[1] : '없음'}`);

// ── 2) QR 자체가 제대로 만들어지는가 ──────────────────────────────
const box = { window: {} };
vm.runInNewContext(read('vendor/qr.js'), box);
const JPQR = box.window.JPQR;
assert.ok(JPQR && JPQR.matrix, 'vendor/qr.js 가 JPQR 을 내놓아야 한다.');

const text = SITE;
const m = JPQR.matrix(text, { ec: 'M' });
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

// 형식정보 — 오류정정 수준과 마스크 번호가 제대로 적혀야 스캐너가 읽는다
const fmtPos = [];
for (let i = 0; i < 15; i += 1) {
  if (i < 6) fmtPos.push([8, i]);
  else if (i < 8) fmtPos.push([8, i + 1]);
  else if (i === 8) fmtPos.push([7, 8]);
  else fmtPos.push([14 - i, 8]);
}
let fmt = 0;
fmtPos.forEach(([r, c], i) => { fmt |= at(r, c) << i });
const un = fmt ^ 0x5412;
assert.equal({ 0: 'M', 1: 'L', 2: 'H', 3: 'Q' }[(un >> 13) & 3], 'M',
  '형식정보의 오류정정 수준이 만들 때와 다르다. 스캐너가 해독에 실패한다.');
const maskNo = (un >> 10) & 7;
assert.ok(maskNo >= 0 && maskNo <= 7, '마스크 번호가 범위를 벗어났다.');
let bch = ((un >> 10) << 10);
for (let i = 4; i >= 0; i -= 1) if ((bch >> (i + 10)) & 1) bch ^= 0x537 << i;
assert.equal((((un >> 10) << 10) | bch), un, '형식정보의 오류정정 비트가 맞지 않는다.');

/* 담긴 글자를 실제로 꺼내 본다. 여기까지 맞으면 카메라도 읽는다. */
const fn = Array.from({ length: n }, () => new Array(n).fill(false));
const mark = (r0, c0, h, w) => {
  for (let r = 0; r < h; r += 1) for (let c = 0; c < w; c += 1) {
    const R = r0 + r, C = c0 + c;
    if (R >= 0 && R < n && C >= 0 && C < n) fn[R][C] = true;
  }
};
mark(0, 0, 9, 9); mark(0, n - 8, 9, 8); mark(n - 8, 0, 8, 9);
for (let i = 0; i < n; i += 1) { fn[6][i] = true; fn[i][6] = true }
if (version >= 2) { const c = n - 7; mark(c - 2, c - 2, 5, 5) }

const MASKS = [
  (r, c) => (r + c) % 2 === 0, (r, c) => r % 2 === 0, (r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0, (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2 + (r * c) % 3) === 0,
  (r, c) => (((r * c) % 2 + (r * c) % 3) % 2) === 0,
  (r, c) => (((r + c) % 2 + (r * c) % 3) % 2) === 0
];
const mk = MASKS[maskNo];
const bits = [];
let up = true;
for (let col = n - 1; col > 0; col -= 2) {
  if (col === 6) col -= 1;
  for (let k = 0; k < n; k += 1) {
    const row = up ? n - 1 - k : k;
    for (const c of [col, col - 1]) {
      if (fn[row][c]) continue;
      bits.push(at(row, c) ^ (mk(row, c) ? 1 : 0));
    }
  }
  up = !up;
}
assert.equal(bits.slice(0, 4).join(''), '0100', '바이트 모드로 담기지 않았다.');
let len = 0;
for (let i = 4; i < 12; i += 1) len = (len << 1) | bits[i];
assert.equal(len, Buffer.byteLength(text, 'utf8'), `담긴 길이가 ${len} 인데 주소는 ${text.length}자.`);
const bytes = [];
for (let i = 0; i < len; i += 1) {
  let v = 0;
  for (let j = 0; j < 8; j += 1) v = (v << 1) | bits[12 + i * 8 + j];
  bytes.push(v);
}
assert.equal(Buffer.from(bytes).toString('utf8'), text,
  'QR 에서 꺼낸 주소가 담으려던 주소와 다르다.');

console.log(`QR 공유 검사 통과 — ${cases.length}가지 상황 · ${n}×${n} 칸 · "${text}" 해독 확인`);
