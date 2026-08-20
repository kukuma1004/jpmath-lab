/* ══════════════════════════════════════════════════════════════════════
   JP Math Lab — 수능 21번 교사용 인터랙티브 그래프 엔진
   f(x) = A·x(x-2)(x-r),   g(x) = f(x) (x≥t) / -f(x) (x<t)
   H(x) = g(x)/(x(x-2))  =  A(x-r)  (x≥t)  /  A(r-x)  (x<t)
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var C = {
    ink1: '#15171c', ink2: '#4c515c', ink3: '#8b909b',
    accent: '#1b3a6b', accent2: '#2f6f9f', tint: '#93b4dd',
    flag: '#9d2b2b', line: 'rgba(21,23,28,.13)', grid: 'rgba(21,23,28,.06)',
    paper: '#faf8f3'
  };

  function nf(v, d) {
    if (d === undefined) d = 2;
    var s = (+v).toFixed(d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    if (s === '-0') s = '0';
    return s;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ── 좌표 변환기 ───────────────────────────────────────────── */
  function Plot(o) {
    var W = o.w || 700, H = o.h || 420;
    var L = o.l === undefined ? 46 : o.l,
        R = o.r === undefined ? 26 : o.r,
        T = o.t === undefined ? 22 : o.t,
        B = o.b === undefined ? 40 : o.b;
    var xm = o.xmin, xM = o.xmax, ym = o.ymin, yM = o.ymax;
    if (o.svg) {
      o.svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      o.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      o.svg.style.aspectRatio = W + ' / ' + H;
    }
    return {
      W: W, H: H, xmin: xm, xmax: xM, ymin: ym, ymax: yM,
      X: function (x) { return L + (x - xm) / (xM - xm) * (W - L - R); },
      Y: function (y) { return T + (yM - y) / (yM - ym) * (H - T - B); },
      clampX: function (x) { return Math.max(xm, Math.min(xM, x)); }
    };
  }

  /* ── 축 + 눈금 ─────────────────────────────────────────────── */
  function axes(p, opt) {
    opt = opt || {};
    var s = '', i;
    var x0 = p.X(0), y0 = p.Y(0);
    // 세로 격자
    for (i = Math.ceil(p.xmin); i <= Math.floor(p.xmax); i++) {
      s += '<line x1="' + p.X(i) + '" y1="' + p.Y(p.ymin) + '" x2="' + p.X(i) +
           '" y2="' + p.Y(p.ymax) + '" stroke="' + C.grid + '" stroke-width="1"/>';
    }
    for (i = Math.ceil(p.ymin); i <= Math.floor(p.ymax); i++) {
      s += '<line x1="' + p.X(p.xmin) + '" y1="' + p.Y(i) + '" x2="' + p.X(p.xmax) +
           '" y2="' + p.Y(i) + '" stroke="' + C.grid + '" stroke-width="1"/>';
    }
    // 축
    s += '<line x1="' + p.X(p.xmin) + '" y1="' + y0 + '" x2="' + p.X(p.xmax) + '" y2="' + y0 +
         '" stroke="' + C.ink2 + '" stroke-width="1.6"/>';
    s += '<line x1="' + x0 + '" y1="' + p.Y(p.ymax) + '" x2="' + x0 + '" y2="' + p.Y(p.ymin) +
         '" stroke="' + C.ink2 + '" stroke-width="1.6"/>';
    // x 눈금 라벨
    var skip = opt.skip || [];
    for (i = Math.ceil(p.xmin); i <= Math.floor(p.xmax); i++) {
      if (i === 0 || skip.indexOf(i) >= 0) continue;
      s += '<line x1="' + p.X(i) + '" y1="' + (y0 - 4) + '" x2="' + p.X(i) + '" y2="' + (y0 + 4) +
           '" stroke="' + C.ink2 + '" stroke-width="1.4"/>';
      s += '<text x="' + p.X(i) + '" y="' + (y0 + 19) + '" text-anchor="middle" font-family="KaTeX_Main, serif" font-size="13" fill="' + C.ink3 + '">' + i + '</text>';
    }
    s += '<text x="' + (p.X(p.xmax) - 4) + '" y="' + (y0 - 9) + '" text-anchor="end" font-family="KaTeX_Math, serif" font-style="italic" font-size="15" fill="' + C.ink3 + '">x</text>';
    return s;
  }

  function lbl(x, y, txt, color, size, anchor, italic) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') +
      '" font-family="' + (italic === false ? '"IBM Plex Sans KR", sans-serif' : 'KaTeX_Math, "STIX Two Math", serif') +
      '" font-style="' + (italic === false ? 'normal' : 'italic') +
      '" font-weight="' + (italic === false ? '700' : '500') +
      '" font-size="' + (size || 16) + '" fill="' + (color || C.ink1) +
      '" paint-order="stroke" stroke="#fff" stroke-width="4.5" stroke-linejoin="round">' + esc(txt) + '</text>';
  }
  function dot(x, y, color, rad) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (rad || 5.5) + '" fill="' + color + '"/>';
  }
  function hollow(x, y, color, rad) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (rad || 5) + '" fill="#fff" stroke="' + color + '" stroke-width="2.4"/>';
  }
  function vdash(p, x, y1, y2, color) {
    return '<line x1="' + p.X(x) + '" y1="' + p.Y(y1) + '" x2="' + p.X(x) + '" y2="' + p.Y(y2) +
      '" stroke="' + (color || C.ink3) + '" stroke-width="1.4" stroke-dasharray="5 5"/>';
  }

  /* ══════════════════════════════════════════════════════════
     LAB 1 · fold — f를 t에서 접어 g 만들기
     ══════════════════════════════════════════════════════════ */
  function labFold(root) {
    var A = 0.3, r = 11 / 3;
    var state = { t: 3.2 };
    var svg = root.querySelector('.lab-svg');
    var side = root.querySelector('.lab-side');

    side.innerHTML =
      '<div class="sl"><div class="sl-top"><span>접는 위치 <span style="font-family:KaTeX_Math,serif;font-style:italic">t</span> 를 움직여 보세요</span>' +
      '<span class="sl-val" data-o="tv"></span></div>' +
      '<input type="range" min="-1" max="4.4" step="0.05" value="3.2" data-i="t">' +
      '<div class="sl-hint">파선 = 원래 <span style="font-family:KaTeX_Math,serif;font-style:italic">f</span> · 실선 = 접은 결과 <span style="font-family:KaTeX_Math,serif;font-style:italic">g</span></div></div>' +
      '<div class="fx sm boxed" data-o="eq"></div>' +
      '<div class="verdict" data-o="v"><div class="vmark" data-o="vm"></div><div class="vtext" data-o="vt"></div></div>';

    var inp = side.querySelector('[data-i="t"]');
    var out = {
      tv: side.querySelector('[data-o="tv"]'), eq: side.querySelector('[data-o="eq"]'),
      v: side.querySelector('[data-o="v"]'), vm: side.querySelector('[data-o="vm"]'),
      vt: side.querySelector('[data-o="vt"]')
    };

    function f(x) { return A * x * (x - 2) * (x - r); }

    function draw() {
      var t = state.t;
      var p = Plot({ svg: svg, w: 700, h: 430, xmin: -1.15, xmax: 4.6, ymin: -5.0, ymax: 4.6 });
      var s = axes(p, {});
      var i, x, pts;

      // 원래 f (연한 파선)
      pts = [];
      for (i = 0; i <= 400; i++) { x = p.xmin + (p.xmax - p.xmin) * i / 400; pts.push(p.X(x) + ',' + p.Y(f(x))); }
      s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + C.ink3 +
           '" stroke-width="2" stroke-dasharray="6 6" opacity=".75"/>';

      // g : 왼쪽 -f
      pts = [];
      for (i = 0; i <= 400; i++) {
        x = p.xmin + (t - p.xmin) * i / 400;
        pts.push(p.X(x) + ',' + p.Y(-f(x)));
      }
      s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + C.flag +
           '" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>';
      // g : 오른쪽 f
      pts = [];
      for (i = 0; i <= 400; i++) {
        x = t + (p.xmax - t) * i / 400;
        pts.push(p.X(x) + ',' + p.Y(f(x)));
      }
      s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + C.accent +
           '" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>';

      // 접는 선
      s += '<line x1="' + p.X(t) + '" y1="' + p.Y(p.ymax) + '" x2="' + p.X(t) + '" y2="' + p.Y(p.ymin) +
           '" stroke="' + C.accent + '" stroke-width="1.6" stroke-dasharray="6 5" opacity=".65"/>';
      s += lbl(p.X(t), p.Y(p.ymax) + 16, 't', C.accent, 17);

      // 두 높이
      var hL = -f(t), hR = f(t);
      var gap = Math.abs(hL - hR);
      if (gap > 0.06) {
        s += '<line x1="' + p.X(t) + '" y1="' + p.Y(hL) + '" x2="' + p.X(t) + '" y2="' + p.Y(hR) +
             '" stroke="' + C.flag + '" stroke-width="4" stroke-linecap="round"/>';
        s += hollow(p.X(t), p.Y(hL), C.flag, 5.5);
        s += dot(p.X(t), p.Y(hR), C.accent, 5.5);
        s += lbl(p.X(t) + 12, (p.Y(hL) + p.Y(hR)) / 2 + 5, '끊김', C.flag, 13, 'start', false);
      } else {
        s += dot(p.X(t), p.Y(hR), C.accent, 6.5);
        s += lbl(p.X(t) + 13, p.Y(hR) - 9, '이어짐', C.accent, 13, 'start', false);
      }

      // 근 표시
      [0, 2, r].forEach(function (v) {
        s += '<circle cx="' + p.X(v) + '" cy="' + p.Y(0) + '" r="3.6" fill="' + C.accent2 + '" opacity=".75"/>';
      });
      s += lbl(p.X(r), p.Y(0) + 21, 'r', C.accent2, 14);
      s += lbl(p.X(-0.72), p.Y(f(-0.72)) - 14, 'f', C.ink3, 16);

      svg.innerHTML = s;

      out.tv.textContent = 't = ' + nf(t, 2);
      var ft = f(t);
      renderTex(out.eq, '-f(t)=' + nf(-ft, 2) + '\\;,\\quad f(t)=' + nf(ft, 2));
      var ok = Math.abs(ft) < 0.045;
      out.v.className = 'verdict ' + (ok ? 'ok' : 'no');
      out.vm.textContent = ok ? '✓' : '✕';
      out.vt.innerHTML = ok
        ? '연속이다 &nbsp;<small>두 높이가 같다 &rarr; <span class="kx" data-k="f(t)=0"></span> &nbsp;즉 <span class="kx" data-k="t"></span>는 <span class="kx" data-k="f"></span>의 근이어야 한다.</small>'
        : '끊어진다 &nbsp;<small>왼쪽 높이 <span class="kx" data-k="-f(t)"></span>와 오른쪽 높이 <span class="kx" data-k="f(t)"></span>가 다르다.</small>';
      renderAll(out.vt);
    }

    inp.addEventListener('input', function () { state.t = +this.value; draw(); });
    draw();
  }

  /* ══════════════════════════════════════════════════════════
     LAB 2 · quot — 몫함수 H(x) = g(x)/(x(x-2))
     data-cases="r,0,2" / data-t="2" / data-r="3.67" / data-nat="1"
     ══════════════════════════════════════════════════════════ */
  function labQuot(root) {
    var A = 0.6;
    var cases = (root.dataset.cases || 'r,0,2').split(',');
    var state = { mode: root.dataset.t || cases[0], r: +(root.dataset.r || 3.67) };
    var showNat = root.dataset.nat !== '0';
    var rmin = +(root.dataset.rmin || 0.4), rmax = +(root.dataset.rmax || 4.8);
    var svg = root.querySelector('.lab-svg');
    var side = root.querySelector('.lab-side');

    var CASE_LABEL = {
      'r': '<em>t</em> = <em>r</em><br><span style="font-weight:600;font-size:.85em;opacity:.8">제3의 근</span>',
      '0': '<em>t</em> = 0', '2': '<em>t</em> = 2'
    };
    var segHTML = '';
    if (cases.length > 1) {
      segHTML = '<div class="seg">' + cases.map(function (c) {
        return '<button type="button" data-c="' + c + '">' + CASE_LABEL[c] + '</button>';
      }).join('') + '</div>';
    }

    side.innerHTML = segHTML +
      '<div class="sl"><div class="sl-top"><span>남은 근 <span style="font-family:KaTeX_Math,serif;font-style:italic">r</span> 의 위치</span>' +
      '<span class="sl-val" data-o="rv"></span></div>' +
      '<input type="range" min="' + rmin + '" max="' + rmax + '" step="0.02" value="' + state.r + '" data-i="r"></div>' +
      '<div class="fx sm boxed" data-o="eq"></div>' +
      (showNat ? '<div class="chipbar" data-o="chips"></div>' : '') +
      '<div class="verdict" data-o="v"><div class="vmark" data-o="vm"></div><div class="vtext" data-o="vt"></div></div>';

    var out = {
      rv: side.querySelector('[data-o="rv"]'), eq: side.querySelector('[data-o="eq"]'),
      chips: side.querySelector('[data-o="chips"]'), v: side.querySelector('[data-o="v"]'),
      vm: side.querySelector('[data-o="vm"]'), vt: side.querySelector('[data-o="vt"]')
    };
    var rInp = side.querySelector('[data-i="r"]');

    function tval() { return state.mode === 'r' ? state.r : +state.mode; }
    function H(x) { var t = tval(); return x >= t ? A * (x - state.r) : A * (state.r - x); }
    function Hr(m) { var t = tval(); return m >= t ? A * (m - state.r) : A * (state.r - m); }

    function draw() {
      var t = tval(), r = state.r;
      var p = Plot({ svg: svg, w: 700, h: 430, xmin: -1.6, xmax: 6.1, ymin: -3.1, ymax: 4.3 });
      var negs = [];
      for (var q = 1; q <= 5; q++) if (Hr(q) < -1e-9) negs.push(q);
      var s = axes(p, { skip: showNat ? negs : [] });
      var i, x;

      // 음수 영역 음영
      s += '<rect x="' + p.X(p.xmin) + '" y="' + p.Y(0) + '" width="' + (p.X(p.xmax) - p.X(p.xmin)) +
           '" height="' + (p.Y(p.ymin) - p.Y(0)) + '" fill="' + C.flag + '" opacity=".055"/>';

      // 왼쪽 조각  A(r-x),  x < t
      if (t > p.xmin) {
        s += '<line x1="' + p.X(p.xmin) + '" y1="' + p.Y(A * (r - p.xmin)) + '" x2="' + p.X(t) + '" y2="' + p.Y(A * (r - t)) +
             '" stroke="' + C.flag + '" stroke-width="4.2" stroke-linecap="round"/>';
      }
      // 오른쪽 조각  A(x-r),  x >= t
      if (t < p.xmax) {
        s += '<line x1="' + p.X(t) + '" y1="' + p.Y(A * (t - r)) + '" x2="' + p.X(p.xmax) + '" y2="' + p.Y(A * (p.xmax - r)) +
             '" stroke="' + C.accent + '" stroke-width="4.2" stroke-linecap="round"/>';
      }

      // 접는 점 처리
      var isHole = (t === 0 || t === 2);
      if (state.mode === 'r') {
        s += dot(p.X(r), p.Y(0), C.accent, 6);
      } else {
        // 점프
        s += '<line x1="' + p.X(t) + '" y1="' + p.Y(A * (r - t)) + '" x2="' + p.X(t) + '" y2="' + p.Y(A * (t - r)) +
             '" stroke="' + C.ink3 + '" stroke-width="2" stroke-dasharray="4 4"/>';
        s += hollow(p.X(t), p.Y(A * (r - t)), C.flag, 5.4);
        s += hollow(p.X(t), p.Y(A * (t - r)), C.accent, 5.4);
        s += lbl(p.X(t) + 14, p.Y(A * (r - t)) + 16, '여기서 점프', C.ink2, 13, 'start', false);
      }
      // x=0, x=2 는 정의되지 않음(구멍)
      [0, 2].forEach(function (v) {
        if (v === t) return;
        var col = (v < t) ? C.flag : C.accent;
        s += hollow(p.X(v), p.Y(H(v)), col, 5);
      });

      // 자연수 우극한
      if (showNat) {
        for (var m = 1; m <= 5; m++) {
          var v = Hr(m);
          if (v > p.ymax || v < p.ymin) continue;
          var neg = v < -1e-9;
          s += vdash(p, m, 0, v, neg ? C.flag : C.ink3);
          if (neg) {
            s += '<circle cx="' + p.X(m) + '" cy="' + p.Y(v) + '" r="11.5" fill="' + C.flag + '"/>';
            s += '<text x="' + p.X(m) + '" y="' + (p.Y(v) + 5.5) + '" text-anchor="middle" font-family="KaTeX_Math, serif" font-style="italic" font-weight="700" font-size="15" fill="#fff">' + m + '</text>';
          } else {
            s += '<circle cx="' + p.X(m) + '" cy="' + p.Y(v) + '" r="6.4" fill="#fff" stroke="' + C.ink2 + '" stroke-width="2.2"/>';
          }
        }
      }
      // r 위치
      s += lbl(p.X(r), p.Y(0) - 12, 'r', C.accent2, 15);
      s += '<circle cx="' + p.X(r) + '" cy="' + p.Y(0) + '" r="3.4" fill="' + C.accent2 + '"/>';
      // 조각 이름
      s += lbl(p.X(p.xmin + .55), p.Y(A * (r - p.xmin - .55)) - 13, 'A(r-x)', C.flag, 15, 'start');
      s += lbl(p.X(p.xmax - .35), p.Y(A * (p.xmax - .35 - r)) - 13, 'A(x-r)', C.accent, 15, 'end');

      svg.innerHTML = s;

      /* 사이드 패널 */
      out.rv.textContent = 'r = ' + nf(r, 2);
      var tTex = state.mode === 'r' ? 'r' : state.mode;
      renderTex(out.eq,
        '\\dfrac{g(x)}{x(x-2)}=\\begin{cases} A(r-x) & (x<' + tTex + ')\\\\[2pt] A(x-r) & (x\\ge ' + tTex + ')\\end{cases}');

      var S = [];
      if (out.chips) {
        var html = '';
        for (var m2 = 1; m2 <= 5; m2++) {
          var vv = Hr(m2), neg = vv < -1e-9, zero = Math.abs(vv) < 1e-9;
          if (neg) S.push(m2);
          var sideTag = (m2 < tval()) ? '접힘 왼쪽' : '접힘 오른쪽';
          html += '<div class="chip' + (neg ? ' neg' : (zero ? ' zero' : '')) + '">' +
            (state.mode === '2' ? '<span class="side">' + sideTag + '</span>' : '') +
            '<b>' + m2 + '</b><span>' + (vv > 0 ? '+' : '') + nf(vv, 2) + '</span></div>';
        }
        out.chips.innerHTML = html;
      } else {
        for (var m3 = 1; m3 <= 5; m3++) if (Hr(m3) < -1e-9) S.push(m3);
      }

      var msg, ok;
      if (state.mode === 'r') {
        ok = false;
        msg = '<b>음수가 되는 자연수가 하나도 없다</b><small>두 조각이 <span class="kx" data-k="x=r"></span>에서 만나 <span class="kx" data-k="A\\lvert x-r\\rvert"></span> — 항상 0 이상. 조건 (나)의 집합이 비어 버린다.</small>';
      } else if (state.mode === '0') {
        ok = (S.length === 2);
        msg = '<b>집합 = ' + (S.length ? '{' + S.join(', ') + '}' : '∅') + ' · 원소 ' + S.length + '개</b><small>' +
          (ok ? '개수는 맞출 수 있다. 하지만 <span class="kx" data-k="-\\tfrac{7}{2}g(1)"></span>의 부호가 문제다 &rarr; 다음 장.'
              : '<span class="kx" data-k="2\\lt r\\le 3"></span> 으로 옮기면 원소가 2개가 된다. 직접 맞춰 보세요.') + '</small>';
      } else {
        ok = (S.length === 2);
        msg = '<b>집합 = ' + (S.length ? '{' + S.join(', ') + '}' : '∅') + '</b><small>' +
          (S.length === 2 ? '원소가 정확히 2개 — 조건 (나)와 형태가 맞는다.' : '원소가 ' + S.length + '개 — 조건 (나)는 2개를 요구한다.') + '</small>';
      }
      out.v.className = 'verdict ' + (ok ? 'ok' : 'no');
      out.vm.textContent = ok ? '✓' : '✕';
      out.vt.innerHTML = msg;
      renderAll(out.vt);

      var btns = side.querySelectorAll('.seg button');
      for (var k = 0; k < btns.length; k++) {
        btns[k].setAttribute('aria-pressed', btns[k].dataset.c === state.mode ? 'true' : 'false');
      }
    }

    side.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.seg button') : null;
      if (!b) return;
      state.mode = b.dataset.c; draw();
    });
    rInp.addEventListener('input', function () { state.r = +this.value; draw(); });
    draw();
  }

  /* ══════════════════════════════════════════════════════════
     LAB 3 · count — t=2 고정, r을 움직이며 자연수 세기
     ══════════════════════════════════════════════════════════ */
  function labCount(root) {
    var A = 1, t = 2;
    var state = { r: +(root.dataset.r || 3.67) };
    var svg = root.querySelector('.lab-svg');
    var side = root.querySelector('.lab-side');

    side.innerHTML =
      '<div class="sl"><div class="sl-top"><span>남은 근 <span style="font-family:KaTeX_Math,serif;font-style:italic">r</span> 을 0.5부터 5까지</span>' +
      '<span class="sl-val" data-o="rv"></span></div>' +
      '<input type="range" min="0.5" max="5" step="0.01" value="' + state.r + '" data-i="r">' +
      '<div class="sl-hint">칩 = 자연수 <span style="font-family:KaTeX_Math,serif;font-style:italic">m</span>, 아래 숫자 = 우극한의 부호</div></div>' +
      '<div class="chipbar" data-o="chips"></div>' +
      '<div class="verdict" data-o="v"><div class="vmark" data-o="vm"></div><div class="vtext" data-o="vt"></div></div>';

    var out = {
      rv: side.querySelector('[data-o="rv"]'), chips: side.querySelector('[data-o="chips"]'),
      v: side.querySelector('[data-o="v"]'), vm: side.querySelector('[data-o="vm"]'),
      vt: side.querySelector('[data-o="vt"]')
    };
    var rInp = side.querySelector('[data-i="r"]');

    function Hr(m) { return m >= t ? A * (m - state.r) : A * (state.r - m); }

    function draw() {
      var r = state.r;
      var p = Plot({ svg: svg, w: 700, h: 420, xmin: -0.6, xmax: 6.3, ymin: -3.4, ymax: 4.6 });
      var negs = [];
      for (var q = 1; q <= 6; q++) if (Hr(q) < -1e-9) negs.push(q);
      var s = axes(p, { skip: negs });

      s += '<rect x="' + p.X(p.xmin) + '" y="' + p.Y(0) + '" width="' + (p.X(p.xmax) - p.X(p.xmin)) +
           '" height="' + (p.Y(p.ymin) - p.Y(0)) + '" fill="' + C.flag + '" opacity=".06"/>';
      s += lbl(p.X(p.xmax) - 6, p.Y(p.ymin) - 12, '이 아래가 음수 구간', C.flag, 13, 'end', false);

      // 왼쪽 A(r-x), x<2
      s += '<line x1="' + p.X(p.xmin) + '" y1="' + p.Y(A * (r - p.xmin)) + '" x2="' + p.X(2) + '" y2="' + p.Y(A * (r - 2)) +
           '" stroke="' + C.flag + '" stroke-width="4.2" stroke-linecap="round"/>';
      // 오른쪽 A(x-r), x>2
      s += '<line x1="' + p.X(2) + '" y1="' + p.Y(A * (2 - r)) + '" x2="' + p.X(p.xmax) + '" y2="' + p.Y(A * (p.xmax - r)) +
           '" stroke="' + C.accent + '" stroke-width="4.2" stroke-linecap="round"/>';
      s += '<line x1="' + p.X(2) + '" y1="' + p.Y(A * (r - 2)) + '" x2="' + p.X(2) + '" y2="' + p.Y(A * (2 - r)) +
           '" stroke="' + C.ink3 + '" stroke-width="2" stroke-dasharray="4 4"/>';
      s += hollow(p.X(2), p.Y(A * (r - 2)), C.flag, 5.2);
      s += hollow(p.X(2), p.Y(A * (2 - r)), C.accent, 5.2);
      s += hollow(p.X(0), p.Y(A * r), C.flag, 5.2);

      for (var m = 1; m <= 6; m++) {
        var v = Hr(m);
        if (v > p.ymax || v < p.ymin) continue;
        var neg = v < -1e-9;
        s += vdash(p, m, 0, v, neg ? C.flag : C.ink3);
        if (neg) {
          s += '<circle cx="' + p.X(m) + '" cy="' + p.Y(v) + '" r="12" fill="' + C.flag + '"/>';
          s += '<text x="' + p.X(m) + '" y="' + (p.Y(v) + 5.5) + '" text-anchor="middle" font-family="KaTeX_Math, serif" font-style="italic" font-weight="700" font-size="15.5" fill="#fff">' + m + '</text>';
        } else {
          s += '<circle cx="' + p.X(m) + '" cy="' + p.Y(v) + '" r="6.6" fill="#fff" stroke="' + C.ink2 + '" stroke-width="2.2"/>';
        }
      }
      s += '<circle cx="' + p.X(r) + '" cy="' + p.Y(0) + '" r="3.6" fill="' + C.accent2 + '"/>';
      s += lbl(p.X(r), p.Y(0) - 13, 'r', C.accent2, 16);
      svg.innerHTML = s;

      out.rv.textContent = 'r = ' + nf(r, 2);
      var S = [], html = '';
      for (var m2 = 1; m2 <= 5; m2++) {
        var vv = Hr(m2), neg = vv < -1e-9, zero = Math.abs(vv) < 1e-9;
        if (neg) S.push(m2);
        html += '<div class="chip' + (neg ? ' neg' : (zero ? ' zero' : '')) + '">' +
          '<span class="side">' + (m2 < 2 ? '왼쪽' : '오른쪽') + '</span>' +
          '<b>' + m2 + '</b><span>' + (vv > 0 ? '+' : '') + nf(vv, 2) + '</span></div>';
      }
      out.chips.innerHTML = html;

      var ok = S.length === 2;
      out.v.className = 'verdict ' + (ok ? 'ok' : 'no');
      out.vm.textContent = ok ? '✓' : '' + S.length;
      out.vt.innerHTML = '<b>집합 = ' + (S.length ? '{' + S.join(', ') + '}' : '∅') + ' &nbsp;·&nbsp; 원소 ' + S.length + '개</b>' +
        '<small>' + (ok ? '조건 (나)가 요구하는 개수와 일치 — 이때 <span class="kx" data-k="3\\lt r\\le 4"></span>' :
          '조건 (나)는 서로 다른 2개를 요구한다. <span class="kx" data-k="r"></span>을 더 움직여 보세요.') + '</small>';
      renderAll(out.vt);
    }
    rInp.addEventListener('input', function () { state.r = +this.value; draw(); });
    draw();
  }

  /* ══════════════════════════════════════════════════════════
     LAB 4 · values — g(-1) 과 -7/2·g(1) 의 값 비교
     data-case="t0" | "t2"
     ══════════════════════════════════════════════════════════ */
  function labValues(root) {
    var kind = root.dataset.case || 't2';
    var lo = kind === 't0' ? 2.02 : 3.02, hi = kind === 't0' ? 3 : 4;
    var state = { r: kind === 't0' ? 2.5 : 3.67, A: 1 };
    var svg = root.querySelector('.lab-svg');
    var side = root.querySelector('.lab-side');

    side.innerHTML =
      '<div class="sl"><div class="sl-top"><span>' + (kind === 't0' ? '<span style="font-family:KaTeX_Math,serif;font-style:italic">t</span>=0 일 때 가능한 범위 2&lt;r≤3' : '<span style="font-family:KaTeX_Math,serif;font-style:italic">t</span>=2 일 때 확정된 범위 3&lt;r≤4') + '</span>' +
      '<span class="sl-val" data-o="rv"></span></div>' +
      '<input type="range" min="' + lo + '" max="' + hi + '" step="0.01" value="' + state.r + '" data-i="r"></div>' +
      '<div class="verdict" data-o="v"><div class="vmark" data-o="vm"></div><div class="vtext" data-o="vt"></div></div>';

    var out = {
      rv: side.querySelector('[data-o="rv"]'), v: side.querySelector('[data-o="v"]'),
      vm: side.querySelector('[data-o="vm"]'), vt: side.querySelector('[data-o="vt"]')
    };
    var rInp = side.querySelector('[data-i="r"]');

    function draw() {
      var r = state.r, A = state.A;
      // t=0 : g(-1)=-f(-1)=3A(1+r) ,  g(1)= f(1)= A(r-1)  →  -7/2 g(1) = -3.5A(r-1)
      // t=2 : g(-1)=-f(-1)=3A(1+r) ,  g(1)=-f(1)=-A(r-1)  →  -7/2 g(1) = +3.5A(r-1)
      var v1 = 3 * A * (1 + r);
      var v2 = (kind === 't0' ? -1 : 1) * 3.5 * A * (r - 1);

      var hasNeg = (v1 < 0 || v2 < 0);
      var W = 700, H = hasNeg ? 440 : 372, base = hasNeg ? 296 : 318, top = 52, floor = H - 40;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.style.aspectRatio = W + ' / ' + H;

      var maxPos = Math.max(v1, v2, 0.001);
      var maxNeg = Math.max(-v1, -v2, 0.001);
      var sc = Math.min((base - top) / maxPos, (floor - base) / maxNeg);

      var s = '';
      // 음수 영역
      s += '<rect x="56" y="' + base + '" width="' + (W - 96) + '" height="' + (H - base - 8) + '" fill="' + C.flag + '" opacity=".055"/>';
      s += '<line x1="56" y1="' + base + '" x2="' + (W - 40) + '" y2="' + base + '" stroke="' + C.ink2 + '" stroke-width="1.6"/>';
      s += '<text x="48" y="' + (base + 5) + '" text-anchor="end" font-family="KaTeX_Main,serif" font-size="13" fill="' + C.ink3 + '">0</text>';
      s += '<text x="64" y="' + (H - 14) + '" font-family="\'IBM Plex Sans KR\',sans-serif" font-weight="700" font-size="12.5" fill="' + C.flag + '">이 아래는 자연수가 될 수 없다</text>';

      function bar(cx, val, color, name, tag) {
        var hgt = Math.max(Math.abs(val) * sc, 3), y = val >= 0 ? base - hgt : base;
        var o = '<rect x="' + (cx - 58) + '" y="' + y + '" width="116" height="' + hgt + '" rx="7" fill="' + color + '" opacity=".93"/>';
        // 값(= A의 배수)
        o += '<text x="' + cx + '" y="' + (val >= 0 ? y - 26 : y + hgt + 26) + '" text-anchor="middle" font-family="KaTeX_Main,serif" font-weight="700" font-size="22" fill="' + color + '">' + nf(val, 2) + 'A</text>';
        // 태그
        o += '<text x="' + cx + '" y="' + (val >= 0 ? y - 8 : y + hgt + 44) + '" text-anchor="middle" font-family="\'IBM Plex Sans KR\',sans-serif" font-weight="700" font-size="12.5" fill="' + (val >= 0 ? C.ink3 : C.flag) + '">' + tag + '</text>';
        // 이름 (막대 안쪽)
        o += '<text x="' + cx + '" y="' + (val >= 0 ? base - 14 : base + 22) + '" text-anchor="middle" font-family="KaTeX_Math,serif" font-style="italic" font-size="16" fill="#fff">' + name + '</text>';
        return o;
      }
      if (kind === 't0') {
        s += bar(238, v1, C.accent, 'g(-1)', '양수 — 자연수 가능');
        s += bar(486, v2, C.flag, '-7/2 g(1)', '음수 — 자연수 불가');
      } else {
        s += bar(238, v1, C.accent, 'g(-1)', '더 큰 쪽 → 3');
        s += bar(486, v2, C.accent2, '-7/2 g(1)', '더 작은 쪽 → 2');
      }
      svg.innerHTML = s;

      out.rv.textContent = 'r = ' + nf(r, 2);
      if (kind === 't0') {
        out.v.className = 'verdict no';
        out.vm.textContent = '✕';
        out.vt.innerHTML = '<b><span class="kx" data-k="-\\tfrac{7}{2}g(1)"></span>가 항상 음수다</b>' +
          '<small><span class="kx" data-k="2\\lt r\\le 3"></span>이면 <span class="kx" data-k="r-1\\gt 0"></span>, <span class="kx" data-k="A\\gt 0"></span> &rarr; <span class="kx" data-k="-\\tfrac{7}{2}A(r-1)\\lt 0"></span>. 자연수 집합의 원소가 될 수 없다. <b style="color:var(--flag)">t = 0 탈락</b></small>';
      } else {
        var d = v1 - v2;
        out.v.className = 'verdict ok';
        out.vm.textContent = '✓';
        out.vt.innerHTML = '<b>항상 <span class="kx" data-k="g(-1)\\gt -\\tfrac{7}{2}g(1)"></span></b>' +
          '<small>차이 <span class="kx" data-k="=\\tfrac{A}{2}(13-r)"></span> — <span class="kx" data-k="r\\le 4"></span>라 항상 양수(지금 ' + nf(d, 2) + 'A). 그래서 큰 쪽 <span class="kx" data-k="g(-1)=3"></span>, 작은 쪽 <span class="kx" data-k="-\\tfrac{7}{2}g(1)=2"></span>.</small>';
      }
      renderAll(out.vt);
    }
    rInp.addEventListener('input', function () { state.r = +this.value; draw(); });
    draw();
  }

  /* ══════════════════════════════════════════════════════════
     LAB 5 · blowup — 분자가 0이 아니면 발산한다
     ══════════════════════════════════════════════════════════ */
  function labBlowup(root) {
    var state = { c: 0.9 };   // g(0) = c  (분자의 x=0 에서의 값)
    var svg = root.querySelector('.lab-svg');
    var side = root.querySelector('.lab-side');

    side.innerHTML =
      '<div class="sl"><div class="sl-top"><span>분자의 값 <span style="font-family:KaTeX_Math,serif;font-style:italic">g</span>(0) 을 0에 가깝게</span>' +
      '<span class="sl-val" data-o="cv"></span></div>' +
      '<input type="range" min="-1.2" max="1.2" step="0.01" value="0.9" data-i="c"></div>' +
      '<div class="fx sm boxed" data-o="eq"></div>' +
      '<div class="verdict" data-o="v"><div class="vmark" data-o="vm"></div><div class="vtext" data-o="vt"></div></div>';

    var out = {
      cv: side.querySelector('[data-o="cv"]'), eq: side.querySelector('[data-o="eq"]'),
      v: side.querySelector('[data-o="v"]'), vm: side.querySelector('[data-o="vm"]'),
      vt: side.querySelector('[data-o="vt"]')
    };
    var inp = side.querySelector('[data-i="c"]');

    function draw() {
      var c = state.c;
      // 분자 N(x) = c + 1.1x  (g(0)=c 를 흉내내는 매끄러운 분자), 분모 D(x)=x(x-2)
      var p = Plot({ svg: svg, w: 700, h: 420, xmin: -1.0, xmax: 1.65, ymin: -6.2, ymax: 6.2 });
      var s = axes(p, { skip: [] });
      var i, x, y, segs = [], cur = [];
      for (i = 0; i <= 900; i++) {
        x = p.xmin + (p.xmax - p.xmin) * i / 900;
        var D = x * (x - 2);
        if (Math.abs(D) < 1e-4) { if (cur.length > 1) segs.push(cur); cur = []; continue; }
        y = (c + 1.1 * x) / D;
        if (y > p.ymax || y < p.ymin) { if (cur.length > 1) segs.push(cur); cur = []; continue; }
        cur.push(p.X(x) + ',' + p.Y(y));
      }
      if (cur.length > 1) segs.push(cur);
      s += '<line x1="' + p.X(0) + '" y1="' + p.Y(p.ymax) + '" x2="' + p.X(0) + '" y2="' + p.Y(p.ymin) +
           '" stroke="' + C.flag + '" stroke-width="1.6" stroke-dasharray="6 5" opacity=".8"/>';
      segs.forEach(function (sg) {
        s += '<polyline points="' + sg.join(' ') + '" fill="none" stroke="' + C.accent +
             '" stroke-width="3.6" stroke-linecap="round"/>';
      });
      var near = Math.abs(c) < 0.05;
      s += lbl(p.X(0) + 12, p.Y(p.ymax) + 20, near ? '유한한 값으로 수렴' : '±∞ 로 발산', near ? C.accent : C.flag, 15, 'start', false);
      svg.innerHTML = s;

      out.cv.textContent = 'g(0) = ' + nf(c, 2);
      renderTex(out.eq, '\\lim_{x\\to 0^{+}}\\dfrac{g(x)}{x(x-2)}');
      out.v.className = 'verdict ' + (near ? 'ok' : 'no');
      out.vm.textContent = near ? '✓' : '✕';
      out.vt.innerHTML = near
        ? '<b>극한값이 존재한다</b><small>분모가 0으로 갈 때 분자도 같이 0이 되어야만 유한한 값이 남는다. &rarr; <span class="kx" data-k="g(0)=0"></span></small>'
        : '<b>극한값이 존재하지 않는다</b><small>분모만 0으로 가고 분자는 <span class="kx" data-k="' + nf(c, 2) + '"></span>이라 크기가 무한히 커진다.</small>';
      renderAll(out.vt);
    }
    inp.addEventListener('input', function () { state.c = +this.value; draw(); });
    draw();
  }

  /* ══════════════════════════════════════════════════════════
     KaTeX 렌더
     ══════════════════════════════════════════════════════════ */
  function renderTex(el, tex) {
    if (!window.katex) { el.textContent = tex; return; }
    try {
      window.katex.render(tex, el, {
        displayMode: el.classList.contains('fx'),
        throwOnError: false, strict: false, output: 'html', trust: true
      });
    } catch (e) { el.textContent = tex; }
  }
  function renderAll(scope) {
    (scope || document).querySelectorAll('[data-k]:not([data-done])').forEach(function (el) {
      renderTex(el, el.getAttribute('data-k'));
      el.setAttribute('data-done', '1');
    });
  }

  var LABS = { fold: labFold, quot: labQuot, count: labCount, values: labValues, blowup: labBlowup };

  function boot() {
    renderAll(document);
    document.querySelectorAll('[data-lab]').forEach(function (root) {
      var fn = LABS[root.dataset.lab];
      if (fn) { try { fn(root); } catch (e) { console.error('lab error', root.dataset.lab, e); } }
    });
  }

  window.JPLab = { render: renderTex, renderAll: renderAll, boot: boot, LABS: LABS };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', function () { renderAll(document); });
})();
