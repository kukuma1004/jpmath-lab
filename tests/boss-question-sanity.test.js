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
  const code = [
    'const boss = { phase: 1, hStep: 0, productPair: null };',
    lines.slice(2, lineOf('  const excluded={')).join('\n'),
    lines.slice(lineOf('  function makeDifferenceQuestion'),
      endOf(lineOf('  function makeForbiddenQuestion')) + 1).join('\n'),
    'globalThis.API = { makeQuestion, makeDifferenceQuestion, makeForbiddenQuestion };'
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

/* 문제 모양은 일곱 가지다. 새 모양을 만들면 여기에 읽는 법을 더한다. */
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
  ['squeeze_limit', '압착의 쌍벽'], ['differentiate_polynomial', '미분의 철갑수']
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
if (API.makeProductBossQuestion) {
  for (const lv of LEVELS) for (const blade of ['left', 'right']) {
    run(`쌍날 곱셈귀(${lv}·${blade})`, () => API.makeProductBossQuestion(lv, blade));
  }
}

assert.equal(failures.length, 0, `보스 문제에 오류가 있다:\n\n${failures.join('\n\n')}\n`);
console.log(`보스 문제 검산 통과 — 난이도마다 ${N}문제씩`);
