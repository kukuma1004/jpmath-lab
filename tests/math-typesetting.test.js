/* 수식이 분수로 조판되는지 본다.

   jp-math-render.js 는 문제 생성기가 쓰는 (분자)/(분모) 표기를 KaTeX 의
   \dfrac 으로 바꾼다. 규칙이 못 잡는 모양이 있으면 화면에 / 가 그대로
   남는다 — 학생 눈에는 그냥 틀린 식이다.

   이 파일이 잡아 낸 것:
     · √(25x²−4x)/(4x−1)   무한비의 거신 심화 — 전 문제
     · |x−2|/(x−2)          양면의 경계자 응용 — 전 문제
     · (x²−4)/|x−2|         양면의 경계자 심화 — 전 문제
     · (f(2+h)−f(2))/h      차분몫의 원형 — 전 난이도 전 문제

   새 보스를 만들면 그 식도 여기를 지나가므로, 분수가 안 잡히면
   보스를 붙이는 시점에 바로 실패한다. */
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const N = Number(process.env.JP_TEX_N || 300);

// ── 렌더러에서 toTex 만 떼어낸다 ────────────────────────────────────
function loadToTex() {
  const lines = fs.readFileSync(path.join(ROOT, 'jp-math-render.js'), 'utf8').split(/\r?\n/);
  const at = (p) => {
    const i = lines.findIndex((l) => l.startsWith(p));
    if (i < 0) throw new Error('못 찾음: ' + p);
    return i;
  };
  const start = at('  function toTex');
  let end = -1;
  for (let i = start + 1; i < lines.length; i += 1) if (lines[i] === '  }') { end = i; break }
  const supStart = at('  const superMap');
  let supEnd = supStart;
  for (let i = supStart; i < lines.length; i += 1) if (/\};?$/.test(lines[i])) { supEnd = i; break }
  const code = lines.slice(supStart, supEnd + 1).join('\n') + '\n'
    + lines.slice(start, end + 1).join('\n') + '\nglobalThis.toTex = toTex;';
  const ctx = { console };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: 'jp-math-render.js' });
  return ctx.toTex;
}

// ── 문제 생성기를 떼어낸다 (boss-question-sanity 와 같은 방식) ──────
function loadGenerators() {
  const src = path.join(ROOT, '미적분1/미적분1_계산스킬.js');
  const lines = fs.readFileSync(src, 'utf8').split(/\r?\n/);
  const at = (p) => {
    const i = lines.findIndex((l) => l.startsWith(p));
    if (i < 0) throw new Error('못 찾음: ' + p);
    return i;
  };
  let end = -1;
  const forb = at('  function makeForbiddenQuestion');
  for (let i = forb + 1; i < lines.length; i += 1) if (lines[i] === '  }') { end = i; break }
  const code = [
    'const boss = { phase: 1, hStep: 0, productPair: null, sniperLock: 0, sniperTarget: null };',
    lines.slice(2, at('  const excluded={')).join('\n'),
    lines.slice(at('  function hDistanceLabel'), end + 1).join('\n'),
    'globalThis.API = { makeQuestion, makeDifferenceQuestion, makeForbiddenQuestion, boss,'
    + ' makeSniperQuestion: typeof makeSniperQuestion === "function" ? makeSniperQuestion : null,'
    + ' makeProductBossQuestion: typeof makeProductBossQuestion === "function" ? makeProductBossQuestion : null };'
  ].join('\n');
  const ctx = { console };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: src });
  return ctx.API;
}

const toTex = loadToTex();
const API = loadGenerators();

// 조판된 LaTeX 안에 분수가 되지 못한 / 가 남았는지 본다.
// 이미 \dfrac 이 된 부분은 지우고 나서 확인한다.
function leftoverSlash(tex) {
  let t = tex;
  for (let i = 0; i < 6; i += 1) t = t.replace(/\\dfrac\{[^{}]*\}\{[^{}]*\}/g, '');
  return /\//.test(t);
}

const bad = new Map();
function look(tag, q) {
  for (const text of [q.equation, ...q.choices.map(String)]) {
    let tex;
    try { tex = toTex(text) } catch (e) { continue }
    if (leftoverSlash(tex)) {
      const key = `${tag} · "${text}"`;
      if (!bad.has(key)) bad.set(key, tex);
    }
  }
}

const SKILLS = ['limit_factor', 'limit_rationalize', 'limit_infinity_ratio', 'limit_infinity_diff',
  'limit_one_sided', 'continuity_parameter', 'squeeze_limit', 'differentiate_polynomial', 'tangent_equation'];
const LEVELS = ['basic', 'applied', 'deep'];

for (const id of SKILLS) for (const lv of LEVELS) {
  for (let i = 0; i < N; i += 1) look(`${id}(${lv})`, API.makeQuestion(id, lv));
}
for (const lv of LEVELS) for (let i = 0; i < N; i += 1) {
  look(`lhopital(${lv})`, API.makeForbiddenQuestion(lv));
  look(`derivative_definition(${lv})`, API.makeDifferenceQuestion(lv));
}
if (API.makeSniperQuestion) {
  for (const lv of LEVELS) for (let s = 0; s < 3; s += 1) for (let i = 0; i < N; i += 1) {
    API.boss.sniperLock = s;
    if (!s) API.boss.sniperTarget = null;
    look(`tangent_equation(${lv}·조준${s})`, API.makeSniperQuestion(lv));
  }
}
if (API.makeProductBossQuestion) {
  for (const lv of LEVELS) for (const blade of ['left', 'right']) for (let i = 0; i < N; i += 1) {
    look(`product_rule(${lv}·${blade})`, API.makeProductBossQuestion(lv, blade));
  }
}

// 한번 고친 네 가지가 다시 깨지지 않는지 못박아 둔다.
const MUST_BE_FRACTION = [
  'lim x→−∞  √(25x²−4x)/(4x−1)',
  '|x−2|/(x−2)',
  '(x²−4)/|x−2|',
  'lim h→0  (f(2+h)−f(2))/h',
  '(x²−5x+6)/(x²−9)',
  'lim x→3  (1/x−1/3)/(x−3)'
];
for (const s of MUST_BE_FRACTION) {
  const tex = toTex(s);
  assert.ok(/\\dfrac/.test(tex), `분수로 조판돼야 한다: ${s}\n  → ${tex}`);
  assert.ok(!leftoverSlash(tex), `조판 안 된 / 가 남았다: ${s}\n  → ${tex}`);
}

assert.equal(bad.size, 0, '분수로 조판되지 않은 식이 있다:\n\n'
  + [...bad].map(([k, v]) => `${k}\n    → ${v}`).join('\n\n') + '\n');

console.log(`수식 조판 검사 통과 — 난이도마다 ${N}문제씩`);
