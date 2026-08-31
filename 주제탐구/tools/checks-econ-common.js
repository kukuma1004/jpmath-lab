/* 경제수학·공통수학·수학과 문화 깊이 탐구 표 검산.
   check-deep-dives.js 가 불러 쓴다. */
'use strict';

module.exports = function (api) {
  const { expect, fail, bump } = api;
  const D2R = Math.PI / 180;

  /* ── 경제수학 ── */

  // 환율: 순노출 × 환율 변화
  {
    const id = 'ECON-FX-TWO-SIDES-001';
    const dRate = 1430 - 1300;                 // 원/달러 상승분
    [[100, 20], [20, 100], [60, 60], [100, 0]].forEach(([rev, cost], r) => {
      const net = rev - cost;
      expect(id, r, 1, rev, 1e-9, '달러 매출');
      expect(id, r, 2, cost, 1e-9, '달러 비용');
      expect(id, r, 3, net, 1e-9, '순노출');
      // 만원 단위: 순노출(만 달러) × 130원 = 만원
      expect(id, r, 4, net * dRate / 10, 5e-2, '손익 변화');
    });
  }

  // 포트폴리오: 반씩 섞은 기대수익과 표준편차
  {
    const id = 'ECON-PORTFOLIO-MIX-001';
    const s1 = 20, s2 = 10, w = 0.5;
    const simple = w * s1 + w * s2;            // 15
    [1.0, 0.5, 0.0, -0.5].forEach((rho, r) => {
      const varSum = w * w * s1 * s1 + w * w * s2 * s2 + 2 * w * w * rho * s1 * s2;
      const sd = Math.sqrt(varSum);
      expect(id, r, 0, rho, 1e-9, 'ρ');
      expect(id, r, 1, 6, 1e-9, '기대수익');
      expect(id, r, 2, sd, 5e-5, '표준편차');
      expect(id, r, 3, sd - simple, 5e-5, '단순 평균 대비');
    });
  }

  // 실질 구매력: (1.03)^n / (1.05)^n
  {
    const id = 'ECON-COMPOUND-INFLATION-001';
    [[0, 10], [1, 20], [2, 30], [3, 0]].forEach(([r, n]) => {
      const nominal = 100 * Math.pow(1.03, n);
      const price = Math.pow(1.05, n);
      expect(id, r, 1, nominal, 5e-3, '명목');
      expect(id, r, 2, price, 5e-5, '물가 배수');
      expect(id, r, 3, nominal / price, 5e-3, '실질');
    });
  }

  // 손익분기: 가격 1만, 변동비 6천, 고정비 400만
  {
    const id = 'ECON-BREAK-EVEN-DECISION-001';
    const price = 1, vc = 0.6, fc = 400;       // 만원 단위 (개당 1만원)
    [800, 1000, 1500, 2000].forEach((q, r) => {
      const rev = price * q;
      const cost = vc * q + fc;
      expect(id, r, 0, q, 1e-9, '판매량');
      expect(id, r, 1, rev, 5e-4, '매출');
      expect(id, r, 2, cost, 5e-4, '총비용');
      expect(id, r, 3, rev - cost, 5e-4, '이익');
      // 첫 달 현금: 매출은 못 받고 비용만 나감
      expect(id, r, 4, -cost, 5e-4, '첫 달 현금');
    });
    bump(1);
    if (Math.abs(fc / (price - vc) - 1000) > 1e-9) fail(id, '손익분기 수량이 1000 이 아니다');
  }

  // 50% 의 함정
  {
    const id = 'BANK-MOMENT-14';
    [0.1, 0.2, 0.3, 0.5].forEach((d, r) => {
      const after = 100000 * (1 - d);
      const back = after * (1 + d);
      expect(id, r, 0, d * 100, 1e-9, '할인율');
      expect(id, r, 1, after, 5e-4, '할인 후');
      expect(id, r, 2, back, 5e-4, '인상 후');
      expect(id, r, 3, d / (1 - d) * 100, 5e-4, '되돌리는 인상률');
    });
  }

  // 복리: 30년 배수와 두 배 기간
  {
    const id = 'BANK-SPLUS-49';
    [0.03, 0.05, 0.07, 0.10].forEach((rr, r) => {
      const g30 = Math.pow(1 + rr, 30);
      const dbl = Math.log(2) / Math.log(1 + rr);
      expect(id, r, 0, rr * 100, 1e-9, '수익률');
      expect(id, r, 1, g30, 5e-4, '30년 배수');
      expect(id, r, 2, dbl, 5e-4, '두 배 기간');
      expect(id, r, 3, 72 / (rr * 100), 5e-4, '72의 법칙');
    });
  }

  // 현재가치: 1억 / (1+r)^n, 만원 단위
  {
    const id = 'BANK-SPLUS-50';
    [0.03, 0.05, 0.07, 0.00].forEach((rr, r) => {
      [10, 20, 30].forEach((n, c) => {
        expect(id, r, c + 1, 10000 / Math.pow(1 + rr, n), 5e-2, 'PV');
      });
    });
  }

  // 연속 비율
  {
    const id = 'BANK-SPLUS-51';
    const cases = [
      [[0.7, 0.8]],
      [[0.5, 0.5]],
      [[0.9, 0.9, 0.9]],
      [[0.8, 1.2]]
    ];
    cases.forEach(([factors], r) => {
      const m = factors.reduce((a, b) => a * b, 1);
      expect(id, r, 1, m, 5e-5, '최종 배수');
      expect(id, r, 2, (1 - m) * 100, 5e-3, '전체 할인율');
    });
  }

  // 대출 총이자 (BANK-MOMENT-16 과 같은 설정)
  {
    const id = 'BANK-SPLUS-52';
    const P = 30000, i = 0.05 / 12, n = 120;
    const principal = P / n;
    let eqTotal = 0;
    for (let k = 0; k < n; k += 1) eqTotal += (P - principal * k) * i;
    const A = P * i * Math.pow(1 + i, n) / (Math.pow(1 + i, n) - 1);
    const annTotal = A * n - P;
    const balloonTotal = P * i * n;
    [eqTotal, annTotal, balloonTotal].forEach((t, r) => {
      expect(id, r, 1, t, 5e-1, '총이자');
      expect(id, r, 2, t / P * 100, 5e-2, '원금 대비');
    });
  }

  // 단위당 이익이 음수인 가게
  {
    const id = 'BANK-SPLUS-53';
    const price = 0.8, vc = 0.9, fc = 300;     // 만원 단위 (개당 8천원, 9천원)
    [500, 1000, 2000, 3000].forEach((q, r) => {
      expect(id, r, 0, q, 1e-9, '판매량');
      expect(id, r, 1, price * q, 5e-4, '매출');
      expect(id, r, 2, vc * q, 5e-4, '변동비');
      expect(id, r, 3, price * q - vc * q - fc, 5e-4, '이익');
    });
    bump(1);
    if (price - vc >= 0) fail(id, '단위당 이익이 음수가 아니다');
  }

  // 탄력성
  {
    const id = 'BANK-SPLUS-54';
    const dp = 0.10;
    [0.5, 1.0, 1.5, 2.0].forEach((E, r) => {
      const dq = -E * dp;
      const mult = (1 + dp) * (1 + dq);
      expect(id, r, 0, E, 1e-9, 'E');
      expect(id, r, 1, dq * 100, 5e-4, '판매량 변화');
      expect(id, r, 2, mult, 5e-5, '매출 배수');
      expect(id, r, 3, (mult - 1) * 100, 5e-3, '매출 변화');
    });
  }

  /* ── 공통수학 ── */

  // GPS: 기지국까지의 거리
  {
    const id = 'BANK-MOMENT-23';
    const p = [4, 3];
    [[0, 0], [8, 0], [4, 6]].forEach((q, r) => {
      expect(id, r, 2, Math.hypot(p[0] - q[0], p[1] - q[1]), 5e-4, '거리');
    });
  }

  // 복소수의 회전
  {
    const id = 'BANK-SPLUS-41';
    const pts = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 0]];
    pts.forEach((pt, r) => {
      expect(id, r, 0, r, 1e-9, '곱한 횟수');
      expect(id, r, 3, r * 90, 1e-9, '회전각');
    });
    bump(1);
    // i 를 네 번 곱하면 제자리
    let z = [1, 0];
    for (let k = 0; k < 4; k += 1) z = [-z[1], z[0]];
    if (z[0] !== 1 || z[1] !== 0) fail(id, 'i 를 네 번 곱해도 제자리가 아니다');
  }

  // 포물선 운동: v0 = 20, g = 9.8
  {
    const id = 'BANK-SPLUS-42';
    const v0 = 20, g = 9.8;
    [15, 30, 45, 60, 75].forEach((deg, r) => {
      const th = deg * D2R;
      const range = v0 * v0 * Math.sin(2 * th) / g;
      const height = v0 * v0 * Math.sin(th) * Math.sin(th) / (2 * g);
      const time = 2 * v0 * Math.sin(th) / g;
      expect(id, r, 0, deg, 1e-9, '각도');
      expect(id, r, 1, range, 5e-4, '도달 거리');
      expect(id, r, 2, height, 5e-4, '최고 높이');
      expect(id, r, 3, time, 5e-4, '체공 시간');
    });
    bump(1);
    const r30 = v0 * v0 * Math.sin(60 * D2R) / g;
    const r60 = v0 * v0 * Math.sin(120 * D2R) / g;
    if (Math.abs(r30 - r60) > 1e-9) fail(id, '30° 와 60° 의 도달 거리가 다르다');
  }

  // 행렬 변환
  {
    const id = 'BANK-SPLUS-46';
    function apply(m, v) {
      return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
    }
    const rot90 = [0, -1, 1, 0];
    const rot180 = [-1, 0, 0, -1];
    const scale2 = [2, 0, 0, 2];
    const rot90then2 = [0, -2, 2, 0];
    const mats = [rot90, rot180, scale2, rot90then2];
    const want = [
      [[0, 1], [-1, 1]],
      [[-1, 0], [-1, -1]],
      [[2, 0], [2, 2]],
      [[0, 2], [-2, 2]]
    ];
    mats.forEach((m, r) => {
      bump(2);
      const a = apply(m, [1, 0]);
      const b = apply(m, [1, 1]);
      if (a[0] !== want[r][0][0] || a[1] !== want[r][0][1]) {
        fail(id, r + '행 (1,0) 의 상이 표와 다르다');
      }
      if (b[0] !== want[r][1][0] || b[1] !== want[r][1][1]) {
        fail(id, r + '행 (1,1) 의 상이 표와 다르다');
      }
    });
  }

  // 경우의 수
  {
    const id = 'BANK-SPLUS-47';
    const want = [100, 10000, Math.pow(26, 4), 10 * 10 * 26 * 26];
    want.forEach((v, r) => expect(id, r, 2, v, 1e-6, '경우의 수'));
  }

  /* ── 수학과 문화 ── */

  // 원근: 화면 크기 = 1.7 × 1 / d
  {
    const id = 'BANK-MOMENT-31';
    [2, 4, 8, 16].forEach((d, r) => {
      expect(id, r, 0, d, 1e-9, '거리');
      expect(id, r, 1, 1.7 / d, 5e-5, '화면 크기');
      expect(id, r, 3, 1.7 * d / 2, 5e-4, '같은 크기로 보이려면');
    });
  }

  // 원근: 타일 경계선
  {
    const id = 'BANK-SPLUS-63';
    const h = 1.7;
    const ys = [2, 4, 6, 8].map((d) => h / d);
    ys.forEach((y, r) => {
      expect(id, r, 1, y, 5e-5, '화면 높이');
      if (r > 0) expect(id, r, 2, ys[r - 1] - y, 5e-5, '간격');
      expect(id, r, 3, y, 5e-5, '소실점까지');
    });
  }

  // 음정: 평균율과 순정율
  {
    const id = 'BANK-SPLUS-64';
    [[12, 2], [7, 1.5], [5, 4 / 3], [4, 1.25]].forEach(([semi, just], r) => {
      expect(id, r, 1, semi, 1e-9, '반음 수');
      expect(id, r, 2, Math.pow(2, semi / 12), 5e-5, '평균율');
      expect(id, r, 3, just, 5e-5, '순정율');
    });
  }
};
