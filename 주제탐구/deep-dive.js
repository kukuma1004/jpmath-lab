/* 학생용 Deep Dive 화면. 교사가 쓴 deep-dives 항목을 우선 사용하고,
   나머지 모든 씨앗은 deep-dive-generator.js가 실제 탐구 설계로 바꾼다. */
(function () {
  'use strict';

  var catalog = window.JPDeepDives || { items: {}, sampleId: '' };
  var layer = null;
  var lastFocus = null;
  var seedMap = {};

  function refreshSeeds() {
    seedMap = {};
    if (!window.JPSeeds || !window.JPSeeds.all) return;
    window.JPSeeds.all().forEach(function (seed) { seedMap[seed.id] = seed; });
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function list(items, cls) {
    return '<ol class="' + (cls || '') + '">' + items.map(function (item) {
      return '<li>' + esc(item) + '</li>';
    }).join('') + '</ol>';
  }

  function chips(items) {
    return '<div class="dd-variable-list">' + items.map(function (item) {
      return '<div><b>' + esc(item.kind) + '</b><span>' + esc(item.text) + '</span></div>';
    }).join('') + '</div>';
  }

  function ensureLayer() {
    if (layer) return layer;
    layer = document.createElement('div');
    layer.className = 'dd-layer';
    layer.hidden = true;
    layer.innerHTML = '<div class="dd-backdrop" data-dd-close></div>' +
      '<section class="dd-dialog" role="dialog" aria-modal="true" aria-labelledby="ddTitle">' +
        '<button type="button" class="dd-close" data-dd-close aria-label="깊이 탐구 닫기">×</button>' +
        '<div class="dd-content"></div>' +
      '</section>';
    document.body.appendChild(layer);
    layer.addEventListener('click', function (event) {
      if (event.target.closest('[data-dd-close]')) close();
    });
    return layer;
  }

  function section(id, label, title, body, extra) {
    return '<section id="' + id + '" class="dd-section' + (extra ? ' ' + extra : '') + '">' +
      '<p class="dd-section-label">' + esc(label) + '</p>' +
      '<h3>' + esc(title) + '</h3>' + body + '</section>';
  }

  function topicVisual(seed, item) {
    var subject = (seed && seed.subject) || item.subject || 'common';
    var shapes = {
      calc: '<path d="M18 117 C58 104 68 28 120 52 S180 119 246 36"/><path class="dd-v-dash" d="M18 94 H250"/>',
      geo: '<circle cx="130" cy="72" r="48"/><path d="M25 127 L130 24 L239 127 Z M50 127 L130 72 L214 127"/><circle class="dd-v-dot" cx="130" cy="72" r="5"/>',
      econ: '<path d="M24 120 C72 104 116 75 235 28"/><path d="M24 36 C95 56 155 94 235 119"/><circle class="dd-v-dot" cx="131" cy="77" r="6"/>',
      algebra: '<path d="M22 94 C70 18 105 18 132 94 S196 170 242 55"/><path class="dd-v-dash" d="M18 94 H248 M132 15 V135"/>',
      prob: '<path class="dd-v-dash" d="M28 115 C60 112 78 88 92 57 S126 18 143 57 S183 113 242 115"/><circle class="dd-v-dot" cx="143" cy="57" r="5"/>',
      common: '<path d="M20 120 L65 82 L104 96 L148 38 L191 65 L240 24"/><path class="dd-v-dash" d="M20 120 H246"/>',
      ai: '<path d="M36 38 L95 68 L148 30 L218 58 L188 116 L111 118 L36 38 M95 68 L111 118 M148 30 L188 116"/><circle class="dd-v-dot" cx="95" cy="68" r="5"/><circle class="dd-v-dot" cx="188" cy="116" r="5"/>',
      culture: '<path d="M130 18 L153 62 L202 56 L168 91 L181 138 L130 116 L79 138 L92 91 L58 56 L107 62 Z"/><circle class="dd-v-dash" cx="130" cy="79" r="52"/>'
    };
    return '<svg class="dd-topic-visual dd-v-' + esc(subject) + '" viewBox="0 0 260 150" aria-hidden="true">' +
      (shapes[subject] || shapes.common) + '</svg>';
  }

  function sampleTemplate(item, seed) {
    var table = '<div class="dd-table-wrap"><table><thead><tr>' + item.dataColumns.map(function (x) {
      return '<th>' + esc(x) + '</th>';
    }).join('') + '</tr></thead><tbody>' + item.dataRows.map(function (row) {
      return '<tr>' + row.map(function (x) { return '<td>' + esc(x) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody></table></div>';

    // 섹션은 있는 것만 그리고 번호는 그때 매긴다.
    // 실험 위젯은 그 씨앗을 위해 만든 것이 있을 때만 넣는다.
    // 없는데 넣으면 엉뚱한 씨앗에 남의 실험이 붙는다.
    var parts = [];
    parts.push(['QUESTION', '질문을 좁히고 다시 연다',
      '<p class="dd-copy">' + esc(item.why) + '</p><div class="dd-question-ladder">' +
      item.questionLadder.map(function (q) {
        return '<div><span>' + esc(q.label) + '</span><p>' + esc(q.text) + '</p></div>';
      }).join('') + '</div>', '']);
    parts.push(['CORE MATH', '눈으로 하던 판단을 수식으로',
      '<div class="dd-formula"><strong>' + esc(item.coreMath.formula) + '</strong>' +
        '<span>' + esc(item.coreMath.normalized) + '</span><b>' + esc(item.coreMath.rule) + '</b></div>' +
      '<p class="dd-copy">' + esc(item.coreMath.note) + '</p>', 'dd-dark']);
    if (item.experiment === 'fov') {
      parts.push(['LIVE EXPERIMENT', '각도와 거리를 움직여 판정을 깨뜨려 보자',
        experimentTemplate(), '']);
    }
    parts.push(['PLAN', '탐구 순서', list(item.plan, 'dd-steps'), '']);
    parts.push(['VARIABLES', '무엇을 바꾸고 무엇을 기록할까', chips(item.variables), '']);
    parts.push(['DATA', '데이터와 그래프 계획',
      table + '<div class="dd-two-col"><div><h4>그래프로 볼 것</h4>' + list(item.graphIdeas) +
      '</div><div><h4>반드시 시험할 반례</h4>' + list(item.checks) + '</div></div>', '']);
    parts.push(['FAILURE', '이 탐구에서 자주 생기는 오류',
      '<div class="dd-warning">' + item.mistakes.map(function (x, i) {
        return '<div><b>0' + (i + 1) + '</b><p>' + esc(x) + '</p></div>';
      }).join('') + '</div>', '']);
    parts.push(['EXTENSION', '새로운 질문으로',
      '<div class="dd-extension">' + item.extensions.map(function (x) {
        return '<p>' + esc(x) + '</p>';
      }).join('') + '</div>', 'dd-warm']);
    parts.push(['OUTPUT', '보고서가 아니라 탐구의 증거를 남긴다',
      '<div class="dd-two-col"><div><h4>보고서 구조</h4>' + list(item.report) +
      '</div><div><h4>난이도 조절</h4><div class="dd-levels">' + item.levels.map(function (x) {
        return '<div><b>' + esc(x.label) + '</b><p>' + esc(x.text) + '</p></div>';
      }).join('') + '</div></div></div>', '']);

    return '<header class="dd-hero">' +
        '<div class="dd-hero-copy"><p class="dd-kicker">' + esc(item.badge) + '</p>' +
        '<h2 id="ddTitle">' + esc(item.title) + '</h2>' +
        '<p>' + esc(item.subtitle) + '</p></div>' + topicVisual(seed, item) +
        '<div class="dd-refined"><span>정교화된 질문</span><strong>' +
          esc(item.refinedQuestion) + '</strong></div>' +
        '<div class="dd-start"><span>지금 바로 할 첫 행동</span><p>' + esc(item.firstAction || item.plan[0]) + '</p>' +
          '<div><button type="button" data-dd-copy>탐구 설계 복사</button><button type="button" data-dd-print>인쇄하기</button></div></div>' +
      '</header>' +
      '<nav class="dd-journey" aria-label="깊이 탐구 차례" style="--dd-parts:' + parts.length + '">' +
        parts.map(function (x, i) {
          return '<button type="button" data-dd-jump="dd-part-' + (i + 1) + '"><b>' + (i + 1) + '</b><span>' + esc(x[0]) + '</span></button>';
        }).join('') + '</nav>' +
      parts.map(function (x, i) {
        var no = (i + 1 < 10 ? '0' : '') + (i + 1);
        return section('dd-part-' + (i + 1), no + ' · ' + x[0], x[1], x[2], x[3]);
      }).join('') +
      // 아직 실험실 페이지가 없는 과목도 있다. 없으면 없다고 적는다.
      '<footer class="dd-footer"><p>이제 설명을 읽는 데서 멈추지 말고 값을 움직여 확인하세요.</p>' +
        (item.asset && !item.generated
          ? '<a href="' + esc(item.asset.href) + '">' + esc(item.asset.label) + ' →</a>'
          : '<a href="inquiry.html?seed=' + encodeURIComponent(item.seedId || (seed && seed.id) || '') + '">이 씨앗으로 내 탐구 시작 →</a>') +
      '</footer>';
  }

  function copyPlan(item) {
    var text = [
      '[탐구 질문] ' + item.refinedQuestion,
      '', '[왜 탐구할까] ' + item.why,
      '', '[탐구 순서]', item.plan.map(function (x, i) { return (i + 1) + '. ' + x; }).join('\n'),
      '', '[확인할 것]', item.checks.map(function (x) { return '- ' + x; }).join('\n'),
      '', '[보고서 구조]', item.report.map(function (x) { return '- ' + x; }).join('\n')
    ].join('\n');
    function fallback() {
      var area = document.createElement('textarea'); area.value = text; document.body.appendChild(area);
      area.select(); document.execCommand('copy'); area.remove(); return Promise.resolve();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(fallback);
    }
    return fallback();
  }

  function experimentTemplate() {
    return '<div class="dd-lab" data-dd-lab>' +
      '<div class="dd-lab-stage">' +
        '<svg viewBox="0 0 320 220" role="img" aria-label="캐릭터 시야각과 적 위치 실험">' +
          '<circle class="dd-range" cx="86" cy="110" r="70"></circle>' +
          '<path class="dd-cone"></path>' +
          '<line class="dd-facing" x1="86" y1="110" x2="190" y2="110"></line>' +
          '<line class="dd-enemy-line" x1="86" y1="110" x2="180" y2="110"></line>' +
          '<circle class="dd-player" cx="86" cy="110" r="12"></circle>' +
          '<circle class="dd-enemy" cx="180" cy="110" r="10"></circle>' +
          '<text x="70" y="142">PLAYER</text><text class="dd-enemy-label" x="192" y="104">ENEMY</text>' +
        '</svg>' +
        '<div class="dd-verdict"><span>판정 결과</span><strong>—</strong><p>값을 바꾸어 보세요.</p></div>' +
      '</div>' +
      '<div class="dd-lab-controls">' +
        control('적의 방향각 θ', 'angle', -180, 180, 5, 55, '°') +
        control('전체 시야각 φ', 'fov', 30, 180, 10, 90, '°') +
        control('적까지의 거리', 'distance', 1, 12, 1, 6, '') +
        control('감지 가능 거리', 'range', 2, 12, 1, 8, '') +
        '<div class="dd-live-math"><span>h · e <b data-dot>—</b></span><span>경계값 <b data-threshold>—</b></span></div>' +
      '</div>' +
    '</div>';
  }

  function control(label, name, min, max, step, value, unit) {
    return '<label><span>' + esc(label) + '<output data-output="' + name + '">' + value + unit + '</output></span>' +
      '<input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '" data-control="' + name + '" data-unit="' + unit + '"></label>';
  }

  function setupExperiment(root) {
    var lab = root.querySelector('[data-dd-lab]');
    if (!lab) return;
    var inputs = {};
    lab.querySelectorAll('[data-control]').forEach(function (input) { inputs[input.dataset.control] = input; });

    function update() {
      var angle = Number(inputs.angle.value);
      var fov = Number(inputs.fov.value);
      var distance = Number(inputs.distance.value);
      var range = Number(inputs.range.value);
      var radians = angle * Math.PI / 180;
      var half = fov / 2 * Math.PI / 180;
      var dot = Math.cos(radians);
      var threshold = Math.cos(half);
      var anglePass = dot + 1e-9 >= threshold;
      var distancePass = distance <= range;
      var detected = anglePass && distancePass;
      var ox = 86, oy = 110, radius = Math.min(100, distance / 12 * 100);
      var ex = ox + Math.cos(radians) * radius;
      var ey = oy - Math.sin(radians) * radius;
      var coneR = 105;
      var p1x = ox + Math.cos(half) * coneR;
      var p1y = oy - Math.sin(half) * coneR;
      var p2x = ox + Math.cos(-half) * coneR;
      var p2y = oy - Math.sin(-half) * coneR;

      lab.querySelectorAll('[data-output]').forEach(function (output) {
        var input = inputs[output.dataset.output];
        output.textContent = input.value + input.dataset.unit;
      });
      lab.querySelector('[data-dot]').textContent = dot.toFixed(3);
      lab.querySelector('[data-threshold]').textContent = threshold.toFixed(3);
      lab.querySelector('.dd-cone').setAttribute('d', 'M ' + ox + ' ' + oy + ' L ' + p1x + ' ' + p1y + ' A ' + coneR + ' ' + coneR + ' 0 0 1 ' + p2x + ' ' + p2y + ' Z');
      lab.querySelector('.dd-range').setAttribute('r', String(range / 12 * 100));
      lab.querySelector('.dd-enemy').setAttribute('cx', String(ex));
      lab.querySelector('.dd-enemy').setAttribute('cy', String(ey));
      lab.querySelector('.dd-enemy-line').setAttribute('x2', String(ex));
      lab.querySelector('.dd-enemy-line').setAttribute('y2', String(ey));
      lab.querySelector('.dd-enemy-label').setAttribute('x', String(ex + 12));
      lab.querySelector('.dd-enemy-label').setAttribute('y', String(ey - 8));
      lab.classList.toggle('is-detected', detected);
      var verdict = lab.querySelector('.dd-verdict');
      verdict.querySelector('strong').textContent = detected ? '감지 성공' : '감지하지 못함';
      verdict.querySelector('p').textContent = !anglePass ? '시야각 경계 밖입니다.' : (!distancePass ? '감지 거리 밖입니다.' : '각도와 거리 조건을 모두 만족합니다.');
    }

    Object.keys(inputs).forEach(function (key) { inputs[key].addEventListener('input', update); });
    update();
  }

  function open(seedId, title) {
    ensureLayer();
    refreshSeeds();
    lastFocus = document.activeElement;
    var seed = seedMap[seedId];
    var item = catalog.items[seedId];
    if (!item && seed && window.JPDeepDiveGenerator) item = window.JPDeepDiveGenerator.build(seed);
    if (!item) return;
    if (!item.seedId) item.seedId = seedId;
    if (!item.subject && seed) item.subject = seed.subject;
    var content = layer.querySelector('.dd-content');
    content.innerHTML = sampleTemplate(item, seed || { title: title });
    layer.hidden = false;
    document.body.classList.add('dd-open');
    setupExperiment(content);
    content.querySelector('[data-dd-copy]').addEventListener('click', function (event) {
      copyPlan(item).then(function () {
        event.currentTarget.textContent = '복사됨 ✓';
      });
    });
    content.querySelector('[data-dd-print]').addEventListener('click', function () { window.print(); });
    content.querySelectorAll('[data-dd-jump]').forEach(function (button) {
      button.addEventListener('click', function () {
        var target = content.querySelector('#' + button.dataset.ddJump);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    layer.querySelector('.dd-close').focus();
  }

  function close() {
    if (!layer || layer.hidden) return;
    layer.hidden = true;
    document.body.classList.remove('dd-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function cardCta(seed) {
    return '<div class="sd-deep-entry is-sample">' +
      '<div><span>DEEP DIVE</span>' +
      '<p>질문을 첫 실험·자료·반례·보고서까지 발전시키는 전체 과정이다.</p></div>' +
      '<button type="button" data-deep-dive-open="' + esc(seed.id) + '" data-seed-title="' + esc(seed.title) + '">' +
        '깊이 탐구 열어보기 →</button></div>';
  }

  function registerProtectedItem(item) {
    if (!item || !item.seedId) return;
    catalog.items[item.seedId] = item;
    // 씨앗밭이 이 씨앗의 잠긴 표시를 다시 그릴 수 있게 알린다.
    document.dispatchEvent(new CustomEvent('jp-deep-dive-unlocked', {
      detail: { seedId: item.seedId }
    }));
  }

  // 이 씨앗의 Deep Dive 가 열려 있는가.
  function isOpen(seedId) {
    refreshSeeds();
    return !!seedMap[seedId];
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-deep-dive-open]');
    if (button) open(button.dataset.deepDiveOpen, button.dataset.seedTitle);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') close();
  });

  window.JPDeepDiveUI = {
    open: open,
    close: close,
    isOpen: isOpen,
    cardCta: cardCta,
    registerProtectedItem: registerProtectedItem
  };
}());
