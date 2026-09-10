/* AI 킬러문제를 지킨다.

   세 가지를 본다.
     1) 수학이 맞는가 — 조건을 만족하는 함수를 실제로 만들어, 조건이 정말
        성립하는지, 답이 정말 그 값인지, 그런 함수가 하나뿐인지 확인한다.
     2) 두 쪽이 짝이 맞는가 — 공개용 문제지와 수업창고 풀이의 발문이 같아야
        한다. 한쪽만 고치면 수업에서 어긋난다.
     3) 풀이가 새지 않는가 — 문제만 있는 것은 공개, 풀이가 있는 것은 수업창고.
        이 규칙이 이 자료의 뼈대다.

   문항을 고치면 여기도 함께 고쳐야 한다. 그것이 이 파일의 목적이다. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e;

// ── 1) 수학 ────────────────────────────────────────────────────────
const checks = [];
const say = (ok, msg) => { checks.push({ ok, msg }); };

/* 삼차방정식의 실근. 브루트포스로 훑으면 느리고 겹근을 놓치므로 정면으로 푼다.
   x^3+bx^2+cx+d 를 y=x+b/3 으로 눌러 y^3+py+q 로 만든 뒤 판별식으로 가른다. */
function cubicRoots(b, c, d) {
  const p = c - b * b / 3, q = 2 * b ** 3 / 27 - b * c / 3 + d, s = -b / 3;
  const D = -4 * p ** 3 - 27 * q * q;
  let ys;
  if (Math.abs(p) < 1e-12 && Math.abs(q) < 1e-12) ys = [0];
  else if (D > 1e-12) {                              // 서로 다른 세 실근
    const m = 2 * Math.sqrt(-p / 3), th = Math.acos(3 * q / (p * m)) / 3;
    ys = [0, 1, 2].map((k) => m * Math.cos(th - 2 * Math.PI * k / 3));
  } else if (Math.abs(D) <= 1e-12) {                 // 겹근이 있다
    ys = [3 * q / p, -3 * q / (2 * p)];
  } else {                                           // 실근 하나
    const r = Math.sqrt(q * q / 4 + p ** 3 / 27);
    ys = [Math.cbrt(-q / 2 + r) + Math.cbrt(-q / 2 - r)];
  }
  const out = [];
  for (const y of ys.map((y) => y + s).sort((x, z) => x - z))
    if (!out.some((v) => Math.abs(v - y) < 1e-7)) out.push(y);
  return out;
}

/* K01 · 평균값정리의 점이 구간을 빠져나가는 순간
   f=x(x-3)^2 에서 현의 기울기는 (t-3)^2. f' 이 이차식이라 평균값정리의 점은
   c=2±√((m+3)/3) 로 정확히 나온다 — 훑지 않고 세도 된다. */
{
  // f'(1)=r-3 이므로 r=3 하나뿐이다
  const dfAt1 = (r) => 3 - 2 * (3 + r) + 3 * r;
  say([-2, 0, 1, 5, 9].every((r) => near(dfAt1(r), r - 3)),
    'K01 · f′(1)=r-3 이므로 f′(1)=0 은 r=3 하나뿐');

  const f = (x) => x * (x - 3) ** 2, df = (x) => 3 * x * x - 12 * x + 9;
  say(near(f(0), 0) && near(f(3), 0) && near(df(1), 0), 'K01 · f=x(x-3)^2 이 세 조건을 만족한다');

  const N = (t) => {
    const m = (f(t) - f(0)) / t, u = Math.sqrt((m + 3) / 3);
    return [2 - u, 2 + u].filter((c) => c > 1e-9 && c < t - 1e-9).length;
  };
  const jumps = [];
  let last = N(0.02);
  for (let t = 0.02; t < 12; t += 0.002) { const cur = N(t + 0.002); if (cur !== last) jumps.push(t + 0.001); last = cur }
  say(jumps.length === 2, `K01 · N(t) 가 두 곳에서만 바뀐다 (${jumps.length}곳)`);
  say(near(jumps[0], 3, 0.01) && near(jumps[1], 6, 0.01),
    `K01 · 바뀌는 자리는 t=${jumps.map((x) => x.toFixed(2)).join(', ')}`);
  say(N(2) === 1 && N(4) === 2 && N(7) === 1, `K01 · N: t=2→${N(2)}, t=4→${N(4)}, t=7→${N(7)}`);

  /* 그림으로 가는 지름길이 정말 맞는지 — 개수가 바뀌는 것은 접점이 끝점을 지날 때다 */
  say(near(df(3), (f(3) - f(0)) / 3), 'K01 · c=t 가 되는 자리: f′(3)=현의 기울기 → t=3');
  say(near(df(0), (f(6) - f(0)) / 6), 'K01 · c=0 이 되는 자리: f′(0)=현의 기울기 → t=6');
  say(3 + 6 === 9, 'K01 · 답은 3+6=9');
}

/* K02 · 변곡접선은 실근의 개수를 바꾸지 않는다
   y=t 와의 교점을 부호변화로 센다. 접하는 순간은 세지 못하지만, 개수가
   튀는 자리는 양옆에서 그대로 잡히므로 불연속점을 찾는 데는 충분하다. */
{
  const crossings = (f, t) => {
    let n = 0, prev = f(-8) - t;
    for (let x = -8; x < 8; x += 0.002) { const cur = f(x + 0.002) - t; if (prev * cur < 0) n++; prev = cur }
    return n;
  };
  const jumpsOf = (f) => {
    const j = []; let last = crossings(f, -40);
    for (let t = -40; t < 40; t += 0.05) { const cur = crossings(f, t + 0.05); if (cur !== last) j.push(t + 0.025); last = cur }
    return j;
  };
  const q3 = (x) => x ** 4 - 4 * x ** 3;              // f' = 4x^2(x-3) — 변곡접선이 x=0
  const qm3 = (x) => x ** 4 + 4 * x ** 3;             // f' = 4x^2(x+3)
  const Weq = (x) => (x * x - 4) ** 2 - 5;            // 극솟값이 같은 W
  const Wne = (x) => x ** 4 - 2 * x ** 3 - 6 * x * x; // 극솟값이 다른 W

  const j3 = jumpsOf(q3);
  say(j3.length === 1, `K02 · f=x^4-4x^3 은 한 곳에서만 불연속 (${j3.length}곳)`);
  say(j3.length === 1 && near(j3[0], -27, 0.1), `K02 · 그 자리가 t=${j3[0].toFixed(2)}`);
  say(crossings(q3, -0.5) === 2 && crossings(q3, 0.5) === 2,
    'K02 · 변곡접선 높이 t=0 을 지나도 실근의 개수는 둘 그대로');
  say(jumpsOf(Weq).length === 2, `K02 · 극솟값이 같은 W 는 두 곳에서 불연속 (${jumpsOf(Weq).length}곳)`);
  say(jumpsOf(Wne).length === 3, `K02 · 극솟값이 다른 W 는 세 곳에서 불연속 (${jumpsOf(Wne).length}곳)`);

  // f(0)=f'(0)=0 아래에서 극솟값 -q^4/3=-27 이 q=±3 을 남긴다
  say(near(-(3 ** 4) / 3, -27) && near(-((-3) ** 4) / 3, -27),
    'K02 · 극솟값 조건만으로는 q=3 과 q=-3 이 둘 다 산다');
  const decreasingLeft = (f) => { for (let x = -12; x < -1e-6; x += 0.001) if (f(x + 0.001) > f(x) + 1e-12) return false; return true };
  say(decreasingLeft(q3) && !decreasingLeft(qm3), 'K02 · (-∞,0) 에서 감소하는 것은 q=3 뿐');
  say(near(q3(5), 125), `K02 · 답은 f(5)=${q3(5)}`);
}

/* K03 · |f|-f 와 삼중근
   g 는 f<0 인 곳에서만 -2f 다. 삼차함수는 반드시 부호를 바꾸므로
   g 가 꺾이지 않으려면 부호가 바뀌는 근에서 f'=0, 곧 삼중근뿐이다. */
{
  const smooth = [];
  for (let b = -3; b <= 3; b += 1) for (let c = -6; c <= 6; c += 1) for (let d = -8; d <= 8; d += 1) {
    const f = (x) => x ** 3 + b * x * x + c * x + d, df = (x) => 3 * x * x + 2 * b * x + c;
    const flips = cubicRoots(b, c, d).filter((r) => f(r - 1e-4) * f(r + 1e-4) < 0);
    if (flips.every((r) => Math.abs(df(r)) < 1e-3)) smooth.push([b, c, d]);
  }
  const isTriple = (t) => { const p = -t[0] / 3; return near(t[1], 3 * p * p, 1e-6) && near(t[2], -(p ** 3), 1e-6) };
  say(smooth.length > 0 && smooth.every(isTriple),
    `K03 · g 가 꺾이지 않는 삼차는 모두 삼중근 (${smooth.length}개 확인)`);

  const F = (p) => (p <= 0 ? 0 : p < 3 ? p ** 4 / 2 : (p ** 4 - (p - 3) ** 4) / 2);
  const hits = [];
  for (let p = -2; p <= 9; p += 1e-4) if (Math.abs(F(p) - 8) < 1e-4) hits.push(Math.round(p * 1e4) / 1e4);
  const uniq = [...new Set(hits)];
  say(uniq.length === 1 && near(uniq[0], 2, 1e-3), `K03 · 적분이 8 인 p 는 ${uniq.join(', ')} 하나뿐`);
  say(F(3) > 8, `K03 · p>=3 이면 적분이 ${F(3).toFixed(1)} 이상이라 8 이 될 수 없다`);
  say((5 - 2) ** 3 === 27, 'K03 · f(5)=27');
}

/* K04 · 폭 2 의 창을 밀고 간다
   g'(t)=f(t+2)-f(t) 가 아래로 볼록한 이차식이므로 작은 근에서 극대, 큰 근에서
   극소다. 두 근이 ∓1 이라는 것이 계수 둘을 정하고, 상수항은 끝내 안 정해진다. */
{
  const a = -3, b = -1;
  say(near((12 + 4 * a) / 6, 0) && near((8 + 4 * a + 2 * b) / 6, -1),
    `K04 · g′ 의 두 근이 ∓1 이 되는 것은 a=${a}, b=${b} 뿐`);

  const mk = (c) => ({
    f: (x) => x ** 3 + a * x * x + b * x + c,
    F: (x) => x ** 4 / 4 + a * x ** 3 / 3 + b * x * x / 2 + c * x
  });
  const g = (o, t) => o.F(t + 2) - o.F(t);
  for (const c of [0, 5, -7.5, 100]) {
    const o = mk(c);
    say(near(g(o, -1) - g(o, 1), 8, 1e-9),
      `K04 · c=${c} 일 때 g(-1)-g(1)=${(g(o, -1) - g(o, 1)).toFixed(6)}`);
  }
  const o0 = mk(0);
  say(g(o0, -1) > g(o0, -1.4) && g(o0, -1) > g(o0, -0.6), 'K04 · t=-1 에서 극대');
  say(g(o0, 1) < g(o0, 0.6) && g(o0, 1) < g(o0, 1.4), 'K04 · t=1 에서 극소');
  say(near(g(o0, -1), -2, 1e-9) && near(g(o0, 1), -10, 1e-9),
    `K04 · c=0 에서 두 넓이는 ${g(o0, -1)} 과 ${g(o0, 1)}`);
}

/* K05 · 두 극한이 부른 겹근
   lim f/(x-a)=0 은 f(a)=0 과 f'(a)=0 을 한꺼번에 말한다 — 미분계수의 정의다.
   두 자리에서 그러니 사차가 (x-α)^2(x-β)^2 로 통째로 정해진다. */
{
  const lim = (f, a) => [1e-5, -1e-5].map((h) => f(a + h) / h);
  const single = (x) => (x - 2) * (x - 3) * (x - 4) * (x - 5);
  say(Math.min(...lim(single, 2).map(Math.abs)) > 1, 'K05 · 한 겹 근에서는 극한이 0 이 아니다');
  const dbl = (x) => (x - 2) ** 2 * (x - 5) ** 2;
  say(Math.max(...lim(dbl, 2).map(Math.abs)) < 1e-3, 'K05 · 두 겹 근에서라야 극한이 0 이다');

  // f(0)=36 → (αβ)^2=36, f'(1)=0 과 α<1<β → α+β=2
  const found = [];
  for (const prod of [6, -6]) {
    const D = 4 - 4 * prod;                          // t^2-2t+prod=0
    if (D < 0) continue;
    found.push({ prod, a: (2 - Math.sqrt(D)) / 2, b: (2 + Math.sqrt(D)) / 2 });
  }
  say(found.length === 1 && found[0].prod === -6,
    `K05 · αβ=6 은 실수해가 없어 죽고 αβ=-6 만 남는다 (남은 것 ${found.length}가지)`);
  const { a, b } = found[0];
  say(a < 1 && 1 < b, `K05 · α=${a.toFixed(4)} < 1 < β=${b.toFixed(4)}`);
  const f = (x) => (x - a) ** 2 * (x - b) ** 2;
  say(near(f(0), 36, 1e-6), `K05 · f(0)=${f(0).toFixed(6)}`);
  const df = (x) => { const h = 1e-6; return (f(x + h) - f(x - h)) / (2 * h) };
  say(Math.abs(df(1)) < 1e-4, `K05 · f′(1)=${df(1).toExponential(2)}`);
  say(near(f(3), 9, 1e-6), `K05 · f(3)=${f(3).toFixed(6)}`);
  say(near((9 - 3 * 2 + (-6)) ** 2, 9), 'K05 · 합과 곱만으로도 f(3)=9 가 나온다');
}

/* ── SET 02 ───────────────────────────────────────────────────────
   수능 4점의 골격을 맞춘 네 문항. 여기서는 조건이 정말 그 함수를 강제하는지,
   갈린 두 경우 중 하나가 진짜 죽는지를 본다 — 경우를 죽이는 조건이 없으면
   답이 둘이 되어 문항이 무너진다. */

/* S01 · 연속 : g(x)=f(x) (x<t), f(x-2)+a (x>=t)
   연속 <=> f(t)-f(t-2)=a. 삼차의 차분이 이차식이라는 것이 요점. */
{
  const mk = (k) => (x) => x * (x - 2) * (x - k);
  const D = (k) => (t) => mk(k)(t) - mk(k)(t - 2);

  // D 가 정말 이차식인가 — 세 점으로 이차식을 세워 네 번째 점에서 맞춰 본다
  const quadFits = (k) => {
    const d = D(k), [x0, x1, x2, x3] = [0, 1, 2, 5];
    const A = d(x0) / ((x0 - x1) * (x0 - x2)), B = d(x1) / ((x1 - x0) * (x1 - x2)), C = d(x2) / ((x2 - x0) * (x2 - x1));
    const lag = (x) => A * (x - x1) * (x - x2) + B * (x - x0) * (x - x2) + C * (x - x0) * (x - x1);
    return near(lag(x3), d(x3), 1e-9);
  };
  say([4, -2, 7, 0].every(quadFits), 'S01 · f(t)-f(t-2) 는 t 에 대한 이차식이다');

  const minD = (k) => { let m = Infinity; for (let t = -60; t < 60; t += 1e-4) m = Math.min(m, D(k)(t)); return m };
  say([4, -2, 7].every((k) => near(minD(k), -2 * (k - 1) ** 2 / 3, 1e-3)),
    'S01 · D 의 최솟값은 -2(k-1)^2/3');
  const ks = [];
  for (let k = -20; k <= 20; k += 1e-3) if (Math.abs(-2 * (k - 1) ** 2 / 3 + 6) < 1e-6) ks.push(Math.round(k));
  say([...new Set(ks)].length === 2, `S01 · 최솟값이 -6 인 k 는 ${[...new Set(ks)].join(', ')} 둘`);

  // N(a) 가 정말 a < -6 에서만 0 인가
  const countT = (k, a) => {
    let n = 0, d = D(k), prev = d(-40) - a;
    for (let t = -40; t < 40; t += 1e-4) { const cur = d(t + 1e-4) - a; if (prev * cur < 0) n++; prev = cur }
    return n;
  };
  say(countT(4, -7) === 0 && countT(4, -5.9) === 2 && countT(4, 3) === 2,
    `S01 · a=-7 이면 ${countT(4, -7)}개, a=-5.9 면 ${countT(4, -5.9)}개`);
  say(mk(4)(3) < 0 && mk(-2)(3) > 0,
    `S01 · f(3) 의 부호가 두 경우를 가른다 (k=4 는 ${mk(4)(3)}, k=-2 는 ${mk(-2)(3)})`);
  say(mk(4)(5) === 15, `S01 · 답 f(5)=${mk(4)(5)}`);
}

/* S02 · 미분가능성 : g(x)=f(x)|x-a| 가 x=a 에서 꺾이지 않을 조건 */
{
  const smoothAt = (f, a) => {
    const g = (x) => f(x) * Math.abs(x - a), h = 1e-6;
    return Math.abs((g(a + h) - g(a)) / h - (g(a) - g(a - h)) / h) < 1e-3;
  };
  const cubic = (x) => (x - 1) * (x - 3) * (x - 5);
  say(smoothAt(cubic, 1) && smoothAt(cubic, 3) && smoothAt(cubic, 5) && !smoothAt(cubic, 2) && !smoothAt(cubic, 0),
    'S02 · 꺾이지 않는 a 는 f 의 실근일 때뿐');

  const A = (x) => x * x * (x - 3), B = (x) => x * (x - 3) ** 2;
  say(smoothAt(A, 0) && smoothAt(A, 3) && smoothAt(B, 0) && smoothAt(B, 3),
    'S02 · 두 배치 모두 a=0, a=3 에서 꺾이지 않는다 — 합 3 만으로는 못 가른다');
  const dA = (x) => 3 * x * x - 6 * x, dB = (x) => 3 * x * x - 12 * x + 9;
  say(near(dA(2), 0) && !near(dB(2), 0),
    `S02 · f'(2)=0 이 x^2(x-3) 만 남긴다 (다른 쪽은 ${dB(2)})`);
  say(A(5) === 50, `S02 · 답 f(5)=${A(5)}`);
}

/* S03 · 접선 : 접선의 y절편은 f(t)-t f'(t) = -2t^3-pt^2+r — q 가 사라진다 */
{
  const yint = (p, q, r) => (t) => (t ** 3 + p * t * t + q * t + r) - t * (3 * t * t + 2 * p * t + q);
  say([0, 12, -5, 100].every((q) => near(yint(-6, q, 2)(1.7), yint(-6, 0, 2)(1.7))),
    'S03 · 접선의 y절편은 일차항의 계수와 무관하다');

  const tangents = (p) => {                       // 2t^3+pt^2+8=0 의 서로 다른 실근
    const g = (t) => 2 * t ** 3 + p * t * t + 8;
    const rs = []; let prev = g(-30);
    for (let t = -30; t < 30; t += 1e-4) { const cur = g(t + 1e-4); if (prev === 0 || prev * cur < 0) rs.push(t); prev = cur }
    for (let t = -30; t < 30; t += 1e-4) if (Math.abs(g(t)) < 1e-4 && !rs.some((r) => Math.abs(r - t) < 1e-2)) rs.push(t);
    const u = []; for (const r of rs.sort((x, y) => x - y)) if (!u.some((v) => Math.abs(v - r) < 1e-2)) u.push(r);
    return u;
  };
  say(tangents(-6).length === 2, `S03 · p=-6 에서 접점이 둘 (${tangents(-6).map((x) => x.toFixed(2)).join(', ')})`);
  say(tangents(-5).length === 1 && tangents(-8).length === 3,
    `S03 · p=-5 면 ${tangents(-5).length}개, p=-8 이면 ${tangents(-8).length}개 — p=-6 이 경계`);

  const f = (x) => x ** 3 - 6 * x * x + 12 * x + 2, df = (x) => 3 * x * x - 12 * x + 12;
  say(near(f(0), 2) && near(df(1), 3), `S03 · f(0)=${f(0)}, f'(1)=${df(1)}`);
  say([2, -1].every((t) => near(f(t) - t * df(t), 10)), 'S03 · 두 접선이 모두 A(0,10) 을 지난다');
  say(!near(df(2), df(-1)), `S03 · 두 접선은 서로 다른 직선 (기울기 ${df(2)}, ${df(-1)})`);
  say(near(f(4), 18), `S03 · 답 f(4)=${f(4)}`);
}

/* S04 · 롤의 정리 : 접어 뒤집은 조각이 미분가능 <=> f'(t)=0.
   f 의 실근이 넷이라야 f' 의 실근이 셋임을 보장할 수 있다 — 그것이 롤이다. */
{
  const f = (x) => x * (x - 4) * (x - 5) * (x + 1);
  /* 도함수는 식으로 쓴다. 훑어서 부호변화를 세면 격자가 근에 정확히 떨어질 때
     곱이 0 이 되어 그 근을 놓친다 — x=2 에서 실제로 놓쳤다. */
  const df = (x) => { const y = x * x - 4 * x; return (2 * x - 4) * (2 * y - 5) };
  { const h = 1e-6; say(Math.abs((f(2 + h) - f(2 - h)) / (2 * h) - df(2)) < 1e-3, 'S04 · 식으로 쓴 f′ 가 수치미분과 맞는다'); }

  const smoothAt = (t) => {
    const g = (x) => (x < t ? f(x) : 2 * f(t) - f(x)), h = 1e-6;
    return Math.abs((g(t + h) - g(t)) / h - (g(t) - g(t - h)) / h) < 1e-2;
  };
  const crit = []; { let prev = df(-10); for (let x = -10; x < 10; x += 1e-4) { const cur = df(x + 1e-4); if (prev === 0 || prev * cur < 0) crit.push(x); prev = cur } }
  say(crit.length === 3, `S04 · f′ 의 실근이 셋 (${crit.length}개) — 롤의 정리와 맞는다`);
  say(near(crit.reduce((a, b) => a + b, 0), 6, 1e-3),
    `S04 · 세 근의 합 = ${crit.reduce((a, b) => a + b, 0).toFixed(4)}`);
  say(crit.every(smoothAt) && !smoothAt(3) && !smoothAt(0),
    'S04 · 그 세 자리에서만 뒤집은 조각이 꺾이지 않는다');

  const sumOf = (s) => 3 * (9 + s) / 4;             // 근이 0,4,5,s 일 때 f′ 근의 합
  const found = [];
  for (let s = -20; s <= 20; s += 1e-3) if (Math.abs(sumOf(s) - 6) < 1e-9) found.push(Math.round(s));
  say([...new Set(found)].length === 1 && found[0] === -1, `S04 · 합이 6 인 s 는 ${found[0]} 하나뿐`);
  say([-1, 0, 4, 5].every((r) => near(f(r), 0)) && Math.max(-1, 0, 4, 5) === 5,
    'S04 · 네 근이 -1, 0, 4, 5 이고 가장 큰 것이 5');
  say(near(f(6), 84), `S04 · 답 f(6)=${f(6)}`);
}

for (const c of checks) if (!c.ok) console.log('  X ' + c.msg);
assert.equal(checks.filter((c) => !c.ok).length, 0,
  '킬러문제의 수학이 맞지 않는다:\n' + checks.filter((c) => !c.ok).map((c) => '  ' + c.msg).join('\n'));

// ── 2) 두 쪽이 짝이 맞는가 ────────────────────────────────────────
/* 세트마다 문항 번호가 1 부터 다시 시작하므로 세트 번호까지 함께 적는다. */
const VERIFIED = {
  1: { 1: 9, 2: 125, 3: 27, 4: 8, 5: 9 },
  2: { 1: 15, 2: 50, 3: 18, 4: 84 }
};

function loadSets(files, globalName) {
  const box = { window: {} };
  for (const f of files) vm.runInNewContext(read(f), box);
  const sets = box.window[globalName];
  assert.ok(Array.isArray(sets) && sets.length, `${globalName} 에 세트가 등록되지 않았다.`);
  return sets.slice().sort((a, b) => a.id - b.id);
}
const pubSets = loadSets(['AI킬러문제/문제.js', 'AI킬러문제/문제2.js'], 'JPKillerSets');
const teaSets = loadSets(['수업창고/AI킬러문제/풀이.js', '수업창고/AI킬러문제/풀이2.js'], 'JPKillerSolutionSets');

assert.equal(pubSets.length, teaSets.length, '공개용과 교사용의 세트 수가 다르다.');
assert.equal(pubSets.length, Object.keys(VERIFIED).length, '검산해 둔 세트 수와 실제 세트 수가 다르다.');

let total = 0;
for (const pub of pubSets) {
  const tea = teaSets.find((s) => s.id === pub.id);
  assert.ok(tea, `SET ${pub.id} 이 교사용에 없다.`);
  assert.equal(pub.problems.length, tea.problems.length, `SET ${pub.id} 의 문항 수가 다르다.`);
  assert.ok(pub.problems.length >= 3, `SET ${pub.id} 은 문항이 셋은 넘어야 한다.`);
  assert.ok(pub.set && pub.headline && pub.blurb, `SET ${pub.id} 의 이름·소개가 비었다.`);
  const answers = VERIFIED[pub.id];
  assert.ok(answers, `SET ${pub.id} 의 답을 검산해 두지 않았다.`);

  for (const q of pub.problems) {
    total += 1;
    const t = tea.problems.find((x) => x.no === q.no);
    const tag = `SET ${pub.id} K${q.no}`;
    assert.ok(t, `${tag} 가 교사용에 없다.`);
    assert.equal(q.stem, t.stem, `${tag} 발문이 서로 다르다.`);
    /* 두 데이터는 서로 다른 vm 안에서 만들어져 배열의 프로토타입이 다르다.
       deepEqual 은 그것까지 견주므로 값으로만 비교한다. */
    assert.equal(JSON.stringify(q.conds), JSON.stringify(t.conds), `${tag} 조건이 서로 다르다.`);
    assert.equal(q.ask, t.ask, `${tag} 묻는 것이 서로 다르다.`);
    assert.equal(q.answer, answers[q.no], `${tag} 공개용 답이 검산과 다르다.`);
    assert.equal(Number(t.answer), answers[q.no], `${tag} 교사용 답이 검산과 다르다.`);

    /* 수식 괄호가 짝이 맞아야 조판이 안 깨진다.

       세기 전에 줄바꿈 간격 표기(\\[2mm])를 걷어낸다. 그 안의 [ 를 블록 수식의
       여는 괄호로 세면 개수가 어긋난다 — 실제로 한 번 걸렸다. */
    const OPEN = '\\' + '(', CLOSE = '\\' + ')';
    const OPEN2 = '\\' + '[', CLOSE2 = '\\' + ']';
    const lineSkip = new RegExp('\\\\\\\\\\[[^\\]]*\\]', 'g');
    const teacherText = [t.stem, ...t.conds, t.ask, t.why, ...t.steps.map((s) => s.body), t.note];
    for (const [label, fields] of [['공개용', [q.stem, ...q.conds, q.ask, q.hint]], ['교사용', teacherText]]) {
      const text = fields.join(' ').replace(lineSkip, '');
      assert.equal(text.split(OPEN).length, text.split(CLOSE).length, `${tag} ${label} 인라인 수식 괄호가 안 맞는다.`);
      assert.equal(text.split(OPEN2).length, text.split(CLOSE2).length, `${tag} ${label} 블록 수식 괄호가 안 맞는다.`);

      /* 수식 안에 날 '<' 가 있으면 안 된다.

         문항은 innerHTML 로 페이지에 꽂힌다. 그러면 브라우저가 '<c' 를 <c> 라는
         여는 태그로 읽고, 뒤따르는 문장을 통째로 그 태그의 속성으로 삼켜 버린다.
         SET 01 의 "0<c<t" 때문에 실제로 한 문장이 화면에서 사라졌다. \lt 를 쓴다.
         교사용 본문에만 진짜 태그 <b> </b> <br> 이 있으므로 그것만 비켜간다. */
      const rawLt = new RegExp('<(?!/b>|b>|b |br>)', 'g');
      for (const one of fields) {
        assert.doesNotMatch(one, rawLt,
          `${tag} ${label} 수식에 날 '<' 가 있다 — \\lt 로 바꿔야 한다: ${one.slice(0, 60)}`);
      }
    }

    // 공개용에는 한 문항이 무엇을 묻는지 알려 주는 것들이 있어야 한다
    assert.ok(q.title && q.topic && q.turn, `${tag} 목록에 쓸 제목·단원·전환이 비었다.`);
    assert.ok(q.hint && q.hint.length > 10, `${tag} 힌트가 비었다.`);
    // 교사용에는 풀이와 수업 노트가 있어야 한다
    assert.ok(t.steps.length >= 3, `${tag} 풀이 단계가 ${t.steps.length}줄뿐.`);
    assert.ok(t.why && t.why.length > 30, `${tag} "왜 어려운가" 가 비었다.`);
    assert.ok(t.note && t.note.length > 40, `${tag} 수업 노트가 빈약하다.`);
    // 그래프를 움직여야 보이는 문항이므로 판이 하나씩 붙어 있어야 한다
    assert.ok(t.figure, `${tag} 에 붙일 그림이 정해져 있지 않다.`);
    assert.match(read('수업창고/AI킬러문제/그림.js'), new RegExp('function ' + t.figure + '\\('),
      `${tag} 이 부르는 그림 ${t.figure} 이 그림.js 에 없다.`);
  }
}

/* SET 02 는 수능 4점의 골격을 맞추려고 만들었다. 그 골격이 유지되는지 본다 —
   기출 세 개와 나란히 놓고 세어 본 결과가 조각함수·경우 나눔·조건 셋이었다. */
{
  const s2 = pubSets.find((s) => s.id === 2);
  const t2 = teaSets.find((s) => s.id === 2);
  const piecewise = s2.problems.filter((q) => /begin\{cases\}|\|x-a\||\\,\|x-a\|/.test(q.stem));
  assert.ok(piecewise.length >= 3,
    `SET 02 는 조각함수가 셋은 되어야 한다 (지금 ${piecewise.length}개). 기출 세 개가 모두 조각함수였다.`);
  for (const q of s2.problems) {
    assert.ok(q.conds.length >= 2, `SET 02 K${q.no} 는 조건이 둘은 되어야 한다.`);
    assert.ok(q.turn.split('→').length >= 4, `SET 02 K${q.no} 의 전환이 ${q.turn.split('→').length}단계뿐이다.`);
  }
  for (const t of t2.problems) {
    assert.ok(t.steps.length >= 4, `SET 02 K${t.no} 의 풀이가 ${t.steps.length}단계뿐 — 4점 골격이면 넷은 넘는다.`);
  }
  /* 범위를 넘지 않아야 한다. 교과서 차례로 연속에서 평균값정리까지이므로
     증가·감소와 극대·극소, 정적분은 아직 배우지 않은 것으로 본다. */
  const OUT = /극댓값|극솟값|극대|극소|증가하|감소하|정적분|\\int/;
  for (const q of s2.problems) {
    for (const one of [q.stem, ...q.conds, q.ask, q.hint]) {
      assert.doesNotMatch(one, OUT, `SET 02 K${q.no} 가 범위(연속~평균값정리)를 넘는 말을 쓴다: ${one.slice(0, 50)}`);
    }
  }
}

// ── 3) 풀이가 공개 쪽으로 새지 않는가 ─────────────────────────────
for (const file of ['AI킬러문제/문제.js', 'AI킬러문제/문제2.js']) {
  const js = read(file);
  assert.doesNotMatch(js, /steps\s*:/, `${file} 에 풀이가 들어 있다.`);
  assert.doesNotMatch(js, /\bnote\s*:/, `${file} 에 수업 노트가 들어 있다.`);
  assert.doesNotMatch(js, /\bwhy\s*:/, `${file} 에 교사용 해설이 들어 있다.`);
}
for (const page of ['AI킬러문제/index.html', 'AI킬러문제/문제.html']) {
  const html = read(page);
  assert.doesNotMatch(html, /auth\.js/, `${page} 는 공개여야 한다.`);
  for (const data of ['문제\\.js', '문제2\\.js']) {
    assert.match(html, new RegExp(data), `${page} 가 ${data.replace('\\', '')} 를 불러와야 한다.`);
  }
}
for (const page of ['수업창고/AI킬러문제/index.html', '수업창고/AI킬러문제/풀이.html']) {
  const html = read(page);
  assert.match(html, /auth\.js/, `${page} 에 수업창고 잠금이 걸려야 한다.`);
  assert.match(html, /풀이2\.js/, `${page} 가 SET 02 풀이를 불러와야 한다.`);
}

/* 기출과 섞이지 않아야 한다. 공개 목록은 서로 다른 자리에 있고,
   기출 쪽에서 킬러문제로 가는 길만 하나 걸어 둔다. */
const csat = read('수능문제/index.html');
assert.doesNotMatch(csat, /문제\.js|KILLER 0/, '수능 기출 목록에 킬러문제가 섞여 있다.');
assert.match(csat, /AI킬러문제\/index\.html/, '기출 목록에서 킬러문제로 가는 길이 있어야 한다.');
assert.match(read('AI킬러문제/index.html'), /수능문제\/index\.html/, '킬러문제 목록에서 기출로 가는 길이 있어야 한다.');
assert.match(read('AI킬러문제/index.html'), /기출이 아닙니다/, '기출이 아니라는 것을 밝혀야 한다.');

// 메뉴에도 따로 걸려 있어야 찾아갈 수 있다
assert.match(read('jp-nav-2.js'), /AI킬러문제\//, '메뉴에 AI 킬러문제가 걸려 있어야 한다.');
assert.match(read('index.html'), /AI킬러문제\//, '메인에 AI 킬러문제가 걸려 있어야 한다.');

console.log(`AI 킬러문제 검사 통과 — 수학 ${checks.length}건 · 세트 ${pubSets.length}개 ${total}문항 · 공개와 수업창고가 짝이 맞음`);