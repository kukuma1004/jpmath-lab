(function () {
  'use strict';

  const targets = [
    '.formula-main',
    '.rule-strip strong',
    '.example-equation',
    '.question-equation',
    '.rush-eq',
    '.answer-btn',
    '.game-choice',
    '.core-formula strong',
    '.mini-formula',
    '[data-example-equation]',
    '[data-drill-equation]',
    '[data-game-equation]',
    '[data-math]',
    '[data-tex]'
  ].join(',');

  const superMap = {
    '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9',
    '⁺':'+','⁻':'-','ⁿ':'n'
  };

  const fitTargets = '.formula-main,.rule-strip strong,.example-equation,.question-equation,.rush-eq,.answer-btn,.game-choice';

  // 풀이의 중심이 되는 수식은 본문형이 아니라 전시형으로 조판한다.
  // 특히 lim, sum, int의 위·아래 조건과 큰 분수의 균형이 달라진다.
  const displayTargets = [
    '.formula-main',
    '.example-equation',
    '.question-equation',
    '.rush-eq',
    '.core-formula strong',
    '[data-example-equation]',
    '[data-drill-equation]',
    '[data-game-equation]',
    '[data-math-display="block"]'
  ].join(',');

  function fitRendered(el) {
    if (!el.matches(fitTargets) || el.clientWidth <= 0) return;
    const rendered = el.querySelector('.katex');
    if (!rendered) return;
    rendered.style.fontSize = '';
    rendered.style.zoom = '';
    const available = Math.max(40, el.clientWidth - 10);
    const width = rendered.getBoundingClientRect().width;
    if (width <= available) return;
    // 너무 줄이면 읽을 수 없다. 0.82 밑으로는 줄이지 않고
    // 넘치는 부분은 가로 스크롤에 맡긴다.
    rendered.style.zoom = String(Math.max(.82, available / width));
  }

  function toTex(source) {
    let tex = String(source).trim();
    tex = tex
      .replace(/−/g, '-')
      .replace(/⇒/g, '\\Rightarrow ')
      .replace(/⇔/g, '\\Longleftrightarrow ')
      .replace(/∴/g, '\\therefore ')
      .replace(/≤/g, '\\le ')
      .replace(/≥/g, '\\ge ')
      .replace(/≠/g, '\\ne ')
      .replace(/∞/g, '\\infty ')
      .replace(/Δ/g, '\\Delta ')
      .replace(/α/g, '\\alpha ')
      .replace(/β/g, '\\beta ')
      .replace(/→/g, '\\to ')
      .replace(/′/g, "'")
      .replace(/″/g, "''")
      .replace(/·/g, '\\cdot ')
      .replace(/∪/g, '\\cup ');

    tex = tex.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ]+/g, run => `^{${[...run].map(ch => superMap[ch]).join('')}}`);
    tex = tex.replace(/\{([^{}]*,[^{}]*)\}/g, '\\{$1\\}');
    tex = tex.replace(/\^\(([^()]*)\)/g, '^{$1}');
    tex = tex.replace(/√\(([^()]*)\)/g, '\\sqrt{$1}');
    tex = tex.replace(/√([A-Za-z0-9]+)/g, '\\sqrt{$1}');
    tex = tex.replace(/lim\s*\[\s*([A-Za-z])\s*\\to\s*([^\]]+)\]/g, '\\lim_{$1\\to $2}');
    tex = tex.replace(/lim\s+([A-Za-z])\s*\\to\s*([^\s,}]+)/g, '\\lim_{$1\\to $2}');
    tex = tex.replace(/∫\[\s*([^\]\\]+)\\to\s*([^\]]+)\]/g, '\\int_{$1}^{$2}');
    tex = tex.replace(/∫\s*([A-Za-z0-9-]+)\s*\\to\s*([A-Za-z0-9-]+)/g, '\\int_{$1}^{$2}');
    tex = tex.replace(/∫/g, '\\int ');
    tex = tex.replace(/\b(sin|cos|tan|exp|ln|log)\b/g, '\\$1');

    // 분수 규칙이 위첨자 묶음 안을 가로지르지 않도록 잠시 표식으로 감춘다.
    // (이게 없으면 x²/a² 가 x^\dfrac{2}{a}^{2} 처럼 깨진다)
    const supStore = [];
    tex = tex.replace(/\^\{[^{}]*\}/g, function (m) {
      supStore.push(m);
      return '\u0001' + (supStore.length - 1) + '\u0002';
    });

    // 문제 생성기가 사용하는 (분자)/(분모) 표기를 실제 분수로 통일합니다.
    for (let i = 0; i < 4; i += 1) {
      tex = tex.replace(/\(([^()]*)\)\s*\/\s*\(([^()]*)\)/g, '\\dfrac{$1}{$2}');
    }
    tex = tex.replace(/\{([^{}]+)\}\s*\/\s*\{([^{}]+)\}/g, '\\dfrac{$1}{$2}');
    tex = tex.replace(/\{([^{}]+)\}\s*\/\s*([A-Za-z0-9]+)/g, '\\dfrac{$1}{$2}');
    tex = tex.replace(/([A-Za-z][A-Za-z0-9']*(?:\([^()]*\))?)\s*\/\s*\{([^{}]+)\}/g, '\\dfrac{$1}{$2}');
    tex = tex.replace(/([A-Za-z0-9]+(?:\^\{[^{}]+\})?)\s*\/\s*\(([^()]*)\)/g, '\\dfrac{$1}{$2}');
    tex = tex.replace(/\|([^|]+)\|\s*\/\s*([A-Za-z0-9]+)/g, '\\dfrac{\\lvert $1\\rvert}{$2}');
    tex = tex.replace(/(\d*[A-Za-z][A-Za-z0-9']*\([^()]*\))\s*\/\s*([A-Za-z0-9]+)/g, '\\dfrac{$1}{$2}');
    tex = tex.replace(/([A-Za-z0-9]+)\s*\/\s*\(([^()]*)\)/g, '\\dfrac{$1}{$2}');

    for (let i = 0; i < 3; i += 1) {
      tex = tex.replace(/(\d+|[A-Za-z]{1,3})\s*\/\s*(\d+|[A-Za-z]{1,3})/g, '\\dfrac{$1}{$2}');
    }
    // 위첨자가 붙은 항끼리의 나눗셈 (x²/a² 같은 표준형)
    for (let i = 0; i < 3; i += 1) {
      tex = tex.replace(
        /([A-Za-z0-9]*\u0001\d+\u0002|[A-Za-z0-9]+)\s*\/\s*([A-Za-z0-9]*\u0001\d+\u0002|[A-Za-z0-9]+)/g,
        '\\dfrac{$1}{$2}');
    }
    // 감춰 둔 위첨자를 되돌린다
    tex = tex.replace(/\u0001(\d+)\u0002/g, function (_, i) { return supStore[+i]; });
    // \rvert 뒤에 글자가 바로 붙으면 (예: |v(t)|dt) 명령어가 뭉개진다. 공백을 남긴다.
    tex = tex.replace(/\|([^|]+)\|/g, '\\lvert $1\\rvert ');
    // 한글 낱말은 수식 글꼴로 두지 않는다. 수식과 붙지 않도록 앞뒤에 숨통을 준다.
    tex = tex.replace(/[가-힣]+/g, word => `\\;\\text{${word}}\\;`);
    return tex;
  }

  function renderOne(el) {
    if (!window.katex || el.querySelector('.katex')) return;
    const source = (el.dataset.tex || el.textContent).trim();
    if (!source) return;
    try {
      const tex = toTex(source);
      const readableTex = el.closest('[data-math-style="upright"]') ? `\\mathsf{${tex}}` : tex;
      const displayMode = el.matches(displayTargets);
      window.katex.render(readableTex, el, {
        displayMode,
        throwOnError: false,
        strict: false,
        output: 'htmlAndMathml'
      });
      requestAnimationFrame(() => fitRendered(el));
    } catch (_) {}
  }

  function scan(root) {
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.matches && root.matches(targets)) renderOne(root);
    root.querySelectorAll(targets).forEach(renderOne);
  }

  const refitAll = () => document.querySelectorAll(fitTargets).forEach(fitRendered);

  window.JPMath = Object.assign(window.JPMath || {}, {
    toTex,
    render: renderOne,
    scan,
    fit: fitRendered,
    refit: refitAll
  });

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      scan(document);
    });
  });

  function start() {
    scan(document);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.addEventListener('resize', refitAll, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refitAll);
    setTimeout(refitAll, 500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
