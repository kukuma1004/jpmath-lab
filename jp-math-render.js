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

  function fitRendered(el) {
    if (!el.matches(fitTargets) || el.clientWidth <= 0) return;
    const rendered = el.querySelector('.katex');
    if (!rendered) return;
    rendered.style.fontSize = '';
    rendered.style.zoom = '';
    const available = Math.max(40, el.clientWidth - 10);
    const width = rendered.getBoundingClientRect().width;
    if (width <= available) return;
    rendered.style.zoom = String(Math.max(.68, available / width));
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

    // 문제 생성기가 사용하는 (분자)/(분모) 표기를 실제 분수로 통일합니다.
    for (let i = 0; i < 4; i += 1) {
      tex = tex.replace(/\(([^()]*)\)\s*\/\s*\(([^()]*)\)/g, '\\frac{$1}{$2}');
    }
    tex = tex.replace(/\{([^{}]+)\}\s*\/\s*\{([^{}]+)\}/g, '\\frac{$1}{$2}');
    tex = tex.replace(/\{([^{}]+)\}\s*\/\s*([A-Za-z0-9]+)/g, '\\frac{$1}{$2}');
    tex = tex.replace(/([A-Za-z][A-Za-z0-9']*(?:\([^()]*\))?)\s*\/\s*\{([^{}]+)\}/g, '\\frac{$1}{$2}');
    tex = tex.replace(/([A-Za-z0-9]+(?:\^\{[^{}]+\})?)\s*\/\s*\(([^()]*)\)/g, '\\frac{$1}{$2}');
    tex = tex.replace(/\|([^|]+)\|\s*\/\s*([A-Za-z0-9]+)/g, '\\frac{\\lvert $1\\rvert}{$2}');
    tex = tex.replace(/(\d*[A-Za-z][A-Za-z0-9']*\([^()]*\))\s*\/\s*([A-Za-z0-9]+)/g, '\\frac{$1}{$2}');
    tex = tex.replace(/([A-Za-z0-9]+)\s*\/\s*\(([^()]*)\)/g, '\\frac{$1}{$2}');

    for (let i = 0; i < 3; i += 1) {
      tex = tex.replace(/(\d+|[A-Za-z]{1,3})\s*\/\s*(\d+|[A-Za-z]{1,3})/g, '\\frac{$1}{$2}');
    }
    tex = tex.replace(/\|([^|]+)\|/g, '\\lvert $1\\rvert');
    tex = tex.replace(/[가-힣]+/g, word => `\\text{${word}}`);
    return tex;
  }

  function renderOne(el) {
    if (!window.katex || el.querySelector('.katex')) return;
    const source = (el.dataset.tex || el.textContent).trim();
    if (!source) return;
    try {
      const tex = toTex(source);
      const readableTex = el.closest('[data-math-style="upright"]') ? `\\mathsf{${tex}}` : tex;
      window.katex.render(readableTex, el, {
        displayMode: false,
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
