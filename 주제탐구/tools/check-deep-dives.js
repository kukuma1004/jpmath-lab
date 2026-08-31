/* 깊이 탐구 표에 적힌 수를 다시 계산해서 맞춰 본다.
   씨앗 하나마다 "이 표는 이렇게 나와야 한다"를 코드로 적어 두고,
   파일에 적힌 값과 다르면 실패시킨다.

   실행: node 주제탐구/tools/check-deep-dives.js   (저장소 뿌리에서) */
'use strict';

const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const DIVES = path.join(ROOT, '주제탐구', 'deep-dives');

const ctx = { console, document: { addEventListener() {} } };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(DIVES, 'index.js'), 'utf8'), ctx, { filename: 'index.js' });
for (const file of fs.readdirSync(DIVES).sort()) {
  if (file === 'index.js' || !file.endsWith('.js')) continue;
  vm.runInContext(fs.readFileSync(path.join(DIVES, file), 'utf8'), ctx, { filename: file });
}
const items = ctx.JPDeepDives.items;

let failures = 0;
let checked = 0;

function fail(id, msg) {
  failures += 1;
  console.log('  ✗ ' + id + ' — ' + msg);
}

// 표의 (행, 열) 칸이 기대한 수와 같은지. 문자열이 아니라 수로 견준다.
function cell(id, r, c) {
  const item = items[id];
  if (!item) { fail(id, '깊이 탐구가 없다'); return null; }
  const row = item.dataRows[r];
  if (!row) { fail(id, `${r}행이 없다`); return null; }
  return row[c];
}

function num(text) {
  const t = String(text).replace(/−/g, '-').replace(/,/g, '').replace(/[^0-9.\-eE/]/g, '');
  if (t.includes('/')) {
    const [a, b] = t.split('/').map(Number);
    return a / b;
  }
  return parseFloat(t);
}

function expect(id, r, c, want, tol = 5e-4, label = '') {
  checked += 1;
  const raw = cell(id, r, c);
  if (raw === null) return;
  const got = num(raw);
  if (!Number.isFinite(got)) { fail(id, `${r}행 ${c}열이 수가 아니다: "${raw}"`); return; }
  if (Math.abs(got - want) > tol) {
    fail(id, `${r}행 ${c}열${label ? ' ' + label : ''} — 적힌 값 ${raw}, 계산 값 ${want}`);
  }
}

function same(id, r, c, want, label = '') {
  checked += 1;
  const raw = cell(id, r, c);
  if (raw === null) return;
  if (String(raw).trim() !== want) {
    fail(id, `${r}행 ${c}열${label ? ' ' + label : ''} — 적힌 값 "${raw}", 기대 "${want}"`);
  }
}

console.log('깊이 탐구 표 검산');

/* ── 미적분Ⅰ ── */

// 도함수 부호 추적: f'(x) = 3x² − 3
{
  const id = 'CAL-DER-SIGN-TRACK-001';
  const fp = (x) => 3 * x * x - 3;
  [[0, -2], [1, -1], [2, 0], [3, 1], [4, 2]].forEach(([r, x]) => {
    expect(id, r, 0, x, 1e-9, 'x');
    expect(id, r, 1, fp(x), 1e-9, "f'");
  });
}

// 중복도: f(x) = (x−1)^m 을 0.9 와 1.1 에서
{
  const id = 'CAL-ROOT-MULTIPLICITY-001';
  [1, 2, 3, 4].forEach((m, r) => {
    expect(id, r, 0, m, 1e-9, 'm');
    expect(id, r, 1, Math.pow(-0.1, m), 1e-12, 'f(0.9)');
    expect(id, r, 2, Math.pow(0.1, m), 1e-12, 'f(1.1)');
    same(id, r, 4, m % 2 === 1 ? '통과' : '접촉', '판정');
  });
}

// 삼차함수: b² − 3ac 와 극값 개수
{
  const id = 'CAL-CUBIC-SHAPE-CONTROL-001';
  const cases = [
    { a: 1, b: 0, c: -3, ext: 2 },
    { a: 1, b: 0, c: 0, ext: 0 },
    { a: 1, b: 0, c: 3, ext: 0 },
    { a: 1, b: 3, c: 3, ext: 0 },
    { a: -1, b: 0, c: 3, ext: 2 }
  ];
  cases.forEach((k, r) => {
    const disc = k.b * k.b - 3 * k.a * k.c;
    expect(id, r, 1, disc, 1e-9, 'b²−3ac');
    // 극값은 f' 의 서로 다른 실근이 둘일 때만 생긴다.
    const ext = disc > 0 ? 2 : 0;
    if (ext !== k.ext) fail(id, `${r}행 검산표 자체가 틀렸다`);
    expect(id, r, 4, k.ext, 1e-9, '극값 개수');
  });
}

// 변위와 이동거리: v(t) = t − 2 on [0,4]
{
  const id = 'CAL-ACCUMULATION-REVERSE-001';
  const F = (t) => t * t / 2 - 2 * t;              // ∫v dt
  const absInt = (a, b) => {                       // ∫|v| dt, 부호 바뀌는 t=2 에서 자른다
    const pieces = [];
    if (a < 2) pieces.push([a, Math.min(b, 2)]);
    if (b > 2) pieces.push([Math.max(a, 2), b]);
    return pieces.reduce((s, [p, q]) => s + Math.abs(F(q) - F(p)), 0);
  };
  let disp = 0, dist = 0;
  [[0, 1], [1, 2], [2, 3], [3, 4]].forEach(([a, b], r) => {
    const d = F(b) - F(a);
    disp += d; dist += absInt(a, b);
    expect(id, r, 1, d, 1e-9, '∫v');
    expect(id, r, 2, disp, 1e-9, '누적 위치');
    expect(id, r, 3, absInt(a, b), 1e-9, '∫|v|');
    expect(id, r, 4, dist, 1e-9, '누적 거리');
  });
  if (Math.abs(disp) > 1e-12) fail(id, '전체 변위가 0 이 아니다');
  if (Math.abs(dist - 4) > 1e-12) fail(id, '전체 이동거리가 4 가 아니다');
}

// 자유낙하 평균속도: x(t) = 4.9t², t = 2
{
  const id = 'BANK-MOMENT-01';
  const x = (t) => 4.9 * t * t;
  [1, 0.5, 0.1, 0.01].forEach((h, r) => {
    expect(id, r, 0, h, 1e-12, 'h');
    expect(id, r, 1, x(2 + h) - x(2), 1e-9, 'Δx');
    expect(id, r, 2, (x(2 + h) - x(2)) / h, 1e-6, '평균속도');
    expect(id, r, 3, Math.abs((x(2 + h) - x(2)) / h - 19.6), 1e-6, '19.6 과의 차이');
  });
}

// 할선 기울기와 방향각: f(x) = x², a = 1
{
  const id = 'BANK-MOMENT-02';
  [1, 0.5, 0.1, 0.01].forEach((h, r) => {
    expect(id, r, 0, h, 1e-12, 'h');
    expect(id, r, 1, (1 + h) * (1 + h), 1e-9, 'f(1+h)');
    expect(id, r, 2, 2 + h, 1e-9, '기울기');
    expect(id, r, 3, Math.atan(2 + h) * 180 / Math.PI, 5e-3, '방향각');
  });
  expect(id, 4, 3, Math.atan(2) * 180 / Math.PI, 5e-3, '극한 방향각');
}

// 사다리꼴 적분: v(t) = 12t − 2t² on [0,5], Δt = 1
{
  const id = 'BANK-MOMENT-03';
  const v = (t) => 12 * t - 2 * t * t;
  let acc = 0;
  for (let t = 0; t <= 5; t += 1) {
    expect(id, t, 0, t, 1e-9, 't');
    expect(id, t, 1, v(t), 1e-9, 'v');
    if (t > 0) {
      const trap = (v(t - 1) + v(t)) / 2;
      acc += trap;
      expect(id, t, 2, trap, 1e-9, '사다리꼴');
      expect(id, t, 3, acc, 1e-9, '누적');
    }
  }
  const exact = 6 * 25 - (2 / 3) * 125;
  if (Math.abs(exact - 200 / 3) > 1e-9) fail(id, '참값 계산이 어긋난다');
  if (Math.abs(acc - 65) > 1e-9) fail(id, `사다리꼴 합이 65 가 아니다: ${acc}`);
  if (Math.abs(exact - acc - 5 / 3) > 1e-9) fail(id, '오차가 5/3 이 아니다');
}

// 제논: Sn = 1 − (1/2)^n
{
  const id = 'BANK-SPLUS-01';
  for (let n = 1; n <= 6; n += 1) {
    const step = Math.pow(0.5, n);
    expect(id, n - 1, 0, n, 1e-9, 'n');
    expect(id, n - 1, 1, step, 1e-12, '이번 단계');
    expect(id, n - 1, 2, 1 - step, 1e-12, '누적');
    expect(id, n - 1, 3, step, 1e-12, '남은 거리');
  }
}

// 활꼴 높이: r = 100
{
  const id = 'BANK-SPLUS-02';
  const sag = (w) => 100 - Math.sqrt(10000 - (w / 2) * (w / 2));
  [100, 20, 4, 1].forEach((w, r) => {
    expect(id, r, 0, w, 1e-9, 'w');
    expect(id, r, 1, sag(w), 5e-5, 's');
    expect(id, r, 2, sag(w) / w, 5e-5, 's/w');
  });
}

// 속도계 분해능: 둘레 2 m, 20 m/s
{
  const id = 'BANK-SPLUS-03';
  const circ = 2, speed = 20;
  [1, 0.5, 0.2, 0.1].forEach((dt, r) => {
    expect(id, r, 0, dt, 1e-12, 'Δt');
    expect(id, r, 1, speed * dt / circ, 1e-9, '회전수');
    expect(id, r, 2, speed, 1e-9, '속도');
    expect(id, r, 3, circ / dt, 1e-9, '분해능');
  });
  expect(id, 4, 3, circ / 0.05, 1e-9, '분해능');
}

// 접선 근사 오차: f(x) = x², a = 1 → 오차 = (x−1)²
{
  const id = 'BANK-SPLUS-04';
  [1.1, 1.01, 1.001, 0.9, 0.99].forEach((x, r) => {
    const err = (x - 1) * (x - 1);
    expect(id, r, 0, x, 1e-12, 'x');
    expect(id, r, 1, x * x, 1e-9, 'f(x)');
    expect(id, r, 2, 2 * x - 1, 1e-9, '접선');
    expect(id, r, 3, err, 1e-9, '오차');
    expect(id, r, 4, 1, 1e-9, '오차/(x−1)²');
  });
}

// 롤러코스터 마루: h(x) = 7 − 0.16x²
{
  const id = 'BANK-SPLUS-05';
  const h = (x) => 7 - 0.16 * x * x;
  const hp = (x) => -0.32 * x;
  [-2, -1, 0, 1, 2].forEach((x, r) => {
    expect(id, r, 0, x, 1e-12, 'x');
    expect(id, r, 1, h(x), 1e-9, '높이');
    expect(id, r, 2, hp(x), 1e-9, '기울기');
  });
}

// 상자 최적화: V = 1000, S = 2x² + 4000/x
{
  const id = 'BANK-SPLUS-06';
  const V = 1000;
  [5, 8, 10, 12, 15].forEach((x, r) => {
    expect(id, r, 0, x, 1e-9, 'x');
    expect(id, r, 1, V / (x * x), 5e-4, 'h');
    expect(id, r, 2, 2 * x * x, 1e-9, '2x²');
    expect(id, r, 3, 4 * V / x, 5e-3, '4V/x');
    expect(id, r, 4, 2 * x * x + 4 * V / x, 5e-3, 'S');
  });
  // 최솟값은 정육면체에서
  const S = (x) => 2 * x * x + 4 * V / x;
  let best = 1, bestS = Infinity;
  for (let x = 1; x <= 30; x += 0.001) { if (S(x) < bestS) { bestS = S(x); best = x; } }
  if (Math.abs(best - 10) > 0.01) fail(id, `최적 x 가 10 이 아니다: ${best.toFixed(3)}`);
  if (Math.abs(bestS - 600) > 0.01) fail(id, `최소 겉넓이가 600 이 아니다: ${bestS.toFixed(3)}`);
}

// 아르키메데스: n·sin(π/n), n·tan(π/n)
{
  const id = 'BANK-SPLUS-07';
  [6, 12, 24, 48, 96].forEach((n, r) => {
    const inn = n * Math.sin(Math.PI / n);
    const out = n * Math.tan(Math.PI / n);
    expect(id, r, 0, n, 1e-9, 'n');
    expect(id, r, 1, inn, 5e-6, '내접');
    expect(id, r, 2, out, 5e-6, '외접');
    expect(id, r, 3, out - inn, 5e-6, '간격');
    if (!(inn < Math.PI && Math.PI < out)) fail(id, `n=${n} 에서 π 를 가두지 못한다`);
  });
  // 아르키메데스의 범위와 96각형 값이 어긋나지 않는지
  const lo = 3 + 10 / 71, hi = 3 + 1 / 7;
  if (!(lo < Math.PI && Math.PI < hi)) fail(id, '아르키메데스 범위 서술이 틀렸다');
}

// 계단 속도: 직사각형 누적
{
  const id = 'BANK-SPLUS-08';
  const seg = [[10, 2], [20, 3], [0, 1], [15, 3]];
  let acc = 0;
  seg.forEach(([v, dt], r) => {
    acc += v * dt;
    expect(id, r, 1, v, 1e-9, '속도');
    expect(id, r, 2, dt, 1e-9, '시간');
    expect(id, r, 3, v * dt, 1e-9, '구간 거리');
    expect(id, r, 4, acc, 1e-9, '누적');
  });
  if (acc !== 125) fail(id, `전체 거리가 125 가 아니다: ${acc}`);
}

// 기본정리: F(x) = x², f(x) = 2x, h = 0.001
{
  const id = 'BANK-SPLUS-09';
  const h = 0.001;
  [1, 2, 3, 4].forEach((x, r) => {
    expect(id, r, 0, x, 1e-9, 'x');
    expect(id, r, 1, x * x, 1e-9, 'F(x)');
    expect(id, r, 2, (x + h) * (x + h), 1e-9, 'F(x+h)');
    expect(id, r, 3, ((x + h) * (x + h) - x * x) / h, 5e-4, '수치미분');
    expect(id, r, 4, 2 * x, 1e-9, 'f(x)');
  });
}

/* ── 기하 ── */

// 시야 판정: h·e = cos θ, 시야각 90° 경계는 cos45°
{
  const id = 'GEO-VEC-DOT-FOV-001';
  const bound = Math.cos(Math.PI / 4);
  [0, 30, 45, 60, 120].forEach((deg, r) => {
    const dot = Math.cos(deg * Math.PI / 180);
    expect(id, r, 0, deg, 1e-9, 'θ');
    expect(id, r, 1, dot, 5e-4, 'h·e');
    same(id, r, 2, dot >= bound - 1e-9 ? '감지' : '미감지', '판정');
  });
}

/* ── 결과 ── */
const total = Object.keys(items).length;
console.log(`\n깊이 탐구 ${total}개 · 검산한 칸 ${checked}개`);
if (failures) {
  console.log(`✗ ${failures}곳이 어긋난다`);
  process.exit(1);
}
console.log('✓ 모두 맞다');
