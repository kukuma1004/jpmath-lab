/* 기하 36종 보스 문제의 선택지와 조판을 본다.

   기하 보스는 문제 생성기를 새로 쓰지 않고 각 스킬이 이미 갖고 있던 것을
   그대로 쓴다. 그래서 생성기 자체는 오래된 코드인데, 보스전에서는 네 개의
   선택지가 곧 전투의 전부라 선택지가 무너지면 보스가 무너진다.

   이 파일이 잡아 낸 것:
     · 구의 조형사 / 구면벡터의 성운룡 — 반지름을 1 로 뽑으면 "우변을 r² 대신
       r 로 쓴다" 는 트랩이 정답과 같아진다(1²=1). 선택지가 셋으로 줄어
       "조건 불일치 1" 이라는 채움말이 답 후보로 떴다.
     · 그림자길이의 투영자 / 그림자넓이의 포식자 — 길이를 홀수로 뽑으면
       오답이 3.5 가 되어 소수가 화면에 샜고, θ=0° 일 때는 오답 하나가
       정답과 같아졌다.

   미적분 쪽 tests/boss-question-sanity.test.js 처럼 답을 다시 계산하지는
   않는다. 기하 문제는 좌표·방정식·문장이 섞여 있어 다시 읽는 규칙을 36종에
   맞춰 따로 써야 하기 때문이다. 여기서는 어느 생성기에나 해당하는 것만 본다 —
   정답이 선택지에 있는가, 넷이 서로 다른가, 채움말이나 소수가 새지 않는가,
   그리고 화면에 찍히는 식이 제대로 조판되는가. */
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const N = Number(process.env.JP_GEO_N || 400);

function slice(file, from, to) {
  const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split(/\r?\n/);
  const at = (p) => {
    const i = lines.findIndex((l) => l.startsWith(p));
    if (i < 0) throw new Error(`${file}: 못 찾음 ${p}`);
    return i;
  };
  return { lines, at, from, to };
}

// ── 렌더러에서 toTex 만 떼어낸다 ────────────────────────────────────
function loadToTex() {
  const { lines, at } = slice('jp-math-render.js');
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

// ── 기하 문제 생성기를 떼어낸다 ────────────────────────────────────
function loadGeometry() {
  const src = '기하/기하_내신스킬.js';
  const { lines, at } = slice(src);
  // 함수의 닫는 괄호까지 가져와야 잘라 낸 코드가 문법에 맞는다
  const endOf = (i) => {
    for (let k = i + 1; k < lines.length; k += 1) if (lines[k] === '  }') return k;
    throw new Error('끝을 못 찾음');
  };
  const code = [
    lines.slice(2, at('  const BOSS_V2_CONFIGS={')).join('\n'),
    lines.slice(at('  const LEVELS=['), endOf(at('  function makeQuestion(')) + 1).join('\n'),
    'globalThis.API = { makeQuestion };'
  ].join('\n');
  const ctx = { console };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: src });
  return ctx.API;
}

// 보스 설정에서 36종의 id 를 읽는다. 손으로 적어 두면 보스를 더할 때 어긋난다.
function bossIds() {
  const js = fs.readFileSync(path.join(ROOT, '기하/기하_내신스킬.js'), 'utf8').replace(/\r\n/g, '\n');
  const s = js.indexOf('  const BOSS_V2_CONFIGS={');
  const e = js.indexOf('\n  };', s) + 4;
  assert.ok(s > 0 && e > 4, '기하 보스 설정을 찾지 못했다.');
  const ctx = { CONFIGS: null };
  // 설정이 대단원 명단(UNIT_MEMBERS)을 가져다 쓰므로 그것부터 읽어 둔다
  const um = js.indexOf('  const UNIT_MEMBERS={');
  const ume = um < 0 ? 0 : js.indexOf('\n  };', um) + 4;
  vm.runInNewContext((um < 0 ? '' : js.slice(um, ume) + '\n')
    + js.slice(s, e).replace('const BOSS_V2_CONFIGS=', 'CONFIGS='), ctx);
  return Object.keys(ctx.CONFIGS);
}

const toTex = loadToTex();
const API = loadGeometry();
const IDS = bossIds();
/* 스킬 보스 서른여섯에 대단원 총력전 셋을 더해 서른아홉.
   대단원은 제 문제가 없고 그 단원 스킬에서 뽑으므로, 여기서 함께 돌리면
   같은 생성기를 한 번 더 훑는 셈이 되어 손해가 없다. */
assert.equal(IDS.length, 39, '기하 보스는 스킬 36종과 대단원 3종이어야 한다.');
assert.equal(IDS.filter((x) => x.startsWith('unit_')).length, 3, '대단원은 셋이어야 한다.');

// 이미 \dfrac 이 된 부분을 지우고 나서 / 가 남았는지 본다
function leftoverSlash(tex) {
  let t = tex;
  for (let i = 0; i < 6; i += 1) t = t.replace(/\\dfrac\{[^{}]*\}\{[^{}]*\}/g, '');
  return /\//.test(t);
}

const bad = new Map();
const note = (k, v) => { if (!bad.has(k)) bad.set(k, v) };

let total = 0;
for (const id of IDS) for (const level of ['basic', 'applied', 'deep']) {
  for (let i = 0; i < N; i += 1) {
    const q = API.makeQuestion(id, level);
    const tag = `${id}(${level})`;
    const shown = q.choices.map(String);
    total += 1;

    for (const text of [q.equation, q.prompt, ...shown]) {
      let tex;
      try { tex = toTex(text) } catch (e) { continue }
      if (leftoverSlash(tex)) note(`${tag} · 조판 안 된 / · "${text}"`, tex);
    }

    // 채움말은 학생 눈에 답 후보로 보인다. 선택지가 모자란다는 뜻이다.
    for (const c of shown) if (/조건 불일치|다른 값/.test(c)) note(`${tag} · 채움말`, `${q.equation} → ${shown.join(' / ')}`);
    // 정수로 떨어지는 문제뿐이므로 소수는 계산이 샌 것이다.
    for (const c of shown) if (/\d\.\d/.test(c)) note(`${tag} · 소수`, `${q.equation} → ${shown.join(' / ')}`);

    if (!shown.includes(String(q.correct))) note(`${tag} · 정답이 선택지에 없음`, `${q.correct} ∉ ${shown.join(' / ')}`);
    if (new Set(shown).size !== shown.length) note(`${tag} · 선택지 중복`, shown.join(' / '));
    if (shown.length !== 4) note(`${tag} · 선택지 ${shown.length}개`, shown.join(' / '));
  }
}

// 한번 고친 것이 다시 깨지지 않게 못박아 둔다
for (let i = 0; i < 200; i += 1) {
  for (const id of ['sphere_build', 'sphere_vector']) {
    const q = API.makeQuestion(id, 'deep');
    const r = /반지름 (\d+)/.exec(q.equation + ' ' + q.prompt + ' ' + q.correct);
    if (r) assert.ok(Number(r[1]) >= 2, `${id}: 반지름이 1이면 r과 r²이 같아져 트랩이 죽는다 — ${q.correct}`);
  }
  for (const id of ['projection_length', 'projection_area']) {
    const q = API.makeQuestion(id, 'deep');
    const L = Number(/[LS]=(\d+)/.exec(q.equation)[1]);
    assert.ok(L % 2 === 0, `${id}: 길이가 홀수면 절반이 소수가 된다 — ${q.equation}`);
  }
}

assert.equal(bad.size, 0, '기하 보스 문제에 문제가 있다:\n\n'
  + [...bad].map(([k, v]) => `${k}\n    → ${v}`).join('\n\n') + '\n');

console.log(`기하 보스 선택지 검사 통과 — ${IDS.length}종 × 난이도 3 × ${N}문제 = ${total}문제`);
