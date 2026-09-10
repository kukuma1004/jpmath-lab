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

/* K01 · 미분가능성 + 평균값정리
   f = sgn(x²−1)·P(x). x=±1 에서 부호가 뒤집히므로 미분가능하려면
   P(±1)=P′(±1)=0, 곧 P=(x²−1)². 그러면 평균변화율이 −1 로 떨어진다. */
{
  const f = (x) => (x * x - 1) * Math.abs(x * x - 1);
  const df = (x) => 4 * x * Math.abs(x * x - 1);

  // 미분가능하게 하는 최고차 1 사차가 (x²−1)² 뿐인지
  const smoothAt = (P, a) => {
    const g = (x) => (Math.abs(x) === 1 ? 0 : (x * x - 1 > 0 ? 1 : -1) * P(x));
    const h = 1e-5;
    const L = (g(a) - g(a - h)) / h, R = (g(a + h) - g(a)) / h;
    return Math.abs(L - R) < 1e-2 && Math.abs(g(a - h)) < 1e-2 && Math.abs(g(a + h)) < 1e-2;
  };
  const found = [];
  for (let p = -2; p <= 2; p += 1) for (let q = -3; q <= 3; q += 1)
    for (let r = -2; r <= 2; r += 1) for (let s = -3; s <= 3; s += 1) {
      const P = (x) => x ** 4 + p * x ** 3 + q * x * x + r * x + s;
      if (smoothAt(P, 1) && smoothAt(P, -1)) found.push([p, q, r, s].join(','));
    }
  say(found.length === 1 && found[0] === '0,-2,0,1',
    `K01 · 미분가능하게 하는 P 는 (x²−1)² 하나뿐 (찾은 것 ${found.length}개)`);

  // α : f(−α)=α+1, α>1 → 황금비
  let alpha = null;
  const cond = (a) => (a * a - 1) ** 2 - (a + 1);
  for (let a = 1.0001; a < 4; a += 1e-6) if (cond(a) * cond(a + 1e-6) <= 0) { alpha = a; break }
  say(alpha !== null && near(alpha, (1 + Math.sqrt(5)) / 2, 1e-4), 'K01 · α 는 황금비');

  const slope = (f(1) - f(-alpha)) / (1 + alpha);
  say(near(slope, -1, 1e-4), `K01 · 평균변화율이 −1 로 떨어진다 (${slope.toFixed(6)})`);

  const roots = [];
  const step = 1e-6;
  for (let x = -alpha + step; x < 1 - step; x += step) {
    const u = df(x) + 1, v = df(x + step) + 1;
    if (u === 0 || u * v < 0) roots.push(x);
  }
  say(roots.length === 3, `K01 · f′(c)=−1 의 해가 3개 (${roots.length}개)`);
  say(roots.filter((c) => c < -1).length === 1 && roots.filter((c) => c > -1 && c < 0).length === 2,
    'K01 · (−α,−1) 에 1개, (−1,0) 에 2개');
}

/* K02 · 절댓값과 실근의 배치
   x>0 과 x<0 에서 삼차식이 갈라지고, 나머지 근의 합 조건이 두 식을 더해
   2a=0 으로 떨어뜨린다. */
{
  const cubic = (p, q) => {                       // x³+px+q 의 실근
    const D = -4 * p * p * p - 27 * q * q;
    if (D > 0) {
      const m = 2 * Math.sqrt(-p / 3), th = Math.acos(3 * q / (p * m)) / 3;
      return [0, 1, 2].map((k) => m * Math.cos(th - 2 * Math.PI * k / 3));
    }
    const s = Math.sqrt(q * q / 4 + p * p * p / 27);
    return [Math.cbrt(-q / 2 + s) + Math.cbrt(-q / 2 - s)];
  };
  const rootsOf = (a) => {
    const all = [...cubic(-4, a - 1).filter((x) => x < -1e-9), 0, ...cubic(-4, a + 1).filter((x) => x > 1e-9)];
    const uniq = [];
    for (const r of all.sort((x, y) => x - y)) if (!uniq.some((u) => Math.abs(u - r) < 1e-7)) uniq.push(r);
    return uniq;
  };
  const r0 = rootsOf(0);
  say(r0.length === 5, `K02 · a=0 일 때 서로 다른 실근 5개 (${r0.length}개)`);
  say(near(r0.reduce((p, q) => p + q, 0), 0, 1e-9), 'K02 · 근의 합이 0');

  const others = [];
  for (let i = -300; i <= 300; i += 1) {
    const a = i / 100;
    if (a === 0) continue;
    const rs = rootsOf(a);
    if (rs.length === 5 && Math.abs(rs.reduce((p, q) => p + q, 0)) < 1e-6) others.push(a);
  }
  say(others.length === 0, `K02 · 조건을 만족하는 a 는 0 하나뿐 (다른 것 ${others.length}개)`);
}

/* K03 · |f|−f 와 삼중근
   g 는 f<0 인 곳에서만 −2f 다. 삼차함수는 반드시 부호를 바꾸므로
   g 가 꺾이지 않으려면 그 근에서 f′=0, 곧 삼중근뿐이다. */
{
  const realRoots = (b, c, d) => {
    const f = (x) => x * x * x + b * x * x + c * x + d;
    const rs = [];
    for (let x = -30; x < 30; x += 0.001) { const u = f(x), v = f(x + 0.001); if (u === 0 || u * v < 0) rs.push(x + 0.0005) }
    const uniq = [];
    for (const r of rs) if (!uniq.some((u) => Math.abs(u - r) < 1e-2)) uniq.push(r);
    return uniq;
  };
  const smooth = [];
  for (let b = -3; b <= 3; b += 1) for (let c = -6; c <= 6; c += 1) for (let d = -8; d <= 8; d += 1) {
    const df = (x) => 3 * x * x + 2 * b * x + c;
    if (!realRoots(b, c, d).some((r) => Math.abs(df(r)) > 1e-2)) smooth.push([b, c, d]);
  }
  const isTriple = (t) => { const p = -t[0] / 3; return near(t[1], 3 * p * p) && near(t[2], -(p * p * p)) };
  say(smooth.length > 0 && smooth.every(isTriple),
    `K03 · g 가 꺾이지 않는 삼차는 모두 삼중근 (${smooth.length}개 확인)`);

  const F = (p) => (p <= 0 ? 0 : p < 3 ? p ** 4 / 2 : (p ** 4 - (p - 3) ** 4) / 2);
  const hits = [];
  for (let p = -2; p <= 8; p += 1e-4) if (Math.abs(F(p) - 8) < 1e-4) hits.push(Math.round(p * 1e4) / 1e4);
  const uniq = [...new Set(hits)];
  say(uniq.length === 1 && near(uniq[0], 2, 1e-3), `K03 · 적분이 8 인 p 는 2 하나뿐 (${uniq.join(', ')})`);
  say((5 - 2) ** 3 === 27, 'K03 · f(5)=27');
}

/* K04 · 절댓값 분모와 겹근의 깊이
   g=f/|x−1| 에서 1 이 몇 겹 근인지가 전부다. 연속이 두 겹을, 미분가능이
   세 겹을 부른다. 네 겹도 두 조건을 다 만족하므로 f(0)=3 이 그것을 걷어낸다
   — 값을 정하는 조건이 아니라 경우를 거르는 조건이라는 것이 이 문항의 핵심. */
{
  const gOf = (f) => (x) => (x === 1 ? 0 : f(x) / Math.abs(x - 1));
  const withRoot = (m, r) => (x) => Math.pow(x - 1, m) * (m === 4 ? 1 : (x - r));
  const contAt1 = (f) => {
    const g = gOf(f);
    return [1e-4, 1e-5, 1e-6].every((h) => Math.abs(g(1 + h)) < 1e-2 && Math.abs(g(1 - h)) < 1e-2);
  };
  const diffAt1 = (f) => {
    const g = gOf(f), h = 1e-6;
    return Math.abs((g(1 + h) - g(1)) / h - (g(1) - g(1 - h)) / h) < 1e-3;
  };
  const r = 3;
  say(!contAt1(withRoot(1, r)), 'K04 · 한 겹이면 g 가 연속이 아니다');
  say(contAt1(withRoot(2, r)) && !diffAt1(withRoot(2, r)), 'K04 · 두 겹이면 연속이나 미분가능하지 않다');
  say(contAt1(withRoot(3, r)) && diffAt1(withRoot(3, r)), 'K04 · 세 겹이면 연속이고 미분가능하다');
  say(contAt1(withRoot(4, r)) && diffAt1(withRoot(4, r)), 'K04 · 네 겹도 두 조건을 만족한다 (f(0) 으로 걸러야 한다)');

  const f3 = (x) => Math.pow(x - 1, 3) * (x - 3);
  say(near(f3(0), 3), `K04 · 세 겹 f(0)=${f3(0)} 이라 조건과 맞는다`);
  say(!near(Math.pow(0 - 1, 4), 3), 'K04 · 네 겹은 f(0)=1 이라 떨어진다');

  // f(0) = (−1)³(0−r) = r 이므로 r 은 3 하나뿐이다
  const hits = [];
  for (let t = -20; t <= 20; t += 0.001) if (near(t, 3, 1e-6)) hits.push(Math.round(t * 1000) / 1000);
  const rs = [...new Set(hits)];
  say(rs.length === 1 && near(rs[0], 3, 1e-3), `K04 · f(0)=3 을 만드는 r 은 ${rs.join(', ')} 하나뿐`);
  say(near(f3(5), 128), `K04 · f(5)=${f3(5)}`);
}

/* K05 · 두 극한이 부른 겹근
   lim f/(x−a)=0 은 f(a)=0 과 f′(a)=0 을 한꺼번에 말한다. 두 자리에서
   그러니 사차가 (x−α)²(x−β)² 로 통째로 정해진다. αβ=6 쪽은 실수해가 없어
   죽고, 남은 쪽에서 α·β 를 따로 구하지 않고 합과 곱만으로 답이 나온다. */
{
  const lim = (f, a) => [1e-5, -1e-5].map((h) => f(a + h) / h);
  const single = (x) => (x - 2) * (x - 3) * (x - 4) * (x - 5);
  say(Math.min(...lim(single, 2).map(Math.abs)) > 1, 'K05 · 한 겹 근에서는 극한이 0 이 아니다');
  const dbl = (x) => Math.pow(x - 2, 2) * Math.pow(x - 5, 2);
  say(Math.max(...lim(dbl, 2).map(Math.abs)) < 1e-3, 'K05 · 두 겹 근에서라야 극한이 0 이다');

  // f(0)=36 → (αβ)²=36, f′(1)=0 과 α<1<β → α+β=2
  const found = [];
  for (const prod of [6, -6]) {
    const D = 4 - 4 * prod;                        // t²−2t+prod=0
    if (D < 0) continue;
    found.push({ prod, a: (2 - Math.sqrt(D)) / 2, b: (2 + Math.sqrt(D)) / 2 });
  }
  say(found.length === 1 && found[0].prod === -6,
    `K05 · αβ=6 은 실수해가 없어 죽고 αβ=−6 만 남는다 (남은 것 ${found.length}가지)`);
  const { a, b } = found[0];
  say(a < 1 && 1 < b, `K05 · α=${a.toFixed(4)} < 1 < β=${b.toFixed(4)}`);

  const f = (x) => Math.pow(x - a, 2) * Math.pow(x - b, 2);
  say(near(f(0), 36, 1e-6), `K05 · f(0)=${f(0).toFixed(6)}`);
  const df = (x) => { const h = 1e-6; return (f(x + h) - f(x - h)) / (2 * h) };
  say(Math.abs(df(1)) < 1e-4, `K05 · f′(1)=${df(1).toExponential(2)}`);
  say(near(f(3), 9, 1e-6), `K05 · f(3)=${f(3).toFixed(6)}`);
  // α, β 를 구하지 않는 길: f(3)=[9−3(α+β)+αβ]²
  say(near(Math.pow(9 - 3 * 2 + (-6), 2), 9), 'K05 · 합과 곱만으로도 f(3)=9 가 나온다');
}

for (const c of checks) if (!c.ok) console.log('  X ' + c.msg);
assert.equal(checks.filter((c) => !c.ok).length, 0,
  '킬러문제의 수학이 맞지 않는다:\n' + checks.filter((c) => !c.ok).map((c) => '  ' + c.msg).join('\n'));

// ── 2) 두 쪽이 짝이 맞는가 ────────────────────────────────────────
const VERIFIED = { 1: 3, 2: 0, 3: 27, 4: 128, 5: 9 };

function loadData(file, globalName) {
  const box = { window: {} };
  vm.runInNewContext(read(file), box);
  const data = box.window[globalName];
  assert.ok(data, `${file} 이 ${globalName} 을 내놓지 않는다.`);
  return data;
}
const pub = loadData('AI킬러문제/문제.js', 'JPKillerSet');
const tea = loadData('수업창고/AI킬러문제/풀이.js', 'JPKillerSolutions');

assert.equal(pub.problems.length, tea.problems.length, '공개용과 교사용의 문항 수가 다르다.');
assert.ok(pub.problems.length >= 3, '문항이 셋은 넘어야 한다.');

for (const q of pub.problems) {
  const t = tea.problems.find((x) => x.no === q.no);
  assert.ok(t, `K${q.no} 가 교사용에 없다.`);
  assert.equal(q.stem, t.stem, `K${q.no} 발문이 서로 다르다.`);
  /* 두 데이터는 서로 다른 vm 안에서 만들어져 배열의 프로토타입이 다르다.
     deepEqual 은 그것까지 견주므로 값으로만 비교한다. */
  assert.equal(JSON.stringify(q.conds), JSON.stringify(t.conds), `K${q.no} 조건이 서로 다르다.`);
  assert.equal(q.ask, t.ask, `K${q.no} 묻는 것이 서로 다르다.`);
  assert.equal(q.answer, VERIFIED[q.no], `K${q.no} 공개용 답이 검산과 다르다.`);
  assert.equal(Number(t.answer), VERIFIED[q.no], `K${q.no} 교사용 답이 검산과 다르다.`);

  /* 수식 괄호가 짝이 맞아야 조판이 안 깨진다.

     세기 전에 줄바꿈 간격 표기(\\[2mm])를 걷어낸다. 그 안의 [ 를 블록 수식의
     여는 괄호로 세면 개수가 어긋난다 — 실제로 한 번 걸렸다. */
  const OPEN = '\\' + '(', CLOSE = '\\' + ')';
  const OPEN2 = '\\' + '[', CLOSE2 = '\\' + ']';
  const lineSkip = new RegExp('\\\\\\\\\\[[^\\]]*\\]', 'g');
  for (const [label, raw] of [
    ['공개용', [q.stem, ...q.conds, q.ask, q.hint].join(' ')],
    ['교사용', [t.stem, ...t.conds, t.ask, t.why, ...t.steps.map((s) => s.body), t.note].join(' ')]
  ]) {
    const text = raw.replace(lineSkip, '');
    assert.equal(text.split(OPEN).length, text.split(CLOSE).length, `K${q.no} ${label} 인라인 수식 괄호가 안 맞는다.`);
    assert.equal(text.split(OPEN2).length, text.split(CLOSE2).length, `K${q.no} ${label} 블록 수식 괄호가 안 맞는다.`);
  }

  // 공개용에는 한 문항이 무엇을 묻는지 알려 주는 것들이 있어야 한다
  assert.ok(q.title && q.topic && q.turn, `K${q.no} 목록에 쓸 제목·단원·전환이 비었다.`);
  assert.ok(q.hint && q.hint.length > 10, `K${q.no} 힌트가 비었다.`);
  // 교사용에는 풀이와 수업 노트가 있어야 한다
  assert.ok(t.steps.length >= 3, `K${q.no} 풀이 단계가 ${t.steps.length}줄뿐.`);
  assert.ok(t.why && t.why.length > 30, `K${q.no} "왜 어려운가" 가 비었다.`);
  assert.ok(t.note && t.note.length > 40, `K${q.no} 수업 노트가 빈약하다.`);
}

// ── 3) 풀이가 공개 쪽으로 새지 않는가 ─────────────────────────────
const pubJs = read('AI킬러문제/문제.js');
assert.doesNotMatch(pubJs, /steps\s*:/, '공개용 문항 데이터에 풀이가 들어 있다.');
assert.doesNotMatch(pubJs, /\bnote\s*:/, '공개용 문항 데이터에 수업 노트가 들어 있다.');
for (const page of ['AI킬러문제/index.html', 'AI킬러문제/문제.html']) {
  assert.doesNotMatch(read(page), /auth\.js/, `${page} 는 공개여야 한다.`);
  assert.match(read(page), /문제\.js/, `${page} 가 문항 데이터를 불러와야 한다.`);
}
for (const page of ['수업창고/AI킬러문제/index.html', '수업창고/AI킬러문제/풀이.html']) {
  assert.match(read(page), /auth\.js/, `${page} 에 수업창고 잠금이 걸려야 한다.`);
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

console.log(`AI 킬러문제 검사 통과 — 수학 ${checks.length}건 · ${pub.problems.length}문항 · 공개와 수업창고가 짝이 맞음`);
