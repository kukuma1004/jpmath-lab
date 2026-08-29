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

  // ── 미적분 — 곡선·접선·넓이에 좌표축과 도함수까지 함께 ─────────────
  function calculus(canvas, t, accent) {
    const s = fit(canvas); if (!s) return;
    const { ctx, w, h } = s;
    const padL = 18, padR = 12, base = h - 16, top = 14;
    const f = x => Math.sin(x * 2.1) * 0.62 + Math.sin(x * 0.9 + 1.1) * 0.3;
    const df = x => (f(x + 0.008) - f(x - 0.008)) / 0.016;
    const X = u => padL + u * (w - padL - padR);
    const Y = v => base - (v + 1.15) * (base - top) * 0.42;

    // 눈금 — 얇게, 그러나 있어야 그래프로 읽힌다
    ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) { const x = X(i / 5); ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, base); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(padL, Y(0)); ctx.lineTo(w - padR, Y(0));
    ctx.strokeStyle = 'rgba(255,255,255,.20)'; ctx.stroke();

    const curve = (fn, from, to) => { ctx.beginPath();
      for (let i = 0; i <= 130; i++) { const u = i / 130; const p = [X(u), Y(fn(u * 3.4))]; i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } };

    // 넓이 — 적분
    ctx.beginPath(); ctx.moveTo(X(0), Y(0));
    for (let i = 0; i <= 100; i++) { const u = i / 100; ctx.lineTo(X(u), Y(f(u * 3.4))); }
    ctx.lineTo(X(1), Y(0)); ctx.closePath();
    const fill = ctx.createLinearGradient(0, top, 0, base);
    fill.addColorStop(0, accent + '44'); fill.addColorStop(1, accent + '08');
    ctx.fillStyle = fill; ctx.fill();

    // 도함수 — 뒤에 흐리게 깔아 두면 화면이 비어 보이지 않는다
    curve(x => df(x) * 0.42, 0, 1);
    ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);

    // 원함수
    curve(f, 0, 1);
    const line = ctx.createLinearGradient(padL, 0, w - padR, 0);
    line.addColorStop(0, accent + '77'); line.addColorStop(.5, '#ffd9c9'); line.addColorStop(1, accent + '77');
    ctx.strokeStyle = line; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
    glow(ctx, accent, 14); ctx.stroke(); noGlow(ctx);

    // 접선 — 미분
    const u = reduce ? .42 : (Math.sin(t * .00042) * .5 + .5) * .8 + .1;
    const x = u * 3.4, y = f(x), d = df(x);
    const px = X(u), py = Y(y);
    const slope = d * (-(base - top) * 0.42) / ((w - padL - padR) / 3.4);
    const span = Math.min(54, w * .24);
    ctx.beginPath(); ctx.moveTo(px - span, py - slope * span); ctx.lineTo(px + span, py + slope * span);
    ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, Y(0));
    ctx.strokeStyle = accent + '77'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; glow(ctx, accent, 16); ctx.fill(); noGlow(ctx);
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
    // 속이 찬 구 — 선만 있으면 얇아 보인다
    const body = ctx.createRadialGradient(cx - R * .34, cy - R * .38, R * .08, cx, cy, R * 1.02);
    body.addColorStop(0, accent + 'aa'); body.addColorStop(.55, accent + '46'); body.addColorStop(1, accent + '12');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = body; ctx.fill();

    [-1.0, -.5, 0, .5, 1.0].forEach(b => draw(ring(b, 'lat')));
    [0, Math.PI / 3, Math.PI * 2 / 3].forEach(a => draw(ring(a, 'lon')));

    // 지면으로 자른 자리 — 돔 실험실과 같은 이야기
    ctx.save();
    ctx.beginPath(); ctx.ellipse(cx, cy + R * .42, R * .92, R * .3, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.globalAlpha = .55; ctx.stroke();
    ctx.restore();

    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = '#dfe6ff'; ctx.lineWidth = 1.8;
    glow(ctx, accent, 14); ctx.stroke(); noGlow(ctx);
  }

  // ── 경제수학 — 정면에서 본 스카이라인 ──────────────────────────────
  // 아이소메트릭은 넓고 낮은 카드에서 세로로 넘쳐 잘린다. 정면으로 세우면
  // 폭을 가득 채우고, 창문 불빛까지 넣으면 도시로 읽힌다.
  // 건물 높이는 결과 화면과 같은 뜻이다 — 배분한 만큼 자란다.
  function economy(canvas, t, accent) {
    const s = fit(canvas); if (!s) return;
    const { ctx, w, h } = s;
    const ground = h - 10, top = 12;
    const seeds = [.42, .78, .30, .95, .58, .86, .36, .68, .50, .88, .34, .62];
    const n = seeds.length, gap = 3;
    const bw = (w - 16 - gap * (n - 1)) / n;

    ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(8, ground + .5); ctx.lineTo(w - 8, ground + .5); ctx.stroke();

    seeds.forEach((base, i) => {
      const wave = reduce ? 1 : (.86 + .14 * Math.sin(t * .0013 + i * .8));
      const bh = (ground - top) * base * wave;
      const x = 8 + i * (bw + gap), y = ground - bh;

      const g = ctx.createLinearGradient(0, y, 0, ground);
      g.addColorStop(0, accent + 'd9'); g.addColorStop(1, accent + '3a');
      ctx.fillStyle = g; ctx.fillRect(x, y, bw, bh);
      ctx.fillStyle = 'rgba(255,255,255,.30)'; ctx.fillRect(x, y, bw, 1.6);   // 옥상 빛

      // 창문
      ctx.fillStyle = 'rgba(255,255,255,.42)';
      const cols = Math.max(1, Math.floor(bw / 5));
      for (let r = 0; r * 7 + 6 < bh; r++) {
        for (let c = 0; c < cols; c++) {
          if (((i * 13 + r * 7 + c * 3) % 5) > 2) continue;
          ctx.fillRect(x + 2 + c * (bw - 3) / cols, y + 4 + r * 7, 1.8, 2.6);
        }
      }
    });

    // 바닥 반사
    const ref = ctx.createLinearGradient(0, ground, 0, h);
    ref.addColorStop(0, accent + '30'); ref.addColorStop(1, accent + '00');
    ctx.fillStyle = ref; ctx.fillRect(8, ground, w - 16, h - ground);
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
