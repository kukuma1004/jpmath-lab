/* 답이 몇 가지로만 나오는 문제를 찾는다.

   압착의 쌍벽 응용은 600문제 전부 정답이 1이었다. 아이들이 먼저 발견했다.
   검산 테스트는 "답이 맞는가" 만 보았지 "답이 늘 같은가" 는 보지 않았다.
   늘 같은 답은 이해 없이 찍을 수 있으므로 문제가 아니다.

   미적분과 기하를 함께 훑는다. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const assert = require('node:assert/strict');
const N = Number(process.env.JP_VARIETY_N || 400);
const ROOT = path.join(__dirname, '..');

function loadCalc() {
  const lines = fs.readFileSync(path.join(ROOT, '미적분1/미적분1_계산스킬.js'), 'utf8').split(/\r?\n/);
  const at = (p) => {
    const i = lines.findIndex((l) => l.startsWith(p));
    if (i < 0) throw new Error('못 찾음: ' + p);
    return i;
  };
  const code = [
    'const boss = { phase:1, hStep:0, productPair:null, sniperLock:0, sniperTarget:null };',
    lines.slice(2, at('  const excluded={')).join('\n'),
    lines.slice(at('  /* ── 보스 전용 문제 생성기 시작'), at('  /* ── 보스 전용 문제 생성기 끝')).join('\n'),
    'globalThis.API = { makeQuestion, skills };'
  ].join('\n');
  const ctx = { console }; ctx.globalThis = ctx;
  vm.createContext(ctx); vm.runInContext(code, ctx);
  return ctx.API;
}

function loadGeo() {
  const src = path.join(ROOT, '기하/기하_내신스킬.js');
  const lines = fs.readFileSync(src, 'utf8').split(/\r?\n/);
  const at = (p) => {
    const i = lines.findIndex((l) => l.startsWith(p));
    if (i < 0) throw new Error('못 찾음: ' + p);
    return i;
  };
  const endOf = (i) => {
    for (let k = i + 1; k < lines.length; k += 1) if (lines[k] === '  }') return k;
    throw new Error('끝을 못 찾음');
  };
  const code = [
    lines.slice(2, at('  const BOSS_V2_CONFIGS={')).join('\n'),
    lines.slice(at('  const LEVELS=['), endOf(at('  function makeQuestion(')) + 1).join('\n'),
    'globalThis.API = { makeQuestion };'
  ].join('\n');
  const ctx = { console }; ctx.globalThis = ctx;
  vm.createContext(ctx); vm.runInContext(code, ctx);
  return ctx.API;
}

/* 보스가 걸린 스킬만 본다 — 실제로 아이들이 푸는 것이다.
   예전에는 이 정규식이 스킬 묶음 이름(limit, differentiate…)까지 잡아 와서
   있지도 않은 문제를 보고 있었다. 보스 설정에는 mechanic 이 반드시 있으므로
   그것으로 가른다. */
function calcIds() {
  const js = fs.readFileSync(path.join(ROOT, '미적분1/미적분1_계산스킬.js'), 'utf8');
  return [...js.matchAll(/^ {4}([a-z_]+):\{name:'[^']+',[^\r\n]*mechanic:/gm)].map((m) => m[1]);
}
function geoIds() {
  const js = fs.readFileSync(path.join(ROOT, '기하/기하_내신스킬.js'), 'utf8').replace(/\r\n/g, '\n');
  const s = js.indexOf('  const BOSS_V2_CONFIGS={');
  const e = js.indexOf('\n  };', s) + 4;
  const ctx = { CONFIGS: null };
  // 설정이 대단원 명단(UNIT_MEMBERS)을 가져다 쓰므로 그것부터 읽어 둔다
  const um = js.indexOf('  const UNIT_MEMBERS={');
  const ume = um < 0 ? 0 : js.indexOf('\n  };', um) + 4;
  vm.runInNewContext((um < 0 ? '' : js.slice(um, ume) + '\n')
    + js.slice(s, e).replace('const BOSS_V2_CONFIGS=', 'CONFIGS='), ctx);
  return Object.keys(ctx.CONFIGS);
}

const calc = loadCalc(), geo = loadGeo();
const rows = [];

function survey(label, make, ids) {
  for (const id of ids) {
    for (const lv of ['basic', 'applied', 'deep']) {
      const answers = new Map(), shapes = new Set();
      for (let i = 0; i < N; i += 1) {
        let q;
        try { q = make(id, lv); } catch (e) { break; }
        const a = String(q.correct);
        answers.set(a, (answers.get(a) || 0) + 1);
        shapes.add(q.equation);
      }
      if (!answers.size) continue;
      const top = [...answers].sort((a, b) => b[1] - a[1])[0];
      rows.push({
        label, id, lv,
        kinds: answers.size,
        shapes: shapes.size,
        topAnswer: top[0],
        topShare: top[1] / N
      });
    }
  }
}

survey('미적분', (id, lv) => calc.makeQuestion(id, lv), calcIds());
survey('기하', (id, lv) => geo.makeQuestion(id, lv), geoIds());

/* 아이들이 압착의 쌍벽 응용에서 "답이 계속 1" 인 것을 찾아냈다. 늘 같은 답은
   식을 읽지 않고도 맞힐 수 있으므로 문제 구실을 못 한다.

   고를 것이 넷뿐이라 어느 정도 쏠리는 것은 어쩔 수 없다 — 예각·둔각처럼
   답이 사실상 둘뿐인 문제는 절반이 바닥이다. 그래서 문턱을 넉넉히 두고,
   대신 "거의 언제나 같은 답" 은 반드시 잡는다. */
const HARD = 0.72;      // 한 답이 이보다 잦으면 식을 안 읽고도 넘어갈 수 있다
const bad = rows.filter((r) => r.kinds === 1 || r.topShare >= HARD);
bad.sort((a, b) => b.topShare - a.topShare);

const report = bad.map((r) =>
  `  ${r.label} ${r.id}(${r.lv}) — 답 ${r.kinds}가지 · 문제 모양 ${r.shapes}가지`
  + ` · 가장 흔한 답 ${r.topAnswer} (${Math.round(r.topShare * 100)}%)`).join('\n');

assert.equal(bad.length, 0,
  `한 답으로 쏠려 찍을 수 있는 문제가 있다:\n\n${report}\n`);

console.log(`정답 쏠림 검사 통과 — ${rows.length}가지(스킬×난이도) × ${N}문제`);
