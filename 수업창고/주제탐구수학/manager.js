(function () {
  'use strict';

  var DATA_URL = '../../주제탐구/data/inquiries.json';
  var SHEET_URL = 'https://docs.google.com/spreadsheets/d/1shQ8CxS3nEO9wM6OT6-9DLgPilNtIaH0vsYPE21hscg/edit';
  var state = { inquiries: [], selectedId: null, promptMode: 'balanced', subject: 'all', query: '' };
  var subjectLabels = { 'calculus-1': '미적분Ⅰ', geometry: '기하', 'mathematical-inquiry': '통합·이론' };

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === 'string') node.textContent = text;
    return node;
  }

  function subjectLabel(item) { return subjectLabels[item.subject] || item.subject; }

  function promptSet(item, mode) {
    var text = [item.title, item.question, item.explorationPlan, (item.concepts || []).join(' ')].join(' ');
    var conceptPrompts = [
      '이 질문에서 반드시 먼저 정의해야 할 용어와 조건은 무엇인가?',
      '이 질문을 한 문장의 검증 가능한 질문으로 바꾼다면 어떤 조건과 대상을 넣어야 할까?',
      '현재 알고 있는 정의·정리·성질 가운데 이 질문의 출발점이 되는 것은 무엇인가?'
    ];
    var topicPrompts = [];

    if (/리만|구분구적|정적분|넓이/.test(text)) {
      topicPrompts.push('왼쪽 끝점·오른쪽 끝점·중점을 사용할 때 근삿값은 어떻게 달라질까? 함수가 증가하거나 감소하면 예상도 달라지는가?');
      topicPrompts.push('분할 수를 늘렸을 때 “더 정확해진다”를 어떤 오차값이나 그래프로 증명할 수 있을까?');
    } else if (/합성함수/.test(text)) {
      topicPrompts.push('합성함수의 극값 후보를 안쪽 함수와 바깥 함수의 변화로 나누어 설명할 수 있을까?');
      topicPrompts.push('안쪽 함수의 극점이 합성함수에서는 극점이 되지 않는 반례를 만들 수 있을까?');
    } else if (/이차곡선|원뿔|포물선|타원|쌍곡선|접선/.test(text)) {
      topicPrompts.push('움직이는 조건과 움직여도 변하지 않는 조건을 각각 하나씩 말할 수 있을까?');
      topicPrompts.push('그림에서 본 관계를 거리·기울기·방정식 가운데 어떤 언어로 설명하고 검증할 수 있을까?');
    } else if (/연속|극한/.test(text)) {
      topicPrompts.push('함숫값의 존재, 극한값의 존재, 두 값의 일치를 각각 따로 깨뜨리는 예를 만들 수 있을까?');
      topicPrompts.push('그래프가 이어져 보이는 것과 연속의 정의가 다른 사례를 수식으로 설명할 수 있을까?');
    } else if (/도함수|원함수 추리|증가와 감소/.test(text)) {
      topicPrompts.push('도함수의 부호와 영점만으로 확정할 수 있는 정보와 확정할 수 없는 정보는 무엇인가?');
      topicPrompts.push('서로 다른 두 원함수가 같은 단서를 갖는 예를 만들 수 있을까?');
    } else if (/평균값/.test(text)) {
      topicPrompts.push('평균값정리의 조건 가운데 하나를 빼면 결론이 깨지는 예를 만들 수 있을까?');
      topicPrompts.push('정리를 만족하는 점이 하나가 아니라 여러 개인 함수와 구간을 찾을 수 있을까?');
    } else if (/최적|최선/.test(text)) {
      topicPrompts.push('목적함수와 제약조건을 각각 무엇으로 정할 것이며, 그 선택이 현실을 어떻게 단순화하는가?');
      topicPrompts.push('최댓값이나 최솟값이 구간의 안쪽이 아니라 경계에서 생기는 경우도 확인했는가?');
    } else {
      topicPrompts.push('조건 하나만 바꾸었을 때 결과가 어떻게 달라지는지 비교할 수 있을까?');
      topicPrompts.push('현재 생각이 틀렸음을 보여 줄 수 있는 반례나 경계값은 무엇인가?');
    }

    var verificationPrompts = [
      '실험하거나 계산하기 전에 결과를 먼저 예상한다면 어떻게 될까? 그렇게 생각한 근거는 무엇인가?',
      '현재 생각이 틀렸음을 보여 줄 수 있는 반례·경계값·극단값은 무엇인가?',
      '웹앱에서 사용자가 바꾸는 값, 화면에 보이는 결과, 반드시 확인할 검증값을 각각 무엇으로 정할까?'
    ];
    var extensionPrompts = [
      '조건 하나를 바꾸어도 유지되는 관계와 깨지는 관계는 각각 무엇인가?',
      '이 탐구를 다른 수학 개념과 연결한다면 어떤 연결이 실제 설명에 도움이 되는가?',
      '이번 탐구의 발견에서 새롭게 생길 수 있는 다음 질문은 무엇인가?'
    ];

    if (mode === 'concept') return conceptPrompts.concat(topicPrompts, verificationPrompts[0]).slice(0, 6);
    if (mode === 'verify') return topicPrompts.concat(verificationPrompts, conceptPrompts[0]).slice(0, 6);
    if (mode === 'extend') return extensionPrompts.concat(topicPrompts, verificationPrompts[1]).slice(0, 6);
    return [conceptPrompts[0], verificationPrompts[0]].concat(topicPrompts, verificationPrompts[2], extensionPrompts[2]).slice(0, 6);
  }

  function updateMetrics() {
    var students = {};
    var published = 0;
    state.inquiries.forEach(function (item) {
      students[item.studentId] = true;
      if (item.visibility === 'public' || item.visibility === 'published') published += 1;
    });
    document.getElementById('metricDraftStudents').textContent = Object.keys(students).length;
    document.getElementById('metricInquiries').textContent = state.inquiries.length;
    document.getElementById('metricPublished').textContent = published;
  }

  function filteredInquiries() {
    var query = state.query.toLowerCase();
    return state.inquiries.filter(function (item) {
      if (state.subject !== 'all' && item.subject !== state.subject) return false;
      if (!query) return true;
      return [item.displayName, item.title, item.question, (item.concepts || []).join(' ')].join(' ').toLowerCase().indexOf(query) !== -1;
    });
  }

  function renderList() {
    var items = filteredInquiries();
    var list = document.getElementById('inquiryList');
    document.getElementById('resultCount').textContent = items.length + '개 탐구';
    list.textContent = '';

    if (!items.length) {
      list.appendChild(element('p', 'list-empty', '조건에 맞는 탐구가 없습니다.\n검색어 또는 과목을 바꿔 보세요.'));
      return;
    }

    items.forEach(function (item) {
      var button = element('button', 'inquiry-button');
      button.type = 'button';
      button.classList.toggle('is-active', state.selectedId === item.id);
      var number = String(parseInt((item.studentId || '').replace(/\D/g, ''), 10) || 0).padStart(2, '0');
      button.appendChild(element('span', 'student-avatar', number));
      var copy = element('span', 'inquiry-copy');
      copy.appendChild(element('span', '', subjectLabel(item) + ' · ' + item.displayName));
      copy.appendChild(element('strong', '', item.title));
      copy.appendChild(element('small', '', item.curriculumMapping === 'complete' ? '성취기준 확정' : '교사 검토용 초안'));
      button.appendChild(copy);
      button.appendChild(element('span', 'inquiry-arrow', '›'));
      button.addEventListener('click', function () {
        state.selectedId = item.id;
        renderList();
        renderCurator(item);
      });
      list.appendChild(button);
    });
  }

  function addSummary(panel, title, text, privateData) {
    var card = element('div', 'summary-card' + (privateData ? ' is-private' : ''));
    card.appendChild(element('strong', '', title));
    card.appendChild(element('p', '', text));
    panel.appendChild(card);
  }

  function slideSteps(item) {
    return [
      { number: '01', label: '수학의 출발', ready: Boolean(item.title) },
      { number: '02', label: '탐구 질문', ready: Boolean(item.question) },
      { number: '03', label: '예상·계획', ready: Boolean(item.explorationPlan) },
      { number: '04', label: '탐구·실험', ready: item.status === 'exploring' || item.status === 'complete' },
      { number: '05', label: '실패·수정', ready: item.status === 'revising' || item.status === 'complete' },
      { number: '06', label: '발견·연결', ready: item.status === 'complete' },
      { number: '07', label: '성찰·새 질문', ready: item.visibility === 'public' || item.visibility === 'published' }
    ];
  }

  function renderCurator(item) {
    var panel = document.getElementById('curatorPanel');
    panel.textContent = '';

    var top = element('div', 'curator-topline');
    top.appendChild(element('span', 'status-badge', '교사 검토용 초안'));
    top.appendChild(element('span', 'detail-tag', subjectLabel(item)));
    top.appendChild(element('span', 'detail-tag', item.displayName));
    top.appendChild(element('span', 'curator-updated', '최근 반영 ' + (item.updatedAt || '—')));
    panel.appendChild(top);
    panel.appendChild(element('h2', 'curator-title', item.title));
    panel.appendChild(element('p', 'curator-question', '“' + item.question + '”'));

    var summary = element('div', 'curator-summary');
    addSummary(summary, '학생 원문', 'Google Sheet의 기초응답이 연결되면 관심 개념·궁금한 점·선정 이유를 원문 그대로 표시합니다.', true);
    addSummary(summary, '현재 가공 초안', item.explorationPlan || '아직 탐구 계획이 입력되지 않았습니다.', false);
    panel.appendChild(summary);

    var mapping = element('section', 'curator-section');
    var mappingLabel = element('div', 'section-label');
    mappingLabel.appendChild(element('h3', '', '성취기준과 핵심 개념'));
    mappingLabel.appendChild(element('small', '', item.curriculumMapping === 'complete' ? '확정' : '원문 대조 필요'));
    mapping.appendChild(mappingLabel);
    var mappingBox = element('div', 'mapping-box');
    (item.curriculumStandards || []).forEach(function (standard) { mappingBox.appendChild(element('span', '', standard)); });
    (item.concepts || []).forEach(function (concept) { mappingBox.appendChild(element('span', '', concept)); });
    if (!mappingBox.children.length) mappingBox.appendChild(element('span', '', '매핑 대기'));
    mapping.appendChild(mappingBox);
    if (item.curriculumMapping !== 'complete') mapping.appendChild(element('p', 'mapping-warning', '현재 값은 기존 자료 기반 초안입니다. 2022 개정 교육과정 원문 대조 후 확정합니다.'));
    panel.appendChild(mapping);

    var promptSection = element('section', 'curator-section');
    var promptLabel = element('div', 'section-label');
    promptLabel.appendChild(element('h3', '', '학생에게 보낼 다음 발문'));
    promptLabel.appendChild(element('small', '', '승인 전 학생에게 보이지 않음'));
    promptSection.appendChild(promptLabel);
    var engine = element('div', 'prompt-engine');
    var engineHead = element('div', 'engine-head');
    engineHead.appendChild(element('span', 'live-dot'));
    engineHead.appendChild(element('strong', '', '발문 가공 도우미'));
    engineHead.appendChild(element('small', '', '주제·질문·개념 기반'));
    engine.appendChild(engineHead);
    var modes = element('div', 'prompt-modes');
    [['balanced', '균형'], ['concept', '개념 정교화'], ['verify', '검증·반례'], ['extend', '확장·연결']].forEach(function (mode) {
      var button = element('button', state.promptMode === mode[0] ? 'is-active' : '', mode[1]);
      button.type = 'button';
      button.addEventListener('click', function () { state.promptMode = mode[0]; renderCurator(item); });
      modes.appendChild(button);
    });
    engine.appendChild(modes);
    promptSection.appendChild(engine);
    var prompts = promptSet(item, state.promptMode);
    var promptList = element('ol', 'prompt-list');
    prompts.forEach(function (prompt) { promptList.appendChild(element('li', '', prompt)); });
    promptSection.appendChild(promptList);
    var copyPrompts = element('button', 'copy-prompts', '발문 전체 복사');
    copyPrompts.type = 'button';
    copyPrompts.addEventListener('click', function () {
      copyText('[' + item.displayName + ' · ' + item.title + ']\n\n' + prompts.map(function (prompt, index) { return (index + 1) + '. ' + prompt; }).join('\n'), copyPrompts, '복사됨');
    });
    promptSection.appendChild(copyPrompts);
    panel.appendChild(promptSection);

    var slides = element('section', 'curator-section');
    var slideLabel = element('div', 'section-label');
    slideLabel.appendChild(element('h3', '', '학생 전시 슬라이드 진행도'));
    var steps = slideSteps(item);
    slideLabel.appendChild(element('small', '', steps.filter(function (step) { return step.ready; }).length + ' / 7 블록 준비'));
    slides.appendChild(slideLabel);
    var slideTrack = element('div', 'slide-track');
    steps.forEach(function (step) {
      var node = element('div', 'slide-step' + (step.ready ? ' is-ready' : ''));
      node.appendChild(element('span', '', step.number));
      node.appendChild(element('strong', '', step.label));
      slideTrack.appendChild(node);
    });
    slides.appendChild(slideTrack);
    panel.appendChild(slides);

    var actions = element('div', 'curator-actions');
    var sheetButton = element('button', 'action-review', 'Google Sheet 원문 확인 ↗');
    sheetButton.type = 'button';
    sheetButton.addEventListener('click', function () { window.open(SHEET_URL, '_blank', 'noopener'); });
    actions.appendChild(sheetButton);
    var copySummary = element('button', 'action-copy', '현재 초안 복사');
    copySummary.type = 'button';
    copySummary.addEventListener('click', function () {
      copyText(item.displayName + ' · ' + subjectLabel(item) + '\n' + item.title + '\n' + item.question + '\n\n' + item.explorationPlan, copySummary, '복사됨');
    });
    actions.appendChild(copySummary);
    var publish = element('button', 'action-publish', '전시 반영 · 승인 연결 후');
    publish.type = 'button';
    publish.disabled = true;
    actions.appendChild(publish);
    panel.appendChild(actions);
  }

  function copyText(text, button, doneText) {
    var original = button.textContent;
    function done() { button.textContent = doneText; window.setTimeout(function () { button.textContent = original; }, 1400); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    else fallbackCopy(text, done);
  }

  function fallbackCopy(text, done) {
    var area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); done(); } catch (error) { window.alert(text); }
    document.body.removeChild(area);
  }

  function bindControls() {
    document.getElementById('studentSearch').addEventListener('input', function () { state.query = this.value.trim(); renderList(); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-subject]'), function (button) {
      button.addEventListener('click', function () {
        state.subject = this.getAttribute('data-subject');
        Array.prototype.forEach.call(document.querySelectorAll('[data-subject]'), function (node) { node.classList.toggle('is-active', node === button); });
        renderList();
      });
    });
    document.getElementById('copyHandoff').addEventListener('click', function () {
      copyText(document.getElementById('handoffText').textContent, this, '복사됨');
    });
  }

  function init() {
    bindControls();
    fetch(DATA_URL, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('탐구 초안 데이터를 불러오지 못했습니다.');
      return response.json();
    }).then(function (data) {
      state.inquiries = data.inquiries || [];
      updateMetrics();
      if (state.inquiries.length) state.selectedId = state.inquiries[0].id;
      renderList();
      if (state.inquiries.length) renderCurator(state.inquiries[0]);
    }).catch(function (error) {
      document.getElementById('inquiryList').appendChild(element('p', 'list-empty', error.message));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
