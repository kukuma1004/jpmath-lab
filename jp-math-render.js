(function () {
  'use strict';

  const targets = [
    '.formula-main',
    '.rule-strip strong',
    '.example-equation',
    '.question-equation',
    '.rush-eq',
    '.core-formula strong',
    '.mini-formula',
    '[data-example-equation]',
    '[data-drill-equation]',
    '[data-game-equation]'
  ].join(',');

  const superMap = {
    '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9',
    '⁺':'+','⁻':'-','ⁿ':'n'
  };

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
    tex = tex.replace(/\^\(([^()]*)\)/g, '^{$1}');
    tex = tex.replace(/√\(([^()]*)\)/g, '\\sqrt{$1}');
    tex = tex.replace(/√([A-Za-z0-9]+)/g, '\\sqrt{$1}');
    tex = tex.replace(/lim\s*\[\s*([A-Za-z])\s*\\to\s*([^\]]+)\]/g, '\\lim_{$1\\to $2}');
    tex = tex.replace(/lim\s+([A-Za-z])\s*\\to\s*([^\s,}]+)/g, '\\lim_{$1\\to $2}');
    tex = tex.replace(/∫\[\s*([^\]\\]+)\\to\s*([^\]]+)\]/g, '\\int_{$1}^{$2}');
    tex = tex.replace(/∫\s*([A-Za-z0-9-]+)\s*\\to\s*([A-Za-z0-9-]+)/g, '\\int_{$1}^{$2}');
    tex = tex.replace(/∫/g, '\\int ');
    tex = tex.replace(/\b(sin|cos|tan|exp|ln|log)\b/g, '\\$1');

    for (let i = 0; i < 3; i += 1) {
      tex = tex.replace(/(-?\d+|[A-Za-z]{1,3})\s*\/\s*(-?\d+|[A-Za-z]{1,3})/g, '\\frac{$1}{$2}');
    }
    return tex;
  }

  function renderOne(el) {
    if (!window.katex || el.querySelector('.katex')) return;
    const source = el.textContent.trim();
    if (!source || /[가-힣]/.test(source)) return;
    try {
      window.katex.render(toTex(source), el, {
        displayMode: false,
        throwOnError: false,
        strict: false,
        output: 'htmlAndMathml'
      });
    } catch (_) {}
  }

  function scan(root) {
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.matches && root.matches(targets)) renderOne(root);
    root.querySelectorAll(targets).forEach(renderOne);
  }

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
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
