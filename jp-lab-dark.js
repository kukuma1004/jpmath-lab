/* ══════════════════════════════════════════════════════════════════════
   jp-lab-dark.js — 2026 수능 15번 전용 탐구 랩 (다크 팔레트)
   ----------------------------------------------------------------------
     f(x) = -x^2 (x<0) / x^2-x (x>=0)
     g(x) = a(x+1) (x<-1) / 0 (-1<=x<1) / a(x-1) (x>=1)        (a>0)
     φ(x) = g(x)-f(x) = h'(x)
       x < -1  :  x^2 + ax + a
      -1<=x<0  :  x^2
       0<=x<1  :  x - x^2
       x >= 1  :  (x-1)(a-x)
     h(x) = ∫₀ˣ φ(t) dt

   사용 : <div class="lab" data-dlab="종류"> … </div>
     pieces   f 와 g 를 겹쳐 보기          (a 슬라이더)
     phi      φ 그래프 · 부호 구간 · 극값 개수   (a 슬라이더)
     disc     x<-1 구간의 x^2+ax+a 와 판별식     (a 슬라이더)
     hgraph   h(x) 곡선과 극값                  (a 슬라이더)
     area     a=4 에서 h(b) 를 넓이로 누적       (b 슬라이더)
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var C = {
    ink:'#0d0e16', line:'rgba(192,202,245,.13)', line2:'rgba(192,202,245,.26)',
    grid:'rgba(192,202,245,.055)', t1:'#e7ecff', t2:'#a9b1d6', t3:'#6b7398',
    am:'#ffb545', cy:'#7dcfff', gr:'#9ece6a', rd:'#f7768e', pu:'#bb9af7'
  };

  function nf(v, d) {
    if (d === undefined) d = 2;
    var s = (+v).toFixed(d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  /* ── 수식 ─────────────────────────────────────────── */
  function tex(el, t) {
    if (!window.katex) { el.textContent = t; return; }
    try { window.katex.render(t, el, { displayMode: el.classList.contains('md'), throwOnError:false, strict:false }); }
    catch (e) { el.textContent = t; }
  }
  function texAll(scope) {
    (scope || document).querySelectorAll('[data-k]:not([data-done])').forEach(function (el) {
      tex(el, el.getAttribute('data-k')); el.setAttribute('data-done','1');
    });
  }

  /* ── 함수 ─────────────────────────────────────────── */
  function f(x){ return x < 0 ? -x*x : x*x - x; }
  function g(x,a){ return x < -1 ? a*(x+1) : (x < 1 ? 0 : a*(x-1)); }
  function phi(x,a){
    if (x < -1) return x*x + a*x + a;
    if (x < 0)  return x*x;
    if (x < 1)  return x - x*x;
    return (x-1)*(a-x);
  }
  /* 극값(부호변화) 위치 — 해석적으로 */
  function extrema(a) {
    var out = [];
    var D = a*a - 4*a;
    if (D > 1e-12) {                                  // x < -1 에서 서로 다른 두 근
      var s = Math.sqrt(D);
      out.push({ x:(-a - s)/2, kind:'극대' });
      out.push({ x:(-a + s)/2, kind:'극소' });
    }
    out.push({ x: a > 1 ? a : 1, kind:'극대' });       // x >= 1 에서 언제나 하나
    return out;
  }
  /* h(x) 수치적분 (사다리꼴) */
  function hmaker(a, xmin, xmax, N) {
    N = N || 4000;
    var dx = (xmax - xmin)/N, xs = [], hs = [], i;
    for (i = 0; i <= N; i++) xs.push(xmin + dx*i);
    // 0 기준 누적
    var acc = new Array(N+1), run = 0;
    acc[0] = 0;
    for (i = 1; i <= N; i++) { run += (phi(xs[i-1],a) + phi(xs[i],a))/2 * dx; acc[i] = run; }
    // x=0 지점 값을 빼서 h(0)=0 으로
    var i0 = Math.round((0 - xmin)/dx), base = acc[Math.max(0,Math.min(N,i0))];
    for (i = 0; i <= N; i++) hs.push(acc[i] - base);
    return { xs:xs, hs:hs, at:function(x){
      var j = Math.round((x - xmin)/dx); j = Math.max(0, Math.min(N, j)); return hs[j];
    }};
  }
  function integ(a, lo, hi) {
    var N = 3000, dx = (hi-lo)/N, s = 0, i;
    for (i = 0; i < N; i++) s += (phi(lo+dx*i,a) + phi(lo+dx*(i+1),a))/2*dx;
    return s;
  }

  /* ── 플롯 ─────────────────────────────────────────── */
  function Plot(svg, o) {
    var W = o.w||720, H = o.h||440,
        L = o.l===undefined?44:o.l, R = o.r===undefined?22:o.r,
        T = o.t===undefined?18:o.t, B = o.b===undefined?34:o.b;
    svg.setAttribute('viewBox','0 0 '+W+' '+H);
    svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    svg.style.aspectRatio = W+' / '+H;
    return {
      W:W,H:H,xmin:o.xmin,xmax:o.xmax,ymin:o.ymin,ymax:o.ymax,
      X:function(x){return L+(x-o.xmin)/(o.xmax-o.xmin)*(W-L-R);},
      Y:function(y){return T+(o.ymax-y)/(o.ymax-o.ymin)*(H-T-B);}
    };
  }
  function axes(p, opt) {
    opt = opt||{}; var s='', i, y0=p.Y(0), x0=p.X(0);
    for (i=Math.ceil(p.xmin); i<=Math.floor(p.xmax); i++)
      s += '<line x1="'+p.X(i)+'" y1="'+p.Y(p.ymin)+'" x2="'+p.X(i)+'" y2="'+p.Y(p.ymax)+'" stroke="'+C.grid+'" stroke-width="1"/>';
    var gy = opt.ystep || 1;
    for (i=Math.ceil(p.ymin/gy)*gy; i<=p.ymax; i+=gy)
      s += '<line x1="'+p.X(p.xmin)+'" y1="'+p.Y(i)+'" x2="'+p.X(p.xmax)+'" y2="'+p.Y(i)+'" stroke="'+C.grid+'" stroke-width="1"/>';
    s += '<line x1="'+p.X(p.xmin)+'" y1="'+y0+'" x2="'+p.X(p.xmax)+'" y2="'+y0+'" stroke="'+C.line2+'" stroke-width="1.4"/>';
    s += '<line x1="'+x0+'" y1="'+p.Y(p.ymax)+'" x2="'+x0+'" y2="'+p.Y(p.ymin)+'" stroke="'+C.line2+'" stroke-width="1.4"/>';
    var skip = opt.skip||[];
    for (i=Math.ceil(p.xmin); i<=Math.floor(p.xmax); i++) {
      if (i===0 || skip.indexOf(i)>=0) continue;
      s += '<text x="'+p.X(i)+'" y="'+(y0+16)+'" text-anchor="middle" font-family="KaTeX_Main,serif" font-size="12" fill="'+C.t3+'">'+i+'</text>';
    }
    s += '<text x="'+(p.X(p.xmax)-3)+'" y="'+(y0-8)+'" text-anchor="end" font-family="KaTeX_Math,serif" font-style="italic" font-size="14" fill="'+C.t3+'">x</text>';
    return s;
  }
  /* 함수 곡선 (범위 밖은 끊어서) */
  function curve(p, fn, color, width, dash) {
    var segs=[], cur=[], i, x, y, N=900;
    for (i=0;i<=N;i++){
      x = p.xmin + (p.xmax-p.xmin)*i/N; y = fn(x);
      if (!isFinite(y) || y>p.ymax || y<p.ymin) { if(cur.length>1) segs.push(cur); cur=[]; continue; }
      cur.push(p.X(x).toFixed(1)+','+p.Y(y).toFixed(1));
    }
    if (cur.length>1) segs.push(cur);
    return segs.map(function(sg){
      return '<polyline points="'+sg.join(' ')+'" fill="none" stroke="'+color+'" stroke-width="'+(width||3.2)+
             '" stroke-linecap="round" stroke-linejoin="round"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
    }).join('');
  }
  /* x축과 곡선 사이 채우기 */
  function fill(p, fn, lo, hi, color, op) {
    var pts=[], i, x, y, N=420;
    for (i=0;i<=N;i++){
      x = lo + (hi-lo)*i/N; y = Math.max(p.ymin, Math.min(p.ymax, fn(x)));
      pts.push(p.X(x).toFixed(1)+','+p.Y(y).toFixed(1));
    }
    pts.push(p.X(hi).toFixed(1)+','+p.Y(0).toFixed(1));
    pts.push(p.X(lo).toFixed(1)+','+p.Y(0).toFixed(1));
    return '<polygon points="'+pts.join(' ')+'" fill="'+color+'" opacity="'+(op||.22)+'"/>';
  }
  function vline(p, x, color, dash) {
    return '<line x1="'+p.X(x)+'" y1="'+p.Y(p.ymax)+'" x2="'+p.X(x)+'" y2="'+p.Y(p.ymin)+
           '" stroke="'+(color||C.t3)+'" stroke-width="1.3" stroke-dasharray="'+(dash||'5 5')+'"/>';
  }
  function lbl(p, x, y, txt, color, size, anchor, ital) {
    return '<text x="'+(typeof x==='number'?x:x)+'" y="'+y+'" text-anchor="'+(anchor||'middle')+
      '" font-family="'+(ital===false?"'IBM Plex Sans KR',sans-serif":'KaTeX_Math,serif')+
      '" font-style="'+(ital===false?'normal':'italic')+'" font-weight="'+(ital===false?'700':'500')+
      '" font-size="'+(size||14)+'" fill="'+(color||C.t2)+'">'+esc(txt)+'</text>';
  }
  function dot(cx, cy, color, r){ return '<circle cx="'+cx+'" cy="'+cy+'" r="'+(r||5)+'" fill="'+color+'"/>'; }
  function ring(cx, cy, color, r){ return '<circle cx="'+cx+'" cy="'+cy+'" r="'+(r||5)+'" fill="'+C.ink+'" stroke="'+color+'" stroke-width="2.2"/>'; }

  /* 조작판 조립 헬퍼 */
  function slider(id, label, min, max, step, val) {
    return '<div class="ctl"><label><span>'+label+'</span><b data-o="'+id+'v"></b></label>' +
           '<input type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'" data-i="'+id+'"></div>';
  }
  function outRow(label, id, cls) {
    return '<div class="row"><span>'+label+'</span><span class="v '+(cls||'')+'" data-o="'+id+'"></span></div>';
  }

  /* ══════════════════════════════════════════════════
     LAB 1 · pieces — f 와 g 겹쳐 보기
     ══════════════════════════════════════════════════ */
  function labPieces(root) {
    var svg = root.querySelector('svg'), panel = root.querySelector('.panel');
    var st = { a: +(root.dataset.a || 2) };
    panel.innerHTML =
      slider('a','기울기 <span style="font-family:KaTeX_Math,serif;font-style:italic">a</span>', .3, 6, .05, st.a) +
      '<div class="out">' +
        outRow('f(-2)', 'f1','cy') + outRow('g(-2)', 'g1') +
        outRow('f(2)',  'f2','cy') + outRow('g(2)',  'g2') +
      '</div>' +
      '<p class="hintline"><b class="cy">파랑</b> f 는 고정된 곡선, <b>주황</b> g 는 <span style="font-family:KaTeX_Math,serif;font-style:italic">a</span>에 따라 벌어지는 꺾은선. 가운데 <b>−1 ≤ x &lt; 1</b> 은 항상 0입니다.</p>';
    var o = q(panel);

    function draw() {
      var a = st.a;
      var p = Plot(svg, { w:720, h:430, xmin:-2.5, xmax:2.9, ymin:-7, ymax:7 });
      var s = axes(p, { ystep:2 });
      s += vline(p, -1, C.line2, '4 4') + vline(p, 1, C.line2, '4 4');
      s += curve(p, f, C.cy, 3.2);
      s += curve(p, function(x){ return g(x,a); }, C.am, 3.4);
      s += lbl(p, p.X(-2.0), p.Y(f(-2.0))+20, 'f', C.cy, 17);
      s += lbl(p, p.X(2.35), p.Y(g(2.35,a))-11, 'g', C.am, 17);
      s += lbl(p, p.X(0), p.Y(0)-9, 'g = 0', C.t3, 12, 'middle', false);
      svg.innerHTML = s;
      o.av.textContent = 'a = ' + nf(a,2);
      o.f1.textContent = nf(f(-2),2);  o.g1.textContent = nf(g(-2,a),2);
      o.f2.textContent = nf(f(2),2);   o.g2.textContent = nf(g(2,a),2);
    }
    bind(panel, st, draw); draw();
  }

  /* ══════════════════════════════════════════════════
     LAB 2 · phi — φ = g - f = h' 의 부호
     ══════════════════════════════════════════════════ */
  function labPhi(root) {
    var svg = root.querySelector('svg'), panel = root.querySelector('.panel');
    var st = { a: +(root.dataset.a || 2) };
    panel.innerHTML =
      slider('a','기울기 <span style="font-family:KaTeX_Math,serif;font-style:italic">a</span>', .3, 6.5, .02, st.a) +
      '<div class="out">' +
        outRow('부호가 바뀌는 곳', 'cnt') +
        outRow('위치', 'pos','t3') +
        outRow('판별식 a(a−4)', 'disc','cy') +
      '</div>' +
      '<div class="verdict" data-o="vbox"><div class="vm" data-o="vm"></div><div class="vt" data-o="vt"></div></div>' +
      '<p class="hintline">색칠된 <b class="rd" style="color:#f7768e">붉은 구간</b>이 <span style="font-family:KaTeX_Math,serif;font-style:italic">φ&lt;0</span>. 붉은 구간이 <b>시작·끝나는 자리</b>가 곧 h의 극값입니다.</p>';
    var o = q(panel);

    function draw() {
      var a = st.a;
      var p = Plot(svg, { w:720, h:430, xmin:-3.6, xmax:5.4, ymin:-8, ymax:8 });
      var s = axes(p, { ystep:2 });
      var F = function(x){ return phi(x,a); };

      /* 부호별 색칠 : 경계에서 잘라 구간 나누기 */
      var ex = extrema(a), cuts = [p.xmin].concat(ex.map(function(e){return e.x;})).concat([p.xmax]);
      cuts = cuts.filter(function(v){return v>=p.xmin && v<=p.xmax;}).sort(function(x,y){return x-y;});
      cuts.unshift(p.xmin); cuts.push(p.xmax);
      for (var i=0;i<cuts.length-1;i++){
        var lo=cuts[i], hi=cuts[i+1]; if (hi-lo < 1e-6) continue;
        var mid=(lo+hi)/2, v=F(mid);
        s += fill(p, F, lo, hi, v<0?C.rd:C.gr, v<0?.26:.14);
      }
      s += vline(p, -1, C.line2, '4 4') + vline(p, 1, C.line2, '4 4');
      s += curve(p, F, C.am, 3.4);

      ex.forEach(function(e){
        if (e.x < p.xmin || e.x > p.xmax) return;
        s += dot(p.X(e.x), p.Y(0), e.kind==='극대'?C.rd:C.cy, 6.5);
        s += lbl(p, p.X(e.x), p.Y(0)+(e.kind==='극대'?-14:26), e.kind, e.kind==='극대'?C.rd:C.cy, 12, 'middle', false);
      });
      s += lbl(p, p.X(-1), p.Y(p.ymax)+14, '-1', C.t3, 12);
      s += lbl(p, p.X(1),  p.Y(p.ymax)+14, '1',  C.t3, 12);
      svg.innerHTML = s;

      var D = a*a - 4*a;
      o.av.textContent = 'a = ' + nf(a,2);
      o.cnt.textContent = ex.length + '개';
      o.pos.textContent = ex.map(function(e){return 'x='+nf(e.x,2);}).join(', ');
      o.disc.textContent = nf(D,2);
      var ok = ex.length === 1;
      o.vbox.className = 'verdict ' + (ok?'ok':'no');
      o.vm.textContent = ok ? '✓' : ex.length;
      o.vt.innerHTML = ok
        ? '<b>극값이 오직 하나</b>조건을 만족합니다.'
        : '<b>극값이 '+ex.length+'개</b>' + (D>0 ? 'x &lt; -1 에서 두 번 더 바뀝니다.' : '조건에 어긋납니다.');
      texAll(panel);
    }
    bind(panel, st, draw); draw();
  }

  /* ══════════════════════════════════════════════════
     LAB 3 · disc — x < -1 구간의 x^2+ax+a
     ══════════════════════════════════════════════════ */
  function labDisc(root) {
    var svg = root.querySelector('svg'), panel = root.querySelector('.panel');
    var st = { a: +(root.dataset.a || 2) };
    panel.innerHTML =
      slider('a','<span style="font-family:KaTeX_Math,serif;font-style:italic">a</span> 를 키워 보세요', .3, 8, .02, st.a) +
      '<div class="out">' +
        outRow('판별식 D = a(a−4)', 'D') +
        outRow('꼭짓점 x = −a/2', 'vx','cy') +
        outRow('꼭짓점의 y값', 'vy','cy') +
        outRow('x = −1 에서의 값', 'p1','gr') +
      '</div>' +
      '<div class="verdict" data-o="vbox"><div class="vm" data-o="vm"></div><div class="vt" data-o="vt"></div></div>' +
      '<p class="hintline"><b>진한 구간만</b> 실제로 쓰는 부분(<span style="font-family:KaTeX_Math,serif;font-style:italic">x &lt; -1</span>)입니다. <span style="font-family:KaTeX_Math,serif;font-style:italic">x=-1</span>에서의 값은 <b>a와 무관하게 늘  1</b>이라는 점을 보세요.</p>';
    var o = q(panel);

    function draw() {
      var a = st.a, Q = function(x){ return x*x + a*x + a; };
      var p = Plot(svg, { w:720, h:430, xmin:-7.8, xmax:1.0, ymin:-9, ymax:12 });
      var s = axes(p, { ystep:3 });
      /* 음수 영역 */
      s += '<rect x="'+p.X(p.xmin)+'" y="'+p.Y(0)+'" width="'+(p.X(p.xmax)-p.X(p.xmin))+
           '" height="'+(p.Y(p.ymin)-p.Y(0))+'" fill="'+C.rd+'" opacity=".07"/>';
      /* x >= -1 은 흐리게 */
      s += '<rect x="'+p.X(-1)+'" y="'+p.Y(p.ymax)+'" width="'+(p.X(p.xmax)-p.X(-1))+
           '" height="'+(p.Y(p.ymin)-p.Y(p.ymax))+'" fill="#14151f" opacity=".55"/>';
      s += curve(p, Q, C.t3, 2.2, '5 5');
      s += curve(p, function(x){ return x <= -1 ? Q(x) : NaN; }, C.am, 3.4);
      s += vline(p, -1, C.line2, '4 4');
      s += lbl(p, p.X(-1)+6, p.Y(p.ymax)+15, 'x = -1', C.t2, 12.5, 'start');

      var D = a*a-4*a, vx = -a/2, vy = a - a*a/4;
      if (D > 1e-9) {
        var sq = Math.sqrt(D), r1 = (-a-sq)/2, r2 = (-a+sq)/2;
        [r1,r2].forEach(function(r){ if(r>=p.xmin&&r<=p.xmax) s += dot(p.X(r), p.Y(0), C.rd, 6); });
        if (r2>=p.xmin&&r2<=p.xmax) s += lbl(p, p.X(r2), p.Y(0)+24, '근', C.rd, 12, 'middle', false);
      } else if (Math.abs(D) <= 1e-9) {
        s += ring(p.X(vx), p.Y(0), C.am, 7);
        s += lbl(p, p.X(vx), p.Y(0)+26, '접한다', C.am, 12.5, 'middle', false);
      }
      if (vy>=p.ymin && vy<=p.ymax) s += dot(p.X(vx), p.Y(vy), C.cy, 4.5);
      s += dot(p.X(-1), p.Y(1), C.gr, 5.5);
      s += lbl(p, p.X(-1)-8, p.Y(1)-9, '1', C.gr, 14, 'end');
      svg.innerHTML = s;

      o.av.textContent = 'a = ' + nf(a,2);
      o.D.textContent = nf(D,2);
      o.vx.textContent = nf(vx,2);
      o.vy.textContent = nf(vy,2);
      o.p1.textContent = '1';
      var cross = D > 1e-9;
      o.vbox.className = 'verdict ' + (cross?'no':'ok');
      o.vm.textContent = cross ? '2' : '0';
      o.vt.innerHTML = cross
        ? '<b>부호가 두 번 바뀐다</b>극값이 2개 더 생겨 조건에 어긋납니다.'
        : (Math.abs(D)<=1e-9
            ? '<b>딱 접한다 (a = 4)</b>0이 되지만 <b>부호는 안 바뀝니다</b> — 극값이 아닙니다.'
            : '<b>부호가 안 바뀐다</b>이 구간에서는 극값이 생기지 않습니다.');
      texAll(panel);
    }
    bind(panel, st, draw); draw();
  }

  /* ══════════════════════════════════════════════════
     LAB 4 · hgraph — h(x) 자체
     ══════════════════════════════════════════════════ */
  function labH(root) {
    var svg = root.querySelector('svg'), panel = root.querySelector('.panel');
    var st = { a: +(root.dataset.a || 2) };
    panel.innerHTML =
      slider('a','기울기 <span style="font-family:KaTeX_Math,serif;font-style:italic">a</span>', .3, 6.5, .02, st.a) +
      '<div class="out">' + outRow('h의 극값 개수', 'cnt') + outRow('h(3)', 'h3','gr') + '</div>' +
      '<div class="verdict" data-o="vbox"><div class="vm" data-o="vm"></div><div class="vt" data-o="vt"></div></div>' +
      '<p class="hintline">φ의 <b>부호가 바뀌는 자리</b>에서 h의 방향이 꺾입니다. 슬라이더를 4 너머로 밀면 왼쪽에 봉우리와 골이 하나씩 더 생깁니다.</p>';
    var o = q(panel);

    function draw() {
      var a = st.a;
      var p = Plot(svg, { w:720, h:430, xmin:-3.6, xmax:5.4, ymin:-5, ymax:9 });
      var s = axes(p, { ystep:2 });
      var H = hmaker(a, p.xmin, p.xmax, 4000);
      s += vline(p, -1, C.line2, '4 4') + vline(p, 1, C.line2, '4 4');
      s += curve(p, function(x){ return H.at(x); }, C.gr, 3.4);
      var ex = extrema(a);
      ex.forEach(function(e){
        if (e.x < p.xmin || e.x > p.xmax) return;
        var y = H.at(e.x);
        if (y < p.ymin || y > p.ymax) return;
        s += vline(p, e.x, e.kind==='극대'?C.rd:C.cy, '3 4');
        s += dot(p.X(e.x), p.Y(y), e.kind==='극대'?C.rd:C.cy, 6);
        s += lbl(p, p.X(e.x), p.Y(y)+(e.kind==='극대'?-13:24), e.kind, e.kind==='극대'?C.rd:C.cy, 12, 'middle', false);
      });
      s += lbl(p, p.X(p.xmax)-30, p.Y(H.at(p.xmax-.4))-12, 'h', C.gr, 17, 'end');
      svg.innerHTML = s;

      o.av.textContent = 'a = ' + nf(a,2);
      o.cnt.textContent = ex.length + '개';
      o.h3.textContent = nf(integ(a,0,3),3);
      var ok = ex.length===1;
      o.vbox.className = 'verdict ' + (ok?'ok':'no');
      o.vm.textContent = ok?'✓':ex.length;
      o.vt.innerHTML = ok ? '<b>극값이 오직 하나</b>봉우리가 하나뿐입니다.'
                          : '<b>극값이 '+ex.length+'개</b>왼쪽에 봉우리·골이 더 생겼습니다.';
      texAll(panel);
    }
    bind(panel, st, draw); draw();
  }

  /* ══════════════════════════════════════════════════
     LAB 5 · area — a=4 에서 h(b) 를 넓이로
     ══════════════════════════════════════════════════ */
  function labArea(root) {
    var svg = root.querySelector('svg'), panel = root.querySelector('.panel');
    var A = 4;
    var st = { b: +(root.dataset.b || 3) };
    panel.innerHTML =
      slider('b','오른쪽 끝 <span style="font-family:KaTeX_Math,serif;font-style:italic">b</span>', 0, 3, .01, st.b) +
      '<div class="out">' +
        outRow('0 → 1 조각', 'i1','cy') +
        outRow('1 → b 조각', 'i2','pu') +
        outRow('h(b) = 두 넓이의 합', 'tot','gr') +
      '</div>' +
      '<div class="btns"><button class="b gh" data-set="1">b = 1</button><button class="b gh" data-set="3">b = 3</button></div>' +
      '<p class="hintline"><span style="font-family:KaTeX_Math,serif;font-style:italic">a = 4</span> 로 고정했습니다. <b>h(b)는 φ와 x축 사이의 넓이</b>입니다 — 적분을 계산이 아니라 면적으로 보세요.</p>';
    var o = q(panel);

    function draw() {
      var b = st.b;
      var p = Plot(svg, { w:720, h:420, xmin:-.5, xmax:3.5, ymin:-.4, ymax:2.6 });
      var s = axes(p, { ystep:.5 });
      var F = function(x){ return phi(x,A); };
      if (b > 0.001) {
        s += fill(p, F, 0, Math.min(b,1), C.cy, .34);
        if (b > 1) s += fill(p, F, 1, b, C.pu, .32);
      }
      s += vline(p, 1, C.line2, '4 4');
      s += curve(p, F, C.am, 3.4);
      s += '<line x1="'+p.X(b)+'" y1="'+p.Y(p.ymin)+'" x2="'+p.X(b)+'" y2="'+p.Y(p.ymax)+'" stroke="'+C.gr+'" stroke-width="2"/>';
      s += lbl(p, p.X(b), p.Y(p.ymax)+14, 'b', C.gr, 15);
      s += lbl(p, p.X(.5), p.Y(F(.5))-12, 'x - x²', C.cy, 13, 'middle', false);
      if (b > 1) s += lbl(p, p.X(2), p.Y(F(2))-12, '(x-1)(4-x)', C.pu, 13, 'middle', false);
      svg.innerHTML = s;

      var i1 = integ(A, 0, Math.min(b,1)), i2 = b>1 ? integ(A,1,b) : 0;
      o.bv.textContent = 'b = ' + nf(b,2);
      o.i1.textContent = nf(i1,4);
      o.i2.textContent = nf(i2,4);
      o.tot.textContent = nf(i1+i2,4);
      texAll(panel);
    }
    panel.addEventListener('click', function(e){
      var t = e.target.closest ? e.target.closest('[data-set]') : null;
      if (!t) return;
      st.b = +t.getAttribute('data-set');
      var inp = panel.querySelector('[data-i="b"]'); if (inp) inp.value = st.b;
      draw();
    });
    bind(panel, st, draw); draw();
  }

  /* ── 공통 배선 ─────────────────────────────────────── */
  function q(panel) {
    var o = {};
    panel.querySelectorAll('[data-o]').forEach(function(el){ o[el.getAttribute('data-o')] = el; });
    return o;
  }
  function bind(panel, st, draw) {
    panel.querySelectorAll('input[data-i]').forEach(function(inp){
      inp.addEventListener('input', function(){ st[inp.getAttribute('data-i')] = +inp.value; draw(); });
    });
  }

  var LABS = { pieces:labPieces, phi:labPhi, disc:labDisc, hgraph:labH, area:labArea };

  function boot() {
    texAll(document);
    document.querySelectorAll('[data-dlab]').forEach(function(root){
      var fn = LABS[root.dataset.dlab];
      if (!fn) return;
      if (!root.querySelector('svg')) {
        var cb = root.querySelector('.cbox');
        if (cb && !cb.querySelector('svg')) cb.innerHTML = '<svg></svg>';
      }
      try { fn(root); } catch (e) { console.error('dlab', root.dataset.dlab, e); }
    });
  }

  window.JPDark = { tex:tex, texAll:texAll, phi:phi, f:f, g:g, extrema:extrema, integ:integ, LABS:LABS, boot:boot };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', function(){ texAll(document); });
})();
