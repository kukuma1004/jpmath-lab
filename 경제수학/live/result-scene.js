(function () {
  'use strict';

  // ── 라운드 결과 도시 ──────────────────────────────────────────────────
  // 땅 네 칸이 네 자산이다. 칸마다 건물이 하나씩 올라간다.
  //   바닥 넓이 = 내가 배분한 비율   (내 선택 · 사람마다 다르다)
  //   높이      = 그 자산의 수익률   (시장 결과 · 모두에게 같다)
  //   따라서 부피 = 배분 x 수익률 = 그 자산이 내 수익에 보탠 몫
  // 같은 시장에서 각자 다른 도시가 지어지는 것을 그대로 보여 주기 위한 그림이다.

  const NS = 'http://www.w3.org/2000/svg';
  const COS30 = Math.cos(Math.PI / 6);
  const SIN30 = 0.5;

  // 항목 수에 맞춰 땅을 배치한다. 가로로 넓은 편이 아이소메트릭에서 덜 가린다.
  function layout(n) {
    const cols = n <= 4 ? 2 : n <= 6 ? 3 : 4, rows = Math.ceil(n / cols);
    return { cols: cols, rows: rows, S: 200 / (cols + rows) };
  }

  function el(tag, attrs, text) {
    const node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(k => node.setAttribute(k, attrs[k]));
    if (text != null) node.textContent = text;
    return node;
  }

  // 아이소메트릭 투영. y가 높이다.
  function iso(x, y, z, S, ox, oy) {
    return { x: ox + (x - z) * COS30 * S, y: oy + (x + z) * SIN30 * S - y * S };
  }

  function shade(hex, amount) {
    const n = parseInt(hex.slice(1), 16);
    const to = amount < 0 ? 0 : 255, f = Math.abs(amount);
    const mix = c => Math.round(c + (to - c) * f);
    return '#' + [mix(n >> 16 & 255), mix(n >> 8 & 255), mix(n & 255)]
      .map(v => v.toString(16).padStart(2, '0')).join('');
  }

  function poly(points, fill, extra) {
    return el('polygon', Object.assign({
      points: points.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' '),
      fill: fill
    }, extra || {}));
  }

  // 한 칸의 땅
  function groundTile(g, gx, gz, S, ox, oy, color, live) {
    const c = [[gx, gz], [gx + 1, gz], [gx + 1, gz + 1], [gx, gz + 1]]
      .map(p => iso(p[0], 0, p[1], S, ox, oy));
    g.appendChild(poly(c, live ? shade(color, 0.86) : '#e7ebe8',
      { stroke: live ? shade(color, 0.6) : '#d3dad6', 'stroke-width': 1 }));
  }

  // 상자 하나. h>0 이면 위로, h<0 이면 땅 아래로 파인다.
  function box(g, gx, gz, half, h, S, ox, oy, color) {
    const cx = gx + 0.5, cz = gz + 0.5;
    const x0 = cx - half, x1 = cx + half, z0 = cz - half, z1 = cz + half;
    const down = h < 0, top = down ? 0 : h, bot = down ? h : 0;
    const P = (x, y, z) => iso(x, y, z, S, ox, oy);
    // 뒤쪽 두 면은 가려지므로 그리지 않는다
    const faces = [
      { pts: [P(x0, top, z1), P(x1, top, z1), P(x1, top, z0), P(x0, top, z0)], tint: down ? -0.5 : 0.18 }, // 윗면(파인 경우 바닥면)
      { pts: [P(x0, bot, z1), P(x0, top, z1), P(x1, top, z1), P(x1, bot, z1)], tint: down ? -0.66 : -0.1 }, // 앞면
      { pts: [P(x1, bot, z1), P(x1, top, z1), P(x1, top, z0), P(x1, bot, z0)], tint: down ? -0.76 : -0.28 } // 옆면
    ];
    faces.forEach(f => g.appendChild(poly(f.pts, shade(color, f.tint),
      { stroke: shade(color, down ? -0.65 : -0.4), 'stroke-width': 0.9, 'stroke-linejoin': 'round' })));
    // 땅에 파인 경우 지면 테두리를 점선으로 남겨 어디가 지표면인지 보이게 한다
    if (down) {
      g.appendChild(poly([P(x0, 0, z1), P(x1, 0, z1), P(x1, 0, z0), P(x0, 0, z0)],
        'none', { stroke: shade(color, -0.1), 'stroke-width': 1.4, 'stroke-dasharray': '4 3' }));
    }
  }

  // 한 사람의 도시 한 장
  function scene(svg, data, t) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const items = data.items, L = layout(items.length), S = L.S, MAXH = 0.9;
    const W = Math.round((L.cols + L.rows) * COS30 * S) + 20;
    const H = Math.round((L.cols + L.rows) * SIN30 * S + 2 * MAXH * S) + 24;
    const ox = W / 2 + (L.rows - L.cols) * COS30 * S / 2;
    const oy = MAXH * S + 12;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    const g = el('g', {});
    svg.appendChild(g);

    const cell = i => [i % L.cols, Math.floor(i / L.cols)];
    // 땅: 배분이 0인 칸은 회색으로 남겨 "여기엔 안 지었다"를 보여 준다
    items.forEach(function (it, i) {
      const c = cell(i);
      groundTile(g, c[0], c[1], S, ox, oy, it.color, it.alloc > 0);
    });
    // 먼 칸부터 그려야 앞 건물이 뒤 건물을 가린다
    items.map(function (it, i) { return { it: it, c: cell(i) }; })
      .sort(function (a, b) { return (a.c[0] + a.c[1]) - (b.c[0] + b.c[1]); })
      .forEach(function (x) {
        if (!(x.it.alloc > 0)) return;
        const half = 0.08 + 0.40 * (x.it.alloc / 100);   // 바닥 넓이 = 배분 비율
        const h = x.it.ret * data.hScale * t;            // 높이 = 그 항목의 수익 (선형)
        if (Math.abs(h) < 0.012) return;
        box(g, x.c[0], x.c[1], half, h, S, ox, oy, x.it.color);
      });
  }

  function card(player, opts, hScale) {
    const wrap = document.createElement('article');
    wrap.className = 'result-city-card';
    const info = opts.readPlayer(player);
    wrap.innerHTML = '<header><b>' + info.name + '</b><em class="' +
      (info.value >= 0 ? 'up' : 'down') + '">' + info.label + '</em></header>';
    const svg = el('svg', { role: 'img', 'aria-label': info.name + '의 라운드 결과' });
    wrap.appendChild(svg);
    const legend = document.createElement('div');
    legend.className = 'result-city-legend';
    legend.innerHTML = info.items.map(function (it) {
      return '<span style="--c:' + it.color + '"><i></i>' + it.name + ' ' + it.alloc + '%</span>';
    }).join('');
    wrap.appendChild(legend);
    return { wrap: wrap, svg: svg, data: { items: info.items, hScale: hScale } };
  }

  function render(container, opts) {
    if (!container) return;
    container.innerHTML = '';
    const players = opts.players || [];
    if (!players.length || typeof opts.readPlayer !== 'function') return;
    // 높이 배율은 이 라운드 전체에서 하나만 쓴다. 사람마다 다르면 비교가 되지 않는다.
    let peak = 0;
    players.forEach(function (p) {
      opts.readPlayer(p).items.forEach(function (it) { peak = Math.max(peak, Math.abs(it.ret)); });
    });
    const hScale = 0.9 / Math.max(0.5, peak);
    const built = players.map(function (p) { return card(p, opts, hScale); });
    built.forEach(function (b) { container.appendChild(b.wrap); });

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { built.forEach(function (b) { scene(b.svg, b.data, 1); }); return; }

    // 애니메이션은 덤이다. rAF 가 멈춘 환경(배경 탭, 화면 밖 프레임)에서도
    // 결과가 반드시 보이도록 완성 상태를 그리는 안전장치를 함께 건다.
    let done = false;
    const finish = function () { if (!done) { done = true; built.forEach(function (b) { scene(b.svg, b.data, 1); }); } };
    const start = performance.now(), DUR = 700;
    const timer = setTimeout(finish, DUR + 260);
    (function step(now) {
      if (done) return;
      const raw = Math.min(1, (now - start) / DUR);
      const t = 1 - Math.pow(1 - raw, 3);            // 처음엔 빠르게, 끝은 부드럽게
      built.forEach(function (b) { scene(b.svg, b.data, t); });
      if (raw < 1) requestAnimationFrame(step);
      else { done = true; clearTimeout(timer); }
    })(start);
  }

  window.JPResultScene = { render: render };
}());
