/* 학생용 Deep Dive 화면과 잠금 어댑터.
   현재는 공개 표본 1개만 싣는다. 광고 연결 시 requestUnlock()만 교체하고,
   보호된 본문은 서버에서 받은 뒤 registerProtectedItem()으로 등록한다. */
(function () {
  'use strict';

  var catalog = window.JPDeepDives || { items: {}, sampleId: '' };
  var layer = null;
  var lastFocus = null;

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

  function lockedTemplate(seedId, title) {
    return '<div class="dd-locked-view">' +
      '<p class="dd-kicker">STUDENT DEEP DIVE</p>' +
      '<div class="dd-lock-symbol" aria-hidden="true">↗</div>' +
      '<h2 id="ddTitle">' + esc(title || '깊이 탐구') + '</h2>' +
      '<p class="dd-lead">씨앗을 실제 탐구로 발전시키는 확장 자료입니다. 광고 연결 전이라 지금은 구조만 준비되어 있습니다.</p>' +
      '<div class="dd-locked-grid">' +
        ['질문 정교화', '핵심 수학', '직접 실험', '데이터·그래프', '검증·반례', '보고서 구조'].map(function (x) {
          return '<span>' + x + '</span>';
        }).join('') +
      '</div>' +
      '<p class="dd-status"><b>다음 연결</b> 광고 1회 시청 → ' + esc(seedId) + ' 영구 해금</p>' +
      '<button type="button" class="dd-disabled" disabled>보상형 광고 준비 중</button>' +
      '<p class="dd-fine">기본 주제 탐색은 계속 무료입니다. 광고가 준비되기 전에는 학습 내용을 광고로 막지 않습니다.</p>' +
    '</div>';
  }

  function section(label, title, body, extra) {
    return '<section class="dd-section' + (extra ? ' ' + extra : '') + '">' +
      '<p class="dd-section-label">' + esc(label) + '</p>' +
      '<h3>' + esc(title) + '</h3>' + body + '</section>';
  }

  function sampleTemplate(item) {
    var table = '<div class="dd-table-wrap"><table><thead><tr>' + item.dataColumns.map(function (x) {
      return '<th>' + esc(x) + '</th>';
    }).join('') + '</tr></thead><tbody>' + item.dataRows.map(function (row) {
      return '<tr>' + row.map(function (x) { return '<td>' + esc(x) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody></table></div>';

    return '<header class="dd-hero">' +
        '<p class="dd-kicker">' + esc(item.badge) + '</p>' +
        '<h2 id="ddTitle">' + esc(item.title) + '</h2>' +
        '<p>' + esc(item.subtitle) + '</p>' +
        '<div class="dd-refined"><span>정교화된 질문</span><strong>' + esc(item.refinedQuestion) + '</strong></div>' +
      '</header>' +
      section('01 · QUESTION', '질문을 좁히고 다시 연다',
        '<p class="dd-copy">' + esc(item.why) + '</p><div class="dd-question-ladder">' + item.questionLadder.map(function (q) {
          return '<div><span>' + esc(q.label) + '</span><p>' + esc(q.text) + '</p></div>';
        }).join('') + '</div>') +
      section('02 · CORE MATH', '눈으로 하던 판단을 수식으로',
        '<div class="dd-formula"><strong>' + esc(item.coreMath.formula) + '</strong>' +
          '<span>' + esc(item.coreMath.normalized) + '</span><b>' + esc(item.coreMath.rule) + '</b></div>' +
        '<p class="dd-copy">' + esc(item.coreMath.note) + '</p>', 'dd-dark') +
      section('03 · LIVE EXPERIMENT', '각도와 거리를 움직여 판정을 깨뜨려 보자', experimentTemplate()) +
      section('04 · PLAN', '탐구 순서', list(item.plan, 'dd-steps')) +
      section('05 · VARIABLES', '무엇을 바꾸고 무엇을 기록할까', chips(item.variables)) +
      section('06 · DATA', '데이터와 그래프 계획', table + '<div class="dd-two-col"><div><h4>그래프로 볼 것</h4>' +
        list(item.graphIdeas) + '</div><div><h4>반드시 시험할 반례</h4>' + list(item.checks) + '</div></div>') +
      section('07 · FAILURE', '이 탐구에서 자주 생기는 오류',
        '<div class="dd-warning">' + item.mistakes.map(function (x, i) {
          return '<div><b>0' + (i + 1) + '</b><p>' + esc(x) + '</p></div>';
        }).join('') + '</div>') +
      section('08 · EXTENSION', '새로운 질문으로',
        '<div class="dd-extension">' + item.extensions.map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('') + '</div>', 'dd-warm') +
      section('09 · OUTPUT', '보고서가 아니라 탐구의 증거를 남긴다',
        '<div class="dd-two-col"><div><h4>보고서 구조</h4>' + list(item.report) + '</div><div><h4>난이도 조절</h4>' +
          '<div class="dd-levels">' + item.levels.map(function (x) {
            return '<div><b>' + esc(x.label) + '</b><p>' + esc(x.text) + '</p></div>';
          }).join('') + '</div></div></div>') +
      '<footer class="dd-footer"><p>이제 설명을 읽는 데서 멈추지 말고 값을 움직여 확인하세요.</p>' +
        '<a href="' + esc(item.asset.href) + '">' + esc(item.asset.label) + ' →</a></footer>';
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
    lastFocus = document.activeElement;
    var item = catalog.items[seedId];
    var content = layer.querySelector('.dd-content');
    content.innerHTML = item ? sampleTemplate(item) : lockedTemplate(seedId, title);
    layer.hidden = false;
    document.body.classList.add('dd-open');
    setupExperiment(content);
    layer.querySelector('.dd-close').focus();
  }

  function close() {
    if (!layer || layer.hidden) return;
    layer.hidden = true;
    document.body.classList.remove('dd-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function cardCta(seed) {
    var sample = !!catalog.items[seed.id];
    return '<div class="sd-deep-entry' + (sample ? ' is-sample' : '') + '">' +
      '<div><span>' + (sample ? '표본 공개' : 'DEEP DIVE · 잠금') + '</span>' +
      '<p>' + (sample ? '질문을 실험과 보고서까지 발전시키는 전체 과정을 확인하세요.' : '실험·데이터·반례·보고서 구조가 잠금 해제 뒤 열립니다.') + '</p></div>' +
      '<button type="button" data-deep-dive-open="' + esc(seed.id) + '" data-seed-title="' + esc(seed.title) + '">' +
        (sample ? '깊이 탐구 열어보기 →' : '잠금 내용 미리보기 ↗') + '</button></div>';
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
    return !!catalog.items[seedId];
  }

  // 광고 어댑터가 나중에 교체할 자리. 지금은 어떤 콘텐츠도 가짜로 해금하지 않는다.
  function requestUnlock() {
    return Promise.resolve({ ok: false, reason: 'rewarded-ad-not-connected' });
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
    requestUnlock: requestUnlock,
    registerProtectedItem: registerProtectedItem
  };
}());
