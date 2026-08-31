/* 확률과 통계 깊이 탐구 표 검산. check-deep-dives.js 가 불러 쓴다. */
'use strict';

module.exports = function (api) {
  const { expect, fail, bump } = api;

  // 생일 문제: 모두 다를 확률
  function allDifferent(n, N) {
    let p = 1;
    for (let i = 0; i < n; i += 1) p *= (N - i) / N;
    return p;
  }
  const pairs = (n) => n * (n - 1) / 2;

  {
    const id = 'BANK-MOMENT-17';
    [10, 20, 23, 30, 50, 70].forEach((n, r) => {
      const same = allDifferent(n, 365);
      expect(id, r, 0, n, 1e-9, 'n');
      expect(id, r, 1, pairs(n), 1e-9, '짝');
      expect(id, r, 2, same, 5e-5, '모두 다를 확률');
      expect(id, r, 3, 1 - same, 5e-5, '겹칠 확률');
    });
    bump(1);
    if (!(1 - allDifferent(22, 365) < 0.5 && 1 - allDifferent(23, 365) > 0.5)) {
      fail(id, '절반을 넘는 인원이 23명이 아니다');
    }
  }

  {
    const id = 'BANK-SPLUS-31';
    [10, 20, 23, 30, 50].forEach((n, r) => {
      const exact = 1 - allDifferent(n, 365);
      const approx = 1 - Math.exp(-pairs(n) / 365);
      expect(id, r, 0, n, 1e-9, 'n');
      expect(id, r, 1, pairs(n), 1e-9, '짝');
      expect(id, r, 2, exact, 5e-5, '정확한 확률');
      expect(id, r, 3, approx, 5e-5, '근삿값');
    });
  }

  // 몬티홀: 이론 승률과 기대 승수
  {
    const id = 'BANK-MOMENT-18';
    [[1 / 3, 10, 10000], [2 / 3, 10, 10000], [1 / 2, 10, 10000]].forEach(([p, a, b], r) => {
      expect(id, r, 1, p, 5e-4, '이론 승률');
      expect(id, r, 2, p * a, 5e-3, '10회 예상');
      expect(id, r, 3, Math.round(p * b), 1, '10,000회 예상');
    });
  }

  // 기저율: P(병|양성) = 0.99p / (0.99p + 0.01(1−p)), 10,000명 기준
  {
    const id = 'BANK-MOMENT-19';
    [0.001, 0.010, 0.050, 0.100, 0.500].forEach((p, r) => {
      const tp = 10000 * p * 0.99;
      const fp = 10000 * (1 - p) * 0.01;
      expect(id, r, 0, p, 1e-9, '유병률');
      expect(id, r, 1, tp, 5e-2, '진짜 양성');
      expect(id, r, 2, fp, 5e-2, '거짓 양성');
      expect(id, r, 3, tp / (tp + fp), 5e-5, '양성 예측도');
    });
  }

  // 표본: 표준오차와 오차한계 (p = 0.5)
  {
    const id = 'BANK-MOMENT-20';
    [100, 400, 1000, 10000].forEach((n, r) => {
      const se = Math.sqrt(0.25 / n);
      expect(id, r, 0, n, 1e-9, 'n');
      expect(id, r, 1, se, 5e-5, '표준오차');
      expect(id, r, 2, 1.96 * se * 100, 5e-3, '오차한계 %');
    });
  }

  // 평균과 중앙값: 직원 9명 3000, 대표만 바뀜
  {
    const id = 'BANK-MOMENT-21';
    [3000, 10000, 30000, 100000].forEach((ceo, r) => {
      const sum = 9 * 3000 + ceo;
      expect(id, r, 0, ceo, 1e-9, '대표');
      expect(id, r, 1, sum, 1e-9, '합');
      expect(id, r, 2, sum / 10, 1e-9, '평균');
      expect(id, r, 3, 3000, 1e-9, '중앙값');
    });
  }

  // 생존자편향: 돌아온 기체와 관측 비율
  {
    const id = 'BANK-MOMENT-22';
    const surv = [0.90, 0.80, 0.30, 0.07];
    const back = surv.map((s) => 100 * s);
    const total = back.reduce((a, b) => a + b, 0);
    surv.forEach((s, r) => {
      expect(id, r, 1, 100, 1e-9, '피격');
      expect(id, r, 2, s, 1e-9, '생존 확률');
      expect(id, r, 3, back[r], 5e-4, '돌아온 기체');
      expect(id, r, 4, back[r] / total * 100, 5e-2, '관측 비율');
    });
  }

  // 도박사의 오류: (1/2)^n
  {
    const id = 'BANK-SPLUS-32';
    [1, 5, 10, 11, 20].forEach((n, r) => {
      const p = Math.pow(0.5, n);
      expect(id, r, 0, n, 1e-9, 'n');
      expect(id, r, 1, p, 1e-6, 'P');
      expect(id, r, 2, 1 / p, 1e-6, '1/P');
      expect(id, r, 3, 0.5, 1e-12, '조건부');
    });
  }

  // 1,000명 네 칸 표
  {
    const id = 'BANK-SPLUS-33';
    const sick = 1000 * 0.01, well = 1000 * 0.99;
    expect(id, 0, 1, sick, 1e-9, '환자');
    expect(id, 0, 2, sick * 0.99, 5e-4, '환자 양성');
    expect(id, 0, 3, sick * 0.01, 5e-4, '환자 음성');
    expect(id, 1, 1, well, 1e-9, '건강');
    expect(id, 1, 2, well * 0.01, 5e-4, '거짓 양성');
    expect(id, 1, 3, well * 0.99, 5e-4, '진짜 음성');
    expect(id, 2, 1, 1000, 1e-9, '합계');
    expect(id, 2, 2, sick * 0.99 + well * 0.01, 5e-4, '양성 합');
    expect(id, 2, 3, sick * 0.01 + well * 0.99, 5e-4, '음성 합');
  }

  // 주사위 합: 경우의 수, 평균, 표준편차
  {
    const id = 'BANK-SPLUS-35';
    const varOne = 35 / 12;
    [1, 2, 3, 4].forEach((n, r) => {
      expect(id, r, 0, n, 1e-9, '개수');
      expect(id, r, 1, Math.pow(6, n), 1e-9, '경우의 수');
      expect(id, r, 2, 3.5 * n, 1e-9, '평균');
      expect(id, r, 3, Math.sqrt(varOne * n), 5e-5, '표준편차');
    });
  }

  // 모집단 크기와 오차한계 (유한모집단 보정 포함)
  {
    const id = 'BANK-SPLUS-36';
    const cases = [[10000, 1000], [1000000, 1000], [50000000, 1000], [50000000, 4000]];
    cases.forEach(([N, n], r) => {
      const se = Math.sqrt(0.25 / n);
      const moe = 1.96 * se * 100;
      const fpc = Math.sqrt((N - n) / (N - 1));
      expect(id, r, 1, n, 1e-9, 'n');
      expect(id, r, 2, moe, 5e-3, '오차한계');
      expect(id, r, 3, moe * fpc, 5e-3, '보정 후');
    });
  }

  // 치우침과 흔들림
  {
    const id = 'BANK-SPLUS-37';
    const rows = [[1000, 40.0], [10000, 40.0], [10000, 60.0], [100000, 60.0]];
    rows.forEach(([n, mean], r) => {
      const moe = 1.96 * Math.sqrt(0.25 / n) * 100;
      expect(id, r, 1, n, 1e-9, 'n');
      expect(id, r, 2, mean, 5e-3, '추정값');
      expect(id, r, 3, moe, 5e-3, '흔들림');
      expect(id, r, 4, Math.abs(mean - 40), 5e-3, '참값과의 차이');
    });
  }

  // 같은 평균 다른 분포
  {
    const id = 'BANK-SPLUS-39';
    const groups = [
      [4000, 4500, 5000, 5500, 6000],
      [3000, 3000, 3000, 3000, 13000],
      [2000, 2000, 5000, 8000, 8000]
    ];
    groups.forEach((g, r) => {
      const sorted = g.slice().sort((a, b) => a - b);
      const mean = g.reduce((a, b) => a + b, 0) / g.length;
      expect(id, r, 2, mean, 1e-9, '평균');
      expect(id, r, 3, sorted[2], 1e-9, '중앙값');
      expect(id, r, 4, sorted[4] - sorted[0], 1e-9, '범위');
      bump(1);
      if (Math.abs(mean - 5000) > 1e-9) fail(id, r + '행 평균이 5000 이 아니다');
    });
  }

  // 생존자편향 뒤집기
  {
    const id = 'BANK-SPLUS-40';
    const a = 1000 * 0.03, b = 1000 * 0.02;
    expect(id, 0, 1, 1000, 1e-9, '인원');
    expect(id, 0, 3, a, 1e-9, '성공자');
    expect(id, 0, 4, a / (a + b) * 100, 5e-3, '성공자 중 비율');
    expect(id, 1, 3, b, 1e-9, '성공자');
    expect(id, 1, 4, b / (a + b) * 100, 5e-3, '성공자 중 비율');
    expect(id, 2, 1, 2000, 1e-9, '합계');
    expect(id, 2, 3, a + b, 1e-9, '성공자 합');
    bump(1);
    // 성공률은 3% 대 2% 인데 성공자 중 비율은 60% 대 40% 로 벌어진다
    if (!(0.03 / 0.02 < (a / (a + b)) / (b / (a + b)) + 1e-9)) {
      fail(id, '비율의 뒤집힘이 표와 어긋난다');
    }
  }
};
