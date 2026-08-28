const SHEET_NAMES = Object.freeze({
  roster: '학생명단',
  intake: '기초응답',
  prompts: '학생발문',
  responses: '학생답변',
  settings: '설정'
});

const AVAILABLE_SUBJECTS = Object.freeze(['미적분Ⅰ', '기하', '경제수학', '과목 확인 필요']);
const TARGET_INTAKE_COUNT = 2;

const SHEET_SCHEMAS = Object.freeze({
  '학생명단': ['학생ID', '학생코드', '이름', '상태', '등록일', '비고'],
  '기초응답': ['제출ID', '제출일시', '학생코드', '학생ID', '이름', '과목', '관심개념', '궁금한점', '선정이유', '탐구방법', '웹앱아이디어', '학생메모', '처리상태', '교사확정주제', '교사확정질문', '가공메모', '수정일시', '수정횟수', '교사검토상태', '교사피드백', '과목확인'],
  '학생발문': ['학생코드', '학생ID', '탐구ID', '이름', '과목', '주제', '현재질문', '핵심개념', '발문1', '발문2', '발문3', '발문버전', '상태', '수정일'],
  '학생답변': ['제출ID', '제출시각', '학생코드', '학생ID', '탐구ID', '이름', '과목', '주제', '발문버전', '답변1', '답변2', '답변3', '새로운질문', '학생메모', '교사검토상태', '수정시각', '수정횟수', '교사피드백'],
  '설정': ['설정키', '값', '설명']
});

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('주제탐구 관리')
    .addItem('시트 구조 점검', 'setupInquiryWorkbook')
    .addItem('현재 운영 상태', 'showInquiryStatus')
    .addSeparator()
    .addItem('실시간 교사용 페이지 열기', 'showTeacherDashboardLink')
    .addItem('운영실 실시간 연결 주소', 'showManagerFeedLink')
    .addItem('운영실용 JSON 내보내기', 'exportManagerJson')
    .addToUi();
}

function setupInquiryWorkbook() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SHEET_SCHEMAS).forEach(function (sheetName) {
    ensureSheet_(spreadsheet, sheetName, SHEET_SCHEMAS[sheetName]);
  });
  ensureSetting_('SUBMISSION_OPEN', 'TRUE', 'TRUE이면 학생 제출과 수정을 받습니다.');
  ensureTeacherToken_();
  return getInquirySystemStatus();
}

function showInquiryStatus() {
  const status = getInquirySystemStatus();
  SpreadsheetApp.getUi().alert(
    '2026 수학 주제탐구 운영 상태',
    [
      '등록 학생: ' + status.students + '명',
      '기초응답: ' + status.intakes + '건 / 목표 ' + status.expectedIntakes + '건',
      '2개 탐구 작성: ' + status.completedStudents + '명',
      '과목 확인 필요: ' + status.subjectReviewCount + '건',
      '발문 공개: ' + status.promptRows + '건',
      '학생답변: ' + status.responseRows + '건',
      '제출·수정 상태: ' + (status.submissionOpen ? '열림' : '닫힘')
    ].join('\n'),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function showTeacherDashboardLink() {
  const deploymentUrl = ScriptApp.getService().getUrl();
  if (!deploymentUrl) {
    SpreadsheetApp.getUi().alert('먼저 웹앱을 배포한 뒤 다시 실행해 주세요.');
    return;
  }
  const url = deploymentUrl + '?view=teacher&token=' + encodeURIComponent(ensureTeacherToken_());
  const html = HtmlService.createHtmlOutput(
    '<div style="font:14px/1.7 sans-serif;padding:20px">' +
    '<h3 style="margin-top:0">실시간 교사용 페이지</h3>' +
    '<p>이 링크에는 교사용 열쇠가 포함되어 있으므로 학생에게 전달하지 마세요.</p>' +
    '<p><a href="' + escapeHtml_(url) + '" target="_blank" style="display:inline-block;padding:11px 15px;border-radius:10px;color:#fff;background:#176b5b;text-decoration:none;font-weight:700">교사용 페이지 열기 ↗</a></p>' +
    '<p style="color:#687773;font-size:12px;word-break:break-all">' + escapeHtml_(url) + '</p></div>'
  ).setWidth(560).setHeight(260);
  SpreadsheetApp.getUi().showModalDialog(html, '주제탐구 실시간 연결');
}

function getInquirySystemStatus() {
  const roster = getRosterRows_().filter(function (row) { return row['상태'] !== '비활성'; });
  const intakes = getIntakeRows_();
  const completedStudents = roster.filter(function (student) {
    const code = normalizeCode_(student['학생코드']);
    return intakes.filter(function (row) { return normalizeCode_(row['학생코드']) === code; }).length >= TARGET_INTAKE_COUNT;
  }).length;
  return {
    ok: true,
    students: roster.length,
    intakes: intakes.length,
    expectedIntakes: roster.length * TARGET_INTAKE_COUNT,
    completedStudents: completedStudents,
    subjectReviewCount: intakes.filter(function (row) { return subjectConcern_(row).needsReview; }).length,
    promptRows: getPromptRows_().filter(function (row) { return row['상태'] !== '비활성'; }).length,
    responseRows: getResponseRows_().length,
    submissionOpen: String(getSetting_('SUBMISSION_OPEN')).toUpperCase() === 'TRUE'
  };
}

function doGet(event) {
  const params = event && event.parameter ? event.parameter : {};

  // 운영실(수업창고/주제탐구수학/관리.html)이 시트를 직접 읽는 통로.
  // 브라우저에서 다른 도메인으로 요청하므로 JSONP 로 돌려준다.
  if (params.view === 'inquiries') return serveInquiryFeed_(params);

  if (params.view === 'teacher') {
    if (!validTeacherToken_(params.token)) {
      return HtmlService.createHtmlOutput('<meta charset="utf-8"><div style="max-width:620px;margin:80px auto;padding:30px;font:15px/1.7 sans-serif"><h2>교사용 링크를 확인해 주세요.</h2><p>Google Sheet의 <b>주제탐구 관리 → 실시간 교사용 페이지 열기</b>에서 안전한 링크로 접속할 수 있습니다.</p></div>')
        .setTitle('교사용 연결 확인');
    }
    return HtmlService.createHtmlOutputFromFile('Teacher')
      .setTitle('주제탐구 실시간 교사용 페이지')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('2026 수학 주제탐구 학생 질문함')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getStudentWorkspace(studentCode) {
  const code = normalizeCode_(studentCode);
  if (!code) return failure_('학생 코드를 입력해 주세요.');

  const student = getRosterRows_().find(function (row) {
    return normalizeCode_(row['학생코드']) === code && row['상태'] !== '비활성';
  });
  if (!student) return failure_('코드를 확인하지 못했습니다. 선생님께 받은 코드를 다시 확인해 주세요.');

  const intakeRows = getIntakeRows_().filter(function (row) {
    return normalizeCode_(row['학생코드']) === code;
  });
  const base = {
    ok: true,
    student: { code: code, id: student['학생ID'], name: student['이름'] },
    availableSubjects: AVAILABLE_SUBJECTS.slice(),
    targetIntakeCount: TARGET_INTAKE_COUNT,
    intakes: intakeRows.map(studentIntake_)
  };

  if (student['상태'] === '질문정교화') {
    const rows = getPromptRows_().filter(function (row) {
      return normalizeCode_(row['학생코드']) === code && row['상태'] !== '비활성';
    });
    if (rows.length) {
      const responses = getResponseRows_().filter(function (row) { return normalizeCode_(row['학생코드']) === code; });
      base.mode = 'prompts';
      base.inquiries = rows.map(function (row) {
        const previous = responses.filter(function (response) {
          return response['탐구ID'] === row['탐구ID'] && response['발문버전'] === row['발문버전'];
        }).pop();
        return {
          id: row['탐구ID'],
          subject: row['과목'],
          title: row['주제'],
          question: row['현재질문'],
          concepts: row['핵심개념'],
          promptVersion: row['발문버전'],
          prompts: [row['발문1'], row['발문2'], row['발문3']],
          response: previous ? {
            submissionId: previous['제출ID'],
            answers: [previous['답변1'], previous['답변2'], previous['답변3']],
            newQuestion: previous['새로운질문'],
            studentNote: previous['학생메모'],
            reviewStatus: previous['교사검토상태'] || '검토 대기',
            teacherFeedback: previous['교사피드백'] || '',
            updatedAt: previous['수정시각'] || previous['제출시각']
          } : null
        };
      });
      return base;
    }
  }

  if (intakeRows.length >= TARGET_INTAKE_COUNT) {
    base.mode = 'waiting';
    base.message = '기초 질문 ' + TARGET_INTAKE_COUNT + '개가 저장되어 있습니다. 선생님이 읽는 동안에도 아래에서 언제든 수정할 수 있습니다.';
    return base;
  }

  base.mode = 'intake';
  return base;
}

function submitInitialIntake(payload) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return failure_('제출이 몰리고 있습니다. 잠시 후 다시 시도해 주세요.');

  try {
    if (String(getSetting_('SUBMISSION_OPEN')).toUpperCase() !== 'TRUE') return failure_('현재는 답변 제출·수정 기간이 아닙니다.');
    payload = payload || {};
    const code = normalizeCode_(payload.studentCode);
    const subject = cleanText_(payload.subject, 30);
    const submissionId = cleanText_(payload.submissionId, 120);
    const student = getRosterRows_().find(function (row) {
      return normalizeCode_(row['학생코드']) === code && row['상태'] !== '비활성';
    });
    if (!student) return failure_('학생 정보를 확인하지 못했습니다. 코드를 다시 확인해 주세요.');
    if (AVAILABLE_SUBJECTS.indexOf(subject) === -1) return failure_('과목을 다시 선택해 주세요.');

    const fields = {
      concept: cleanText_(payload.concept, 3000),
      curiosity: cleanText_(payload.curiosity, 5000),
      reason: cleanText_(payload.reason, 5000),
      method: cleanText_(payload.method, 5000),
      appIdea: cleanText_(payload.appIdea, 4000),
      studentNote: cleanText_(payload.studentNote, 2000)
    };
    if ([fields.concept, fields.curiosity, fields.reason, fields.method].some(function (value) { return value.length < 2; })) {
      return failure_('필수 질문 네 가지에 모두 답해 주세요. 아직 확실하지 않다면 현재 생각을 그대로 적어도 됩니다.');
    }

    const rows = getIntakeRows_().filter(function (row) { return normalizeCode_(row['학생코드']) === code; });
    const existing = submissionId ? rows.find(function (row) { return row['제출ID'] === submissionId; }) : null;
    if (submissionId && !existing) return failure_('수정할 기록을 찾지 못했습니다. 화면을 새로 불러와 주세요.');
    if (!existing && rows.length >= TARGET_INTAKE_COUNT) return failure_('이미 두 탐구를 작성했습니다. 새로 추가하지 말고 기존 탐구를 선택해 수정해 주세요.');
    const duplicate = rows.some(function (row) { return row['제출ID'] !== submissionId && row['과목'] === subject && subject !== '과목 확인 필요'; });
    if (duplicate) return failure_(subject + ' 탐구가 이미 있습니다. 기존 기록을 선택해 수정해 주세요.');

    const unchanged = existing &&
      cleanText_(existing['과목'], 30) === subject &&
      cleanText_(existing['관심개념'], 3000) === fields.concept &&
      cleanText_(existing['궁금한점'], 5000) === fields.curiosity &&
      cleanText_(existing['선정이유'], 5000) === fields.reason &&
      cleanText_(existing['탐구방법'], 5000) === fields.method &&
      cleanText_(existing['웹앱아이디어'], 4000) === fields.appIdea &&
      cleanText_(existing['학생메모'], 2000) === fields.studentNote;
    if (unchanged) {
      return {
        ok: true,
        submissionId: existing['제출ID'],
        updated: false,
        unchanged: true,
        message: '내용이 바뀌지 않아 기존 검토 상태를 유지했습니다.',
        allCompleted: rows.length >= TARGET_INTAKE_COUNT
      };
    }

    const now = new Date();
    const record = {
      '제출ID': existing ? existing['제출ID'] : Utilities.getUuid(),
      '제출일시': existing ? existing['제출일시'] : now,
      '학생코드': code,
      '학생ID': student['학생ID'],
      '이름': student['이름'],
      '과목': subject,
      '관심개념': fields.concept,
      '궁금한점': fields.curiosity,
      '선정이유': fields.reason,
      '탐구방법': fields.method,
      '웹앱아이디어': fields.appIdea,
      '학생메모': fields.studentNote,
      '처리상태': existing ? '수정됨 · 가공 대기' : '가공 대기',
      '교사확정주제': existing ? existing['교사확정주제'] : '',
      '교사확정질문': existing ? existing['교사확정질문'] : '',
      '가공메모': existing ? existing['가공메모'] : '',
      '수정일시': now,
      '수정횟수': existing ? Number(existing['수정횟수'] || 0) + 1 : 0,
      '교사검토상태': existing ? '재검토 대기' : '검토 대기',
      '교사피드백': existing ? existing['교사피드백'] : '',
      '과목확인': ''
    };
    record['과목확인'] = subjectConcern_(record).needsReview ? '확인 필요' : '';

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.intake);
    if (existing) updateRecordRow_(sheet, existing._rowNumber, record);
    else appendRecord_(sheet, record);

    const completedCount = existing ? rows.length : rows.length + 1;
    if (completedCount >= TARGET_INTAKE_COUNT) updateRosterStatus_(student['학생ID'], '기초응답완료');

    return {
      ok: true,
      submissionId: record['제출ID'],
      updated: Boolean(existing),
      message: subject + (existing ? ' 기초 질문을 수정했습니다.' : ' 기초 질문을 저장했습니다.'),
      allCompleted: completedCount >= TARGET_INTAKE_COUNT
    };
  } catch (error) {
    console.error(error);
    return failure_('저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
  } finally {
    lock.releaseLock();
  }
}

function submitStudentResponse(payload) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return failure_('제출이 몰리고 있습니다. 잠시 후 다시 시도해 주세요.');
  try {
    if (String(getSetting_('SUBMISSION_OPEN')).toUpperCase() !== 'TRUE') return failure_('현재는 답변 제출·수정 기간이 아닙니다.');
    payload = payload || {};
    const code = normalizeCode_(payload.studentCode);
    const inquiryId = cleanText_(payload.inquiryId, 120);
    const responseId = cleanText_(payload.responseId, 120);
    const saveMode = payload.saveMode === 'draft' ? 'draft' : 'final';
    const answers = Array.isArray(payload.answers) ? payload.answers.map(function (answer) { return cleanText_(answer, 5000); }) : [];
    const newQuestion = cleanText_(payload.newQuestion, 3000);
    const studentNote = cleanText_(payload.studentNote, 2000);
    if (!code || !inquiryId) return failure_('학생 코드와 탐구 정보를 확인해 주세요.');
    if (answers.length !== 3) return failure_('세 발문 정보를 다시 불러와 주세요.');
    if (saveMode === 'final' && answers.some(function (answer) { return answer.length < 2; })) return failure_('세 발문에 대한 답변을 모두 작성해 주세요.');
    if (saveMode === 'draft' && !answers.some(Boolean) && !newQuestion && !studentNote) return failure_('임시저장할 내용을 한 글자 이상 적어 주세요.');

    const student = getRosterRows_().find(function (row) {
      return normalizeCode_(row['학생코드']) === code && row['상태'] !== '비활성';
    });
    if (!student || student['상태'] !== '질문정교화') return failure_('선생님이 다음 단계로 전환해 현재는 답변을 수정할 수 없습니다.');

    const promptRow = getPromptRows_().find(function (row) {
      return normalizeCode_(row['학생코드']) === code && row['탐구ID'] === inquiryId && row['상태'] !== '비활성';
    });
    if (!promptRow) return failure_('현재 발문을 찾지 못했습니다. 화면을 새로 불러와 주세요.');

    const existing = responseId ? getResponseRows_().find(function (row) {
      return row['제출ID'] === responseId && normalizeCode_(row['학생코드']) === code && row['탐구ID'] === inquiryId;
    }) : null;
    if (responseId && !existing) return failure_('수정할 답변을 찾지 못했습니다. 화면을 새로 불러와 주세요.');
    const reviewStatus = saveMode === 'draft' ? '작성 중' : (existing && existing['교사검토상태'] !== '작성 중' ? '재검토 대기' : '검토 대기');
    const unchanged = existing &&
      answers.every(function (answer, index) { return cleanText_(existing['답변' + (index + 1)], 5000) === answer; }) &&
      cleanText_(existing['새로운질문'], 3000) === newQuestion &&
      cleanText_(existing['학생메모'], 2000) === studentNote &&
      existing['교사검토상태'] === reviewStatus;
    if (unchanged) return { ok: true, submissionId: existing['제출ID'], updated: false, unchanged: true, draft: saveMode === 'draft', message: saveMode === 'draft' ? '임시저장된 내용과 같습니다.' : '제출된 답변과 같습니다.' };
    const now = new Date();
    const record = {
      '제출ID': existing ? existing['제출ID'] : Utilities.getUuid(),
      '제출시각': existing ? existing['제출시각'] : now,
      '학생코드': code,
      '학생ID': promptRow['학생ID'],
      '탐구ID': promptRow['탐구ID'],
      '이름': promptRow['이름'],
      '과목': promptRow['과목'],
      '주제': promptRow['주제'],
      '발문버전': promptRow['발문버전'],
      '답변1': answers[0],
      '답변2': answers[1],
      '답변3': answers[2],
      '새로운질문': newQuestion,
      '학생메모': studentNote,
      '교사검토상태': reviewStatus,
      '수정시각': now,
      '수정횟수': existing ? Number(existing['수정횟수'] || 0) + 1 : 0,
      '교사피드백': existing ? existing['교사피드백'] : ''
    };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.responses);
    if (existing) updateRecordRow_(sheet, existing._rowNumber, record);
    else appendRecord_(sheet, record);
    return {
      ok: true,
      submissionId: record['제출ID'],
      updated: Boolean(existing),
      draft: saveMode === 'draft',
      message: saveMode === 'draft' ? '작성 중인 답변을 임시저장했습니다.' : (existing ? '수정한 답변이 선생님께 전달되었습니다.' : '답변이 선생님께 전달되었습니다.')
    };
  } catch (error) {
    console.error(error);
    return failure_('저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
  } finally {
    lock.releaseLock();
  }
}

function getTeacherDashboard(token) {
  if (!validTeacherToken_(token)) return failure_('교사용 연결이 만료되었거나 올바르지 않습니다. Sheet 메뉴에서 다시 열어 주세요.');
  const rows = getIntakeRows_();
  const items = rows.map(function (row) {
    const concern = subjectConcern_(row);
    return {
      id: row['제출ID'],
      studentId: row['학생ID'],
      name: row['이름'],
      subject: row['과목'],
      concept: row['관심개념'],
      curiosity: row['궁금한점'],
      reason: row['선정이유'],
      method: row['탐구방법'],
      appIdea: row['웹앱아이디어'],
      studentNote: row['학생메모'],
      submittedAt: row['제출일시'],
      updatedAt: row['수정일시'] || row['제출일시'],
      revisionCount: Number(row['수정횟수'] || 0),
      reviewStatus: row['교사검토상태'] || '검토 대기',
      teacherFeedback: row['교사피드백'] || '',
      processStatus: row['처리상태'] || '가공 대기',
      needsSubjectReview: concern.needsReview,
      subjectReason: concern.reason
    };
  });
  return {
    ok: true,
    syncedAt: Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
    items: items,
    stats: {
      total: items.length,
      waiting: items.filter(function (item) { return /대기|재검토/.test(item.reviewStatus); }).length,
      needsRevision: items.filter(function (item) { return item.reviewStatus === '보완 필요' || item.reviewStatus === '반려'; }).length,
      subjectReview: items.filter(function (item) { return item.needsSubjectReview; }).length,
      approved: items.filter(function (item) { return item.reviewStatus === '승인'; }).length
    }
  };
}

function reviewIntake(token, payload) {
  if (!validTeacherToken_(token)) return failure_('교사용 연결을 확인해 주세요.');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return failure_('다른 저장 작업이 진행 중입니다. 잠시 후 다시 시도해 주세요.');
  try {
    payload = payload || {};
    const id = cleanText_(payload.submissionId, 120);
    const status = cleanText_(payload.status, 30);
    const feedback = cleanText_(payload.feedback, 3000);
    const subject = cleanText_(payload.subject, 30);
    if (['승인', '보완 필요', '반려', '검토 대기'].indexOf(status) === -1) return failure_('검토 상태를 다시 선택해 주세요.');
    if ((status === '보완 필요' || status === '반려') && feedback.length < 2) return failure_('학생이 고칠 수 있도록 교사 피드백을 입력해 주세요.');
    if (subject && AVAILABLE_SUBJECTS.indexOf(subject) === -1) return failure_('과목을 다시 선택해 주세요.');
    const row = getIntakeRows_().find(function (item) { return item['제출ID'] === id; });
    if (!row) return failure_('검토할 응답을 찾지 못했습니다. 새로고침해 주세요.');
    const updates = {
      '교사검토상태': status,
      '교사피드백': feedback,
      '처리상태': status === '승인' ? '교사 승인' : (status === '검토 대기' ? '가공 대기' : status)
    };
    if (subject) {
      updates['과목'] = subject;
      updates['과목확인'] = subject === '과목 확인 필요' ? '확인 필요' : '확인 완료';
    }
    updateRecordRow_(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.intake), row._rowNumber, updates);
    return { ok: true, message: row['이름'] + ' 학생의 응답을 ' + status + ' 상태로 저장했습니다.' };
  } catch (error) {
    console.error(error);
    return failure_('검토 상태를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.');
  } finally {
    lock.releaseLock();
  }
}

function studentIntake_(row) {
  const concern = subjectConcern_(row);
  return {
    submissionId: row['제출ID'],
    subject: row['과목'],
    concept: row['관심개념'],
    curiosity: row['궁금한점'],
    reason: row['선정이유'],
    method: row['탐구방법'],
    appIdea: row['웹앱아이디어'],
    studentNote: row['학생메모'],
    reviewStatus: row['교사검토상태'] || '검토 대기',
    teacherFeedback: row['교사피드백'] || '',
    needsSubjectReview: concern.needsReview,
    subjectReason: concern.reason,
    updatedAt: row['수정일시'] || row['제출일시'],
    revisionCount: Number(row['수정횟수'] || 0)
  };
}

function subjectConcern_(row) {
  if (row['과목확인'] === '확인 완료') return { needsReview: false, reason: '' };
  const subject = row['과목'];
  if (subject === '과목 확인 필요' || AVAILABLE_SUBJECTS.indexOf(subject) === -1) {
    return { needsReview: true, reason: '학생이 과목을 확정하지 못했습니다.' };
  }
  const text = [row['관심개념'], row['궁금한점'], row['선정이유'], row['탐구방법']].join(' ').toLowerCase();
  const groups = {
    '미적분Ⅰ': ['극한', '미분', '적분', '도함수', '변화율', '연속', '극값', '리만', '접선'],
    '기하': ['벡터', '공간', '평면', '직선', '원뿔', '이차곡선', '포물선', '타원', '쌍곡선', '내적', '정사영'],
    '경제수학': ['경제', '금리', '환율', '물가', '수요', '공급', '금융', '자산', '투자', '대출', '보험', '세금', '주식', '채권', '예금']
  };
  const scores = {};
  Object.keys(groups).forEach(function (name) {
    scores[name] = groups[name].filter(function (word) { return text.indexOf(word) !== -1; }).length;
  });
  const strongest = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; })[0];
  if (strongest !== subject && scores[strongest] >= 2 && scores[strongest] >= scores[subject] + 2) {
    return { needsReview: true, reason: '선택 과목은 ' + subject + '이지만 내용에는 ' + strongest + ' 관련 표현이 더 많이 보입니다.' };
  }
  return { needsReview: false, reason: '' };
}

function getRosterRows_() { return getRows_(SHEET_NAMES.roster); }
function getIntakeRows_() { return getRows_(SHEET_NAMES.intake); }
function getPromptRows_() { return getRows_(SHEET_NAMES.prompts); }
function getResponseRows_() { return getRows_(SHEET_NAMES.responses); }

function getRows_(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error(sheetName + ' 시트를 찾을 수 없습니다.');
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).map(function (row, index) {
    if (!row.some(function (cell) { return cell !== ''; })) return null;
    const record = { _rowNumber: index + 2 };
    headers.forEach(function (header, column) { record[header] = row[column] || ''; });
    return record;
  }).filter(Boolean);
}

function appendRecord_(sheet, record) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  sheet.appendRow(headers.map(function (header) { return safeCell_(record[header]); }));
}

function updateRecordRow_(sheet, rowNumber, updates) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  Object.keys(updates).forEach(function (header) {
    const index = headers.indexOf(header);
    if (index !== -1) sheet.getRange(rowNumber, index + 1).setValue(safeCell_(updates[header]));
  });
}

function updateRosterStatus_(studentId, status) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.roster);
  const values = sheet.getDataRange().getDisplayValues();
  const idIndex = values[0].indexOf('학생ID');
  const statusIndex = values[0].indexOf('상태');
  if (idIndex < 0 || statusIndex < 0) return;
  for (let index = 1; index < values.length; index += 1) {
    if (values[index][idIndex] === studentId) {
      sheet.getRange(index + 1, statusIndex + 1).setValue(status);
      return;
    }
  }
}

function ensureSheet_(spreadsheet, sheetName, headers) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(sheetName);
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const existing = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0].filter(function (value) { return value !== ''; });
  if (!existing.length) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    const missing = headers.filter(function (header) { return existing.indexOf(header) === -1; });
    if (missing.length) sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
  }
  sheet.setFrozenRows(1);
  const width = sheet.getLastColumn();
  sheet.getRange(1, 1, 1, width).setFontWeight('bold').setBackground('#173f37').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, width);
  return sheet;
}

function ensureSetting_(key, value, description) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.settings);
  const values = sheet.getDataRange().getDisplayValues();
  for (let index = 1; index < values.length; index += 1) if (values[index][0] === key) return;
  sheet.appendRow([key, value, description]);
}

function getSetting_(key) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.settings);
  if (!sheet) return '';
  const values = sheet.getDataRange().getDisplayValues();
  for (let index = 1; index < values.length; index += 1) if (values[index][0] === key) return values[index][1];
  return '';
}

function ensureTeacherToken_() {
  const properties = PropertiesService.getScriptProperties();
  let token = properties.getProperty('TEACHER_DASHBOARD_TOKEN');
  if (!token) {
    token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    properties.setProperty('TEACHER_DASHBOARD_TOKEN', token);
  }
  return token;
}

function validTeacherToken_(value) {
  const expected = PropertiesService.getScriptProperties().getProperty('TEACHER_DASHBOARD_TOKEN');
  const received = cleanText_(value, 100);
  return Boolean(expected && received && expected.length === received.length && expected === received);
}

function normalizeCode_(value) { return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12); }
function cleanText_(value, maxLength) { return String(value || '').replace(/\u0000/g, '').trim().slice(0, maxLength); }
function safeCell_(value) {
  if (value instanceof Date) return value;
  const text = String(value === undefined || value === null ? '' : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
function escapeHtml_(value) { return String(value || '').replace(/[&<>"']/g, function (character) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]; }); }
function failure_(message) { return { ok: false, message: message }; }

/**
 * 운영실용 JSON 내보내기
 *
 * 운영실(수업창고/주제탐구수학/관리.html)은 시트를 직접 읽지 못하고
 * 주제탐구/data-private/inquiries.local.json 파일만 읽는다.
 * 이 함수가 그 파일 내용을 만들어 준다.
 *
 * 시트에서 그대로 나오는 값만 채우고, 교사가 읽고 정해야 하는
 * 제목·성취기준·핵심개념은 빈 채로 둔다. 그 세 가지는 운영실 화면에서 채운다.
 */

const EXPORT_SUBJECT_KEYS = Object.freeze({
  '미적분Ⅰ': 'calculus-1',
  '기하': 'geometry',
  '경제수학': 'economics',
  '과목 확인 필요': 'subject-review'
});

function exportManagerJson() {
  const payload = buildManagerJson_();
  const html = HtmlService.createHtmlOutput(
    '<div style="font:14px/1.6 -apple-system,BlinkMacSystemFont,\'Malgun Gothic\',sans-serif;padding:14px">' +
    '<p style="margin:0 0 6px"><b>' + payload.count + '건</b>을 내보냈습니다. ' +
    (payload.skipped ? '승인 전 ' + payload.skipped + '건은 제외했습니다.' : '') + '</p>' +
    '<p style="margin:0 0 10px;color:#555">아래 내용을 모두 복사해 ' +
    '<code>주제탐구/data-private/inquiries.local.json</code> 에 덮어써 주세요.</p>' +
    '<textarea id="out" style="width:100%;height:330px;font:12px/1.5 Consolas,monospace" readonly>' +
    payload.text.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</textarea>' +
    '<button style="margin-top:10px;padding:8px 14px;font-size:14px;cursor:pointer" ' +
    'onclick="var t=document.getElementById(\'out\');t.select();document.execCommand(\'copy\');this.textContent=\'복사했습니다\'">' +
    '전체 복사</button></div>')
    .setWidth(620).setHeight(520);
  SpreadsheetApp.getUi().showModalDialog(html, '운영실용 JSON');
}

function buildManagerJson_() {
  const rows = getIntakeRows_();
  const tz = Session.getScriptTimeZone() || 'Asia/Seoul';
  const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const asDate = function (value) {
    if (!value) return '';
    if (Object.prototype.toString.call(value) === '[object Date]') return Utilities.formatDate(value, tz, 'yyyy-MM-dd');
    return String(value).slice(0, 10);
  };

  let skipped = 0;
  const inquiries = [];
  rows.forEach(function (row) {
    // 승인된 응답만 내보낸다. 검토 중인 초안이 운영실에 섞이지 않게 한다.
    if (String(row['교사검토상태'] || '') !== '승인') { skipped += 1; return; }
    const subjectKey = EXPORT_SUBJECT_KEYS[row['과목']] || 'subject-review';
    const studentId = String(row['학생ID'] || row['학생코드'] || '').trim();
    inquiries.push({
      id: studentId + '-' + subjectKey,
      studentId: studentId,
      displayName: String(row['이름'] || '').trim(),
      subject: subjectKey,

      // 교사가 정하는 값. 운영실 화면에서 채운다.
      title: '',
      curriculumStandards: [],
      concepts: [],
      curriculumMapping: 'draft',

      // 학생이 쓴 값
      question: String(row['궁금한점'] || '').trim(),
      explorationPlan: String(row['탐구방법'] || '').trim(),
      studentConcept: String(row['관심개념'] || '').trim(),
      studentReason: String(row['선정이유'] || '').trim(),
      studentApp: String(row['웹앱아이디어'] || '').trim() || null,
      studentNote: String(row['학생메모'] || '').trim(),

      teacherFeedback: String(row['교사피드백'] || '').trim(),
      status: 'topic-submitted',
      visibility: 'draft',
      updatedAt: asDate(row['수정일시'] || row['제출일시']) || today
    });
  });

  const text = JSON.stringify({
    schemaVersion: '1.0',
    project: {
      title: '2026 수학 주제탐구 프로젝트',
      updatedAt: today,
      notice: '시트의 승인된 기초응답에서 내보낸 실명 초안입니다. 공개 저장소에 올리지 않습니다.'
    },
    inquiries: inquiries
  }, null, 2);

  return { text: text, count: inquiries.length, skipped: skipped };
}


/**
 * 운영실 실시간 연동 응답
 *
 * 학생 원문을 공개 저장소에 올리지 않으면서도 어느 기기에서나 확인하려면,
 * 파일로 내보내는 대신 이 통로로 그때그때 읽어 가면 된다.
 * 토큰이 맞지 않으면 아무 내용도 싣지 않는다.
 */
function serveInquiryFeed_(params) {
  const callback = String(params.callback || '').replace(/[^A-Za-z0-9_$.]/g, '').slice(0, 60);
  let body;
  if (!validTeacherToken_(params.token)) {
    body = { ok: false, error: '교사용 열쇠가 올바르지 않습니다. 시트에서 링크를 다시 받아 주세요.' };
  } else {
    const built = buildManagerJson_();
    const payload = JSON.parse(built.text);
    payload.ok = true;
    payload.pending = built.skipped;
    payload.syncedAt = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    body = payload;
  }
  const json = JSON.stringify(body);
  if (!callback) {
    return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(callback + '(' + json + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

/** 운영실에 붙여 넣을 연결 주소를 보여 준다. */
function showManagerFeedLink() {
  const deploymentUrl = ScriptApp.getService().getUrl();
  if (!deploymentUrl) {
    SpreadsheetApp.getUi().alert('먼저 웹앱을 배포한 뒤 다시 실행해 주세요.');
    return;
  }
  const url = deploymentUrl + '?view=inquiries&token=' + encodeURIComponent(ensureTeacherToken_());
  const html = HtmlService.createHtmlOutput(
    '<div style="font:14px/1.7 sans-serif;padding:20px">' +
    '<h3 style="margin-top:0">운영실 실시간 연결 주소</h3>' +
    '<p>탐구 운영실 화면에서 <b>실시간 연결</b>에 이 주소를 한 번 붙여 넣으면, 그 기기에서는 계속 시트를 바로 읽습니다.</p>' +
    '<textarea id="u" style="width:100%;height:82px;font:12px/1.5 Consolas,monospace" readonly>' +
    escapeHtml_(url) + '</textarea>' +
    '<button style="margin-top:10px;padding:8px 14px;font-size:14px;cursor:pointer" ' +
    'onclick="var t=this.parentNode.querySelector(&quot;textarea&quot;);t.select();document.execCommand(&quot;copy&quot;);this.textContent=&quot;복사했습니다&quot;">주소 복사</button>' +
    '<p style="color:#a3402c;font-size:12px;margin-top:14px">이 주소에는 교사용 열쇠가 들어 있습니다. 학생에게 전달하거나 공개 문서에 적지 마세요.</p></div>'
  ).setWidth(600).setHeight(320);
  SpreadsheetApp.getUi().showModalDialog(html, '운영실 실시간 연결');
}
