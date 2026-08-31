/* 대수 깊이 탐구 표 검산. check-deep-dives.js 가 불러 쓴다. */
'use strict';

module.exports = function (api) {
  const { expect, fail, bump } = api;

  // 종이 접기: 두께 = 0.1 mm × 2^n
  {
    const id = 'BANK-MOMENT-11';
    [10, 20, 30, 42].forEach((n, r) => {
      const p = Math.pow(2, n);
      expect(id, r, 0, n, 1e-9, 'n');
      expect(id, r, 1, p, 1, '2^n');
      expect(id, r, 2, 0.1 * p, Math.max(1e-6, 0.1 * p * 1e-9), '두께 mm');
      expect(id, r, 3, 0.1 * p / 1e6, Math.max(1e-9, 0.1 * p / 1e6 * 1e-9), '두께 km');
    });
  }

  // 등비수열: 10단계 인원과 누적
  {
    const id = 'BANK-MOMENT-12';
    [0.9, 1.0, 1.1, 1.5].forEach((rr, r) => {
      // 10단계는 10번째 항이므로 r의 9제곱이다
      const nth = Math.pow(rr, 9);
      const sum = rr === 1 ? 10 : (1 - Math.pow(rr, 10)) / (1 - rr);
      expect(id, r, 0, rr, 1e-9, 'r');
      expect(id, r, 1, nth, 5e-6, '10단계');
      expect(id, r, 2, sum, 5e-6, '누적');
    });
    // r < 1 의 무한 누적 = 1/(1−r)
    expect(id, 0, 3, 1 / (1 - 0.9), 5e-6, '무한 누적');
  }

  // 로그로 곱셈
  {
    const id = 'BANK-MOMENT-13';
    const rows = [[2, 3, 6], [20, 30, 600], [1234, 5678, 1234 * 5678]];
    rows.forEach(([a, b, prod], r) => {
      expect(id, r, 1, Math.log10(a), 5e-5, 'log a');
      expect(id, r, 2, Math.log10(b), 5e-5, 'log b');
      expect(id, r, 3, Math.log10(a) + Math.log10(b), 5e-5, '합');
      expect(id, r, 4, prod, Math.max(1, prod * 1e-6), '결과');
    });
    // 나눗셈 행
    expect(id, 3, 3, Math.log10(2) - Math.log10(8), 5e-5, '차');
    expect(id, 3, 4, 0.25, 1e-9, '결과');
  }

  // 복리: 1.07^n
  {
    const id = 'BANK-MOMENT-15';
    [[20, 45], [30, 35], [40, 25], [50, 15]].forEach(([, years], r) => {
      const g = Math.pow(1.07, years);
      expect(id, r, 1, years, 1e-9, '기간');
      expect(id, r, 2, g, 5e-4, '배수');
      expect(id, r, 3, 1000 * g, 5e-1, '결과');
    });
  }

  // 대출: 원금 3억, 연 5%, 10년
  {
    const id = 'BANK-MOMENT-16';
    const P = 30000;                 // 만원
    const i = 0.05 / 12;
    const n = 120;
    // 원금균등
    const principal = P / n;
    let eqTotal = 0;
    for (let k = 0; k < n; k += 1) eqTotal += (P - principal * k) * i;
    const eqFirst = principal + P * i;
    const eqLast = principal + (P - principal * (n - 1)) * i;
    // 원리금균등
    const A = P * i * Math.pow(1 + i, n) / (Math.pow(1 + i, n) - 1);
    const annTotal = A * n - P;
    // 만기일시
    const balloonMonthly = P * i;
    const balloonTotal = balloonMonthly * n;

    expect(id, 0, 1, eqFirst, 5e-2, '원금균등 첫 달');
    expect(id, 0, 2, eqLast, 5e-2, '원금균등 마지막');
    expect(id, 0, 3, eqTotal, 5e-1, '원금균등 총이자');
    expect(id, 1, 1, A, 5e-2, '원리금균등');
    expect(id, 1, 2, A, 5e-2, '원리금균등');
    expect(id, 1, 3, annTotal, 5e-1, '원리금균등 총이자');
    expect(id, 2, 1, balloonMonthly, 5e-2, '만기일시 첫 달');
    expect(id, 2, 2, balloonMonthly + P, 5e-2, '만기일시 마지막');
    expect(id, 2, 3, balloonTotal, 5e-1, '만기일시 총이자');
    bump(1);
    if (!(eqTotal < annTotal && annTotal < balloonTotal)) {
      fail(id, '총이자 순서가 원금균등 < 원리금균등 < 만기일시 가 아니다');
    }
  }

  // 평균율: 440 × 2^(n/12)
  {
    const id = 'BANK-MOMENT-32';
    const f = (n) => 440 * Math.pow(2, n / 12);
    [0, 1, 2, 3].forEach((n, r) => {
      expect(id, r, 1, n, 1e-9, '반음');
      expect(id, r, 2, f(n), 5e-3, '주파수');
      if (n > 0) expect(id, r, 3, f(n) - f(n - 1), 5e-3, '차');
    });
    expect(id, 4, 1, 12, 1e-9, '반음');
    expect(id, 4, 2, f(12), 5e-3, '주파수');
    bump(1);
    if (Math.abs(f(12) - 880) > 1e-9) fail(id, '12반음 위가 두 배가 아니다');
  }

  // 접기의 물리적 한계
  {
    const id = 'BANK-SPLUS-10';
    [0, 4, 7, 10].forEach((n, r) => {
      const t = 0.1 * Math.pow(2, n);
      const w = 210 / Math.pow(2, n);
      expect(id, r, 0, n, 1e-9, 'n');
      expect(id, r, 1, t, 5e-6, '두께');
      expect(id, r, 2, w, 5e-6, '폭');
      expect(id, r, 3, w / t, Math.max(5e-7, w / t * 1e-6), '비');
    });
  }

  // 지수적 성장: 10 × 1.3^t
  {
    const id = 'BANK-SPLUS-11';
    const N = (t) => 10 * Math.pow(1.3, t);
    [[0, 0], [1, 5], [2, 10], [3, 20], [4, 30]].forEach(([r, t]) => {
      expect(id, r, 1, N(t), 5e-2, '인원');
      if (t > 0) expect(id, r, 2, N(t) - N(t - 1), 5e-2, '증가');
    });
  }

  // 별의 등급: 100^(d/5)
  {
    const id = 'BANK-SPLUS-12';
    [1, 2, 3, 5, 10].forEach((d, r) => {
      expect(id, r, 0, d, 1e-9, '등급 차');
      expect(id, r, 1, Math.pow(100, d / 5), Math.max(5e-4, Math.pow(100, d / 5) * 1e-6), '밝기 비');
    });
  }

  // 로그표의 계산량: n²
  {
    const id = 'BANK-SPLUS-13';
    [2, 4, 8, 16].forEach((n, r) => {
      expect(id, r, 0, n, 1e-9, '자릿수');
      expect(id, r, 1, n * n, 1e-9, '손 곱셈');
      expect(id, r, 2, 4, 1e-9, '로그 방법');
      expect(id, r, 3, n * n * 1000, 1e-6, '1000번');
    });
  }

  // 데시벨: 10^(d/10)
  {
    const id = 'BANK-SPLUS-14';
    [3, 6, 10, 20, 30].forEach((d, r) => {
      expect(id, r, 0, d, 1e-9, 'dB');
      expect(id, r, 1, Math.pow(10, d / 10), Math.max(5e-4, Math.pow(10, d / 10) * 1e-6), '세기 비');
    });
  }

  // 확산: 100 → 100만 도달 단계와 조회수
  {
    const id = 'BANK-SPLUS-15';
    [1.5, 2.0, 1.2, 1.1].forEach((rr, r) => {
      const steps = Math.log(1e6 / 100) / Math.log(rr);
      expect(id, r, 0, rr, 1e-9, 'r');
      expect(id, r, 1, steps, 5e-3, '도달 단계');
      expect(id, r, 2, 100 * Math.pow(rr, 10), 5e-2, '10단계');
      expect(id, r, 3, 100 * Math.pow(rr, 20), Math.max(5e-2, 100 * Math.pow(rr, 20) * 1e-6), '20단계');
    });
  }

  // 귀납법: 1 + 2 + … + n = n(n+1)/2
  {
    const id = 'BANK-SPLUS-16';
    [1, 2, 5, 10, 100].forEach((n, r) => {
      let s = 0;
      for (let k = 1; k <= n; k += 1) s += k;
      expect(id, r, 0, n, 1e-9, 'n');
      expect(id, r, 1, s, 1e-9, '직접 합');
      expect(id, r, 2, n * (n + 1) / 2, 1e-9, '공식');
      bump(1);
      if (s !== n * (n + 1) / 2) fail(id, 'n=' + n + ' 에서 합과 공식이 다르다');
    });
  }
};
