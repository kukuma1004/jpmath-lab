(function () {
  'use strict';

  var PUBLIC_DATA_URL = '../../주제탐구/data/inquiries.json';
  var PRIVATE_DATA_URL = '../../주제탐구/data-private/inquiries.local.json';
  var SHEET_URL = 'https://docs.google.com/spreadsheets/d/1shQ8CxS3nEO9wM6OT6-9DLgPilNtIaH0vsYPE21hscg/edit';
  var state = { inquiries: [], selectedId: null, promptMode: 'balanced', subject: 'all', query: '', dataSource: '' };
  var subjectLabels = { 'calculus-1': '미적분Ⅰ', geometry: '기하', economics: '경제수학', 'economic-math': '경제수학', 'subject-review': '과목 확인 필요', 'mathematical-inquiry': '통합·이론' };

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === 'string') node.textContent = text;
    return node;
  }

  function isLocalView() {
    return location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(location.hostname);
  }

  function loadInquiryData() {
    var sources = isLocalView()
      ? [{ url: PRIVATE_DATA_URL, kind: 'private-local' }, { url: PUBLIC_DATA_URL, kind: 'public-approved' }]
      : [{ url: PUBLIC_DATA_URL, kind: 'secure-public' }];
    function attempt(index) {
      return fetch(sources[index].url, { cache: 'no-store' }).then(function (response) {
        if (!response.ok) throw new Error('not-found');
        return response.json();
      }).then(function (data) {
        return { data: data, source: sources[index].kind };
      }).catch(function () {
        if (index + 1 < sources.length) return attempt(index + 1);
        throw new Error('탐구 초안 데이터를 불러오지 못했습니다.');
      });
    }
    return attempt(0);
  }

  function updateConnectionStatus(source, count) {
    var card = document.querySelector('[data-connection-card]');
    var title = document.getElementById('connectionTitle');
    var badge = document.getElementById('connectionBadge');
    var description = document.getElementById('connectionDescription');
    var note = document.getElementById('connectionNote');
    if (!card) return;
    card.setAttribute('aria-busy', 'false');
    card.setAttribute('data-data-mode', source || 'error');

    if (source === 'error') {
      title.textContent = '자료 연결을 확인해 주세요';
      badge.textContent = 'CHECK';
      description.textContent = '탐구 자료를 읽는 중 문제가 발생했습니다.';
      note.textContent = '로컬 파일 또는 네트워크 연결 확인 필요';
      return;
    }

    if (source === 'private-local') {
      title.textContent = '로컬 전용 탐구 자료 연결됨';
      badge.textContent = 'LOCAL';
      description.textContent = '학생별 초안 ' + count + '개를 이 컴퓨터의 비공개 자료에서 불러왔습니다.';
      note.textContent = '학생 원문 보존 → 교사 검토 → 공개 승인';
      return;
    }
    if (source === 'secure-public') {
      title.textContent = '학생 자료 비공개 모드';
      badge.textContent = 'SAFE';
      description.textContent = '공개 배포본에는 실제 학생 명단·원문·학생코드를 저장하지 않습니다.';
      note.textContent = '학생 자료는 로컬 또는 비공개 Google Sheet에서 확인';
      return;
    }
    title.textContent = '교사 승인 전시 자료 연결됨';
    badge.textContent = 'PUBLIC';
    description.textContent = '교사가 공개 승인한 탐구 ' + count + '개만 표시합니다.';
    note.textContent = '승인 데이터만 공개 전시에 반영';
  }

  function subjectLabel(item) { return subjectLabels[item.subject] || item.subject; }

  function needsSubjectReview(item) {
    if (item.needsSubjectReview || item.subjectReview === 'required' || item.subject === 'subject-review') return true;
    var subject = subjectLabel(item);
    if (['미적분Ⅰ', '기하', '경제수학', '통합·이론'].indexOf(subject) === -1) return true;
    var text = [item.title, item.question, item.explorationPlan, (item.concepts || []).join(' ')].join(' ').toLowerCase();
    var groups = {
      '미적분Ⅰ': ['극한', '미분', '적분', '도함수', '변화율', '연속', '극값', '리만'],
      '기하': ['벡터', '공간', '평면', '원뿔', '이차곡선', '포물선', '타원', '쌍곡선', '내적', '정사영'],
      '경제수학': ['경제', '금리', '환율', '물가', '수요', '공급', '금융', '자산', '투자', '대출', '보험', '주식', '채권']
    };
    if (!groups[subject]) return false;
    var scores = {};
    Object.keys(groups).forEach(function (name) {
      scores[name] = groups[name].filter(function (word) { return text.indexOf(word) !== -1; }).length;
    });
    var strongest = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; })[0];
    return strongest !== subject && scores[strongest] >= 2 && scores[strongest] >= scores[subject] + 2;
  }

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
      if (state.subject === 'subject-review' && !needsSubjectReview(item)) return false;
      if (state.subject !== 'all' && state.subject !== 'subject-review' && item.subject !== state.subject) return false;
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
      if (needsSubjectReview(item)) button.classList.add('needs-subject-review');
      button.type = 'button';
      button.classList.toggle('is-active', state.selectedId === item.id);
      button.setAttribute('aria-pressed', state.selectedId === item.id ? 'true' : 'false');
      var number = String(parseInt((item.studentId || '').replace(/\D/g, ''), 10) || 0).padStart(2, '0');
      button.appendChild(element('span', 'student-avatar', number));
      var copy = element('span', 'inquiry-copy');
      copy.appendChild(element('span', '', subjectLabel(item) + ' · ' + item.displayName));
      copy.appendChild(element('strong', '', item.title));
      copy.appendChild(element('small', '', needsSubjectReview(item) ? '과목 확인 필요 · 먼저 검토' : (item.curriculumMapping === 'complete' ? '성취기준 확정' : '교사 검토용 초안')));
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

  function renderSecureEmptyState() {
    var list = document.getElementById('inquiryList');
    var panel = document.getElementById('curatorPanel');
    list.textContent = '';
    var listState = element('div', 'list-empty secure-list-empty');
    var localMissing = isLocalView() && state.dataSource === 'public-approved';
    listState.appendChild(element('strong', '', localMissing ? '로컬 전용 자료를 찾지 못했습니다.' : '학생 자료를 배포하지 않았습니다.'));
    listState.appendChild(element('span', '', localMissing
      ? 'data-private/inquiries.local.json을 연결하면 학생별 초안이 이 목록에 나타납니다.'
      : '이 화면은 정상입니다. 로컬 전용 자료 또는 비공개 Google Sheet에서 학생별 응답을 확인합니다.'));
    list.appendChild(listState);

    panel.textContent = '';
    var empty = element('div', 'empty-state secure-empty');
    empty.appendChild(element('span', '', '✓'));
    empty.appendChild(element('strong', '', localMissing ? '로컬 자료 연결 대기' : '공개 저장소 안전 모드'));
    empty.appendChild(element('p', '', localMissing
      ? '현재는 공개 승인 데이터만 확인됩니다. 로컬 전용 JSON을 준비하면 학생 원문을 공개하지 않고 이 운영실에서 검토할 수 있습니다.'
      : '실제 학생 명단, 학생코드, 원문 응답은 GitHub에 올리지 않았습니다. 이 컴퓨터에서 로컬 서버로 열면 비공개 탐구 초안을 확인할 수 있습니다.'));
    var actions = element('div', 'secure-empty-actions');
    var sheet = element('a', '', '비공개 Google Sheet 열기 ↗');
    sheet.href = SHEET_URL;
    sheet.target = '_blank';
    sheet.rel = 'noopener';
    actions.appendChild(sheet);
    var guide = element('a', '', '자료 흐름 다시 보기 ↑');
    guide.href = '#processTitle';
    actions.appendChild(guide);
    empty.appendChild(actions);
    panel.appendChild(empty);
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

  // ── 교사 큐레이션 ────────────────────────────────────────────────────
  // 시트에서 내보낸 JSON은 제목·성취기준·핵심개념이 비어 있다.
  // 학생이 쓰지 않는 값이라 교사가 읽고 정해야 하고, 그 자리가 여기다.
  // 정적 페이지라 파일에 바로 쓸 수 없으므로 편집분은 브라우저에 보관했다가
  // "완성 JSON 내려받기"로 한 번에 파일로 만든다.
  var CURATION_KEY = 'jp-inquiry-curation-v1';

  function loadCuration() {
    try { return JSON.parse(localStorage.getItem(CURATION_KEY) || '{}'); }
    catch (error) { return {}; }
  }

  function saveCuration(map) {
    try { localStorage.setItem(CURATION_KEY, JSON.stringify(map)); }
    catch (error) { /* 저장이 막힌 브라우저에서도 편집 자체는 계속된다 */ }
  }

  // 저장해 둔 편집분을 원본 위에 얹는다
  function applyCuration(list) {
    var saved = loadCuration();
    list.forEach(function (item) {
      var patch = saved[item.id];
      if (!patch) return;
      if (patch.title != null) item.title = patch.title;
      if (patch.curriculumStandards) item.curriculumStandards = patch.curriculumStandards;
      if (patch.concepts) item.concepts = patch.concepts;
      if (patch.curriculumMapping) item.curriculumMapping = patch.curriculumMapping;
    });
    return list;
  }

  function recordCuration(item, field, value) {
    var saved = loadCuration();
    var patch = saved[item.id] || (saved[item.id] = {});
    patch[field] = value;
    item[field] = value;
    saveCuration(saved);
  }

  // 쉼표와 줄바꿈만 구분자로 쓴다. 가운뎃점은 '극대·극소'처럼 개념 이름 안에 들어간다.
  var splitTags = function (text) {
    return String(text || '').split(/[,\n]/).map(function (x) { return x.trim(); })
      .filter(function (x) { return x.length; });
  };

  function curationRow(parent, label, hint, value, onChange) {
    var row = element('div', 'curation-row');
    var head = element('label', 'curation-label');
    head.appendChild(element('span', '', label));
    if (hint) head.appendChild(element('small', '', hint));
    row.appendChild(head);
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'curation-input';
    input.value = value || '';
    input.placeholder = hint || '';
    input.addEventListener('change', function () { onChange(this.value); });
    head.setAttribute('for', input.id = 'cur-' + Math.random().toString(36).slice(2, 8));
    row.appendChild(input);
    parent.appendChild(row);
    return input;
  }

  function renderCuration(panel, item) {
    var section = element('section', 'curator-section curation-block');
    var label = element('div', 'section-label');
    label.appendChild(element('h3', '', '교사가 정하는 값'));
    label.appendChild(element('small', '', '학생이 쓰지 않는 항목입니다'));
    section.appendChild(label);

    curationRow(section, '탐구 제목', '예: 합성함수의 극값 탐구', item.title,
      function (v) { recordCuration(item, 'title', v.trim()); renderList(); renderCurator(item); });
    curationRow(section, '성취기준', '쉼표로 구분 · 예: 12미적Ⅰ02-07', (item.curriculumStandards || []).join(', '),
      function (v) { recordCuration(item, 'curriculumStandards', splitTags(v)); renderCurator(item); });
    curationRow(section, '핵심 개념', '쉼표로 구분 · 예: 합성함수, 극대·극소', (item.concepts || []).join(', '),
      function (v) { recordCuration(item, 'concepts', splitTags(v)); renderCurator(item); });

    var stateRow = element('div', 'curation-row');
    var stateLabel = element('label', 'curation-label');
    stateLabel.appendChild(element('span', '', '매핑 상태'));
    stateRow.appendChild(stateLabel);
    var select = document.createElement('select');
    select.className = 'curation-input';
    [['draft', '초안'], ['review', '원문 대조 중'], ['complete', '확정']].forEach(function (pair) {
      var option = document.createElement('option');
      option.value = pair[0]; option.textContent = pair[1];
      if ((item.curriculumMapping || 'draft') === pair[0]) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener('change', function () {
      recordCuration(item, 'curriculumMapping', this.value); renderCurator(item);
    });
    stateLabel.setAttribute('for', select.id = 'cur-map-' + item.id);
    stateRow.appendChild(select);
    section.appendChild(stateRow);

    panel.appendChild(section);
  }

  // 편집분을 얹은 완성본을 파일로 내려받는다
  function downloadCurated() {
    var payload = {
      schemaVersion: '1.0',
      project: {
        title: '2026 수학 주제탐구 프로젝트',
        updatedAt: new Date().toISOString().slice(0, 10),
        notice: '운영실에서 제목·성취기준·핵심개념을 채운 실명 초안입니다. 공개 저장소에 올리지 않습니다.'
      },
      inquiries: state.inquiries
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'inquiries.local.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function curationProgress() {
    var done = state.inquiries.filter(function (item) {
      return item.title && (item.curriculumStandards || []).length;
    }).length;
    return { done: done, total: state.inquiries.length };
  }

  function renderCurator(item) {
    var panel = document.getElementById('curatorPanel');
    panel.textContent = '';

    var top = element('div', 'curator-topline');
    top.appendChild(element('span', 'status-badge', '교사 검토용 초안'));
    top.appendChild(element('span', 'detail-tag', subjectLabel(item)));
    top.appendChild(element('span', 'detail-tag', item.displayName));
    if (needsSubjectReview(item)) top.appendChild(element('span', 'status-badge subject-alert', '과목 확인 필요'));
    top.appendChild(element('span', 'curator-updated', '최근 반영 ' + (item.updatedAt || '—')));
    panel.appendChild(top);
    panel.appendChild(element('h2', 'curator-title', item.title));
    panel.appendChild(element('p', 'curator-question', '“' + item.question + '”'));

    if (needsSubjectReview(item)) {
      var subjectWarning = element('div', 'subject-warning');
      subjectWarning.appendChild(element('strong', '', '이 탐구는 과목을 먼저 확인해야 합니다.'));
      subjectWarning.appendChild(element('p', '', '선택 과목과 질문의 수학 내용이 어긋날 수 있습니다. 실시간 교사용 페이지에서 과목을 바로잡아 승인하거나, 보완 필요·반려로 학생에게 돌려보내세요.'));
      panel.appendChild(subjectWarning);
    }

    var summary = element('div', 'curator-summary');
    var raw = [item.studentConcept && ('관심 개념 · ' + item.studentConcept),
               item.studentReason && ('선정 이유 · ' + item.studentReason)]
      .filter(Boolean).join(String.fromCharCode(10));
    addSummary(summary, '학생 원문', raw || 'Google Sheet에서 내보낸 JSON을 연결하면 관심 개념·선정 이유가 원문 그대로 표시됩니다.', true);
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
    renderCuration(panel, item);

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
      button.setAttribute('aria-pressed', state.promptMode === mode[0] ? 'true' : 'false');
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
    function done() {
      button.textContent = doneText;
      document.dispatchEvent(new CustomEvent('jp:feedback', { detail: { type: 'success', message: '클립보드에 복사했습니다.' } }));
      window.setTimeout(function () { button.textContent = original; }, 1400);
    }
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
      button.setAttribute('aria-pressed', button.classList.contains('is-active') ? 'true' : 'false');
      button.addEventListener('click', function () {
        state.subject = this.getAttribute('data-subject');
        Array.prototype.forEach.call(document.querySelectorAll('[data-subject]'), function (node) {
          var active = node === button;
          node.classList.toggle('is-active', active);
          node.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        renderList();
      });
    });
    document.getElementById('copyHandoff').addEventListener('click', function () {
      copyText(document.getElementById('handoffText').textContent, this, '복사됨');
    });
    var download = document.getElementById('downloadCurated');
    if (download) download.addEventListener('click', function () {
      if (!state.inquiries.length) return;
      downloadCurated();
      var progress = curationProgress();
      this.textContent = progress.total + '건 내려받음 · 성취기준까지 정리된 것 ' + progress.done + '건';
      var button = this;
      setTimeout(function () { button.textContent = '완성 JSON 내려받기'; }, 2600);
    });
  }

  function init() {
    bindControls();
    var list = document.getElementById('inquiryList');
    list.classList.add('is-loading');
    list.setAttribute('aria-busy', 'true');
    list.innerHTML = '<div class="jp-skeleton-card"><span class="jp-skeleton-line short"></span><span class="jp-skeleton-line long"></span><span class="jp-skeleton-line"></span></div>' +
      '<div class="jp-skeleton-card"><span class="jp-skeleton-line short"></span><span class="jp-skeleton-line long"></span><span class="jp-skeleton-line"></span></div>' +
      '<div class="jp-skeleton-card"><span class="jp-skeleton-line short"></span><span class="jp-skeleton-line long"></span><span class="jp-skeleton-line"></span></div>';
    loadInquiryData().then(function (payload) {
      list.classList.remove('is-loading');
      list.removeAttribute('aria-busy');
      state.dataSource = payload.source;
      state.inquiries = applyCuration(payload.data.inquiries || []);
      updateConnectionStatus(state.dataSource, state.inquiries.length);
      updateMetrics();
      if (!state.inquiries.length) {
        renderSecureEmptyState();
        return;
      }
      if (state.inquiries.length) state.selectedId = state.inquiries[0].id;
      renderList();
      if (state.inquiries.length) renderCurator(state.inquiries[0]);
    }).catch(function (error) {
      list.classList.remove('is-loading');
      list.removeAttribute('aria-busy');
      list.textContent = '';
      list.appendChild(element('p', 'list-empty', error.message));
      updateConnectionStatus('error', 0);
      document.dispatchEvent(new CustomEvent('jp:feedback', { detail: { type: 'error', message: error.message } }));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
