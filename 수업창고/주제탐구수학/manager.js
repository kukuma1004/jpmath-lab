(function () {
  'use strict';

  var DATA_URL = '../../주제탐구/data/inquiries.json';
  var state = { inquiries: [], names: {}, selectedId: null, promptMode: 'balanced' };
  var subjectLabels = {
    'calculus-1': '미적분Ⅰ',
    geometry: '기하',
    'mathematical-inquiry': '통합·이론'
  };

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === 'string') node.textContent = text;
    return node;
  }

  function displayName(item) {
    return state.names[item.studentId] || item.displayName;
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
    } else if (/도함수|Function Detective|증가와 감소/.test(text)) {
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
    var pending = 0;
    var appsMissing = 0;
    state.inquiries.forEach(function (item) {
      students[item.studentId] = true;
      if (item.curriculumMapping === 'pending' || item.curriculumMapping === 'review') pending += 1;
      if (!item.studentApp || !item.studentApp.entry) appsMissing += 1;
    });
    document.getElementById('metricStudents').textContent = Object.keys(students).length;
    document.getElementById('metricInquiries').textContent = state.inquiries.length;
    document.getElementById('metricPending').textContent = pending;
    document.getElementById('metricApps').textContent = appsMissing;
  }

  function renderList() {
    var list = document.getElementById('inquiryList');
    var filter = document.getElementById('subjectFilter').value;
    list.textContent = '';

    state.inquiries.filter(function (item) {
      return filter === 'all' || item.subject === filter;
    }).forEach(function (item) {
      var button = element('button', 'inquiry-button');
      button.type = 'button';
      button.classList.toggle('is-active', state.selectedId === item.id);
      button.appendChild(element('span', '', (subjectLabels[item.subject] || item.subject) + ' · ' + displayName(item)));
      button.appendChild(element('strong', '', item.title));
      var mappingLabel = item.curriculumMapping === 'complete'
        ? '성취기준 매핑 확정'
        : (item.curriculumMapping === 'draft'
          ? '성취기준 1차 매핑'
          : (item.curriculumMapping === 'review' ? '성취기준 재검토 필요' : '성취기준 미매핑'));
      button.appendChild(element('small', '', mappingLabel));
      button.addEventListener('click', function () {
        state.selectedId = item.id;
        renderList();
        renderCurator(item);
      });
      list.appendChild(button);
    });
  }

  function renderCurator(item) {
    var panel = document.getElementById('curatorPanel');
    panel.textContent = '';

    var tags = element('div', 'detail-tags');
    tags.appendChild(element('span', '', subjectLabels[item.subject] || item.subject));
    tags.appendChild(element('span', '', displayName(item)));
    (item.concepts || []).forEach(function (concept) { tags.appendChild(element('span', '', concept)); });
    panel.appendChild(tags);
    panel.appendChild(element('h3', '', item.title));
    panel.appendChild(element('p', 'curator-question', '“' + item.question + '”'));

    var mapping = element('section', 'curator-section');
    mapping.appendChild(element('h4', '', '성취기준 매핑'));
    var standardText = item.curriculumStandards && item.curriculumStandards.length
      ? item.curriculumStandards.join(' · ')
      : '코드 미입력';
    var mappingMessage = item.curriculumMapping === 'complete'
      ? standardText + ' · 교육부 원문 확인 완료'
      : (item.curriculumMapping === 'draft'
        ? standardText + ' · 기존 마스터표 기반 1차 매핑. 교육부 원문 대조 후 확정'
        : (item.curriculumMapping === 'review'
          ? standardText + ' · 교과 경계와 주 성취기준 재검토 필요'
          : '아직 미매핑 상태입니다. 교육부 원문의 코드와 문장을 확인한 뒤 입력하세요.'));
    mapping.appendChild(element('p', item.curriculumMapping === 'complete' ? '' : 'mapping-warning', mappingMessage));
    panel.appendChild(mapping);

    var plan = element('section', 'curator-section');
    plan.appendChild(element('h4', '', '현재 학생 계획'));
    plan.appendChild(element('p', '', item.explorationPlan));
    panel.appendChild(plan);

    var promptSection = element('section', 'curator-section');
    promptSection.appendChild(element('h4', '', '다음에 보낼 발문'));
    var engine = element('div', 'prompt-engine');
    var engineLabel = element('div', 'engine-label');
    engineLabel.appendChild(element('span', 'pulse-dot'));
    engineLabel.appendChild(element('strong', '', 'AUTO QUESTION ENGINE'));
    engineLabel.appendChild(element('small', '', '학생 질문·개념 기반 규칙 생성'));
    engine.appendChild(engineLabel);
    var modeBar = element('div', 'prompt-modes');
    [
      ['balanced', '균형'],
      ['concept', '개념 정교화'],
      ['verify', '검증·반례'],
      ['extend', '확장·연결']
    ].forEach(function (mode) {
      var modeButton = element('button', state.promptMode === mode[0] ? 'is-active' : '', mode[1]);
      modeButton.type = 'button';
      modeButton.addEventListener('click', function () {
        state.promptMode = mode[0];
        renderCurator(item);
      });
      modeBar.appendChild(modeButton);
    });
    engine.appendChild(modeBar);
    promptSection.appendChild(engine);
    var prompts = promptSet(item, state.promptMode);
    var list = element('ol', 'prompt-list');
    prompts.forEach(function (prompt) { list.appendChild(element('li', '', prompt)); });
    promptSection.appendChild(list);
    var copy = element('button', 'copy-prompts', '발문 전체 복사');
    copy.type = 'button';
    copy.addEventListener('click', function () {
      var text = '[' + displayName(item) + ' · ' + item.title + ']\n\n' + prompts.map(function (prompt, index) {
        return (index + 1) + '. ' + prompt;
      }).join('\n');
      copyText(text, copy, '복사됨');
    });
    promptSection.appendChild(copy);
    panel.appendChild(promptSection);
  }

  function loadPrivateFile(file) {
    var feedback = document.getElementById('fileFeedback');
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var students = Array.isArray(data.students) ? data.students : [];
        state.names = {};
        students.forEach(function (student) {
          if (student.studentId && student.name) state.names[student.studentId] = student.name;
        });
        feedback.textContent = students.length + '명의 교사용 실명 매핑을 현재 브라우저 메모리에만 불러왔습니다.';
        renderList();
        if (state.selectedId) {
          var selected = state.inquiries.find(function (item) { return item.id === state.selectedId; });
          if (selected) renderCurator(selected);
        }
      } catch (error) {
        feedback.textContent = 'JSON 형식이 맞지 않습니다. 교사용 students.private.json을 선택해 주세요.';
      }
    };
    reader.readAsText(file, 'UTF-8');
  }

  function copyText(text, button, doneText) {
    var oldText = button.textContent;
    function done() {
      button.textContent = doneText;
      window.setTimeout(function () { button.textContent = oldText; }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
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

  function init() {
    document.getElementById('subjectFilter').addEventListener('change', renderList);
    document.getElementById('privateFile').addEventListener('change', function (event) {
      if (event.target.files && event.target.files[0]) loadPrivateFile(event.target.files[0]);
    });
    document.getElementById('copyHandoff').addEventListener('click', function () {
      copyText(document.getElementById('handoffText').textContent, this, '복사됨');
    });

    fetch(DATA_URL, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('공개용 탐구 데이터를 불러오지 못했습니다.');
      return response.json();
    }).then(function (data) {
      state.inquiries = data.inquiries || [];
      updateMetrics();
      renderList();
    }).catch(function (error) {
      document.getElementById('inquiryList').appendChild(element('p', 'empty-selection', error.message));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
