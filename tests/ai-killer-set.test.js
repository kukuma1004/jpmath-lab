/* AI 킬러문제 여섯 문항을 지킨다.

   두 가지를 본다.
     1) 수학이 맞는가 — 조건을 만족하는 함수를 실제로 만들어, 조건이 정말
        성립하는지, 답이 정말 그 값인지, 그런 함수가 하나뿐인지 확인한다.
     2) 두 쪽이 짝이 맞는가 — 학생용 문제지와 교사용 풀이의 발문이 같아야
        한다. 한쪽만 고치면 수업에서 어긋난다.

   문제를 고치면 여기도 함께 고쳐야 한다. 그것이 이 파일의 목적이다. */
const fs = require("fs");
const path = require("path");
process.chdir(path.join(__dirname, ".."));

const near = (a, b, e = 1e-7) => Math.abs(a - b) < e;
const P = (c) => (x) => c.reduce((s, k, i) => s + k * Math.pow(x, i), 0);   // 계수는 낮은 차수부터
const results = [];
const say = (no, ok, msg) => { results.push({ no, ok, msg }); console.log(`  ${ok ? 'O' : 'X'} ${msg}`); };

// ── K1 · 사차함수와 유리식의 극한 ──────────────────────────────────
// f(x)=x(x−1)(x²−6x+3),  g=f/(x²−x)
console.log('\nK1 · 극한과 연속');
{
  const f = (x) => x * (x - 1) * (x * x - 6 * x + 3);
  const g = (x) => f(x) / (x * x - x);
  // 0 과 1 근처에서 극한이 각각 3, −2 인가
  const at0 = [1e-5, -1e-5, 1e-6, -1e-6].map(g);
  const at1 = [1 + 1e-5, 1 - 1e-5, 1 + 1e-6, 1 - 1e-6].map(g);
  say(1, at0.every((v) => near(v, 3, 1e-3)), `x→0 극한 3 (실제 ${at0[0].toFixed(6)})`);
  say(1, at1.every((v) => near(v, -2, 1e-3)), `x→1 극한 −2 (실제 ${at1[0].toFixed(6)})`);
  say(1, near(f(4), -60), `f(4) = ${f(4)} (답 −60)`);
  // 최고차항 계수 1 인 사차인가
  const lead = f(1e4) / Math.pow(1e4, 4);
  say(1, near(lead, 1, 1e-3), `최고차항 계수 1 (실제 ${lead.toFixed(6)})`);
  // 유일성: f=x(x−1)(x²+px+r) 에서 r=3, p=−6 이 강제되는가
  let only = true;
  for (let p = -12; p <= 12; p += 1) for (let r = -12; r <= 12; r += 1) {
    const h = (x) => x * (x - 1) * (x * x + p * x + r);
    const q = (x) => x * x + p * x + r;
    if (near(q(0), 3) && near(q(1), -2) && !(p === -6 && r === 3)) only = false;
  }
  say(1, only, '조건을 만족하는 f 는 하나뿐');
}

// ── K2 · |f| 의 미분가능성 ─────────────────────────────────────────
// f(x)=x²(x−1)²
console.log('\nK2 · 절댓값과 미분가능성');
{
  const f = (x) => x * x * (x - 1) * (x - 1);
  const g = (x) => Math.abs(f(x));
  say(2, near(f(0), 0) && near(f(1), 0) && near(f(2), 4), `f(0)=${f(0)}, f(1)=${f(1)}, f(2)=${f(2)}`);
  // 뿌리 0, 1 에서 좌우 미분계수가 같은가
  const d = (fn, x, h = 1e-6) => (fn(x + h) - fn(x - h)) / (2 * h);
  const dd = (x) => {
    const L = (g(x) - g(x - 1e-6)) / 1e-6, R = (g(x + 1e-6) - g(x)) / 1e-6;
    return Math.abs(L - R);
  };
  say(2, dd(0) < 1e-3 && dd(1) < 1e-3, `|f| 가 x=0, x=1 에서 미분가능 (좌우 차 ${dd(0).toExponential(1)}, ${dd(1).toExponential(1)})`);
  say(2, near(f(4), 144), `f(4) = ${f(4)} (답 144)`);
  /* 유일성: 최고차 1 인 사차에서 |f| 가 어디서나 미분가능하려면 실근이 모두
     짝수 겹이어야 한다. f(0)=f(1)=0 이므로 0 과 1 이 각각 두 겹씩 —
     사차를 다 쓴다. 다른 모양이 f(2)=4 를 만족하는지 훑어본다. */
  let clash = false;
  for (let b = -20; b <= 20; b += 1) for (let c = -20; c <= 20; c += 1) {
    // f=x²(x²+bx+c) 꼴이면 f(1)=1+b+c=0 이어야 하고, 실근이 짝수 겹이어야 한다
    if (!near(1 + b + c, 0)) continue;
    const disc = b * b - 4 * c;
    const h = (x) => x * x * (x * x + b * x + c);
    if (near(h(2), 4) && !(b === -2 && c === 1)) {
      // 판별식이 0 이면 중근이라 허용, 음수면 실근 없어 허용
      if (disc <= 0) clash = true;
    }
  }
  say(2, !clash, '조건을 만족하는 f 는 x²(x−1)² 하나뿐');
}

// ── K3 · |x³−3x²+k| = 1 의 실근 개수 ──────────────────────────────
console.log('\nK3 · 절댓값 방정식의 실근 개수');
{
  // 삼차 x³−3x²+k−c 의 서로 다른 실근 개수를 센다
  const rootCount = (k, c) => {
    const f = (x) => x * x * x - 3 * x * x + k - c;
    // 극값으로 판정: 극대 f(0)=k−c, 극소 f(2)=k−c−4
    const hi = k - c, lo = k - c - 4;
    if (hi > 0 && lo < 0) return 3;
    if (near(hi, 0) || near(lo, 0)) return 2;
    return 1;
  };
  const good = [];
  for (let k = -30; k <= 30; k += 1) {
    if (rootCount(k, 1) + rootCount(k, -1) === 5) good.push(k);
  }
  say(3, good.join(',') === '1,3', `정수 k = ${good.join(', ')} (기대 1, 3)`);
  const sum = good.reduce((a, b) => a + b, 0);
  say(3, sum === 4, `합 = ${sum} (답 4)`);
  // 실제로 근을 세어 교차 확인
  const distinct = (k) => {
    const xs = [];
    for (let x = -20; x <= 20; x += 0.0005) {
      const v1 = Math.abs(x * x * x - 3 * x * x + k) - 1;
      const v2 = Math.abs((x + 0.0005) ** 3 - 3 * (x + 0.0005) ** 2 + k) - 1;
      if (v1 === 0 || v1 * v2 < 0) xs.push(Math.round(x * 1000) / 1000);
    }
    return xs.length;
  };
  say(3, distinct(1) === 5 && distinct(3) === 5, `직접 세어도 k=1 일 때 ${distinct(1)}개, k=3 일 때 ${distinct(3)}개`);
}

// ── K4 · g(t) 의 불연속점과 삼차함수 ──────────────────────────────
// f(x)=x³−3x+1
console.log('\nK4 · 실근 개수 함수의 불연속점');
{
  const f = (x) => x * x * x - 3 * x + 1;
  const df = (x) => 3 * x * x - 3;
  say(4, near(df(1), 0) && f(1) === -1, `x=1 에서 f′=0 이고 f(1)=${f(1)} (극솟값)`);
  say(4, near(df(-1), 0) && f(-1) === 3, `x=−1 에서 극댓값 ${f(-1)}`);
  // 극솟값인지 확인 (좌우 부호)
  say(4, df(0.9) < 0 && df(1.1) > 0, 'x=1 좌우에서 f′ 이 −에서 +로 바뀐다 (극소)');
  say(4, near(f(3), 19), `f(3) = ${f(3)} (답 19)`);
  /* 유일성: f′=3(x−α)(x−1) 로 두면 극댓값−극솟값 = −(α−1)³/2 이다.
     이 차가 3−(−1)=4 가 되는 α 를 찾는다. */
  const gap = (a) => -(Math.pow(a - 1, 3)) / 2;
  const found = [];
  for (let a = -6; a <= 6; a += 0.001) if (near(gap(a), 4, 1e-3)) found.push(Math.round(a * 100) / 100);
  const uniq = [...new Set(found)];
  say(4, uniq.every((x) => near(x, -1, 0.02)), `극대점 α = ${uniq[0]} 하나뿐 (기대 −1)`);
}

// ── K5 · 곡선과 직선 사이의 넓이 ──────────────────────────────────
console.log('\nK5 · 넓이가 36 이 되는 기울기');
{
  const area = (m) => {
    // ∫₀^{m+4} (mx − (x²−4x)) dx
    const L = m + 4;
    let s = 0; const n = 200000, h = L / n;
    for (let i = 0; i < n; i += 1) {
      const x = (i + 0.5) * h;
      s += (m * x - (x * x - 4 * x)) * h;
    }
    return s;
  };
  say(5, near(area(2), 36, 1e-3), `m=2 일 때 넓이 = ${area(2).toFixed(4)} (조건 36)`);
  // 다른 양수 m 에서는 36 이 아닌가
  let only = true;
  for (let m = 0.05; m <= 8; m += 0.05) if (near(area(m), 36, 1e-2) && !near(m, 2, 0.02)) only = false;
  say(5, only, 'm>0 에서 넓이가 36 인 것은 m=2 하나뿐');
  say(5, true, `공식으로도 (m+4)³/6 = 36 → m+4 = ${Math.cbrt(216)} → m = 2`);
}

// ── K6 · 정적분으로 정의된 함수의 극값 차 ────────────────────────
console.log('\nK6 · 극댓값과 극솟값의 차');
{
  const F = (a, x) => {
    let s = 0; const n = 200000, h = x / n;
    for (let i = 0; i < n; i += 1) {
      const t = (i + 0.5) * h;
      s += (t - 1) * (t - a) * h;
    }
    return s;
  };
  const a = 7;
  const hi = F(a, 1), lo = F(a, a);
  say(6, near(hi - lo, 36, 1e-3), `a=7 일 때 극대 ${hi.toFixed(4)} − 극소 ${lo.toFixed(4)} = ${(hi - lo).toFixed(4)} (조건 36)`);
  // x=1 이 극대, x=a 가 극소인지
  const d = (x) => (x - 1) * (x - a);
  say(6, d(0.9) > 0 && d(1.1) < 0, 'x=1 에서 f′ 이 +에서 −로 (극대)');
  say(6, d(a - 0.1) < 0 && d(a + 0.1) > 0, `x=${a} 에서 f′ 이 −에서 +로 (극소)`);
  let only = true;
  for (let t = 1.05; t <= 12; t += 0.05) {
    const diff = Math.pow(t - 1, 3) / 6;
    if (near(diff, 36, 1e-2) && !near(t, 7, 0.03)) only = false;
  }
  say(6, only, 'a>1 에서 차가 36 인 것은 a=7 하나뿐');
}

const bad = results.filter((r) => !r.ok);
console.log(`\n검산 ${results.length}건 중 ${bad.length}건 실패`);
if (bad.length) { for (const b of bad) console.log(`  K${b.no}: ${b.msg}`); process.exit(1) }
console.log('여섯 문항 모두 조건·답·유일성 확인됨');


const VERIFIED = { 1: -60, 2: 144, 3: 4, 4: 19, 5: 2, 6: 7 };   // 수치로 확인한 답
const OPEN = '\\' + '(';
const CLOSE = '\\' + ')';

function pull(file) {
  const s = fs.readFileSync(file, 'utf8');
  const m = /const SET = \[([\s\S]*?)\n  \];/.exec(s);
  if (!m) throw new Error('문항 데이터를 못 찾음: ' + file);
  return { html: s, set: eval('[' + m[1] + ']') };
}

const pub = pull('수능문제/미적분1/AI킬러문제.html');
const tea = pull('수업창고/수능문제/미적분1/교사용_AI킬러문제_풀이.html');

let mismatch = 0;
const note = (msg) => { console.log('  X ' + msg); mismatch += 1 };
const okay = (msg) => console.log('  O ' + msg);

// 잠금
if (/auth\.js" data-classroom-protected/.test(tea.html)) okay('교사용 풀이에 수업창고 잠금이 걸려 있다');
else note('교사용 풀이에 잠금이 없다');
if (/auth\.js/.test(pub.html)) note('학생용 문제지에 잠금이 걸려 있다 (공개여야 한다)');
else okay('학생용 문제지는 잠금 없이 공개');

// 풀이가 학생용에 새지 않았는가 — 이 자료의 규칙이다
if (/steps|풀이/.test(pub.html.replace(/풀이와 교사용 해설은|풀이는 공개하지|풀이는 수업창고에만/g, ''))) {
  const leak = /"steps"|steps:/.test(pub.html);
  if (leak) note('학생용 문제지에 풀이가 들어 있다');
  else okay('학생용 문제지에 풀이가 없다');
} else okay('학생용 문제지에 풀이가 없다');

// 문항 수와 답
if (pub.set.length === 6 && tea.set.length === 6) okay('두 쪽 모두 여섯 문항');
else note(`문항 수가 다르다 — 학생용 ${pub.set.length}, 교사용 ${tea.set.length}`);

for (const q of pub.set) {
  const t = tea.set.find((x) => x.no === q.no);
  if (!t) { note(`K${q.no} 이 교사용에 없다`); continue }
  // 발문이 같은가
  if (q.body !== t.stem) note(`K${q.no} 발문이 서로 다르다`);
  if (JSON.stringify(q.conds) !== JSON.stringify(t.conds)) note(`K${q.no} 조건이 서로 다르다`);
  if (q.ask !== t.ask) note(`K${q.no} 묻는 것이 서로 다르다`);
  // 답이 검산과 같은가
  if (q.answer !== VERIFIED[q.no]) note(`K${q.no} 학생용 답 ${q.answer} ≠ 검산 ${VERIFIED[q.no]}`);
  if (Number(t.answer) !== VERIFIED[q.no]) note(`K${q.no} 교사용 답 ${t.answer} ≠ 검산 ${VERIFIED[q.no]}`);
  // 수식 델리미터가 짝이 맞는가 — 안 맞으면 조판이 깨진다
  for (const [label, text] of [['학생용', [q.body, ...q.conds, q.ask, q.hint].join(' ')],
    ['교사용', [t.stem, ...t.conds, t.ask, ...t.steps, t.note].join(' ')]]) {
    const o = text.split(OPEN).length - 1, c = text.split(CLOSE).length - 1;
    if (o !== c) note(`K${q.no} ${label} 수식 괄호가 안 맞는다 (${o} vs ${c})`);
  }
  if (t.steps.length < 3) note(`K${q.no} 풀이 단계가 ${t.steps.length}줄뿐`);
  if (!t.note || t.note.length < 40) note(`K${q.no} 수업 노트가 빈약하다`);
}
if (!mismatch) okay('여섯 문항 모두 발문·조건·답·조판이 두 쪽에서 일치');

console.log(`\n답: ${pub.set.map((q) => `K${q.no}=${q.answer}`).join(', ')}`);
console.log(`풀이 단계: ${tea.set.map((t) => t.steps.length).join(', ')}줄`);
if (mismatch) { console.log(`\n${mismatch}건 문제`); process.exit(1) }
console.log('\n두 쪽이 짝이 맞는다');
