/* 보스 문제를 대량으로 뽑아 기계로 검산한다.

   생성기가 "답은 이거다"라고 말한 값을 믿지 않는다. 화면에 실제로
   찍히는 식을 다시 읽어 수치로 계산해 맞춰 본다. 식과 답이 따로 노는
   오류는 이 방법으로만 잡힌다.

   이 파일이 잡아 낸 것들:
     · 켤레의 연금술사 심화 — 보기를 못 채워 '다른 값 1'이라는 글자가
       그대로 답안 버튼이 되어 나왔다 (열 문제 중 여섯 문제)
     · 금단의 미분술사 응용 — √4 · √9 가 안 풀린 채 문제에 찍혔다
       (다섯 문제 중 하나꼴)

   저장소를 셋이 함께 고치므로, 문제 모양을 새로 만들면 아래
   verify() 에 읽는 법을 같이 넣어야 한다. 어느 모양에도 안 걸리면
   '식 모양을 못 읽음'으로 실패한다 — 검사한 척만 하는 것을 막는다. */
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SRC = path.join(__dirname, '..', '미적분1', '미적분1_계산스킬.js');
const N = Number(process.env.JP_BOSS_N || 400);

// ── 생성기만 떼어내 실행한다 (파일 전체는 DOM 을 건드린다) ──────────
function loadGenerators() {
  // 줄 끝의 \r 을 떼고 자른다. 저장소를 여러 도구로 고치다 보면 같은
  // 파일이 LF 와 CRLF 를 오간다. 안 떼면 '  }' 를 영영 못 찾는다.
  const lines = fs.readFileSync(SRC, 'utf8').split(/\r?\n/);
  const lineOf = (p) => {
    const i = lines.findIndex((l) => l.startsWith(p));
    if (i < 0) throw new Error('못 찾음: ' + p);
    return i;
  };
  const endOf = (start) => {
    for (let i = start + 1; i < lines.length; i += 1) if (lines[i] === '  }') return i;
    throw new Error('함수 끝을 못 찾음');
  };
  // 보스 전용 문제 생성기는 hDistanceLabel 과 makeForbiddenQuestion 사이에
  // 모여 있다. 새 보스를 만들면 그 사이에 두어야 여기서 함께 잘려 나온다.
  const code = [
    'const boss = { phase: 1, hStep: 0, productPair: null, sniperLock: 0, sniperTarget: null };',
    lines.slice(2, lineOf('  const excluded={')).join('\n'),
    lines.slice(lineOf('  function hDistanceLabel'),
      endOf(lineOf('  function makeForbiddenQuestion')) + 1).join('\n'),
    'globalThis.API = { makeQuestion, makeDifferenceQuestion, makeForbiddenQuestion, boss,' +
    '  makeSniperQuestion: typeof makeSniperQuestion === "function" ? makeSniperQuestion : null,' +
    '  makeProductBossQuestion: typeof makeProductBossQuestion === "function" ? makeProductBossQuestion : null };'
  ].join('\n');
  const ctx = { console };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: SRC });
  return ctx.API;
}
const API = loadGenerators();

// ── 표시된 식을 계산할 수 있는 형태로 ──────────────────────────────
function toJs(src, extra = '') {
  let s = String(src).replace(/−/g, '-').replace(/\s+/g, '');
  // 상수 a 는 맨 먼저 값으로 바꾼다. \ba\b 로는 안 된다 —
  // ax² 에서 a 와 x 사이에는 단어 경계가 없다.
  if (extra) s = s.replace(/(^|[^A-Za-z0-9])a/g, '$1(' + extra + ')');
  s = s.replace(/[{]/g, '(').replace(/[}]/g, ')');
  s = s.replace(/⁶/g, '^6').replace(/⁵/g, '^5').replace(/⁴/g, '^4')
       .replace(/³/g, '^3').replace(/²/g, '^2').replace(/¹/g, '^1');
  for (let guard = 0; s.includes('√') && guard < 40; guard += 1) {
    const i = s.indexOf('√');
    if (s[i + 1] === '(') {
      let depth = 0, j = i + 1;
      for (; j < s.length; j += 1) {
        if (s[j] === '(') depth += 1;
        else if (s[j] === ')') { depth -= 1; if (!depth) break }
      }
      s = s.slice(0, i) + 'SQ' + s.slice(i + 1, j + 1) + s.slice(j + 1);
    } else {
      const m = /^[0-9]+|^x(\^[0-9]+)?/.exec(s.slice(i + 1));
      if (!m) throw new Error('√ 뒤를 못 읽음');
      s = s.slice(0, i) + 'SQ(' + m[0] + ')' + s.slice(i + 1 + m[0].length);
    }
  }
  s = s.replace(/\|([^|]+)\|/g, 'AB($1)');
  // x^n 은 PW(x,n) 으로. ** 는 앞에 단항 마이너스가 오면 문법 오류다.
  s = s.replace(/([xh])\^([0-9]+)/g, 'PW($1,$2)');
  return s.replace(/([0-9xh)])(?=[xh(]|SQ|AB|PW)/g, '$1*');
}
const ENV = ['x', 'h', 'SQ', 'AB', 'PW', 'f'];
const args = (x, h, f) => [x, h, Math.sqrt, Math.abs, Math.pow, f];
const compile = (js) => new Function(...ENV, 'return ' + js);

function toNum(v) {
  const s = String(v).replace(/−/g, '-').trim();
  if (s === '∞') return Infinity;
  if (s === '-∞') return -Infinity;
  const m = /^(-?[0-9]+)\/(-?[0-9]+)$/.exec(s);
  if (m) return Number(m[1]) / Number(m[2]);
  return /^-?[0-9]+(\.[0-9]+)?$/.test(s) ? Number(s) : null;
}
const near = (a, b) => (!Number.isFinite(a) && !Number.isFinite(b) && Math.sign(a) === Math.sign(b))
  || (Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 2e-3 * Math.max(1, Math.abs(b)));

function limitOf(js, to, f) {
  const fn = compile(js);
  const at = (t) => fn(...args(t, undefined, f));
  const oneSided = /^(-?[0-9]+)([+-])$/.exec(to);
  if (oneSided) return at(Number(oneSided[1]) + (oneSided[2] === '+' ? 1e-7 : -1e-7));
  if (to === '∞' || to === '-∞') {
    const s = to === '∞' ? 1 : -1;
    const v = [1e6, 1e7, 1e8].map((t) => at(s * t));
    if (!Number.isFinite(v[2])) return NaN;
    if (Math.abs(v[2]) > 1e3 && Math.abs(v[2]) > Math.abs(v[1]) * 1.5) return v[2] > 0 ? Infinity : -Infinity;
    return v[2];
  }
  if (to === '0+') return at(1e-7);
  if (to === '0-') return at(-1e-7);
  const a = Number(to), e = 1e-6, l = at(a - e), r = at(a + e);
  if (!Number.isFinite(l)) return r;
  if (!Number.isFinite(r)) return l;
  return (l + r) / 2;
}

// y=mx+k 꼴로 적힌 답이 주어진 기울기·절편과 맞는지 본다.
function checkLine(correct, m, k) {
  const s = String(correct).replace(/−/g, '-');
  const lm = /^y=(-?[0-9]*)x([+-][0-9]+)?$/.exec(s);
  if (!lm) return `접선의 방정식 꼴이 아니다 (${correct})`;
  const gm = lm[1] === '' ? 1 : lm[1] === '-' ? -1 : Number(lm[1]);
  const gk = lm[2] ? Number(lm[2]) : 0;
  if (!near(gm, m) || !near(gk, k)) {
    return `접선이 안 맞는다 (있어야 할 기울기 ${m}, 절편 ${k} / 적힌 것 ${gm}, ${gk})`;
  }
  return null;
}


// 다항식을 함수로. 상수 b·k·m 이 들어 있으면 값을 먼저 꽂는다.
function polyFn(src, param, value) {
  let t = String(src).replace(/−/g, '-');
  if (param) t = t.replace(new RegExp(param, 'g'), '(' + value + ')');
  return compile(toJs(t));
}
const evalAt = (fn, x) => fn(...args(x, undefined, null));
const deriv = (fn, x) => (evalAt(fn, x + 1e-5) - evalAt(fn, x - 1e-5)) / 2e-5;

// f′ 의 부호가 바뀌는 자리를 훑어 찾는다. 정확한 근이 아니라
// 부호가 어디서 바뀌는지만 알면 극대·극소를 셀 수 있다.
function signChanges(g) {
  // 0 에 닿기만 하는 식(3(x−3)² 같은 것)에서 부동소수점 잡음이
  // −1e-15 를 만들어 부호가 바뀐 것처럼 보인다. 문턱을 둔다.
  const sgn = (v) => (v > 1e-6 ? 1 : v < -1e-6 ? -1 : 0);
  const out = [];
  let prev = sgn(g(-12));
  for (let x = -12 + 0.01; x <= 12; x += 0.01) {
    const cur = sgn(g(x));
    if (cur !== 0 && prev !== 0 && cur !== prev) out.push({ x: x - 0.005, from: prev, to: cur });
    if (cur !== 0) prev = cur;
  }
  return out;
}

// 서로 다른 실근을 센다. 부호 변화만 세면 중근을 놓친다 —
// x³−3x+2=(x−1)²(x+2) 는 근이 둘인데 부호는 한 번만 바뀐다.
// 부호가 안 바뀌면서 0 에 닿는 자리(접점)도 근으로 센다.
function distinctRoots(g) {
  const step = 0.002, hits = [];
  let pv = g(-12);
  for (let x = -12 + step; x <= 12; x += step) {
    const v = g(x);
    if (Math.sign(v) !== Math.sign(pv) && pv !== 0) hits.push(x - step / 2);
    else if (Math.abs(v) < 1e-3 && Math.abs(v) < Math.abs(pv) && Math.abs(v) < Math.abs(g(x + step))) hits.push(x);
    pv = v;
  }
  const uniq = [];
  for (const r of hits) if (!uniq.some((u) => Math.abs(u - r) < 0.05)) uniq.push(r);
  return uniq;
}

// "(−∞,-2) ∪ (4,∞)" 를 구간 목록으로
function parseIntervals(text) {
  const t = String(text).replace(/−/g, '-').replace(/\s/g, '');
  const out = [];
  for (const m of t.matchAll(/\((-?(?:\d+(?:\.\d+)?|inf|∞)),(-?(?:\d+(?:\.\d+)?|inf|∞))\)/g)) {
    const num = (v) => (/∞|inf/.test(v) ? (v.startsWith('-') ? -Infinity : Infinity) : Number(v));
    out.push([num(m[1]), num(m[2])]);
  }
  return out;
}
const inSet = (iv, x) => iv.some(([lo, hi]) => x > lo && x < hi);

// "b ≥ 12" 같은 조건을 읽는다
function parseCondition(text) {
  const m = /^([a-z])\s*(≥|≤|>|<)\s*(-?[0-9.]+)$/.exec(String(text).replace(/−/g, '-').trim());
  return m ? { param: m[1], op: m[2], bound: Number(m[3]) } : null;
}

/* 문제 모양은 열여덟 가지다. 새 모양을 만들면 여기에 읽는 법을 더한다. */
function verify(q) {
  const eq = q.equation.replace(/−/g, '-'), want = toNum(q.correct);

  // 유계 g 를 낀 압착:  |g(x)|≤M,  lim x→a  (식)g(x)
  let m = /^\|g\(x\)\|≤([0-9]+),\s*lim\s+x→(\S+)\s+(.+?)g\(x\)$/.exec(eq);
  if (m) {
    const cap = limitOf('AB(' + toJs(m[3]) + ')*' + Number(m[1]), m[2]);
    if (!near(cap, 0)) return `유계 상한이 0으로 안 간다 (${cap})`;
    if (want !== null && !near(want, 0)) return '상한이 0인데 답이 0이 아니다';
    return null;
  }

  // k 를 되묻는 압착:  2k+1-5/x ≤ f(x) ≤ 3k+5+5/x
  m = /^(.*k.*?)\s*≤\s*f\(x\)\s*≤\s*(.*k.*?)(\s*\([^)]*\))?$/.exec(eq);
  if (m && /k는\?/.test(q.prompt || '')) {
    const put = (t) => toJs(t.replace(/k/g, '(' + want + ')'));
    const lo = limitOf(put(m[1]), '∞'), hi = limitOf(put(m[2]), '∞');
    if (!near(lo, hi)) return `그 k 로는 상·하한이 안 만난다 (${lo} vs ${hi})`;
    return null;
  }

  // 압착:  하한 ≤ f(x) ≤ 상한,  x→T
  m = /^(.+?)\s*≤\s*f\(x\)\s*≤\s*(.+?)(\s*\([^)]*\))?,\s*x→(.+)$/.exec(eq);
  if (m) {
    const to = m[4].trim(), lo = limitOf(toJs(m[1]), to), hi = limitOf(toJs(m[2]), to);
    if (!near(lo, hi)) return `상·하한의 극한이 다르다 (${lo} vs ${hi})`;
    if (want !== null && !near(lo, want)) return `식과 답이 다르다 (계산 ${lo})`;
    return null;
  }

  // 쌍날 곱셈귀 · 한쪽 날:  u(x)=…,  v(x)=…   / "x=T에서 … u′(x)v(x)의 값은?"
  m = /^u\(x\)=(.+?),\s*v\(x\)=(.+)$/.exec(eq);
  if (m) {
    const tm = /x=(-?[0-9]+)에서/.exec(q.prompt.replace(/−/g, '-'));
    if (!tm) return '어느 x 인지 못 읽음';
    const t = Number(tm[1]), e = 1e-5;
    const u = compile(toJs(m[1])), v = compile(toJs(m[2]));
    const at = (fn, x) => fn(...args(x, undefined, null));
    const dU = (at(u, t + e) - at(u, t - e)) / (2 * e), dV = (at(v, t + e) - at(v, t - e)) / (2 * e);
    const left = dU * at(v, t), right = at(u, t) * dV;
    const target = /왼날/.test(q.prompt) ? left : right;
    if (want !== null && !near(want, target)) return `식과 답이 다르다 (계산 ${target})`;
    return null;
  }

  // 쌍날 곱셈귀 · 항 복원:  w(x)=u(x)v(x),  w′(T)=전체   / "u′v=L일 때 uv′는?"
  m = /^w\(x\)=u\(x\)v\(x\),\s*w′\((-?[0-9]+)\)=(-?[0-9]+)$/.exec(eq);
  if (m) {
    const total = Number(m[2]);
    const lm = /u′v=(-?[0-9]+)/.exec(q.prompt.replace(/−/g, '-'));
    if (!lm) return '왼날 값을 못 읽음';
    const rest = total - Number(lm[1]);
    if (want !== null && !near(want, rest)) return `u′v+uv′ 가 안 맞는다 (있어야 할 값 ${rest})`;
    return null;
  }

  // 접선의 저격수 · 발사:  접점 (A, Y),  기울기 M
  m = /^접점 \((-?[0-9]+), (-?[0-9]+)\),\s*기울기 (-?[0-9]+)$/.exec(eq);
  if (m) {
    const A = Number(m[1]), Y = Number(m[2]), M = Number(m[3]);
    return checkLine(q.correct, M, Y - M * A);
  }

  // 접선 문제:  f(x)=다항식,  x=A
  // 접점 f(A) · 기울기 f′(A) · 접선의 방정식 — 물음에 따라 갈린다.
  m = /^f\(x\)=(.+?),\s*x=(-?[0-9]+)$/.exec(eq);
  if (m) {
    const at = Number(m[2]), e = 1e-5, fn = compile(toJs(m[1]));
    const val = fn(...args(at, undefined, null));
    const der = (fn(...args(at + e, undefined, null)) - fn(...args(at - e, undefined, null))) / (2 * e);
    if (/방정식/.test(q.prompt || '')) return checkLine(q.correct, der, val - der * at);
    const target = /기울기/.test(q.prompt || '') ? der : val;
    if (want !== null && !near(want, target)) return `식과 답이 다르다 (계산 ${target})`;
    return null;
  }

  // 기울기로 접점 찾기:  f(x)=다항식  /  "기울기가 M인 접선의 접점 x좌표는?"
  // 물음의 빼기 기호도 먼저 맞춘다 — 화면에는 −12 로 찍힌다.
  const prompt = (q.prompt || '').replace(/−/g, '-');
  m = /^f\(x\)=(.+)$/.exec(eq);
  if (m && /기울기가 (-?[0-9]+)인 접선의 접점/.test(prompt)) {
    const M = Number(/기울기가 (-?[0-9]+)인/.exec(prompt)[1]);
    const e = 1e-5, fn = compile(toJs(m[1]));
    const der = (fn(...args(want + e, undefined, null)) - fn(...args(want - e, undefined, null))) / (2 * e);
    if (!near(der, M)) return `그 x 에서 기울기가 ${M} 이 아니다 (계산 ${der})`;
    return null;
  }


  // ── 부호표·극값 계열 (단계잠금 보스 4종) ──────────────────────────

  // 부호 변화표:  x=-1:  f′(x)  + → −
  m = /^x=(-?[0-9]+):\s*f′\(x\)\s*([+-−])\s*→\s*([+-−])$/.exec(eq);
  if (m) {
    const from = m[2] === '+' ? 1 : -1, to = m[3] === '+' ? 1 : -1;
    const should = from > 0 && to < 0 ? '극대' : from < 0 && to > 0 ? '극소' : '변곡점';
    if (String(q.correct) !== should) return `부호 ${m[2]}→${m[3]} 이면 ${should} 여야 한다`;
    return null;
  }

  // 조건식:  f(x)=… (상수 b·k·m 포함)  /  "… 조건은?"
  if (/조건은\?/.test(prompt)) {
    const em = /^f(′)?\(x\)=(.+)$/.exec(eq);
    const cond = parseCondition(q.correct);
    if (em && cond) {
      const isPrime = !!em[1];
      const holds = (v) => {
        const fn = polyFn(em[2], cond.param, v);
        const g = isPrime ? (x) => evalAt(fn, x) : (x) => deriv(fn, x);
        if (/모든 실수에서 f가 증가/.test(prompt)) {
          for (let x = -14; x <= 14; x += 0.02) if (g(x) < -1e-6) return false;
          return true;
        }
        // 수평접선이 하나도 없다 = f′ 에 실근이 없다
        if (/수평접선이 하나도 없/.test(prompt)) return distinctRoots(g).length === 0;
        // 극대와 극소를 모두 갖는다 = f′ 의 부호가 두 번 바뀐다
        return signChanges(g).length === 2;
      };
      const strict = cond.op === '>' || cond.op === '<';
      const dir = cond.op === '≥' || cond.op === '>' ? 1 : -1;
      const inside = cond.bound + dir * 0.5;      // 조건을 만족해야 하는 값
      const outside = cond.bound - dir * 0.5;     // 만족하면 안 되는 값
      if (!holds(inside)) return `${cond.param}=${inside} 에서 조건이 성립해야 하는데 안 한다`;
      if (holds(outside)) return `${cond.param}=${outside} 에서는 성립하면 안 되는데 성립한다`;
      // 경계는 등호가 있으면 성립, 없으면 불성립이어야 한다
      if (holds(cond.bound) === strict) {
        return `경계 ${cond.param}=${cond.bound} 의 등호 처리가 뒤집혀 있다 (적힌 것 ${cond.op})`;
      }
      return null;
    }
  }

  // 극값을 갖게 하는 상수:  f(x)=…b…  /  "f가 x=A에서 극값을 갖게 하는 b는?"
  m = /^f\(x\)=(.+)$/.exec(eq);
  if (m && /x=(-?[0-9]+)에서 극값을 갖게 하는 ([a-z])는\?/.test(prompt)) {
    const pm = /x=(-?[0-9]+)에서 극값을 갖게 하는 ([a-z])는\?/.exec(prompt);
    const at = Number(pm[1]), fn = polyFn(m[1], pm[2], want);
    if (Math.abs(deriv(fn, at)) > 1e-3) return `그 값을 넣으면 f′(${at})=${deriv(fn, at).toFixed(3)} 로 0이 아니다`;
    // 0이 되는 것만으로는 부족하다. 부호가 실제로 바뀌어야 극값이다.
    if (Math.sign(deriv(fn, at - 0.3)) === Math.sign(deriv(fn, at + 0.3))) {
      return `f′ 가 x=${at} 에서 0이지만 부호가 안 바뀌어 극값이 아니다`;
    }
    return null;
  }

  // 증가·감소 구간:  f(x)=… 또는 f′(x)=…  /  "f가 증가하는 구간은?"
  m = /^f(′)?\(x\)=(.+)$/.exec(eq);
  if (m && /(증가|감소)하는 구간/.test(prompt)) {
    const wantUp = /증가하는 구간/.test(prompt);
    const fn = polyFn(m[2]);
    const g = m[1] ? (x) => evalAt(fn, x) : (x) => deriv(fn, x);
    const iv = parseIntervals(q.correct);
    if (!iv.length) return '구간을 못 읽음: ' + q.correct;
    for (let x = -11; x <= 11; x += 0.05) {
      const v = g(x);
      if (Math.abs(v) < 0.05) continue;           // 근 언저리는 건너뛴다
      const claimed = inSet(iv, x);
      const actual = wantUp ? v > 0 : v < 0;
      if (claimed !== actual) {
        return `x=${x.toFixed(2)} 에서 어긋난다 (적힌 구간 ${claimed ? '안' : '밖'}, 실제 f′=${v.toFixed(2)})`;
      }
    }
    return null;
  }

  // 극댓값·극솟값·그 차:  f(x)=…
  m = /^f\(x\)=(.+)$/.exec(eq);
  if (m && /극(댓값|솟값)/.test(prompt) && want !== null) {
    const fn = polyFn(m[1]);
    const chg = signChanges((x) => deriv(fn, x));
    const maxes = chg.filter((c) => c.from > 0 && c.to < 0).map((c) => evalAt(fn, c.x));
    const mins = chg.filter((c) => c.from < 0 && c.to > 0).map((c) => evalAt(fn, c.x));
    let target = null;
    if (/차는\?/.test(prompt)) {
      if (!maxes.length || !mins.length) return '극대와 극소가 둘 다 있어야 차를 묻는다';
      target = Math.max(...maxes) - Math.min(...mins);
    } else if (/극댓값/.test(prompt)) target = maxes.length ? Math.max(...maxes) : null;
    else target = mins.length ? Math.min(...mins) : null;
    if (target === null) return '극값을 찾지 못했다';
    if (Math.abs(target - want) > 0.05 * Math.max(1, Math.abs(want))) {
      return `식과 답이 다르다 (계산 ${target.toFixed(2)})`;
    }
    return null;
  }

  // 사차 임계점 판정:  f′(x)=4(x+2)x(x−2)  /  "가운데 임계점 x=A에서 f는?"
  m = /^f′\(x\)=(.+)$/.exec(eq);
  if (m && /임계점 x=(-?[0-9]+)에서 f는\?/.test(prompt)) {
    const at = Number(/임계점 x=(-?[0-9]+)에서/.exec(prompt)[1]);
    const g = polyFn(m[1]);
    const l = evalAt(g, at - 0.3), r = evalAt(g, at + 0.3);
    const should = l > 0 && r < 0 ? '극대' : l < 0 && r > 0 ? '극소' : '변곡점';
    if (String(q.correct) !== should) return `x=${at} 좌우 부호가 ${l > 0 ? '+' : '-'}→${r > 0 ? '+' : '-'} 이므로 ${should}`;
    return null;
  }

  // 극값의 개수:  f′(x)=…  /  "f의 극값은 모두 몇 개인가요?"
  if (m && /극값은 모두 몇 개/.test(prompt)) {
    const g = polyFn(m[1]);
    const n = signChanges((x) => evalAt(g, x)).length;
    const said = Number(String(q.correct).replace(/[^0-9]/g, ''));
    if (n !== said) return `부호가 ${n}번 바뀌는데 ${said}개라고 적혀 있다`;
    return null;
  }


  // ── 실근·평균값·운동·적분 계열 ────────────────────────────────────

  // 실근의 개수:  x³−3x=-2   /  "서로 다른 실근의 개수는?"
  m = /^(.+?)\s*=\s*(-?[0-9]+)$/.exec(eq);
  if (m && /서로 다른 실근의 개수/.test(prompt)) {
    const fn = polyFn(m[1]), rhs = Number(m[2]);
    const g = (x) => evalAt(fn, x) - rhs;
    const n = distinctRoots(g).length;               // 중근도 하나로 센다
    const said = Number(String(q.correct).replace(/[^0-9]/g, ''));
    if (n !== said) return `부호가 ${n}번 바뀌는데 ${said}개라고 적혀 있다`;
    return null;
  }

  // 실근 3개가 되게 하는 k:  x³−3x = k   /  "…k의 범위는?"
  m = /^(.+?)\s*=\s*k$/.exec(eq);
  if (m && /실근이 (\d)개가 되게 하는 k의 범위/.test(prompt)) {
    const want3 = Number(/실근이 (\d)개가/.exec(prompt)[1]);
    const fn = polyFn(m[1]);
    const rootCount = (k) => distinctRoots((x) => evalAt(fn, x) - k).length;
    // "−2 < k < 2" 를 읽는다
    const rm = /^(-?[0-9.]+)\s*(<|≤)\s*k\s*(<|≤)\s*(-?[0-9.]+)$/.exec(String(q.correct).replace(/−/g, '-').replace(/\s+/g, ' ').trim());
    if (!rm) return '범위를 못 읽음: ' + q.correct;
    const lo = Number(rm[1]), hi = Number(rm[4]);
    const mid = (lo + hi) / 2;
    if (rootCount(mid) !== want3) return `범위 한가운데 k=${mid} 에서 실근이 ${rootCount(mid)}개다`;
    if (rootCount(lo - 0.5) === want3) return `범위 밖 k=${lo - 0.5} 에서도 ${want3}개가 된다`;
    if (rootCount(hi + 0.5) === want3) return `범위 밖 k=${hi + 0.5} 에서도 ${want3}개가 된다`;
    // 경계는 등호가 없어야 한다 (중근이 생겨 개수가 준다)
    if (rm[2] === '≤' && rootCount(lo) === want3) return '경계에서 등호를 쓰면 안 된다';
    return null;
  }

  // 평균값 정리:  f(x)=x²,  [1,7]   /  "…c는?"
  m = /^f\(x\)=(.+?),\s*\[(-?[0-9]+),(-?[0-9]+)\]$/.exec(eq);
  if (m && want !== null) {
    const fn = polyFn(m[1]), a = Number(m[2]), b = Number(m[3]);
    if (want <= a || want >= b) return `c=${want} 가 구간 (${a},${b}) 안에 없다`;
    const slope = (evalAt(fn, b) - evalAt(fn, a)) / (b - a);
    const got = deriv(fn, want);
    // 롤의 정리 꼴이면 f′(c)=0 이어야 하고, 그때 평균 기울기도 0이다
    if (Math.abs(got - slope) > 1e-3 * Math.max(1, Math.abs(slope))) {
      return `f′(${want})=${got.toFixed(3)} 인데 평균 기울기는 ${slope.toFixed(3)} 이다`;
    }
    return null;
  }

  // 운동:  s(t)=…  /  "t=T에서 속도는? · 가속도는? · 방향이 바뀌는 시각은?"
  m = /^s\(t\)=(.+?)(\s*\(t ≥ 0\))?$/.exec(eq);
  if (m && want !== null) {
    const fn = polyFn(m[1].replace(/t/g, 'x'));
    if (/방향이 바뀌는 시각/.test(prompt)) {
      const v = (x) => deriv(fn, x);
      if (Math.abs(v(want)) > 1e-2) return `t=${want} 에서 속도가 ${v(want).toFixed(3)} 로 0이 아니다`;
      if (Math.sign(v(want - 0.3)) === Math.sign(v(want + 0.3))) return `t=${want} 에서 속도의 부호가 안 바뀐다`;
      return null;
    }
    const tm = /t=(-?[0-9]+)에서/.exec(prompt);
    if (!tm) return '어느 t 인지 못 읽음';
    const t = Number(tm[1]);
    const target = /가속도/.test(prompt)
      ? (deriv(fn, t + 1e-3) - deriv(fn, t - 1e-3)) / 2e-3
      : deriv(fn, t);
    if (Math.abs(target - want) > 0.02 * Math.max(1, Math.abs(want))) {
      return `식과 답이 다르다 (계산 ${target.toFixed(3)})`;
    }
    return null;
  }

  // 수평접선의 개수:  f(x)=…   /  "수평접선의 개수는?"
  m = /^f\(x\)=(.+)$/.exec(eq);
  if (m && /수평접선의 개수/.test(prompt)) {
    const fn = polyFn(m[1]);
    const n = distinctRoots((x) => deriv(fn, x)).length;
    const said = Number(String(q.correct).replace(/[^0-9]/g, ''));
    if (n !== said) return `f′ 의 실근이 ${n}개인데 ${said}개라고 적혀 있다`;
    return null;
  }

  // 부정적분:  ∫ 8x³ dx   /  답 "2x⁴+C"
  // 구간이 붙은 ∫[a→b] 는 아래 정적분 규칙이 맡는다. 여기서 먼저
  // 걸리지 않도록 [ 로 시작하는 것은 뺀다.
  m = /^∫\s*(?!\[)\(?(.+?)\)?\s*dx$/.exec(eq);
  if (m) {
    const body = String(q.correct).replace(/\+\s*C$/, '').trim();
    let F, g;
    try { F = polyFn(body); g = polyFn(m[1]) } catch (e) { return '식을 못 읽음' }
    for (const x of [-2.3, -0.7, 0.6, 1.4, 2.9]) {
      const d = deriv(F, x), want2 = evalAt(g, x);
      if (Math.abs(d - want2) > 1e-2 * Math.max(1, Math.abs(want2))) {
        return `x=${x} 에서 답을 미분하면 ${d.toFixed(3)} 인데 피적분함수는 ${want2.toFixed(3)} 이다`;
      }
    }
    return null;
  }

  // 도함수에서 원함수:  f′(x)=4x+3   /  "f(x)로 가능한 식은?"
  m = /^f′\(x\)=(.+)$/.exec(eq);
  if (m && /f\(x\)로 가능한 식/.test(prompt)) {
    const F = polyFn(String(q.correct).replace(/\+\s*C$/, '').trim()), g = polyFn(m[1]);
    for (const x of [-2.1, -0.4, 1.3, 2.7]) {
      const d = deriv(F, x), w = evalAt(g, x);
      if (Math.abs(d - w) > 1e-2 * Math.max(1, Math.abs(w))) {
        return `x=${x} 에서 답을 미분하면 ${d.toFixed(3)} 인데 f′ 은 ${w.toFixed(3)} 이다`;
      }
    }
    return null;
  }

  // 초기조건이 붙은 원시함수:  F′(x)=4x,  F(0)=3   /  "F(1)의 값은?"
  m = /^F′\(x\)=(.+?),\s*F\((-?[0-9]+)\)=(-?[0-9]+)$/.exec(eq);
  if (m && want !== null) {
    const tm = /F\((-?[0-9]+)\)의 값/.exec(prompt.replace(/−/g, '-'));
    if (!tm) return '어느 점의 값인지 못 읽음';
    const g = polyFn(m[1]), x0 = Number(m[2]), F0 = Number(m[3]), at2 = Number(tm[1]);
    // F(at) = F(x0) + ∫[x0→at] f  — 사다리꼴로 촘촘히 적분한다
    const steps = 20000, h = (at2 - x0) / steps;
    let sum = 0;
    for (let i = 0; i < steps; i += 1) sum += (evalAt(g, x0 + i * h) + evalAt(g, x0 + (i + 1) * h)) / 2 * h;
    const got = F0 + sum;
    if (Math.abs(got - want) > 1e-2 * Math.max(1, Math.abs(want))) {
      return `식과 답이 다르다 (계산 ${got.toFixed(3)})`;
    }
    return null;
  }

  // 정적분:  ∫[0→4] 2x dx
  m = /^∫\[(-?[0-9]+)→(-?[0-9]+)\]\s*\(?(.+?)\)?\s*dx$/.exec(eq);
  if (m && want !== null) {
    const g = polyFn(m[3]), lo = Number(m[1]), hi = Number(m[2]);
    const steps = 20000, h = (hi - lo) / steps;
    let sum = 0;
    for (let i = 0; i < steps; i += 1) sum += (evalAt(g, lo + i * h) + evalAt(g, lo + (i + 1) * h)) / 2 * h;
    if (Math.abs(sum - want) > 1e-2 * Math.max(1, Math.abs(want))) {
      return `식과 답이 다르다 (계산 ${sum.toFixed(3)})`;
    }
    return null;
  }

  // 부정적분과 미분계수:  f(x)=…  /  "F가 f의 부정적분일 때 lim … 의 값은?"
  m = /^f\(x\)=(.+)$/.exec(eq);
  if (m && /부정적분일 때/.test(prompt) && want !== null) {
    const am = /lim x→(-?[0-9]+)/.exec(prompt.replace(/−/g, '-'));
    if (!am) return '어느 점의 극한인지 못 읽음';
    // 이 극한은 F′(a) 의 정의이고 F′=f 이므로 f(a) 여야 한다
    const at2 = Number(am[1]), got = evalAt(polyFn(m[1]), at2);
    if (Math.abs(got - want) > 1e-6) return `F′(${at2})=f(${at2})=${got} 여야 한다`;
    return null;
  }

  // 그래프와 x축 사이 넓이:  y=x²−2x,  0≤x≤2
  // x축 아래도 넓이는 양수이므로 |f| 를 적분해야 한다.
  m = /^y=(.+?),\s*(-?[0-9]+)≤x≤(-?[0-9]+)$/.exec(eq);
  if (m && /x축 사이 넓이/.test(prompt) && want !== null) {
    const g = polyFn(m[1]), lo = Number(m[2]), hi = Number(m[3]);
    const steps = 40000, h = (hi - lo) / steps;
    let sum = 0;
    for (let i = 0; i < steps; i += 1) {
      sum += (Math.abs(evalAt(g, lo + i * h)) + Math.abs(evalAt(g, lo + (i + 1) * h))) / 2 * h;
    }
    if (Math.abs(sum - want) > 5e-3 * Math.max(1, Math.abs(want))) {
      return `식과 답이 다르다 (|f| 를 적분하면 ${sum.toFixed(4)})`;
    }
    return null;
  }

  // 두 곡선 사이 넓이:  y=4x, y=3x,  0≤x≤2
  m = /^y=(.+?),\s*y=(.+?),\s*(-?[0-9]+)≤x≤(-?[0-9]+)$/.exec(eq);
  if (m && /사이 넓이/.test(prompt) && want !== null) {
    const f1 = polyFn(m[1]), f2 = polyFn(m[2]);
    const lo = Number(m[3]), hi = Number(m[4]);
    const steps = 40000, h = (hi - lo) / steps;
    const d = (x) => Math.abs(evalAt(f1, x) - evalAt(f2, x));
    let sum = 0;
    for (let i = 0; i < steps; i += 1) sum += (d(lo + i * h) + d(lo + (i + 1) * h)) / 2 * h;
    if (Math.abs(sum - want) > 5e-3 * Math.max(1, Math.abs(want))) {
      return `식과 답이 다르다 (|f−g| 를 적분하면 ${sum.toFixed(4)})`;
    }
    return null;
  }

  // 두 곡선이 둘러싼 넓이:  y=x²,  y=4x
  // 구간이 안 적혀 있으므로 두 곡선의 교점 사이를 잰다.
  m = /^y=(.+?),\s+y=(.+)$/.exec(eq);
  if (m && /둘러싸인 부분의 넓이/.test(prompt) && want !== null) {
    const f1 = polyFn(m[1]), f2 = polyFn(m[2]);
    const gap = (x) => evalAt(f1, x) - evalAt(f2, x);
    const cross = distinctRoots(gap);
    if (cross.length < 2) return `교점이 ${cross.length}개라 둘러싸인 영역이 없다`;
    const lo = Math.min(...cross), hi = Math.max(...cross);
    const steps = 40000, h = (hi - lo) / steps;
    let sum = 0;
    for (let i = 0; i < steps; i += 1) sum += (Math.abs(gap(lo + i * h)) + Math.abs(gap(lo + (i + 1) * h))) / 2 * h;
    if (Math.abs(sum - want) > 1e-2 * Math.max(1, Math.abs(want))) {
      return `식과 답이 다르다 (교점 사이를 재면 ${sum.toFixed(3)})`;
    }
    return null;
  }

  // 이동거리·위치 변화:  v(t)=2t−4,  0≤t≤4
  // 이동거리는 ∫|v| 이고 위치 변화는 ∫v 다. 이 둘을 헷갈리는 것이 함정이다.
  m = /^v\(t\)=(.+?),\s*(-?[0-9]+)≤t≤(-?[0-9]+)$/.exec(eq);
  if (m && want !== null) {
    const g = polyFn(m[1].replace(/t/g, 'x'));
    const lo = Number(m[2]), hi = Number(m[3]);
    const steps = 40000, h = (hi - lo) / steps;
    const useAbs = /이동거리/.test(prompt);
    const val = (x) => (useAbs ? Math.abs(evalAt(g, x)) : evalAt(g, x));
    let sum = 0;
    for (let i = 0; i < steps; i += 1) sum += (val(lo + i * h) + val(lo + (i + 1) * h)) / 2 * h;
    if (Math.abs(sum - want) > 5e-3 * Math.max(1, Math.abs(want))) {
      return `식과 답이 다르다 (${useAbs ? '∫|v|' : '∫v'} 를 재면 ${sum.toFixed(4)})`;
    }
    return null;
  }

  // 미적분의 기본정리:  F(x)=∫[0→x] (2t²) dt   /  "F′(2)의 값은?"
  // F′(x)=f(x) 이므로 답은 피적분함수에 그 값을 넣은 것이어야 한다.
  m = /^F\(x\)=∫\[(-?[0-9]+)→x\]\s*\(?(.+?)\)?\s*dt$/.exec(eq);
  if (m && want !== null) {
    const tm = /F′\((-?[0-9]+)\)의 값/.exec(prompt.replace(/−/g, '-'));
    if (!tm) return '어느 점의 값인지 못 읽음';
    const at2 = Number(tm[1]), got = evalAt(polyFn(m[2].replace(/t/g, 'x')), at2);
    if (Math.abs(got - want) > 1e-6) return `F′(${at2})=f(${at2})=${got} 여야 한다`;
    return null;
  }

  // 양변을 미분하기:  ∫[2→x] f(t) dt = x²−2x   /  "f(2)의 값은?"
  m = /^∫\[(-?[0-9]+)→x\]\s*f\(t\)\s*dt\s*=\s*(.+)$/.exec(eq);
  if (m && want !== null) {
    const tm = /f\((-?[0-9]+)\)의 값/.exec(prompt.replace(/−/g, '-'));
    if (!tm) return '어느 점의 값인지 못 읽음';
    const lo = Number(m[1]), at2 = Number(tm[1]);
    const R = polyFn(m[2]);
    // 양변을 미분하면 f(x)=우변′ 이다. 그리고 아래끝에서 우변은 0이어야 한다.
    if (Math.abs(evalAt(R, lo)) > 1e-6) return `x=${lo} 에서 우변이 0이 아니다 (${evalAt(R, lo)})`;
    const got = deriv(R, at2);
    if (Math.abs(got - want) > 1e-3) return `우변을 미분해 x=${at2} 를 넣으면 ${got.toFixed(3)} 이다`;
    return null;
  }

  // 연속이 되게 하는 k:  f(x)=유리식 (x≠a),  f(a)=k
  m = /^f\(x\)=(.+?)\s*\(x≠(-?[0-9]+)\),\s*f\(-?[0-9]+\)=k$/.exec(eq);
  if (m) {
    const v = limitOf(toJs(m[1]), m[2]);
    return want !== null && !near(v, want) ? `식과 답이 다르다 (계산 ${v})` : null;
  }

  // lim … = R  (계수를 되묻는 꼴)
  m = /^lim\s+([xh])→(\S+)\s+(.+?)\s*=\s*(-?[0-9]+)$/.exec(eq);
  if (m) {
    const v = limitOf(toJs(m[3]), m[2]), rhs = Number(m[4]);
    return !near(v, rhs) ? `적어 둔 극한값이 식과 다르다 (계산 ${v} · 적힘 ${rhs})` : null;
  }

  // lim
  m = /^lim\s+([xh])→(\S+)\s+(.+)$/.exec(eq);
  if (m) {
    if (m[1] === 'h') {
      const pm = /f\(x\)=([^일]+)일 때/.exec(q.prompt || '');
      if (!pm) return '프롬프트에서 f(x)를 못 읽음';
      const pf = compile(toJs(pm[1]));
      const f = (t) => pf(...args(t, undefined, null));
      const fn = compile(toJs(m[3]));
      const val = (t) => fn(...args(undefined, t, f));
      const g = (val(1e-6) + val(-1e-6)) / 2;
      return want !== null && !near(g, want) ? `식과 답이 다르다 (계산 ${g})` : null;
    }
    const g = limitOf(toJs(m[3]), m[2]);
    return want !== null && !near(g, want) ? `식과 답이 다르다 (계산 ${g})` : null;
  }

  // f(x)=다항식  (f′(A) 또는 조건을 맞추는 상수 a)
  m = /^f\(x\)=(.+)$/.exec(eq);
  if (m) {
    const hasParam = /a/.test(m[1]);          // 이 식에 들어가는 글자는 x 와 a 뿐이다
    const pm = /f′\((-?[0-9-]+)\)/.exec(q.prompt.replace(/−/g, '-'));
    if (!pm) return '프롬프트를 못 읽음';
    const at = Number(pm[1]), e = 1e-5;
    const fn = compile(toJs(m[1], hasParam ? String(want) : ''));
    const d = (fn(...args(at + e, undefined, null)) - fn(...args(at - e, undefined, null))) / (2 * e);
    if (hasParam) {
      const rhs = /f′\(-?[0-9-]+\)=(-?[0-9-]+)/.exec(q.prompt.replace(/−/g, '-'));
      const target = rhs ? Number(rhs[1]) : 0;
      return !near(d, target) ? `답을 넣어도 조건이 안 맞는다 (f′(${at})=${d})` : null;
    }
    return want !== null && !near(d, want) ? `식과 답이 다르다 (계산 ${d})` : null;
  }

  return '식 모양을 못 읽음 — verify() 에 읽는 법을 더해야 한다';
}

function checkCommon(q) {
  const want = toNum(q.correct);
  if (want !== null) {
    const same = q.choices.filter((c) => { const n = toNum(c); return n !== null && n === want });
    if (same.length > 1) return '정답과 같은 값의 보기가 둘';
  }
  if (!q.choices.includes(String(q.correct))) return '보기에 정답이 없다';
  if (q.choices.length !== 4) return `보기가 ${q.choices.length}개`;
  if (/다른 값 [0-9]/.test(q.choices.join(' '))) return '보기를 못 채워 "다른 값 N" 버튼이 생겼다';
  // 이 앱의 답은 정수 아니면 1/3 같은 분수다. 0.3333333333333333 처럼
  // 소수가 그대로 나오면 계산 도중 값이 새어 나온 것이다.
  const decimal = [String(q.correct), ...q.choices].find((c) => /\d\.\d{3,}/.test(String(c)));
  if (decimal) return `보기에 소수가 그대로 나온다: ${decimal}`;
  for (const [where, text] of [['식', q.equation], ['보기', q.choices.join(' ')], ['해설', q.explanation || '']]) {
    for (const t of (text.match(/√([0-9]+)/g) || [])) {
      const r = Math.sqrt(Number(t.slice(1)));
      if (Number.isInteger(r)) return `${where}에 ${t} 가 안 풀린 채 나온다 (=${r})`;
    }
  }
  return null;
}

const SKILL_BOSSES = [
  ['limit_factor', '인수분해의 문지기'], ['limit_rationalize', '켤레의 연금술사'],
  ['limit_infinity_ratio', '무한비의 거신'], ['limit_infinity_diff', '미정형의 혼돈수'],
  ['limit_one_sided', '양면의 경계자'], ['continuity_parameter', '연속의 봉합사'],
  ['squeeze_limit', '압착의 쌍벽'], ['differentiate_polynomial', '미분의 철갑수'],
  ['tangent_equation', '접선의 저격수'],
  ['monotonic_interval', '부호표의 순찰자'], ['extrema_sign', '극점의 전환자'],
  ['cubic_extrema', '판별식의 삼두룡'], ['quartic_shape', '사차의 봉우리왕'],
  ['real_roots', '교점의 군주'],
  ['mean_value', '평균값의 추적자'],
  ['motion_rate', '가속의 폭주마'],
  ['horizontal_tangent', '수평접선의 사냥꾼'],
  ['antiderivative', '원시함수의 수집가'],
  ['initial_antiderivative', '상수 C의 봉인자'],
  ['definite_integral', '구간의 판관'],
  ['integral_symmetry', '대칭적분의 거울왕'],
  ['area_axis', '절댓값의 재단사'],
  ['area_between', '교차영역의 포식자'],
  ['distance_velocity', '속도누적의 질주귀'],
  ['fundamental_theorem', '미적분의 문지기']
];
const LEVELS = ['basic', 'applied', 'deep'];

const failures = [];
function run(tag, make) {
  for (let i = 0; i < N; i += 1) {
    const q = make();
    let why = checkCommon(q);
    if (!why) { try { why = verify(q) } catch (e) { why = '검산 중 오류: ' + e.message } }
    if (why) {
      failures.push(`${tag} · ${why}\n    식   : ${q.equation}\n    물음 : ${q.prompt}` +
        `\n    답   : ${q.correct}\n    보기 : ${q.choices.join(' / ')}`);
      return;   // 같은 종류를 수천 번 찍지 않는다
    }
  }
}

for (const [id, name] of SKILL_BOSSES) for (const lv of LEVELS) run(`${name}(${lv})`, () => API.makeQuestion(id, lv));
for (const lv of LEVELS) {
  run(`금단의 미분술사(${lv})`, () => API.makeForbiddenQuestion(lv));
  run(`차분몫의 원형(${lv})`, () => API.makeDifferenceQuestion(lv));
}
// 저격수는 조준 0 → 1 → 2 로 이어져야 세 번째 문제가 앞의 두 답을 합친다.
// 조준 단계를 직접 돌려 가며 세 문제 모두 뽑아 본다.
if (API.makeSniperQuestion) {
  for (const lv of LEVELS) {
    for (let step = 0; step < 3; step += 1) {
      run(`접선의 저격수(${lv}·조준${step})`, () => {
        API.boss.sniperLock = step;
        if (step === 0) API.boss.sniperTarget = null;
        return API.makeSniperQuestion(lv);
      });
    }
  }
  API.boss.sniperLock = 0;
  API.boss.sniperTarget = null;
}
if (API.makeProductBossQuestion) {
  for (const lv of LEVELS) for (const blade of ['left', 'right']) {
    run(`쌍날 곱셈귀(${lv}·${blade})`, () => API.makeProductBossQuestion(lv, blade));
  }
}

assert.equal(failures.length, 0, `보스 문제에 오류가 있다:\n\n${failures.join('\n\n')}\n`);
console.log(`보스 문제 검산 통과 — 난이도마다 ${N}문제씩`);
