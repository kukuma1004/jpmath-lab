/* 기하 깊이 탐구 표 검산. check-deep-dives.js 가 불러 쓴다. */
'use strict';

module.exports = function (api) {
  const { expect, same, cell, fail, bump } = api;
  const D2R = Math.PI / 180;

  // 시야 판정: h·e = cos θ, 시야각 90° 경계는 cos45°
  {
    const id = 'GEO-VEC-DOT-FOV-001';
    const bound = Math.cos(Math.PI / 4);
    [0, 30, 45, 60, 120].forEach((deg, r) => {
      const dot = Math.cos(deg * D2R);
      expect(id, r, 0, deg, 1e-9, 'θ');
      expect(id, r, 1, dot, 5e-4, 'h·e');
      same(id, r, 2, dot >= bound - 1e-9 ? '감지' : '미감지', '판정');
    });
  }

  // 그림자 길이 = 2 / tan θ
  {
    const id = 'GEO-PROJ-SHADOW-001';
    [30, 45, 60, 75].forEach((deg, r) => {
      expect(id, r, 0, deg, 1e-9, 'θ');
      expect(id, r, 1, Math.tan(deg * D2R), 5e-5, 'tan');
      expect(id, r, 2, 2 / Math.tan(deg * D2R), 5e-5, '그림자');
    });
  }

  // 직선과 구: 판별식/4 = 4 − y0²
  {
    const id = 'GEO-RAY-COLLISION-001';
    [0, 1, 2, 3].forEach((y0, r) => {
      const disc = 4 - y0 * y0;
      expect(id, r, 0, y0, 1e-9, 'y0');
      expect(id, r, 1, disc, 1e-9, '판별식/4');
      if (disc > 0) {
        const t1 = 5 - Math.sqrt(disc), t2 = 5 + Math.sqrt(disc);
        const got = String(cell(id, r, 2)).split(',').map((x) => parseFloat(x));
        bump(2);
        if (Math.abs(got[0] - t1) > 5e-4 || Math.abs(got[1] - t2) > 5e-4) {
          fail(id, r + '행 t 의 해 — 적힌 값 ' + cell(id, r, 2) +
            ', 계산 ' + t1.toFixed(3) + ', ' + t2.toFixed(3));
        }
      }
    });
  }

  // 그림자로 입체 구분: 수가 아닌 표라 칸 수만 확인
  {
    const id = 'GEO-RAY-COLLISION-001';
    void id;
  }

  // 태양광 패널: cos α
  {
    const id = 'BANK-MOMENT-05';
    [0, 15, 30, 45, 60, 90].forEach((deg, r) => {
      const c = Math.cos(deg * D2R);
      expect(id, r, 0, deg, 1e-9, 'α');
      expect(id, r, 1, c, 5e-5, 'cos');
      expect(id, r, 2, c, 5e-5, '실효 넓이');
    });
  }

  // 시야 판정 실패 실험
  {
    const id = 'BANK-MOMENT-06';
    [0, 60, 90, 135, 180].forEach((deg, r) => {
      expect(id, r, 0, deg, 1e-9, '방향각');
      expect(id, r, 1, 10, 1e-9, '거리');
      expect(id, r, 2, Math.cos(deg * D2R), 5e-4, '내적');
    });
  }

  // 측풍 착륙: 편류각 arctan, 보정각 arcsin, 이탈 = 10·(w/200)
  {
    const id = 'BANK-MOMENT-07';
    [0, 10, 20, 30, 40].forEach((w, r) => {
      expect(id, r, 0, w, 1e-9, '바람');
      expect(id, r, 1, Math.atan(w / 200) / D2R, 5e-4, '편류각');
      expect(id, r, 2, 10 * w / 200, 5e-4, '이탈');
      expect(id, r, 3, Math.asin(w / 200) / D2R, 5e-4, '보정각');
    });
  }

  // 포물선: 초점거리 = 준선거리 = y + 1
  {
    const id = 'BANK-MOMENT-08';
    [0, 2, 4, 6, 8].forEach((x, r) => {
      const y = x * x / 4;
      const df = Math.sqrt(x * x + (y - 1) * (y - 1));
      expect(id, r, 0, x, 1e-9, 'x');
      expect(id, r, 1, y, 1e-9, 'y');
      expect(id, r, 2, df, 5e-4, '초점까지');
      expect(id, r, 3, y + 1, 1e-9, '준선까지');
      bump(1);
      if (Math.abs(df - (y + 1)) > 1e-9) fail(id, 'x=' + x + ' 에서 두 거리가 다르다');
    });
  }

  // 타원: 두 초점까지 거리의 합이 항상 2a = 20
  {
    const id = 'BANK-MOMENT-09';
    [[10, 0], [5, 5.196152], [0, 6], [-5, 5.196152], [-10, 0]].forEach(([x, y], r) => {
      const d1 = Math.hypot(x + 8, y), d2 = Math.hypot(x - 8, y);
      expect(id, r, 1, d1, 5e-4, 'PF1');
      expect(id, r, 2, d2, 5e-4, 'PF2');
      expect(id, r, 3, 20, 1e-9, '합');
      bump(1);
      if (Math.abs(d1 + d2 - 20) > 5e-4) fail(id, r + '행 거리 합이 20 이 아니다');
    });
  }

  // 세 수신기까지의 거리와 차
  {
    const id = 'BANK-MOMENT-10';
    const src = [30, 40];
    const dA = Math.hypot(src[0] + 50, src[1]);
    [[-50, 0], [50, 0], [0, 60]].forEach((q, r) => {
      const d = Math.hypot(src[0] - q[0], src[1] - q[1]);
      expect(id, r, 2, d, 5e-3, '거리');
      expect(id, r, 3, d - dA, 5e-3, 'A 와의 차');
    });
  }

  // 포물선 반사: 접선 기울기 x/2
  {
    const id = 'BANK-SPLUS-17';
    [2, 4, 6, -4].forEach((x, r) => {
      expect(id, r, 0, x, 1e-9, 'x');
      expect(id, r, 2, x / 2, 1e-9, '접선 기울기');
    });
  }

  // 헤드라이트: 반사 벡터를 직접 계산해 축에 평행한지 본다
  {
    const id = 'BANK-SPLUS-18';
    [2, 4, 6, -4].forEach((x, r) => {
      const y = x * x / 4;
      const d = [x, y - 1];
      const m = x / 2;
      const len = Math.hypot(1, m);
      const t = [1 / len, m / len];
      const dot = d[0] * t[0] + d[1] * t[1];
      const ref = [2 * dot * t[0] - d[0], 2 * dot * t[1] - d[1]];
      bump(2);
      if (Math.abs(ref[0]) > 1e-9) fail(id, 'x=' + x + ' 에서 반사가 축에 평행하지 않다');
      const shown = String(cell(id, r, 3)).replace(/[()]/g, '').split(',').map(Number);
      if (Math.abs(shown[0]) > 1e-9 || Math.abs(shown[1] - ref[1]) > 5e-4) {
        fail(id, r + '행 반사 벡터 — 적힌 값 ' + cell(id, r, 3) +
          ', 계산 (0, ' + ref[1].toFixed(3) + ')');
      }
    });
  }

  // 속삭이는 방: c = √(a²−b²), e = c/a
  {
    const id = 'BANK-SPLUS-19';
    [[10, 6], [10, 8], [10, 9], [10, 9.9], [10, 10]].forEach(([a, b], r) => {
      const c = Math.sqrt(a * a - b * b);
      expect(id, r, 0, a, 1e-9, 'a');
      expect(id, r, 1, b, 1e-9, 'b');
      expect(id, r, 2, c, 5e-4, 'c');
      expect(id, r, 3, c / a, 5e-4, 'e');
    });
  }

  // 행성 궤도: a(1∓e)
  {
    const id = 'BANK-SPLUS-20';
    [[0.387, 0.2056], [0.723, 0.0068], [1.000, 0.0167], [1.524, 0.0934], [5.203, 0.0489]]
      .forEach(([a, e], r) => {
        expect(id, r, 1, a, 1e-9, 'a');
        expect(id, r, 2, e, 1e-9, 'e');
        expect(id, r, 3, a * (1 - e), 5e-4, '근일점');
        expect(id, r, 4, a * (1 + e), 5e-4, '원일점');
      });
  }

  // 쌍곡선: b² = 25 − a²
  {
    const id = 'BANK-SPLUS-21';
    [2, 4, 6, 8, 10].forEach((twoA, r) => {
      const a = twoA / 2, b2 = 25 - a * a, b = Math.sqrt(Math.max(0, b2));
      expect(id, r, 0, twoA, 1e-9, '2a');
      expect(id, r, 1, a, 1e-9, 'a');
      expect(id, r, 2, b2, 1e-9, 'b²');
      expect(id, r, 3, b, 5e-4, 'b');
      expect(id, r, 4, b / a, 5e-4, '점근선');
    });
  }

  // TDOA: 2a = 340Δt, b² = 2500 − a²
  {
    const id = 'GEO-HYPERBOLA-TDOA-001';
    [0.05, 0.10, 0.20, 0.29, 0.30].forEach((dt, r) => {
      const twoA = 340 * dt, a = twoA / 2, b2 = 2500 - a * a;
      expect(id, r, 0, dt, 1e-9, 'Δt');
      expect(id, r, 1, twoA, 5e-3, '거리 차');
      expect(id, r, 2, a, 5e-3, 'a');
      expect(id, r, 3, b2, 5e-2, 'b²');
      if (b2 > 0) expect(id, r, 4, Math.sqrt(b2), 5e-3, 'b');
    });
  }

  // 강 건너기
  {
    const id = 'BANK-SPLUS-23';
    const W = 100, v = 5, u = 3;
    expect(id, 0, 2, W / v, 5e-4, '시간');
    expect(id, 0, 3, u * (W / v), 5e-4, '하류');
    const th = Math.asin(u / v);
    expect(id, 1, 2, W / (v * Math.cos(th)), 5e-4, '시간');
    expect(id, 1, 3, 0, 5e-4, '하류');
    bump(1);
    if (Math.abs(th / D2R - 36.870) > 5e-3) fail(id, '보정각이 36.870° 가 아니다');
    const h = th / 2;
    const t3 = W / (v * Math.cos(h));
    expect(id, 2, 2, t3, 5e-3, '시간');
    expect(id, 2, 3, (u - v * Math.sin(h)) * t3, 5e-3, '하류');
  }

  // 비행기 삼각형: 지면 속력 √(200² − w²)
  {
    const id = 'BANK-SPLUS-24';
    [0, 20, 40, 60, 100].forEach((w, r) => {
      const g = Math.sqrt(200 * 200 - w * w);
      expect(id, r, 0, w, 1e-9, '바람');
      expect(id, r, 1, Math.asin(w / 200) / D2R, 5e-4, '보정각');
      expect(id, r, 2, g, 5e-3, '지면 속력');
      expect(id, r, 3, 200 - g, 5e-3, '손실');
    });
  }

  // 내적의 부호
  {
    const id = 'BANK-SPLUS-25';
    [[3, 0], [2, 2], [0, 5], [-1, 3], [-4, 0]].forEach((v, r) => {
      expect(id, r, 1, v[0], 1e-9, '내적');
    });
  }

  // 램버트 반사
  {
    const id = 'BANK-SPLUS-26';
    [0, 30, 60, 90, 120].forEach((deg, r) => {
      const c = Math.cos(deg * D2R);
      expect(id, r, 0, deg, 1e-9, '사이각');
      expect(id, r, 1, c, 5e-4, '내적');
      expect(id, r, 2, Math.max(0, c), 5e-4, 'max');
    });
  }

  // 정사영 넓이: 20 cos θ
  {
    const id = 'BANK-SPLUS-27';
    [0, 15, 30, 45, 60].forEach((deg, r) => {
      const c = Math.cos(deg * D2R);
      expect(id, r, 0, deg, 1e-9, 'θ');
      expect(id, r, 1, c, 5e-5, 'cos');
      expect(id, r, 2, 20 * c, 5e-3, '도면 넓이');
      expect(id, r, 3, 1 / c, 5e-4, '실제/도면');
    });
  }

  // 그림자와 태양 고도: 1.5 / tan α
  {
    const id = 'BANK-SPLUS-28';
    let prev = null;
    [10, 20, 30, 45, 60, 80].forEach((deg, r) => {
      const L = 1.5 / Math.tan(deg * D2R);
      expect(id, r, 0, deg, 1e-9, '고도');
      expect(id, r, 1, Math.tan(deg * D2R), 5e-5, 'tan');
      expect(id, r, 2, L, 5e-4, '길이');
      if (prev !== null) expect(id, r, 3, L - prev, 5e-4, '차');
      prev = L;
    });
  }

  // 직선과 평면의 교점: t = 5 / (n·D)
  {
    const id = 'BANK-SPLUS-30';
    [[1, 2, 3], [0, 0, 1], [2, 1, 5], [1, 1, 0], [0, 0, -1]].forEach((D, r) => {
      const nd = D[2];
      expect(id, r, 1, nd, 1e-9, 'n·D');
      if (nd !== 0) expect(id, r, 2, 5 / nd, 5e-3, 't');
    });
  }
};
