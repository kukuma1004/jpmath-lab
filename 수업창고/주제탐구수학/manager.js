(function () {
  'use strict';

  var PUBLIC_DATA_URL = '../../주제탐구/data/inquiries.json';
  var PRIVATE_DATA_URL = '../../주제탐구/data-private/inquiries.local.json';
  var SHEET_URL = 'https://docs.google.com/spreadsheets/d/1shQ8CxS3nEO9wM6OT6-9DLgPilNtIaH0vsYPE21hscg/edit';
  var state = { inquiries: [], selectedId: null, promptMode: 'balanced', subject: 'all', stage: 'all', query: '', dataSource: '', liveStats: null };
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

  // ── 시트 실시간 연결 ─────────────────────────────────────────────────
  // 학생 원문을 공개 저장소에 올리지 않으면서 어느 기기에서나 보려면,
  // 파일로 내보내는 대신 시트를 그때그때 읽어 오면 된다.
  //
  // 보관하는 것은 교사용 열쇠 하나뿐이고, 요청을 보낼 주소는 이 페이지가
  // 이미 아는 배포 주소로 고정한다. 붙여 넣은 주소를 그대로 믿지 않으므로
  //  1) 열쇠가 엉뚱한 곳으로 나갈 일이 없고,
  //  2) 시트 메뉴가 개발용(/dev) 주소를 건네줘도 연결이 깨지지 않는다.
  //     (/dev 는 로그인 세션이 필요해 다른 도메인에서는 열리지 않는다)
  var FEED_KEY = 'jp-inquiry-token-v1';
  var FEED_KEY_LEGACY = 'jp-inquiry-feed-url-v1';  // 예전엔 주소 전체를 저장했다
  var FEED_REFRESH_MS = 8000;
  var FEED_TIMEOUT_MS = 25000;                     // Apps Script 첫 호출은 느릴 수 있다
  var feedTimer = null;
  var feedSeq = 0;
  var volatileFeedToken = '';

  function feedError(code, detail) {
    var error = new Error(code);
    error.code = code;
    error.detail = detail || '';
    return error;
  }

  // 요청을 보낼 곳. 헤더의 학생 질문함 링크가 곧 배포 주소라 그것을 출처로 삼는다.
  function feedBase() {
    var link = document.querySelector('.action-inbox');
    var href = link ? String(link.getAttribute('href') || '') : '';
    return /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(href) ? href : '';
  }

  // 주소를 통째로 붙여 넣어도, 열쇠만 붙여 넣어도 받는다
  function readToken(text) {
    var value = String(text || '').trim();
    if (!value) return '';
    var found = value.match(/[?&]token=([^&\s]+)/);
    if (found) {
      try { return decodeURIComponent(found[1]); } catch (error) { return found[1]; }
    }
    return /^[\w.~-]{8,200}$/.test(value) ? value : '';
  }

  function savedToken() {
    try {
      var token = sessionStorage.getItem(FEED_KEY);
      if (token) return token;
      // 예전 버전에서 영구 저장한 열쇠는 이번 탭으로만 옮기고 즉시 지운다.
      var moved = readToken(localStorage.getItem(FEED_KEY) || localStorage.getItem(FEED_KEY_LEGACY) || '');
      localStorage.removeItem(FEED_KEY);
      localStorage.removeItem(FEED_KEY_LEGACY);
      if (moved) { storeToken(moved); return moved; }
      return volatileFeedToken;
    } catch (error) { return volatileFeedToken; }
  }

  function storeToken(token) {
    volatileFeedToken = token || '';
    try {
      if (token) sessionStorage.setItem(FEED_KEY, token);
      else sessionStorage.removeItem(FEED_KEY);
      localStorage.removeItem(FEED_KEY);
      localStorage.removeItem(FEED_KEY_LEGACY);
    } catch (error) { /* 저장이 막혀도 이번 세션 동안은 쓸 수 있다 */ }
  }

  // Apps Script 웹앱은 다른 도메인이라 JSONP 로 읽는다.
  // 실패 사유를 뭉뚱그리면 어디를 고쳐야 할지 알 수 없으니 나눠서 돌려준다.
  function fetchFeed(token) {
    return new Promise(function (resolve, reject) {
      var base = feedBase();
      if (!base) { reject(feedError('nobase')); return; }
      var name = 'jpInquiryFeed' + (++feedSeq);
      var script = document.createElement('script');
      var timer = setTimeout(function () { cleanup(); reject(feedError('timeout')); }, FEED_TIMEOUT_MS);
      function cleanup() {
        clearTimeout(timer);
        try { delete window[name]; } catch (error) { window[name] = undefined; }
        if (script.parentNode) script.parentNode.removeChild(script);
      }
      window[name] = function (payload) { cleanup(); resolve(payload); };
      script.onerror = function () { cleanup(); reject(feedError('unreachable')); };
      script.src = base + '?view=inquiries&token=' + encodeURIComponent(token) +
        '&callback=' + name + '&_=' + Date.now();
      document.head.appendChild(script);
    });
  }

  function feedMessage(error) {
    var code = error && error.code;
    if (code === 'denied') return error.detail || '열쇠가 맞지 않습니다. 시트에서 열쇠를 다시 받아 주세요.';
    if (code === 'unreachable') return '배포 주소에 닿지 못했습니다. 시트 메뉴에서 웹앱을 다시 배포한 뒤 시도해 주세요.';
    if (code === 'timeout') return '시트가 제때 답하지 않았습니다. 잠시 뒤 다시 눌러 주세요.';
    if (code === 'nobase') return '이 페이지에서 학생 질문함 주소를 찾지 못했습니다.';
    if (code === 'render') return '자료는 받았지만 화면에 그리지 못했습니다.';
    return '연결하지 못했습니다.';
  }

  function stopFeedTimer() { if (feedTimer) { clearInterval(feedTimer); feedTimer = null; } }

  // 자동 새로고침. 편집 중인 입력란에 커서가 있으면 그 회차는 건너뛴다.
  function startFeedTimer(token) {
    stopFeedTimer();
    feedTimer = setInterval(function () {
      var active = document.activeElement;
      if (active && active.classList && active.classList.contains('curation-input')) return;
      refreshFromFeed(token, true);
    }, FEED_REFRESH_MS);
  }

  function paintFeed(payload) {
    var keep = state.selectedId;
    state.dataSource = 'live-sheet';
    state.liveSyncedAt = payload.syncedAt || '';
    state.liveStats = payload.stats || null;
    state.inquiries = payload.inquiries || [];
    updateConnectionStatus(state.dataSource, state.inquiries.length);
    updateMetrics(state.liveStats);
    if (!state.inquiries.length) { renderSecureEmptyState(); return; }
    var still = state.inquiries.some(function (item) { return item.id === keep; });
    state.selectedId = still ? keep : state.inquiries[0].id;
    renderList();
    var current = state.inquiries.filter(function (item) { return item.id === state.selectedId; })[0];
    if (current) renderCurator(current);
  }

  function refreshFromFeed(token, quiet) {
    return fetchFeed(token).then(function (payload) {
      if (!payload || !payload.ok) {
        throw feedError('denied', payload && payload.error ? payload.error : '');
      }
      // 그리다 난 오류를 연결 실패로 보고하면 엉뚱한 곳을 고치게 된다
      try { paintFeed(payload); }
      catch (error) { throw feedError('render'); }
      return payload;
    }).catch(function (error) {
      if (quiet) return null;
      throw error;
    });
  }

  function renderFeedPanel() {
    var host = document.getElementById('livePanel');
    if (!host) return;
    host.textContent = '';
    var token = savedToken();

    var head = element('div', 'live-panel-head');
    head.appendChild(element('strong', '', token ? '시트의 전체 진행상황에 실시간으로 연결되었습니다' : '학생 진행상황을 이 화면에 연결하기'));
    head.appendChild(element('small', '', token
      ? (state.liveSyncedAt ? '마지막 확인 ' + state.liveSyncedAt : '') + ' · 기초응답·발문·임시저장 답안을 ' + Math.round(FEED_REFRESH_MS / 1000) + '초마다 새로고침'
      : '구글시트 → 주제탐구 관리 → 운영실 실시간 연결 주소 에서 받은 열쇠를 붙여 넣으세요.'));
    host.appendChild(head);

    if (!token) {
      var row = element('div', 'live-panel-row');
      var input = document.createElement('input');
      input.type = 'password';
      input.className = 'curation-input';
      input.placeholder = '열쇠 붙여 넣기 (주소를 통째로 붙여 넣어도 됩니다)';
      input.setAttribute('aria-label', '시트 연결 열쇠');
      var connect = element('button', 'live-connect', '연결');
      connect.type = 'button';
      var message = element('p', 'live-panel-message', '');
      var attempt = function () {
        var next = readToken(input.value);
        if (!next) {
          message.textContent = '열쇠를 찾지 못했습니다. 시트 메뉴에서 받은 내용을 그대로 붙여 넣어 주세요.';
          return;
        }
        message.textContent = '연결하는 중…';
        refreshFromFeed(next, false).then(function () {
          storeToken(next);
          startFeedTimer(next);
          renderFeedPanel();
        }).catch(function (error) {
          message.textContent = '연결하지 못했습니다. ' + feedMessage(error);
        });
      };
      connect.addEventListener('click', attempt);
      input.addEventListener('keydown', function (event) { if (event.key === 'Enter') attempt(); });
      row.appendChild(input);
      row.appendChild(connect);
      host.appendChild(row);
      host.appendChild(message);
      host.appendChild(element('small', 'live-panel-warn',
        '이 열쇠는 현재 브라우저 탭에만 보관되며 저장소에는 올라가지 않습니다. 학생에게 주지 마세요.'));
      return;
    }

    var actions = element('div', 'live-panel-row');
    var now = element('button', 'live-connect', '지금 새로고침');
    now.type = 'button';
    var off = element('button', 'live-disconnect', '연결 끊기');
    off.type = 'button';
    actions.appendChild(now);
    actions.appendChild(off);
    host.appendChild(actions);
    var note = element('p', 'live-panel-message', '승인 전 자료와 작성 중인 답안까지 교사용으로만 표시하고 있습니다.');
    host.appendChild(note);

    now.addEventListener('click', function () {
      now.textContent = '읽는 중…';
      refreshFromFeed(token, false).then(function () { renderFeedPanel(); })
        .catch(function (error) { now.textContent = '지금 새로고침'; note.textContent = feedMessage(error); });
    });
    off.addEventListener('click', function () {
      stopFeedTimer(); storeToken(''); renderFeedPanel();
    });
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

    if (source === 'live-sheet') {
      title.textContent = '구글시트 실시간 연결됨';
      badge.textContent = 'LIVE';
      description.textContent = '승인 전 내용을 포함한 탐구 ' + count + '개와 학생 답안을 시트에서 바로 읽고 있습니다.';
      note.textContent = state.liveSyncedAt ? '마지막 확인 ' + state.liveSyncedAt : '자동 새로고침 중';
      var scope = document.querySelector('.data-scope p');
      if (scope) scope.innerHTML = '<strong>현재 표시:</strong> 교사용 비공개 실시간 전체 자료';
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
      description.textContent = '학생 확인과 승인은 실시간 교사용 페이지에서 합니다. 이 운영실은 전시용 초안을 다듬는 자리입니다.';
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

  function updateMetrics(stats) {
    if (stats) {
      document.getElementById('metricStudents').textContent = stats.students;
      document.getElementById('metricCompletedStudents').textContent = '기초응답 2개 완료 ' + stats.completedStudents + '명';
      document.getElementById('metricInquiries').textContent = stats.intakes;
      document.getElementById('metricPrompts').textContent = stats.prompts;
      document.getElementById('metricDraftResponses').textContent = stats.responseDrafts;
      document.getElementById('metricSubmittedResponses').textContent = stats.responseSubmitted;
      updateWorkflowSummary();
      return;
    }
    var students = {};
    state.inquiries.forEach(function (item) {
      students[item.studentId] = true;
    });
    document.getElementById('metricStudents').textContent = Object.keys(students).length || 25;
    document.getElementById('metricCompletedStudents').textContent = '공개 자료 기준';
    document.getElementById('metricInquiries').textContent = state.inquiries.length;
    document.getElementById('metricPrompts').textContent = '—';
    document.getElementById('metricDraftResponses').textContent = '—';
    document.getElementById('metricSubmittedResponses').textContent = '—';
    updateWorkflowSummary();
  }

  function progressLabel(item) {
    if (item.response) return item.response.reviewStatus === '작성 중' ? '답안 작성 중 · 임시저장' : '발문 답안 제출 · ' + item.response.reviewStatus;
    if (item.prompt) return '발문 공개 · 답안 대기';
    if (/교사 검토|교사 승인/.test(item.processStatus || '') || item.reviewStatus === '승인') return '교사 검토 완료 · 발문 대기';
    if (/수정됨/.test(item.processStatus || '')) return '기초응답 수정 · 재검토 대기';
    return (item.processStatus || '가공 대기') + ' · ' + (item.reviewStatus || '검토 대기');
  }

  function stageKey(item) {
    if (item.response) return item.response.reviewStatus === '작성 중' ? 'draft' : 'submitted';
    if (item.prompt) return 'prompt';
    if (/교사 검토|교사 승인/.test(item.processStatus || '') || item.reviewStatus === '승인') return 'review';
    return 'intake';
  }

  function updateWorkflowSummary() {
    var counts = { intake: 0, review: 0, prompt: 0, draft: 0, submitted: 0 };
    state.inquiries.forEach(function (item) { counts[stageKey(item)] += 1; });
    ['Intake', 'Review', 'Prompt', 'Draft', 'Submitted'].forEach(function (name) {
      var node = document.getElementById('queue' + name);
      if (node) node.textContent = state.dataSource === 'live-sheet' ? counts[name.toLowerCase()] + '건' : '—';
    });
  }

  function filteredInquiries() {
    var query = state.query.toLowerCase();
    return state.inquiries.filter(function (item) {
      if (state.subject === 'subject-review' && !needsSubjectReview(item)) return false;
      if (state.subject !== 'all' && state.subject !== 'subject-review' && item.subject !== state.subject) return false;
      if (state.stage !== 'all' && stageKey(item) !== state.stage) return false;
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
      copy.appendChild(element('strong', '', item.title || item.question || '주제 검토 전'));
      copy.appendChild(element('small', '', needsSubjectReview(item) ? '과목 확인 필요 · 먼저 검토' : progressLabel(item)));
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
      : '실제 학생 명단, 학생코드, 원문 응답은 GitHub에 올리지 않았습니다. 이 운영실은 전시용 초안을 다듬는 곳이라 이 컴퓨터에서 로컬 서버로 열어야 합니다.'));

    // 이 화면이 비어 있다고 학생을 못 보는 것이 아니다.
    // 학생 확인과 승인은 어느 기기에서나 되는 실시간 교사용 페이지에서 한다.
    var live = element('div', 'live-hint');
    live.appendChild(element('strong', '', '학생이 낸 내용을 지금 보려면'));
    live.appendChild(element('p', '', '실시간 교사용 페이지에서 확인합니다. 휴대폰·학교 PC 어디서나 열리고, 8초마다 새로고침되며 승인·보완 필요·반려까지 그 자리에서 처리합니다.'));
    live.appendChild(element('p', 'live-hint-path', '구글시트 → 주제탐구 관리 → 실시간 교사용 페이지 열기'));
    live.appendChild(element('small', '', '링크에 교사용 열쇠가 들어 있어 이 페이지에 저장해 두지 않습니다. 학생에게 전달하지 마세요.'));
    empty.appendChild(live);
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
  // 시트에서 내보낸 JSON은 제목·핵심개념이 비어 있다.
  // 성취기준은 별도의 2022 개정 교육과정 대조 작업에서 채운다.
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
        notice: '운영실에서 제목·핵심개념을 정리한 실명 초안입니다. 성취기준은 2022 개정 교육과정 대조 후 채우며 공개 저장소에 올리지 않습니다.'
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
      return item.title && (item.concepts || []).length;
    }).length;
    return { done: done, total: state.inquiries.length };
  }

  function addLiveAnswer(parent, title, value, className) {
    var card = element('article', 'live-answer' + (className ? ' ' + className : ''));
    card.appendChild(element('strong', '', title));
    card.appendChild(element('p', '', value || '아직 작성하지 않았습니다.'));
    parent.appendChild(card);
  }

  function renderLiveProgress(panel, item) {
    var hasPrompt = Boolean(item.prompt);
    var hasResponse = Boolean(item.response);
    var isFinal = hasResponse && item.response.reviewStatus !== '작성 중';
    var reviewed = hasPrompt || /교사 검토|교사 승인/.test(item.processStatus || '') || item.reviewStatus === '승인';
    var stages = [
      { label: '기초응답', detail: '원문 저장', ready: true, current: !reviewed },
      { label: '교사 검토', detail: item.reviewStatus || '검토 대기', ready: reviewed, current: reviewed && !hasPrompt },
      { label: '발문 공개', detail: hasPrompt ? '학생 화면 노출' : '발행 대기', ready: hasPrompt, current: hasPrompt && !hasResponse },
      { label: '학생 작성', detail: hasResponse ? (isFinal ? '답안 작성 완료' : '임시저장 있음') : '답안 대기', ready: hasResponse, current: hasResponse && !isFinal },
      { label: '최종 제출', detail: isFinal ? item.response.reviewStatus : '제출 전', ready: isFinal, current: isFinal }
    ];
    var section = element('section', 'curator-section live-progress-section');
    var heading = element('div', 'section-label');
    heading.appendChild(element('h3', '', '현재 진행 과정'));
    heading.appendChild(element('small', '', progressLabel(item)));
    section.appendChild(heading);
    var track = element('div', 'live-progress-track');
    stages.forEach(function (stage, index) {
      var node = element('div', 'live-progress-step' + (stage.ready ? ' is-ready' : '') + (stage.current ? ' is-current' : ''));
      node.appendChild(element('span', '', String(index + 1).padStart(2, '0')));
      node.appendChild(element('strong', '', stage.label));
      node.appendChild(element('small', '', stage.detail));
      track.appendChild(node);
    });
    section.appendChild(track);
    panel.appendChild(section);
  }

  function renderLiveCurator(item) {
    var panel = document.getElementById('curatorPanel');
    panel.textContent = '';
    var top = element('div', 'curator-topline');
    top.appendChild(element('span', 'status-badge live-private-badge', '비공개 실시간'));
    top.appendChild(element('span', 'detail-tag', subjectLabel(item)));
    top.appendChild(element('span', 'detail-tag', item.displayName));
    top.appendChild(element('span', 'status-badge', item.processStatus || '가공 대기'));
    if (needsSubjectReview(item)) top.appendChild(element('span', 'status-badge subject-alert', '과목 확인 필요'));
    top.appendChild(element('span', 'curator-updated', '최근 반영 ' + (item.updatedAt || '—')));
    panel.appendChild(top);
    panel.appendChild(element('h2', 'curator-title', item.title || item.studentConcept || '제목 검토 전'));
    panel.appendChild(element('p', 'curator-question', '“' + (item.question || item.studentCuriosity || '질문 검토 전') + '”'));
    renderLiveProgress(panel, item);

    var intake = element('section', 'curator-section');
    var intakeLabel = element('div', 'section-label');
    intakeLabel.appendChild(element('h3', '', '학생의 기초응답 원문'));
    intakeLabel.appendChild(element('small', '', '수정 ' + (item.revisionCount || 0) + '회 · ' + (item.reviewStatus || '검토 대기')));
    intake.appendChild(intakeLabel);
    var intakeGrid = element('div', 'live-answer-grid');
    addLiveAnswer(intakeGrid, '처음 궁금했던 질문', item.studentCuriosity, 'wide');
    addLiveAnswer(intakeGrid, '관심 개념', item.studentConcept);
    addLiveAnswer(intakeGrid, '선정 이유', item.studentReason);
    addLiveAnswer(intakeGrid, '탐구 방법', item.studentMethod || item.explorationPlan);
    addLiveAnswer(intakeGrid, '웹앱 아이디어', item.studentApp);
    if (item.studentNote) addLiveAnswer(intakeGrid, '학생 메모', item.studentNote, 'wide');
    intake.appendChild(intakeGrid);
    panel.appendChild(intake);

    var teacher = element('section', 'curator-section');
    var teacherLabel = element('div', 'section-label');
    teacherLabel.appendChild(element('h3', '', '교사 가공·검토 내용'));
    teacherLabel.appendChild(element('small', '', item.reviewStatus || '검토 대기'));
    teacher.appendChild(teacherLabel);
    var teacherGrid = element('div', 'live-answer-grid');
    addLiveAnswer(teacherGrid, '과목별 주제 초안', item.teacherTopic || '아직 가공 전입니다.');
    addLiveAnswer(teacherGrid, '핵심 질문', item.teacherQuestion || '아직 가공 전입니다.');
    addLiveAnswer(teacherGrid, '핵심 개념', item.prompt && item.prompt.concepts ? item.prompt.concepts : ((item.concepts || []).join(', ') || '아직 가공 전입니다.'));
    addLiveAnswer(teacherGrid, '가공 메모', item.processingMemo || '아직 기록이 없습니다.');
    if (item.teacherFeedback) addLiveAnswer(teacherGrid, '학생에게 보낸 피드백', item.teacherFeedback, 'wide');
    teacher.appendChild(teacherGrid);
    panel.appendChild(teacher);

    var promptSection = element('section', 'curator-section');
    var promptLabel = element('div', 'section-label');
    promptLabel.appendChild(element('h3', '', '맞춤 발문과 학생 답안'));
    promptLabel.appendChild(element('small', '', item.prompt ? ('발문 ' + item.prompt.version + ' · ' + (item.response ? item.response.reviewStatus : '답안 대기')) : '아직 학생에게 발행되지 않음'));
    promptSection.appendChild(promptLabel);
    if (!item.prompt) {
      var waiting = element('div', 'live-waiting');
      waiting.appendChild(element('strong', '', '발문 발행 전입니다.'));
      waiting.appendChild(element('p', '', '기초응답과 교사 가공 내용은 위에서 바로 확인할 수 있습니다. 학생발문 시트에 발행되면 이 자리에 세 발문과 답안이 나타납니다.'));
      promptSection.appendChild(waiting);
    } else {
      var promptMeta = element('div', 'prompt-meta');
      addLiveAnswer(promptMeta, '학생 화면의 주제', item.prompt.title);
      addLiveAnswer(promptMeta, '학생 화면의 핵심 질문', item.prompt.question);
      promptSection.appendChild(promptMeta);
      var pairList = element('div', 'prompt-response-list');
      item.prompt.prompts.forEach(function (prompt, index) {
        var pair = element('article', 'prompt-response-pair');
        var promptHead = element('div', 'prompt-response-head');
        promptHead.appendChild(element('span', '', '발문 ' + (index + 1)));
        promptHead.appendChild(element('small', '', item.response && item.response.answers[index] ? '답변 있음' : '작성 전'));
        pair.appendChild(promptHead);
        pair.appendChild(element('strong', 'prompt-question', prompt || '발문이 비어 있습니다.'));
        pair.appendChild(element('p', 'prompt-answer' + (item.response && item.response.answers[index] ? '' : ' is-empty'), item.response && item.response.answers[index] ? item.response.answers[index] : '아직 답변하지 않았습니다.'));
        pairList.appendChild(pair);
      });
      promptSection.appendChild(pairList);
      if (item.response) {
        var responseExtra = element('div', 'live-answer-grid response-extra');
        addLiveAnswer(responseExtra, '답하면서 새로 생긴 질문', item.response.newQuestion);
        addLiveAnswer(responseExtra, '학생 메모', item.response.studentNote);
        promptSection.appendChild(responseExtra);
        var responseNote = element('p', 'response-sync-note', '답안 수정 ' + (item.response.revisionCount || 0) + '회 · 최근 저장 ' + (item.response.updatedAt || '—'));
        promptSection.appendChild(responseNote);
      }
    }
    panel.appendChild(promptSection);

    var actions = element('div', 'curator-actions');
    var sheetButton = element('button', 'action-review', 'Google Sheet에서 원문 열기 ↗');
    sheetButton.type = 'button';
    sheetButton.addEventListener('click', function () { window.open(SHEET_URL, '_blank', 'noopener'); });
    actions.appendChild(sheetButton);
    panel.appendChild(actions);
  }

  function renderCurator(item) {
    if (state.dataSource === 'live-sheet') {
      renderLiveCurator(item);
      return;
    }
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
    mappingLabel.appendChild(element('h3', '', '교육과정 대조 결과와 핵심 개념'));
    mappingLabel.appendChild(element('small', '', item.curriculumMapping === 'complete' ? '2022 개정 교육과정 대조 완료' : 'Codex 대조 작업 대기'));
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
    var stageFilter = document.getElementById('stageFilter');
    if (stageFilter) stageFilter.addEventListener('change', function () {
      state.stage = this.value;
      renderList();
      var items = filteredInquiries();
      if (items.length && !items.some(function (item) { return item.id === state.selectedId; })) {
        state.selectedId = items[0].id;
        renderList();
        renderCurator(items[0]);
      }
    });
    document.getElementById('copyHandoff').addEventListener('click', function () {
      copyText(document.getElementById('handoffText').textContent, this, '복사됨');
    });
    var download = document.getElementById('downloadCurated');
    if (download) download.addEventListener('click', function () {
      if (!state.inquiries.length) return;
      downloadCurated();
      var progress = curationProgress();
      this.textContent = progress.total + '건 내려받음 · 제목·개념 정리 ' + progress.done + '건';
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
    var feedToken = savedToken();
    if (feedToken) {
      // 저장된 연결이 있으면 시트를 먼저 읽고, 실패하면 파일로 물러난다
      refreshFromFeed(feedToken, false).then(function () {
        list.classList.remove('is-loading');
        list.removeAttribute('aria-busy');
        startFeedTimer(feedToken);
        renderFeedPanel();
      }).catch(function () {
        list.classList.remove('is-loading');
        list.removeAttribute('aria-busy');
        renderFeedPanel();
        loadFromFiles(list);
      });
      return;
    }
    renderFeedPanel();
    loadFromFiles(list);
  }

  function loadFromFiles(list) {
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
