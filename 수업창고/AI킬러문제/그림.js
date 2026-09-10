/* AI 킬러문제 · 교사용 그림 (수업창고 전용)

   다섯 문항 중 넷은 "그래프를 움직여야 보이는" 문항이다. 정지된 그림으로는
   그 움직임을 보여 줄 수 없어서, 손으로 밀 수 있는 판을 하나씩 붙였다.

     k01  t 를 밀면 현이 회전하고, 평행한 접선이 구간을 드나든다
     k02  y=t 를 위아래로 밀면 교점이 몇 개인지 센다 — 변곡접선을 지나도 안 바뀐다
     k03  p 를 밀면 접어 올린 넓이가 커진다. 8 이 되는 자리가 하나뿐이다
     k04  창을 밀고, 곡선을 통째로 올렸다 내렸다 한다. 두 넓이의 차는 안 변한다
     k05  β 를 밀면 f(0) 이 훑고 지나간다. 36 이 되는 자리가 하나뿐이다

   좌표는 가로세로 배율이 다르다. 기울기의 값은 달라지지만 평행은 평행 그대로
   보존되므로(아핀변환), k01 에서 "현과 접선이 나란하다"는 그대로 읽힌다. */
window.JPKillerFigures = (function () {
  'use strict';

  const INK = '#1f2937', GRID = '#eef0f4', AXIS = '#9aa3af';
  const CURVE = '#4c1d95', HOT = '#dc2626', COOL = '#0e7490', FILL = 'rgba(109,40,217,.16)';

  /* ── 판 하나 ─────────────────────────────────────────────────── */
  function board(host, o) {
    const cv = document.createElement('canvas');
    cv.className = 'fig-canvas';
    host.appendChild(cv);
    const ctx = cv.getContext('2d');
    let W = 0, H = 0;

    const px = (x) => (x - o.xmin) / (o.xmax - o.xmin) * W;
    const py = (y) => H - (y - o.ymin) / (o.ymax - o.ymin) * H;

    function size() {
      const dpr = window.devicePixelRatio || 1;
      W = cv.clientWidth || 640; H = o.height || 260;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const b = {
      get W() { return W }, get H() { return H }, px, py, ctx,
      clear() {
        size();
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
      },
      grid(stepX, stepY) {
        ctx.strokeStyle = GRID; ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = Math.ceil(o.xmin / stepX) * stepX; x <= o.xmax; x += stepX) { ctx.moveTo(px(x), 0); ctx.lineTo(px(x), H) }
        for (let y = Math.ceil(o.ymin / stepY) * stepY; y <= o.ymax; y += stepY) { ctx.moveTo(0, py(y)); ctx.lineTo(W, py(y)) }
        ctx.stroke();
      },
      axes() {
        ctx.strokeStyle = AXIS; ctx.lineWidth = 1.4;
        ctx.beginPath();
        if (o.ymin < 0 && o.ymax > 0) { ctx.moveTo(0, py(0)); ctx.lineTo(W, py(0)) }
        if (o.xmin < 0 && o.xmax > 0) { ctx.moveTo(px(0), 0); ctx.lineTo(px(0), H) }
        ctx.stroke();
      },
      curve(f, color, width) {
        ctx.strokeStyle = color || CURVE; ctx.lineWidth = width || 2.4;
        ctx.beginPath();
        let on = false;
        for (let i = 0; i <= 700; i++) {
          const x = o.xmin + (o.xmax - o.xmin) * i / 700, y = f(x);
          if (!isFinite(y) || y < o.ymin - 1e4 || y > o.ymax + 1e4) { on = false; continue }
          if (on) ctx.lineTo(px(x), py(y)); else { ctx.moveTo(px(x), py(y)); on = true }
        }
        ctx.stroke();
      },
      shade(f, a, c, color) {                       // 곡선과 x축 사이
        ctx.fillStyle = color || FILL;
        ctx.beginPath(); ctx.moveTo(px(a), py(0));
        for (let i = 0; i <= 200; i++) { const x = a + (c - a) * i / 200; ctx.lineTo(px(x), py(f(x))) }
        ctx.lineTo(px(c), py(0)); ctx.closePath(); ctx.fill();
      },
      line(x1, y1, x2, y2, color, dash, width) {
        ctx.save(); ctx.setLineDash(dash || []);
        ctx.strokeStyle = color; ctx.lineWidth = width || 1.8;
        ctx.beginPath(); ctx.moveTo(px(x1), py(y1)); ctx.lineTo(px(x2), py(y2)); ctx.stroke();
        ctx.restore();
      },
      hline(y, color, dash) { b.line(o.xmin, y, o.xmax, y, color, dash) },
      vline(x, color, dash) { b.line(x, o.ymin, x, o.ymax, color, dash) },
      /* 기울기 m 인 직선을 (x0,y0) 을 지나게 화면 끝까지 긋는다 */
      through(x0, y0, m, color, dash, width) {
        b.line(o.xmin, y0 + m * (o.xmin - x0), o.xmax, y0 + m * (o.xmax - x0), color, dash, width);
      },
      dot(x, y, color, r) {
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(px(x), py(y), r || 4.5, 0, 7); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.stroke();
      },
      text(x, y, s, color, align) {
        ctx.fillStyle = color || INK;
        ctx.font = '600 12px "IBM Plex Sans KR",system-ui,sans-serif';
        ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(s, px(x), py(y));
      }
    };
    return b;
  }

  /* ── 미는 손잡이 ─────────────────────────────────────────────── */
  function slider(host, o, onInput) {
    const row = document.createElement('label');
    row.className = 'fig-slider';
    row.innerHTML = '<span class="fig-slider-name"></span>'
      + '<input type="range"><output class="fig-slider-val"></output>';
    row.querySelector('.fig-slider-name').textContent = o.name;
    const input = row.querySelector('input'), out = row.querySelector('output');
    input.min = o.min; input.max = o.max; input.step = o.step; input.value = o.value;
    host.appendChild(row);
    const read = () => Number(input.value);
    const show = () => { out.textContent = o.format ? o.format(read()) : read().toFixed(2) };
    input.addEventListener('input', () => { show(); onInput(read()) });
    return { get value() { return read() }, show };
  }

  function readout(host) {
    const p = document.createElement('p');
    p.className = 'fig-readout';
    host.appendChild(p);
    return p;
  }

  /* ── K01 · 현이 회전하고 접점이 구간을 드나든다 ─────────────── */
  function k01(host) {
    const f = (x) => x * (x - 3) * (x - 3), df = (x) => 3 * x * x - 12 * x + 9;
    const b = board(host, { xmin: -0.7, xmax: 7.2, ymin: -9, ymax: 62, height: 280 });
    const out = readout(host);

    function draw(t) {
      const m = f(t) / t, u = Math.sqrt((m + 3) / 3);
      const cs = [2 - u, 2 + u].filter((c) => c > 0 && c < t);
      b.clear(); b.grid(1, 10); b.axes();
      b.curve(f);
      b.line(0, f(0), t, f(t), COOL, [], 2.2);          // 현
      cs.forEach((c) => { b.through(c, f(c), df(c), HOT, [6, 4], 1.8); b.dot(c, f(c), HOT) });
      b.dot(0, 0, COOL, 4); b.dot(t, f(t), COOL, 4);
      b.vline(t, '#cbd5e1', [3, 4]);
      b.text(t, -5.5, 't', COOL);
      out.innerHTML = 'N(' + t.toFixed(2) + ') = <b>' + cs.length + '</b>'
        + ' &nbsp;·&nbsp; 현의 기울기 (t−3)² = ' + m.toFixed(2)
        + (cs.length ? ' &nbsp;·&nbsp; 접점 c = ' + cs.map((c) => c.toFixed(2)).join(', ') : '');
    }
    const s = slider(host, { name: 't', min: 0.2, max: 8, step: 0.01, value: 4 }, draw);
    return () => { s.show(); draw(s.value) };
  }

  /* ── K02 · y=t 를 밀어도 변곡접선에서는 개수가 안 바뀐다 ────── */
  function k02(host) {
    const f = (x) => x * x * x * x - 4 * x * x * x;
    const b = board(host, { xmin: -1.7, xmax: 4.8, ymin: -42, ymax: 46, height: 300 });
    const out = readout(host);

    function roots(t) {                               // f(x)=t 의 서로 다른 실근
      const rs = []; let prev = f(-1.7) - t;
      for (let x = -1.7; x < 4.8; x += 0.002) {
        const cur = f(x + 0.002) - t;
        if (prev === 0 || prev * cur < 0) rs.push(x + 0.001);
        prev = cur;
      }
      return rs;
    }
    function draw(t) {
      const rs = roots(t);
      b.clear(); b.grid(1, 10); b.axes();
      b.curve(f);
      b.hline(t, HOT, [6, 4]);
      rs.forEach((r) => b.dot(r, t, HOT));
      b.dot(0, 0, '#f59e0b', 5);                      // 변곡접선의 접점
      b.line(-0.9, 0, 0.9, 0, '#f59e0b', [], 2.4);    // 그 자리의 수평 접선
      b.dot(3, -27, COOL, 5);
      b.text(0.05, 7, 'x=0 · 접선은 수평인데 극값이 아니다', '#b45309', 'left');
      b.text(3.05, -34, '극소 −27', COOL, 'left');
      out.innerHTML = 'g(' + t.toFixed(1) + ') = <b>' + rs.length + '</b>'
        + (Math.abs(t) < 0.6 ? ' &nbsp;·&nbsp; <b style="color:#b45309">t가 0을 지나도 개수가 그대로다</b>'
          : Math.abs(t + 27) < 0.6 ? ' &nbsp;·&nbsp; <b style="color:#0e7490">여기서만 개수가 바뀐다</b>' : '');
    }
    const s = slider(host, { name: 't', min: -40, max: 40, step: 0.5, value: 10, format: (v) => v.toFixed(1) }, draw);
    return () => { s.show(); draw(s.value) };
  }

  /* ── K03 · 접어 올린 넓이가 8 이 되는 자리 ──────────────────── */
  function k03(host) {
    const b = board(host, { xmin: -0.6, xmax: 3.6, ymin: -10, ymax: 26, height: 280 });
    const out = readout(host);

    function draw(p) {
      const f = (x) => Math.pow(x - p, 3), g = (x) => Math.abs(f(x)) - f(x);
      const area = p <= 0 ? 0 : p < 3 ? Math.pow(p, 4) / 2 : (Math.pow(p, 4) - Math.pow(p - 3, 4)) / 2;
      b.clear(); b.grid(1, 5); b.axes();
      if (p > 0) b.shade(g, 0, Math.min(p, 3));
      b.curve(f, '#c4b5fd', 2);
      b.curve(g, CURVE, 2.8);
      b.vline(0, '#cbd5e1', [3, 4]); b.vline(3, '#cbd5e1', [3, 4]);
      b.dot(p, 0, HOT, 5);
      b.text(p, -6, 'x=p', HOT);
      out.innerHTML = '∫₀³ g dx = <b>' + area.toFixed(2) + '</b>'
        + (Math.abs(area - 8) < 0.05 ? ' &nbsp;·&nbsp; <b style="color:#0e7490">여기가 8. p=2</b>' : '')
        + ' &nbsp;·&nbsp; 옅은 선이 f, 진한 선이 g=|f|−f';
    }
    const s = slider(host, { name: 'p', min: -0.4, max: 3.4, step: 0.01, value: 1.2 }, draw);
    return () => { s.show(); draw(s.value) };
  }

  /* ── K04 · 창을 밀고, 곡선을 통째로 올렸다 내렸다 ───────────── */
  function k04(host) {
    const b = board(host, { xmin: -1.8, xmax: 3.8, ymin: -17, ymax: 12, height: 290 });
    const out = readout(host);
    let t = 0, c = 0;

    const F = (x) => x * x * x * x / 4 - x * x * x - x * x / 2 + c * x;
    const g = (u) => F(u + 2) - F(u);

    function draw() {
      const f = (x) => x * x * x - 3 * x * x - x + c;
      b.clear(); b.grid(1, 5); b.axes();
      b.shade(f, t, t + 2);
      b.curve(f);
      b.vline(t, COOL, [3, 4]); b.vline(t + 2, COOL, [3, 4]);
      b.dot(t, f(t), COOL, 4); b.dot(t + 2, f(t + 2), COOL, 4);
      b.text(t + 1, -15, '폭 2', COOL);
      out.innerHTML = 'g(' + t.toFixed(2) + ') = <b>' + g(t).toFixed(2) + '</b>'
        + ' &nbsp;·&nbsp; g(−1) = ' + g(-1).toFixed(2)
        + ' &nbsp;·&nbsp; g(1) = ' + g(1).toFixed(2)
        + ' &nbsp;·&nbsp; <b style="color:#0e7490">g(−1)−g(1) = ' + (g(-1) - g(1)).toFixed(2) + '</b>'
        + ' &nbsp; ← c를 아무리 움직여도 8';
    }
    const st = slider(host, { name: '창의 왼끝 t', min: -1.8, max: 1.8, step: 0.01, value: -1 }, (v) => { t = v; draw() });
    const sc = slider(host, { name: '상수항 c', min: -5, max: 5, step: 0.1, value: 0, format: (v) => v.toFixed(1) }, (v) => { c = v; draw() });
    return () => { t = st.value; c = sc.value; st.show(); sc.show(); draw() };
  }

  /* ── K05 · α+β=2 를 지킨 채 β 를 밀면 f(0) 이 36 을 한 번 지난다 ── */
  function k05(host) {
    const b = board(host, { xmin: -2.8, xmax: 4.8, ymin: -8, ymax: 60, height: 280 });
    const out = readout(host);

    function draw(beta) {
      const al = 2 - beta;
      const f = (x) => Math.pow(x - al, 2) * Math.pow(x - beta, 2);
      b.clear(); b.grid(1, 10); b.axes();
      b.curve(f);
      b.dot(al, 0, HOT, 5); b.dot(beta, 0, HOT, 5);
      b.dot(1, f(1), COOL, 5);
      b.line(-0.3, f(1), 2.3, f(1), COOL, [], 2.2);   // f'(1)=0 — 가운데 극대
      b.dot(0, f(0), '#f59e0b', 5);
      b.hline(36, '#f59e0b', [6, 4]);
      b.text(-2.4, 40, 'f(0)=36', '#b45309', 'left');
      b.text(1, f(1) + 6, "f′(1)=0", COOL);
      out.innerHTML = 'α = ' + al.toFixed(3) + ', β = ' + beta.toFixed(3)
        + ' &nbsp;·&nbsp; αβ = ' + (al * beta).toFixed(3)
        + ' &nbsp;·&nbsp; f(0) = <b>' + f(0).toFixed(2) + '</b>'
        + (Math.abs(f(0) - 36) < 0.4 ? ' &nbsp;·&nbsp; <b style="color:#0e7490">여기 — αβ=−6, β=1+√7</b>' : '')
        + ' &nbsp;·&nbsp; f(3) = ' + f(3).toFixed(2);
    }
    const s = slider(host, { name: 'β (α=2−β 로 묶여 있다)', min: 1.05, max: 5, step: 0.005, value: 2.6, format: (v) => v.toFixed(3) }, draw);
    return () => { s.show(); draw(s.value) };
  }

  /* ── SET 02 ─────────────────────────────────────────────────────
     이쪽은 넷 다 조각함수다. 조각을 붙이는 자리가 어떻게 벌어지고 꺾이는지는
     식으로는 잘 안 보인다 — 이어지는 순간과 꺾이지 않는 순간을 손으로
     찾아 보게 하는 것이 이 판들의 일이다. */

  /* S01 · 두 조각을 이어 붙이는 자리 */
  function s01(host) {
    const f = (x) => x * (x - 2) * (x - 4);
    const b = board(host, { xmin: -0.8, xmax: 6.6, ymin: -18, ymax: 40, height: 290 });
    const out = readout(host);
    let t = 3, a = 0;

    function draw() {
      const L = f(t), R = f(t - 2) + a, gap = L - R;
      b.clear(); b.grid(1, 5); b.axes();
      // 왼쪽 조각과 오른쪽 조각을 각자의 정의역에서만 그린다
      b.ctx.save(); b.ctx.beginPath(); b.ctx.rect(0, 0, b.px(t), b.H); b.ctx.clip();
      b.curve(f, CURVE, 2.6); b.ctx.restore();
      b.ctx.save(); b.ctx.beginPath(); b.ctx.rect(b.px(t), 0, b.W - b.px(t), b.H); b.ctx.clip();
      b.curve((x) => f(x - 2) + a, COOL, 2.6); b.ctx.restore();
      b.vline(t, '#cbd5e1', [3, 4]);
      b.dot(t, L, CURVE, 5); b.dot(t, R, COOL, 5);
      if (Math.abs(gap) > 0.3) b.line(t, L, t, R, HOT, [4, 3], 2.4);   // 벌어진 틈
      b.text(t, -15, 'x=t', '#6b7280');
      out.innerHTML = '좌극한 f(t) = <b>' + L.toFixed(2) + '</b>'
        + ' &nbsp;·&nbsp; 우극한 f(t−2)+a = <b>' + R.toFixed(2) + '</b>'
        + ' &nbsp;·&nbsp; 차이 D(t)−a = ' + gap.toFixed(2)
        + (Math.abs(gap) < 0.05 ? ' &nbsp;·&nbsp; <b style="color:#0e7490">여기서 이어진다</b>'
          : ' &nbsp;·&nbsp; <b style="color:#dc2626">끊긴다</b>');
    }
    const st = slider(host, { name: '이음매 t', min: -0.5, max: 6.3, step: 0.01, value: 3 }, (v) => { t = v; draw() });
    const sa = slider(host, { name: '올림 a', min: -12, max: 12, step: 0.1, value: 0, format: (v) => v.toFixed(1) }, (v) => { a = v; draw() });
    return () => { t = st.value; a = sa.value; st.show(); sa.show(); draw() };
  }

  /* S02 · 절댓값이 꺾이지 않는 자리 */
  function s02(host) {
    const f = (x) => x * x * (x - 3);
    const b = board(host, { xmin: -1.1, xmax: 4.3, ymin: -32, ymax: 58, height: 290 });
    const out = readout(host);

    function draw(a) {
      const g = (x) => f(x) * Math.abs(x - a);
      b.clear(); b.grid(1, 10); b.axes();
      b.curve(f, '#c4b5fd', 2);
      b.curve(g, CURVE, 2.8);
      b.dot(a, 0, HOT, 5);
      b.text(a, -26, 'x=a', HOT);
      const smooth = Math.abs(f(a)) < 1e-9;
      out.innerHTML = 'f(a) = <b>' + f(a).toFixed(3) + '</b>'
        + ' &nbsp;·&nbsp; 좌미분계수 ' + (-f(a)).toFixed(3) + ' / 우미분계수 ' + f(a).toFixed(3)
        + (smooth ? ' &nbsp;·&nbsp; <b style="color:#0e7490">부호가 같아져 꺾이지 않는다</b>'
          : ' &nbsp;·&nbsp; <b style="color:#dc2626">여기서 꺾인다</b>')
        + ' &nbsp;·&nbsp; 옅은 선이 f, 진한 선이 g';
    }
    const s = slider(host, { name: 'a', min: -1, max: 4.2, step: 0.01, value: 1.4 }, draw);
    return () => { s.show(); draw(s.value) };
  }

  /* S03 · 한 점에서 그은 접선의 개수 */
  function s03(host) {
    const f = (x) => x ** 3 - 6 * x * x + 12 * x + 2, df = (x) => 3 * x * x - 12 * x + 12;
    const b = board(host, { xmin: -1.6, xmax: 5.2, ymin: -34, ymax: 46, height: 300 });
    const out = readout(host);

    function touches(k) {                            // f(t) − t f′(t) = k 의 실근
      const y = (t) => -2 * t ** 3 + 6 * t * t + 2 - k;
      const rs = []; let prev = y(-6);
      for (let t = -6; t < 8; t += 0.0005) { const cur = y(t + 0.0005); if (prev === 0 || prev * cur < 0) rs.push(t); prev = cur }
      // 중근은 부호가 안 바뀐다 — 따로 줍는다
      for (let t = -6; t < 8; t += 0.0005) if (Math.abs(y(t)) < 5e-4 && !rs.some((r) => Math.abs(r - t) < 0.05)) rs.push(t);
      const u = []; for (const r of rs.sort((p, q) => p - q)) if (!u.some((v) => Math.abs(v - r) < 0.05)) u.push(r);
      return u;
    }
    function draw(k) {
      const ts = touches(k);
      b.clear(); b.grid(1, 10); b.axes();
      b.curve(f);
      ts.forEach((t) => { b.through(t, f(t), df(t), HOT, [6, 4], 1.8); b.dot(t, f(t), HOT) });
      b.dot(0, k, '#f59e0b', 6);
      b.text(0.15, k + 4, 'A(0, ' + k.toFixed(0) + ')', '#b45309', 'left');
      out.innerHTML = '접선의 개수 = <b>' + ts.length + '</b>'
        + (ts.length ? ' &nbsp;·&nbsp; 접점 t = ' + ts.map((t) => t.toFixed(2)).join(', ') : '')
        + (ts.length === 2 ? ' &nbsp;·&nbsp; <b style="color:#0e7490">여기가 두 개 — 중근이 생긴 자리</b>' : '');
    }
    const s = slider(host, { name: 'A 의 높이 k', min: -8, max: 26, step: 0.5, value: 6, format: (v) => v.toFixed(1) }, draw);
    return () => { s.show(); draw(s.value) };
  }

  /* S04 · 접어 뒤집어도 꺾이지 않는 자리 */
  function s04(host) {
    const f = (x) => x * (x - 4) * (x - 5) * (x + 1);
    const df = (x) => { const y = x * x - 4 * x; return (2 * x - 4) * (2 * y - 5) };
    const b = board(host, { xmin: -1.7, xmax: 5.7, ymin: -26, ymax: 46, height: 300 });
    const out = readout(host);

    /* f'(x)=0 의 세 근. 가운데는 2 지만 나머지 둘은 2±√6.5 라 무리수다.
       슬라이더로는 정확히 짚을 수 없으므로 x축에 눈금으로 찍어 두고,
       판정에도 눈으로 구별되지 않을 만큼의 여유를 준다. */
    const ROOTS = [2 - Math.sqrt(6.5), 2, 2 + Math.sqrt(6.5)];

    function draw(raw) {
      /* 눈금 가까이 가면 그 자리로 붙여 준다. 무리수를 슬라이더로 정확히
         맞출 수는 없는데, 붙여 주지 않으면 f′(t) 가 0 근처를 맴돌기만 해서
         "꺾이지 않는다" 를 끝내 못 본다. */
      const snapped = ROOTS.find((r) => Math.abs(raw - r) < 0.03);
      const t = snapped === undefined ? raw : snapped;
      const g = (x) => (x < t ? f(x) : 2 * f(t) - f(x));
      b.clear(); b.grid(1, 10); b.axes();
      b.curve(f, '#ddd6fe', 2);                      // 원래 곡선을 옅게 남겨 둔다
      ROOTS.forEach((r) => b.line(r, -3.5, r, 3.5, COOL, [], 2.2));
      b.hline(f(t), '#cbd5e1', [3, 4]);              // 뒤집는 기준선
      b.curve(g, CURVE, 2.8);
      b.vline(t, '#cbd5e1', [3, 4]);
      b.dot(t, f(t), HOT, 5);
      b.text(t, -22, 'x=t', '#6b7280');
      out.innerHTML = 't = ' + t.toFixed(3)
        + ' &nbsp;·&nbsp; f′(t) = <b>' + df(t).toFixed(3) + '</b>'
        + ' &nbsp;·&nbsp; 좌 ' + df(t).toFixed(2) + ' / 우 ' + (-df(t)).toFixed(2)
        + (snapped !== undefined ? ' &nbsp;·&nbsp; <b style="color:#0e7490">여기서는 꺾이지 않는다</b>'
          : ' &nbsp;·&nbsp; <b style="color:#dc2626">꺾인다</b>')
        + ' &nbsp;·&nbsp; 청록 눈금이 f′(x)=0 인 세 자리 — 2−√6.5, 2, 2+√6.5 (합 6)';
    }
    const s = slider(host, { name: '접는 자리 t', min: -1.5, max: 5.5, step: 0.005, value: 3 }, draw);
    return () => { s.show(); draw(s.value) };
  }

  const FIGURES = { k01, k02, k03, k04, k05, s01, s02, s03, s04 };
  const CAPTION = {
    k01: 't 를 밀어 보세요. 현이 회전하면서 평행한 접선이 구간 안팎을 드나듭니다 — 개수가 바뀌는 것은 접점이 끝을 지날 때뿐입니다.',
    k02: 'y=t 를 위아래로 밀어 보세요. t 가 0 을 지날 때 곡선은 평평해지지만 교점의 개수는 그대로입니다. 바뀌는 곳은 −27 하나뿐입니다.',
    k03: 'p 를 밀어 보세요. f 의 음수 부분을 접어 올린 것이 g 입니다. 색칠된 넓이가 8 이 되는 자리는 하나뿐입니다.',
    k04: '창을 밀면 넓이가 오르내립니다. 그런데 상수항 c 를 움직여 곡선을 통째로 올렸다 내려도 g(−1)−g(1) 은 꿈쩍하지 않습니다.',
    k05: 'α+β=2 를 지킨 채 β 를 밀어 보세요. 두 겹근이 벌어지면서 f(0) 이 훑고 지나가고, 36 이 되는 자리는 하나뿐입니다.',
    s01: '이음매 t 와 올림 a 를 각각 밀어 보세요. 붉은 세로선이 두 조각 사이에 벌어진 틈입니다. a 를 정해 놓고 t 를 밀면 틈이 닫히는 자리가 몇 군데인지 세어 볼 수 있습니다 — 그것이 N(a) 입니다.',
    s02: 'a 를 밀어 보세요. 대부분의 자리에서는 x=a 에서 뾰족하게 꺾입니다. 꺾이지 않는 자리는 f 가 x축에 닿는 곳뿐입니다.',
    s03: '점 A 를 위아래로 밀어 보세요. 대개 접선이 세 개인데, 딱 두 자리에서 두 개로 줄어듭니다. 그때 접점 두 개 중 하나가 중근입니다.',
    s04: 't 를 밀어 보세요. 오른쪽 조각이 회색 가로선을 기준으로 뒤집힙니다. 대부분은 이음매에서 뾰족하게 꺾이고, 꺾이지 않는 자리는 셋뿐입니다.'
  };

  return {
    mount(host, id) {
      const make = FIGURES[id];
      if (!make) return false;
      host.innerHTML = '';
      const cap = document.createElement('p');
      cap.className = 'fig-caption';
      cap.textContent = CAPTION[id] || '';
      host.appendChild(cap);
      const redraw = make(host);
      redraw();
      /* 폭이 바뀌면 캔버스 픽셀이 어긋난다. 인쇄 미리보기에서도 한 번 다시 그린다. */
      window.addEventListener('resize', redraw);
      return true;
    }
  };
})();
