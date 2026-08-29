(function () {
  'use strict';

  // ── 라운드 결과 도시 / 최종 스카이라인 ────────────────────────────────
  //
  // 한 라운드(render)
  //   땅 네 칸이 네 자산이다. 칸마다 건물이 하나씩 올라간다.
  //     바닥 넓이 = 내가 배분한 비율   (내 선택 · 사람마다 다르다)
  //     높이      = 그 자산의 수익률   (시장 결과 · 모두에게 같다)
  //     따라서 부피 = 배분 x 수익률 = 그 자산이 내 수익에 보탠 몫
  //
  // 여덟 라운드(renderSkyline)
  //   같은 칸 위에 라운드를 한 층씩 쌓는다.
  //     바닥 넓이 = 8라운드 평균 배분  (그 전략에 얼마나 걸었는가)
  //     한 층     = 그 라운드에 그 전략이 벌어준 점수 = 배분/100 x 성과
  //     탑 높이   = 그 전략이 8라운드 동안 벌어준 총점
  //   점수 계산이 배분과 성과의 곱의 합이므로(weightedScore), 네 탑을 더하면
  //   실제 점수 증감과 정확히 같아진다. 그림이 곧 계산이다.
  //   손해 본 라운드는 층이 아래로 내려가므로 탑이 도중에 꺼지는 게 보인다.

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

  // y0 에서 y1 까지의 한 층. 쌓기용이라 위아래를 직접 받는다.
  function slab(g, gx, gz, half, y0, y1, S, ox, oy, fill, edge) {
    const cx = gx + 0.5, cz = gz + 0.5;
    const x0 = cx - half, x1 = cx + half, z0 = cz - half, z1 = cz + half;
    const lo = Math.min(y0, y1), hi = Math.max(y0, y1);
    const P = (x, y, z) => iso(x, y, z, S, ox, oy);
    [
      { pts: [P(x0, hi, z1), P(x1, hi, z1), P(x1, hi, z0), P(x0, hi, z0)], tint: 0.18 },
      { pts: [P(x0, lo, z1), P(x0, hi, z1), P(x1, hi, z1), P(x1, lo, z1)], tint: -0.1 },
      { pts: [P(x1, lo, z1), P(x1, hi, z1), P(x1, hi, z0), P(x1, lo, z0)], tint: -0.28 }
    ].forEach(f => g.appendChild(poly(f.pts, shade(fill, f.tint),
      { stroke: edge, 'stroke-width': 0.8, 'stroke-linejoin': 'round' })));
  }

  // 한 사람의 도시 한 장 (한 라운드)
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

  // 한 사람의 스카이라인 한 장 (여덟 라운드 누적)
  // progress 는 "지금까지 몇 라운드가 쌓였는가". 3.4 면 3층까지 쌓고 4층은 40%.
  function skyline(svg, data, progress) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const items = data.items, L = layout(items.length), S = L.S;
    const up = Math.max(0.14, data.top), down = Math.min(0, data.bottom);
    const W = Math.round((L.cols + L.rows) * COS30 * S) + 20;
    const H = Math.round((L.cols + L.rows) * SIN30 * S + (up - down) * S) + 26;
    const ox = W / 2 + (L.rows - L.cols) * COS30 * S / 2;
    const oy = up * S + 13;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    const g = el('g', {});
    svg.appendChild(g);

    const cell = i => [i % L.cols, Math.floor(i / L.cols)];
    items.forEach(function (it, i) {
      const c = cell(i);
      groundTile(g, c[0], c[1], S, ox, oy, it.color, it.share > 0);
    });

    items.map(function (it, i) { return { it: it, c: cell(i) }; })
      .sort(function (a, b) { return (a.c[0] + a.c[1]) - (b.c[0] + b.c[1]); })
      .forEach(function (x) {
        const it = x.it;
        if (!(it.share > 0)) return;
        const half = 0.08 + 0.40 * (it.share / 100);     // 바닥 넓이 = 평균 배분
        const edge = shade(it.color, -0.45);
        let running = 0;
        for (let r = 0; r < it.layers.length; r += 1) {
          const part = Math.max(0, Math.min(1, progress - r));
          if (part <= 0) break;
          const seg = it.layers[r] * data.hScale * part;  // 한 층 = 그 라운드 기여분
          if (Math.abs(seg) >= 0.006) {
            // 이익 층은 라운드가 갈수록 진해지고, 손해 층은 어둡게 눌러 구분한다
            const fill = seg >= 0 ? shade(it.color, 0.34 - 0.042 * r) : shade(it.color, -0.4);
            slab(g, x.c[0], x.c[1], half, running, running + seg, S, ox, oy, fill, edge);
          }
          running += seg;
          if (part < 1) break;
        }
      });
  }

  function header(info) {
    return '<header><b>' + info.name + '</b><em class="' +
      (info.value >= 0 ? 'up' : 'down') + '">' + info.label + '</em></header>';
  }

  function card(player, opts, hScale) {
    const wrap = document.createElement('article');
    wrap.className = 'result-city-card';
    const info = opts.readPlayer(player);
    wrap.innerHTML = header(info);
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
    play(built, function (b, t) { scene(b.svg, b.data, t); }, 700);
  }

  // 값들을 각각 반올림하면 합이 헤더 숫자와 어긋날 수 있다. 최대 잔여법으로
  // 마지막 한 자리를 나눠 줘, 화면에서 더해도 실제로 맞게 한다.
  // step 은 표시 단위다. 점수는 0.1, 돈은 1원.
  function roundToTotal(values, total, step) {
    const unit = step || 0.1;
    const floors = values.map(v => Math.floor(v / unit));
    const order = values.map((v, i) => i)
      .sort((a, b) => (values[b] / unit - floors[b]) - (values[a] / unit - floors[a]));
    const out = floors.slice();
    let rest = Math.round(total / unit) - floors.reduce((a, b) => a + b, 0);
    for (let k = 0; rest > 0 && k < 64; k += 1) { out[order[k % order.length]] += 1; rest -= 1; }
    for (let k = 0; rest < 0 && k < 64; k += 1) { out[order[order.length - 1 - (k % order.length)]] -= 1; rest += 1; }
    return out.map(v => v * unit);
  }

  function defaultFormat(value) {
    return (value >= 0 ? '+' : '−') + Math.abs(value).toFixed(1);
  }

  function skylineCard(player, opts, shared) {
    const wrap = document.createElement('article');
    wrap.className = 'result-city-card is-skyline';
    const info = opts.readPlayer(player);
    wrap.innerHTML = header(info);
    const svg = el('svg', { role: 'img', 'aria-label': info.name + '의 8라운드 누적 결과' });
    wrap.appendChild(svg);
    const legend = document.createElement('div');
    legend.className = 'result-city-legend is-skyline';
    const format = typeof opts.formatValue === 'function' ? opts.formatValue : defaultFormat;
    const sums = info.items.map(function (it) { return it.layers.reduce(function (a, b) { return a + b; }, 0); });
    const shown = roundToTotal(sums, info.value, opts.step);
    legend.innerHTML = info.items.map(function (it, index) {
      return '<span style="--c:' + it.color + '"><i></i>' + it.name +
        ' <b>' + format(shown[index]) + '</b>' +
        '<small>평균 ' + Math.round(it.share) + '%</small></span>';
    }).join('');
    wrap.appendChild(legend);
    return {
      wrap: wrap, svg: svg,
      data: { items: info.items, hScale: shared.hScale, top: shared.top, bottom: shared.bottom }
    };
  }

  // 누적 높이의 최대·최소를 미리 훑는다. 모두 같은 자로 재야 비교가 된다.
  function extent(players, opts) {
    let peak = 0, top = 0, bottom = 0, rounds = 0;
    const walked = players.map(function (p) {
      const info = opts.readPlayer(p);
      info.items.forEach(function (it) {
        rounds = Math.max(rounds, it.layers.length);
        let run = 0;
        it.layers.forEach(function (v) {
          run += v;
          peak = Math.max(peak, Math.abs(run));
        });
      });
      return info;
    });
    const hScale = 0.95 / Math.max(0.6, peak);
    walked.forEach(function (info) {
      info.items.forEach(function (it) {
        let run = 0;
        it.layers.forEach(function (v) {
          run += v * hScale;
          top = Math.max(top, run);
          bottom = Math.min(bottom, run);
        });
      });
    });
    return { hScale: hScale, top: top, bottom: bottom, rounds: rounds || 1 };
  }

  function renderSkyline(container, opts) {
    if (!container) return;
    container.innerHTML = '';
    const players = opts.players || [];
    if (!players.length || typeof opts.readPlayer !== 'function') return;
    const shared = extent(players, opts);
    const built = players.map(function (p) { return skylineCard(p, opts, shared); });
    built.forEach(function (b) { container.appendChild(b.wrap); });
    // 라운드가 한 층씩 올라오는 게 이 화면의 재미다. 층 수에 맞춰 시간을 준다.
    play(built, function (b, t) { skyline(b.svg, b.data, t * shared.rounds); },
      Math.min(1600, 170 * shared.rounds));
  }

  // 애니메이션은 덤이다. rAF 가 멈춘 환경(배경 탭, 화면 밖 프레임)에서도
  // 결과가 반드시 보이도록 완성 상태를 그리는 안전장치를 함께 건다.
  function play(built, draw, duration) {
    const paint = function (t) { built.forEach(function (b) { draw(b, t); }); };
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { paint(1); return; }
    let done = false;
    const finish = function () { if (!done) { done = true; paint(1); } };
    const start = performance.now();
    const timer = setTimeout(finish, duration + 300);
    (function step(now) {
      if (done) return;
      const raw = Math.min(1, (now - start) / duration);
      paint(1 - Math.pow(1 - raw, 3));            // 처음엔 빠르게, 끝은 부드럽게
      if (raw < 1) requestAnimationFrame(step);
      else { done = true; clearTimeout(timer); }
    })(start);
  }

  window.JPResultScene = { render: render, renderSkyline: renderSkyline };
}());
