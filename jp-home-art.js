(function () {
  'use strict';

  // ── 과목 카드 그림 ────────────────────────────────────────────────────
  // 예전엔 모눈종이 위의 꺾은선 그래프였다. 정확하지만 못생겼다.
  //
  // 사진으로 바꿔 볼까 했지만, 롤러코스터 사진만 덩그러니 놓으면 그건
  // 미적분이 아니라 놀이공원이다. 맥락이 없다. 그래서 수학은 그대로 두고
  // 그리는 방식을 바꿨다. 셋 다 그 과목의 대표 장면이다.
  //
  //   미적분  접선이 곡선을 미끄러지고 그 아래가 채워진다 (미분과 적분)
  //   기하    구가 돌면서 위도·경도가 앞뒤로 지나간다 (공간)
  //   경제수학 배분한 만큼 블록이 오르내린다 (선택과 결과)
  //
  // 어두운 카드 위에서 읽히도록 밝은 선과 은은한 빛으로만 그린다.

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fit(canvas) {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    return { ctx: ctx, w: rect.width, h: rect.height };
  }

  function glow(ctx, color, blur) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
  }
  function noGlow(ctx) { ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; }

  // ── 미적분 — 곡선 위를 미끄러지는 접선, 그 아래 채워지는 넓이 ──────────
  function calculus(canvas, t, accent) {
    const s = fit(canvas); if (!s) return;
    const { ctx, w, h } = s;
    const pad = 14, base = h - 12;
    const f = x => Math.sin(x * 2.1) * 0.62 + Math.sin(x * 0.9 + 1.1) * 0.3;
    const X = u => pad + u * (w - pad * 2);
    const Y = v => base - (v + 1) * (base - 16) * 0.46;

    // 넓이 — 적분
    ctx.beginPath();
    ctx.moveTo(X(0), base);
    for (let i = 0; i <= 90; i++) { const u = i / 90; ctx.lineTo(X(u), Y(f(u * 3.4))); }
    ctx.lineTo(X(1), base); ctx.closePath();
    const fill = ctx.createLinearGradient(0, 16, 0, base);
    fill.addColorStop(0, accent + '3a'); fill.addColorStop(1, accent + '05');
    ctx.fillStyle = fill; ctx.fill();

    // 곡선
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) { const u = i / 120; const p = [X(u), Y(f(u * 3.4))]; i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
    const line = ctx.createLinearGradient(pad, 0, w - pad, 0);
    line.addColorStop(0, accent + '66'); line.addColorStop(.5, accent); line.addColorStop(1, accent + '66');
    ctx.strokeStyle = line; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
    glow(ctx, accent, 10); ctx.stroke(); noGlow(ctx);

    // 접선 — 미분
    const u = reduce ? .42 : (Math.sin(t * .00042) * .5 + .5) * .84 + .08;
    const x = u * 3.4;
    const y = f(x);
    const d = (f(x + 0.012) - f(x - 0.012)) / 0.024;
    const px = X(u), py = Y(y);
    const dxPix = (w - pad * 2) / 3.4;
    const dyPix = -(base - 16) * 0.46;
    const slope = d * dyPix / dxPix;
    const span = Math.min(46, w * .22);
    ctx.beginPath();
    ctx.moveTo(px - span, py - slope * span);
    ctx.lineTo(px + span, py + slope * span);
    ctx.strokeStyle = 'rgba(255,255,255,.72)'; ctx.lineWidth = 1.4; ctx.stroke();

    ctx.beginPath(); ctx.arc(px, py, 4.2, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; glow(ctx, accent, 12); ctx.fill(); noGlow(ctx);
  }

  // ── 기하 — 도는 구. 앞쪽은 진하게, 뒤쪽은 흐리게 ──────────────────────
  function geometry(canvas, t, accent) {
    const s = fit(canvas); if (!s) return;
    const { ctx, w, h } = s;
    const cx = w / 2, cy = h / 2 + 1, R = Math.min(h * .46, w * .30);
    const yaw = reduce ? .6 : t * .00034;
    const pitch = .5;

    const proj = (a, b) => {
      // 구면좌표 -> 회전 -> 화면
      const x = Math.cos(b) * Math.cos(a + yaw);
      const y = Math.sin(b);
      const z = Math.cos(b) * Math.sin(a + yaw);
      const ry = y * Math.cos(pitch) - z * Math.sin(pitch);
      const rz = y * Math.sin(pitch) + z * Math.cos(pitch);
      return { x: cx + x * R, y: cy - ry * R, z: rz };
    };
    const ring = (fixed, kind) => {
      const pts = [];
      for (let i = 0; i <= 72; i++) {
        const t2 = i / 72 * Math.PI * 2;
        pts.push(kind === 'lat' ? proj(t2, fixed) : proj(fixed, t2 - Math.PI));
      }
      return pts;
    };
    const draw = pts => {
      let prev = null;
      pts.forEach(p => {
        if (prev) {
          const front = (p.z + prev.z) / 2 > 0;
          ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = front ? accent : accent + '33';
          ctx.lineWidth = front ? 1.5 : 1;
          ctx.stroke();
        }
        prev = p;
      });
    };
    // 은은한 안쪽 빛
    const g = ctx.createRadialGradient(cx - R * .3, cy - R * .35, R * .1, cx, cy, R);
    g.addColorStop(0, accent + '2e'); g.addColorStop(1, accent + '00');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();

    [-1.0, -.5, 0, .5, 1.0].forEach(b => draw(ring(b, 'lat')));
    [0, Math.PI / 3, Math.PI * 2 / 3].forEach(a => draw(ring(a, 'lon')));

    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = accent; ctx.lineWidth = 1.6;
    glow(ctx, accent, 10); ctx.stroke(); noGlow(ctx);
  }

  // ── 경제수학 — 배분한 만큼 오르내리는 아이소메트릭 블록 ────────────────
  function economy(canvas, t, accent) {
    const s = fit(canvas); if (!s) return;
    const { ctx, w, h } = s;
    const S = Math.min(h * .34, w * .13);
    const ox = w / 2, oy = h * .74;
    const iso = (x, y, z) => ({ x: ox + (x - z) * S * .87, y: oy + (x + z) * S * .5 - y * S });
    const cells = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const heights = cells.map((c, i) => {
      const base = [.95, .55, .34, .72][i];
      return reduce ? base : base * (.72 + .28 * Math.sin(t * .0011 + i * 1.5));
    });

    // 바닥
    const g0 = [[0, 0], [2, 0], [2, 2], [0, 2]].map(p => iso(p[0], 0, p[1]));
    ctx.beginPath(); g0.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath();
    ctx.fillStyle = accent + '16'; ctx.fill();
    ctx.strokeStyle = accent + '3c'; ctx.lineWidth = 1; ctx.stroke();

    cells.map((c, i) => ({ c: c, hgt: heights[i] }))
      .sort((a, b) => (a.c[0] + a.c[1]) - (b.c[0] + b.c[1]))
      .forEach(item => {
        const [gx, gz] = item.c, hh = item.hgt, m = .09;
        const x0 = gx + m, x1 = gx + 1 - m, z0 = gz + m, z1 = gz + 1 - m;
        const faces = [
          [[x0, hh, z1], [x1, hh, z1], [x1, hh, z0], [x0, hh, z0]],
          [[x0, 0, z1], [x0, hh, z1], [x1, hh, z1], [x1, 0, z1]],
          [[x1, 0, z1], [x1, hh, z1], [x1, hh, z0], [x1, 0, z0]]
        ];
        const tone = ['cc', '8e', '60'];
        faces.forEach((f, k) => {
          ctx.beginPath();
          f.map(p => iso(p[0], p[1], p[2])).forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
          ctx.closePath();
          ctx.fillStyle = accent + tone[k]; ctx.fill();
          ctx.strokeStyle = accent; ctx.lineWidth = .8; ctx.stroke();
        });
      });
  }

  const jobs = [
    { el: document.getElementById('artCalculus'), fn: calculus, accent: '#e8845f' },
    { el: document.getElementById('artGeometry'), fn: geometry, accent: '#93a6ff' },
    { el: document.getElementById('artEconomy'), fn: economy, accent: '#5fc9a6' }
  ].filter(j => j.el);
  if (!jobs.length) return;

  function paint(t) { jobs.forEach(j => { try { j.fn(j.el, t, j.accent); } catch (e) { /* 한 장이 실패해도 나머지는 그린다 */ } }); }

  // 먼저 한 번 그려 둔다. 탭이 화면에 보이지 않으면 rAF 가 멈추는데,
  // 그때도 카드가 비어 보이면 안 된다.
  paint(0);
  if (!reduce) {
    let frame = 0;
    const loop = now => { paint(now); frame = requestAnimationFrame(loop); };
    frame = requestAnimationFrame(loop);
    window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
  }
  let rz = 0;
  window.addEventListener('resize', () => {
    window.cancelAnimationFrame(rz);
    rz = window.requestAnimationFrame(() => paint(performance.now()));
  }, { passive: true });
}());
