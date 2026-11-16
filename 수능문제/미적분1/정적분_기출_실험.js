(() => {
  'use strict';

  document.querySelectorAll('[data-csat-chapters]').forEach(main => {
    const sections = [...main.querySelectorAll('.ch')];
    const tabs = [...document.querySelectorAll('#nav [data-step]')];
    const progress = document.getElementById('pfill');
    let current = 0;

    function go(index, focus = false) {
      current = Math.max(0, Math.min(sections.length - 1, index));
      sections.forEach((section, i) => section.classList.toggle('on', current === i));
      tabs.forEach((tab, i) => {
        tab.classList.toggle('on', current === i);
        if (current === i) tab.setAttribute('aria-current', 'step');
        else tab.removeAttribute('aria-current');
      });
      progress.style.width = ((current + 1) / sections.length * 100) + '%';
      if (focus) sections[current].querySelector('h2').focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    }

    tabs.forEach((tab, i) => tab.addEventListener('click', () => go(i, true)));
    main.querySelectorAll('[data-advance]').forEach(button => {
      button.addEventListener('click', () => go(current + Number(button.dataset.advance), true));
    });
    document.addEventListener('keydown', event => {
      if (event.altKey || event.metaKey || event.ctrlKey || event.target.closest('input,select,textarea,button,a')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        go(current + (event.key === 'ArrowRight' ? 1 : -1), true);
      }
    });
    main.querySelectorAll('[data-csat-quiz]').forEach(quiz => {
      const output = quiz.querySelector('[role="status"]');
      const buttons = [...quiz.querySelectorAll('button.choice')];
      const report = correct => {
        output.textContent = correct ? output.dataset.correct : '조건과 그래프를 다시 살펴보고 시도해 보세요.';
        output.className = correct ? 'gr' : 'rd';
      };
      for (const button of buttons) {
        button.addEventListener('click', () => {
          const correct = button.dataset.answer === quiz.dataset.csatQuiz;
          buttons.forEach(choice => {
            choice.setAttribute('aria-pressed', String(choice === button));
            choice.classList.remove('right', 'wrong');
          });
          button.classList.add(correct ? 'right' : 'wrong');
          report(correct);
        });
      }
      const form = quiz.querySelector('form');
      if (form) form.addEventListener('submit', event => {
        event.preventDefault();
        const value = form.elements.answer.value.trim();
        report(value !== '' && Number(value) === Number(quiz.dataset.csatQuiz));
      });
    });
    go(0);
  });

  const clean = value => {
    const rounded = Math.round(value * 1000) / 1000;
    return String(rounded).replace(/^-/, '−');
  };

  function graph(canvas, view, style) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width < 40 || height < 40) return null;
    const scale = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.scale(scale, scale);
    const { left, right, bottom, top } = view;
    const X = x => 36 + (x - left) / (right - left) * (width - 58);
    const Y = y => height - 30 - (y - bottom) / (top - bottom) * (height - 49);
    const color = key => style.getPropertyValue('--' + key).trim();
    const path = (points, stroke, fill, lineWidth = 2) => {
      ctx.beginPath();
      points.forEach(([x, y], index) => {
        if (index === 0) ctx.moveTo(X(x), Y(y));
        else ctx.lineTo(X(x), Y(y));
      });
      if (fill) {
        ctx.closePath();
        ctx.fillStyle = color(fill);
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = color(stroke);
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    };
    const text = (label, x, y, tone = 't2') => {
      ctx.fillStyle = color(tone);
      ctx.font = '12px "IBM Plex Sans KR", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, X(x), Y(y));
    };
    const points = (fn, from, to) => Array.from({ length: 81 }, (_, index) => {
      const x = from + (to - from) * index / 80;
      return [x, fn(x)];
    });
    const area = (fn, from, to, tone) => {
      if (to > from) path([[from, 0], ...points(fn, from, to), [to, 0]], null, tone);
    };
    const dot = (x, y, tone) => {
      ctx.beginPath();
      ctx.arc(X(x), Y(y), 4.5, 0, Math.PI * 2);
      ctx.fillStyle = color(tone);
      ctx.fill();
    };
    const boundingY = top < 0 ? top : bottom > 0 ? bottom : 0;
    path([[left, boundingY], [right, boundingY]], 'line2');
    if (left <= 0 && right >= 0) path([[0, bottom], [0, top]], 'line2');
    const tickHeight = (top - bottom) / 45;
    view.ticks.forEach(x => {
      path([[x, boundingY - tickHeight], [x, boundingY + tickHeight]], 'line2', null, 1);
      text(clean(x), x, boundingY - tickHeight * 2.5);
    });
    return { path, plot: (fn, from, to, tone) => path(points(fn, from, to), tone), area, dot, text };
  }

  const vBefore = t => 2 * t ** 3 - 8 * t;
  const vAfter = t => (t - 2) * (3 * t + 10);
  const leftPosition = t => t ** 4 / 2 - 4 * t ** 2;
  const rightSweep = t => 8 * (t - 2) ** 2 + (t - 2) ** 3;

  function drawMotion(canvas, style, t) {
    const g = graph(canvas, { left: 0, right: 3.15, bottom: -13, top: 23, ticks: [0, 1, 2, 3] }, style);
    const signed = t <= 2 ? leftPosition(t) : -8 + rightSweep(t);
    const distance = t <= 2 ? -signed : 8 + rightSweep(t);
    const speed = t <= 2 ? vBefore(t) : vAfter(t);
    if (g) {
      g.area(vBefore, 0, Math.min(2, t), 'cy-w');
      g.area(vAfter, 2, t, 'am-w');
      g.plot(vBefore, 0, 2, 'cy');
      g.plot(vAfter, 2, 3, 'am');
      g.path([[t, 0], [t, speed]], 'line2');
      g.dot(t, speed, 't1');
      g.text('t', 3.1, 2);
      g.text('v(t)', 0.32, 20.6);
    }
    return { signed, distance, direction: speed < 0 ? '왼쪽' : speed > 0 ? '오른쪽' : '정지', time: t.toFixed(2) };
  }

  function drawBoundary(canvas, style, a) {
    const g = graph(canvas, { left: 0, right: 2, bottom: -0.3, top: 5.4, ticks: [0, 0.5, 1, 1.5, 2] }, style);
    if (g) {
      const after = x => (x - 1) ** 2 + a * (x - 1) + 1;
      g.plot(x => x, 0, 1, 'cy');
      g.plot(after, 1, 2, 'am');
      g.path([[1, 1], [1.84, 1 + 0.84 * a]], 'rd', null, 1.5);
      g.dot(1, 1, 't1');
      g.text('x', 1.98, 0.36);
      g.text('f(x)', 0.24, 4.96);
    }
    return { leftSlope: '1', rightSlope: clean(a), match: a === 1 ? '기울기가 같습니다' : '기울기가 다릅니다' };
  }

  const shapes = {
    odd: { fn: x => 3 * x ** 3 + 3 * x, primitive: x => 0.75 * x ** 4 + 1.5 * x ** 2 },
    even: { fn: x => 3 * x ** 2, primitive: x => x ** 3 },
    total: { fn: x => 3 * x ** 3 + 3 * x ** 2 + 3 * x, primitive: x => 0.75 * x ** 4 + x ** 3 + 1.5 * x ** 2 }
  };

  function drawSymmetry(canvas, style, radius, mode) {
    const { fn, primitive } = shapes[mode];
    const g = graph(canvas, { left: -2.2, right: 2.2, bottom: -33, top: 48, ticks: [-2, -1, 0, 1, 2] }, style);
    const leftIntegral = -primitive(-radius);
    const rightIntegral = primitive(radius);
    if (g) {
      g.area(fn, -radius, 0, 'cy-w');
      g.area(fn, 0, radius, 'am-w');
      g.plot(fn, -2, 2, 't1');
      g.dot(-radius, fn(-radius), 'cy');
      g.dot(radius, fn(radius), 'am');
      g.text('x', 2.09, 5);
      g.text('y', 0.13, 44);
    }
    return { leftIntegral: clean(leftIntegral), rightIntegral: clean(rightIntegral), totalIntegral: clean(leftIntegral + rightIntegral) };
  }

  document.querySelectorAll('[data-csat-lab]').forEach(lab => {
    const canvas = lab.querySelector('canvas');
    const range = lab.querySelector('input[type="range"]');
    const mode = lab.querySelector('select');
    const marker = lab.querySelector('.csat-marker');
    const readouts = [...lab.querySelectorAll('[data-reading]')];
    const style = getComputedStyle(lab);
    function draw() {
      const value = Number(range.value);
      let values;
      switch (lab.dataset.csatLab) {
        case 'motion':
          values = drawMotion(canvas, style, value);
          marker.style.left = (values.signed + 8) / 9 * 100 + '%';
          values.signed = clean(values.signed);
          values.distance = clean(values.distance);
          break;
        case 'boundary':
          values = drawBoundary(canvas, style, value);
          break;
        case 'symmetry':
          values = drawSymmetry(canvas, style, value, mode.value);
          values.radius = clean(value);
          break;
      }
      readouts.forEach(output => { output.textContent = values[output.dataset.reading]; });
    }
    range.addEventListener('input', draw);
    if (mode) mode.addEventListener('change', draw);
    [range, mode].filter(Boolean).forEach(control => {
      control.addEventListener('keydown', event => {
        if (/^(Arrow|Page|Home|End| $)/.test(event.key)) event.stopPropagation();
      });
    });
    new ResizeObserver(draw).observe(canvas);
    draw();
  });
})();
