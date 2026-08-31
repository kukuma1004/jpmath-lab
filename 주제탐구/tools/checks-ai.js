/* 인공지능·이산수학 깊이 탐구 표 검산. check-deep-dives.js 가 불러 쓴다. */
'use strict';

module.exports = function (api) {
  const { expect, fail, bump } = api;

  // 비밀번호: 10^n
  {
    const id = 'BANK-MOMENT-25';
    [4, 6, 8, 10].forEach((n, r) => {
      expect(id, r, 0, n, 1e-9, '자릿수');
      expect(id, r, 1, Math.pow(10, n), 1e-3, '경우의 수');
      expect(id, r, 2, Math.pow(10, n) / 1e6, 1e-6, '초');
    });
  }

  // 코사인 유사도
  {
    const id = 'BANK-MOMENT-26';
    const rows = [
      [[3, 4], [4, 3]],
      [[3, 4], [4, -3]],
      [[4, -3], [8, -6]],
      [[4, 3], [8, -6]]
    ];
    rows.forEach(([a, b], r) => {
      const dot = a[0] * b[0] + a[1] * b[1];
      const cos = dot / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]));
      expect(id, r, 3, dot, 1e-9, 'a·b');
      expect(id, r, 4, cos, 5e-5, '코사인');
    });
  }

  // 경사하강: x_{n+1} = (1 − 2η) x_n, x0 = 1
  {
    const id = 'BANK-MOMENT-27';
    [0.1, 0.5, 0.9, 1.1].forEach((eta, r) => {
      const k = 1 - 2 * eta;
      expect(id, r, 0, eta, 1e-9, 'η');
      expect(id, r, 1, k, 1e-9, '1−2η');
      expect(id, r, 2, k, 5e-6, '1걸음');
      expect(id, r, 3, Math.pow(k, 3), 5e-6, '3걸음');
      expect(id, r, 4, Math.pow(k, 5), 5e-6, '5걸음');
    });
    bump(1);
    // 수렴 조건 |1 − 2η| < 1 은 0 < η < 1
    if (!(Math.abs(1 - 2 * 0.9) < 1 && Math.abs(1 - 2 * 1.1) > 1)) {
      fail(id, '수렴 조건 서술이 표와 어긋난다');
    }
  }

  // 최단경로: 다익스트라 단계표
  {
    const id = 'BANK-MOMENT-29';
    // A→B 4, A→C 2, C→B 1, C→D 8, B→D 5
    const w = { AB: 4, AC: 2, CB: 1, CD: 8, BD: 5 };
    const dA = 0;
    const dC = w.AC;                    // 2
    const dB = Math.min(w.AB, dC + w.CB); // 3
    const dD = Math.min(dC + w.CD, dB + w.BD); // min(10, 8) = 8
    expect(id, 4, 2, dA, 1e-9, 'A');
    expect(id, 4, 3, dB, 1e-9, 'B');
    expect(id, 4, 4, dC, 1e-9, 'C');
    expect(id, 4, 5, dD, 1e-9, 'D');
    bump(2);
    if (dB !== 3) fail(id, 'B 의 최단거리가 3 이 아니다');
    if (dD !== 8) fail(id, 'D 의 최단거리가 8 이 아니다');
  }

  // 쾨니히스베르크: 차수의 합 = 변 × 2
  {
    const id = 'BANK-MOMENT-30';
    const deg = [3, 3, 3, 5];
    deg.forEach((d, r) => expect(id, r, 1, d, 1e-9, '차수'));
    bump(2);
    const sum = deg.reduce((a, b) => a + b, 0);
    if (sum !== 7 * 2) fail(id, '차수의 합이 변의 두 배가 아니다: ' + sum);
    if (deg.filter((d) => d % 2 === 1).length !== 4) fail(id, '홀수 차수 점이 4개가 아니다');
  }

  // 왕 − 남자 + 여자
  {
    const id = 'BANK-SPLUS-55';
    const king = [5, 5], man = [4, 1], woman = [1, 1];
    const q = [king[0] - man[0] + woman[0], king[1] - man[1] + woman[1]];
    bump(2);
    if (q[0] !== 2 || q[1] !== 5) fail(id, '계산 결과가 (2, 5) 가 아니다');
    const shown = String(api.cell(id, 3, 1)).replace(/[()]/g, '').split(',').map(Number);
    if (shown[0] !== q[0] || shown[1] !== q[1]) {
      fail(id, '3행 결과 벡터가 계산과 다르다');
    }
  }

  // 골짜기 두 개: f(x) = x⁴ − 4x², f'(x) = 4x³ − 8x
  {
    const id = 'BANK-SPLUS-56';
    const f = (x) => x * x * x * x - 4 * x * x;
    const fp = (x) => 4 * x * x * x - 8 * x;
    [-Math.SQRT2, -1, 0, 1, Math.SQRT2].forEach((x, r) => {
      // 표에는 소수 넷째 자리까지 적는다
      expect(id, r, 0, x, 5e-5, 'x');
      expect(id, r, 1, fp(x), 1e-9, "f'");
      expect(id, r, 2, f(x), 1e-9, 'f');
    });
    bump(2);
    if (Math.abs(fp(Math.SQRT2)) > 1e-9) fail(id, 'x=√2 에서 기울기가 0 이 아니다');
    if (f(Math.SQRT2) >= f(1)) fail(id, 'x=√2 가 골짜기가 아니다');
  }

  // 격자 경로: C(2n, n)
  {
    const id = 'BANK-SPLUS-59';
    function comb(n, k) {
      let v = 1;
      for (let i = 1; i <= k; i += 1) v = v * (n - k + i) / i;
      return Math.round(v);
    }
    [2, 4, 8, 16].forEach((n, r) => {
      const paths = comb(2 * n, n);
      const nodes = (n + 1) * (n + 1);
      expect(id, r, 0, n, 1e-9, 'n');
      expect(id, r, 1, paths, 1, '경로 수');
      expect(id, r, 2, nodes, 1e-9, '교차로 수');
      expect(id, r, 3, paths / nodes, Math.max(0.05, paths / nodes * 1e-6), '비');
    });
  }

  // 한붓그리기: 홀수 차수 점의 개수
  {
    const id = 'BANK-SPLUS-60';
    const cases = [
      { edges: 3, odd: 0 },
      { edges: 7, odd: 4 },
      { edges: 8, odd: 2 },
      { edges: 6, odd: 4 }
    ];
    cases.forEach((c, r) => {
      expect(id, r, 1, c.edges, 1e-9, '변의 수');
      expect(id, r, 2, c.odd, 1e-9, '홀수 점');
      bump(1);
      if (c.odd % 2 !== 0) fail(id, r + '행 홀수 차수 점이 홀수 개다');
    });
  }

  // 디피–헬만: p = 23, g = 5, a = 6, b = 15
  {
    const id = 'BANK-SPLUS-61';
    function powMod(base, exp, mod) {
      let r = 1, b = base % mod, e = exp;
      while (e > 0) {
        if (e % 2 === 1) r = (r * b) % mod;
        b = (b * b) % mod;
        e = Math.floor(e / 2);
      }
      return r;
    }
    const p = 23, g = 5, a = 6, b = 15;
    const A = powMod(g, a, p);
    const B = powMod(g, b, p);
    const s1 = powMod(B, a, p);
    const s2 = powMod(A, b, p);
    expect(id, 2, 2, A, 1e-9, '내가 보내는 값');
    expect(id, 3, 2, B, 1e-9, '상대가 보내는 값');
    expect(id, 4, 2, s1, 1e-9, '공유 비밀');
    bump(1);
    if (s1 !== s2) fail(id, '두 사람이 같은 비밀에 도달하지 못한다');
  }

  // 시간표: 제약 없는 배치 수 = 시간대^과목
  {
    const id = 'BANK-SPLUS-62';
    [[3, 3], [4, 3], [5, 3], [6, 4]].forEach(([subj, slot], r) => {
      expect(id, r, 0, subj, 1e-9, '과목 수');
      expect(id, r, 1, slot, 1e-9, '시간대 수');
      expect(id, r, 2, Math.pow(slot, subj), 1e-6, '배치 수');
    });
  }
};
