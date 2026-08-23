const SHEET_NAMES = Object.freeze({
  roster: '학생명단',
  intake: '기초응답',
  prompts: '학생발문',
  responses: '학생답변',
  settings: '설정'
});

const REQUIRED_SUBJECTS = Object.freeze(['미적분Ⅰ', '기하']);

const SHEET_SCHEMAS = Object.freeze({
  '학생명단': ['학생ID', '학생코드', '이름', '상태', '등록일', '비고'],
  '기초응답': ['제출ID', '제출일시', '학생코드', '학생ID', '이름', '과목', '관심개념', '궁금한점', '선정이유', '탐구방법', '웹앱아이디어', '학생메모', '처리상태', '교사확정주제', '교사확정질문', '가공메모'],
  '학생발문': ['학생코드', '학생ID', '탐구ID', '이름', '과목', '주제', '현재질문', '핵심개념', '발문1', '발문2', '발문3', '발문버전', '상태', '수정일'],
  '학생답변': ['제출ID', '제출시각', '학생코드', '학생ID', '탐구ID', '이름', '과목', '주제', '발문버전', '답변1', '답변2', '답변3', '새로운질문', '학생메모', '교사검토상태'],
  '설정': ['설정키', '값', '설명']
});

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('주제탐구 관리')
    .addItem('시트 구조 점검', 'setupInquiryWorkbook')
    .addItem('현재 운영 상태', 'showInquiryStatus')
    .addToUi();
}

function setupInquiryWorkbook() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SHEET_SCHEMAS).forEach(function (sheetName) {
    ensureSheet_(spreadsheet, sheetName, SHEET_SCHEMAS[sheetName]);
  });
  ensureSetting_('SUBMISSION_OPEN', 'TRUE', 'TRUE이면 학생 제출을 받습니다.');
  return getInquirySystemStatus();
}

function showInquiryStatus() {
  const status = getInquirySystemStatus();
  SpreadsheetApp.getUi().alert(
    '2026 수학 주제탐구 운영 상태',
    [
      '등록 학생: ' + status.students + '명',
      '기초응답: ' + status.intakes + '건 / 예상 ' + status.expectedIntakes + '건',
      '두 과목 완료: ' + status.completedStudents + '명',
      '발문 공개: ' + status.promptRows + '건',
      '학생답변: ' + status.responseRows + '건',
      '제출 상태: ' + (status.submissionOpen ? '열림' : '닫힘')
    ].join('\n'),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function getInquirySystemStatus() {
  const roster = getRosterRows_().filter(function (row) { return row['상태'] !== '비활성'; });
  const intakes = getIntakeRows_();
  const completedStudents = roster.filter(function (student) {
    const code = normalizeCode_(student['학생코드']);
    return REQUIRED_SUBJECTS.every(function (subject) {
      return intakes.some(function (row) {
        return normalizeCode_(row['학생코드']) === code && row['과목'] === subject;
      });
    });
  }).length;
  return {
    ok: true,
    students: roster.length,
    intakes: intakes.length,
    expectedIntakes: roster.length * REQUIRED_SUBJECTS.length,
    completedStudents: completedStudents,
    promptRows: getPromptRows_().filter(function (row) { return row['상태'] !== '비활성'; }).length,
    responseRows: getRows_(SHEET_NAMES.responses).length,
    submissionOpen: String(getSetting_('SUBMISSION_OPEN')).toUpperCase() === 'TRUE'
  };
}

function doGet() {
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

  const base = {
    ok: true,
    student: { code: code, id: student['학생ID'], name: student['이름'] }
  };

  if (student['상태'] === '질문정교화') {
    const rows = getPromptRows_().filter(function (row) {
      return normalizeCode_(row['학생코드']) === code && row['상태'] !== '비활성';
    });
    if (rows.length) {
      base.mode = 'prompts';
      base.inquiries = rows.map(function (row) {
        return {
          id: row['탐구ID'],
          subject: row['과목'],
          title: row['주제'],
          question: row['현재질문'],
          concepts: row['핵심개념'],
          promptVersion: row['발문버전'],
          prompts: [row['발문1'], row['발문2'], row['발문3']]
        };
      });
      return base;
    }
  }

  const intakeRows = getIntakeRows_().filter(function (row) {
    return normalizeCode_(row['학생코드']) === code;
  });
  const completedSubjects = REQUIRED_SUBJECTS.filter(function (subject) {
    return intakeRows.some(function (row) { return row['과목'] === subject; });
  });

  if (completedSubjects.length === REQUIRED_SUBJECTS.length) {
    base.mode = 'waiting';
    base.completedSubjects = completedSubjects;
    base.message = '미적분Ⅰ과 기하의 기초 질문이 모두 제출되었습니다. 선생님이 내용을 읽고 다음 맞춤 발문을 준비하고 있습니다.';
    return base;
  }

  base.mode = 'intake';
  base.subjects = REQUIRED_SUBJECTS.map(function (subject) {
    return { name: subject, submitted: completedSubjects.indexOf(subject) !== -1 };
  });
  return base;
}

function submitInitialIntake(payload) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return failure_('제출이 몰리고 있습니다. 잠시 후 다시 시도해 주세요.');

  try {
    if (String(getSetting_('SUBMISSION_OPEN')).toUpperCase() !== 'TRUE') {
      return failure_('현재는 답변 제출 기간이 아닙니다.');
    }

    payload = payload || {};
    const code = normalizeCode_(payload.studentCode);
    const subject = cleanText_(payload.subject, 30);
    const student = getRosterRows_().find(function (row) {
      return normalizeCode_(row['학생코드']) === code && row['상태'] !== '비활성';
    });
    if (!student) return failure_('학생 정보를 확인하지 못했습니다. 코드를 다시 확인해 주세요.');
    if (REQUIRED_SUBJECTS.indexOf(subject) === -1) return failure_('과목을 다시 선택해 주세요.');

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

    const alreadySubmitted = getIntakeRows_().some(function (row) {
      return normalizeCode_(row['학생코드']) === code && row['과목'] === subject;
    });
    if (alreadySubmitted) return failure_(subject + ' 기초 질문은 이미 제출되었습니다. 수정이 필요하면 선생님께 알려 주세요.');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.intake);
    if (!sheet) throw new Error('기초응답 시트를 찾을 수 없습니다.');
    const submissionId = Utilities.getUuid();
    sheet.appendRow([
      submissionId,
      new Date(),
      safeCell_(code),
      safeCell_(student['학생ID']),
      safeCell_(student['이름']),
      safeCell_(subject),
      safeCell_(fields.concept),
      safeCell_(fields.curiosity),
      safeCell_(fields.reason),
      safeCell_(fields.method),
      safeCell_(fields.appIdea),
      safeCell_(fields.studentNote),
      '가공 대기',
      '',
      '',
      ''
    ]);

    const completedCount = getIntakeRows_().filter(function (row) {
      return normalizeCode_(row['학생코드']) === code;
    }).length;
    if (completedCount >= REQUIRED_SUBJECTS.length) updateRosterStatus_(student['학생ID'], '기초응답완료');

    return {
      ok: true,
      submissionId: submissionId,
      message: subject + ' 기초 질문이 저장되었습니다.',
      allCompleted: completedCount >= REQUIRED_SUBJECTS.length
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
    if (String(getSetting_('SUBMISSION_OPEN')).toUpperCase() !== 'TRUE') {
      return failure_('현재는 답변 제출 기간이 아닙니다.');
    }

    payload = payload || {};
    const code = normalizeCode_(payload.studentCode);
    const inquiryId = cleanText_(payload.inquiryId, 120);
    const answers = Array.isArray(payload.answers) ? payload.answers.map(function (answer) {
      return cleanText_(answer, 5000);
    }) : [];

    if (!code || !inquiryId) return failure_('학생 코드와 탐구 정보를 확인해 주세요.');
    if (answers.length !== 3 || answers.some(function (answer) { return answer.length < 2; })) {
      return failure_('세 발문에 대한 답변을 모두 작성해 주세요.');
    }

    const promptRow = getPromptRows_().find(function (row) {
      return normalizeCode_(row['학생코드']) === code && row['탐구ID'] === inquiryId && row['상태'] !== '비활성';
    });
    if (!promptRow) return failure_('현재 발문을 찾지 못했습니다. 화면을 새로 불러와 주세요.');

    const responseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.responses);
    if (!responseSheet) throw new Error('학생답변 시트를 찾을 수 없습니다.');

    const submissionId = Utilities.getUuid();
    responseSheet.appendRow([
      submissionId,
      new Date(),
      safeCell_(code),
      safeCell_(promptRow['학생ID']),
      safeCell_(promptRow['탐구ID']),
      safeCell_(promptRow['이름']),
      safeCell_(promptRow['과목']),
      safeCell_(promptRow['주제']),
      safeCell_(promptRow['발문버전']),
      safeCell_(answers[0]),
      safeCell_(answers[1]),
      safeCell_(answers[2]),
      safeCell_(cleanText_(payload.newQuestion, 3000)),
      safeCell_(cleanText_(payload.studentNote, 2000)),
      '검토 대기'
    ]);

    return { ok: true, submissionId: submissionId, message: '답변이 선생님께 전달되었습니다.' };
  } catch (error) {
    console.error(error);
    return failure_('저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
  } finally {
    lock.releaseLock();
  }
}

function getRosterRows_() { return getRows_(SHEET_NAMES.roster); }
function getIntakeRows_() { return getRows_(SHEET_NAMES.intake); }
function getPromptRows_() { return getRows_(SHEET_NAMES.prompts); }

function getRows_(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error(sheetName + ' 시트를 찾을 수 없습니다.');
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).filter(function (row) {
    return row.some(function (cell) { return cell !== ''; });
  }).map(function (row) {
    const record = {};
    headers.forEach(function (header, index) { record[header] = row[index] || ''; });
    return record;
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

  const existing = sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
  const isEmpty = existing.every(function (value) { return value === ''; });
  if (isEmpty) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    const mismatched = headers.filter(function (header, index) { return existing[index] !== header; });
    if (mismatched.length) {
      throw new Error(sheetName + ' 시트의 열 순서가 예상과 다릅니다: ' + mismatched.join(', '));
    }
  }

  sheet.setFrozenRows(1);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold').setBackground('#173f37').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, headers.length);
  return sheet;
}

function ensureSetting_(key, value, description) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.settings);
  const values = sheet.getDataRange().getDisplayValues();
  for (let index = 1; index < values.length; index += 1) {
    if (values[index][0] === key) return;
  }
  sheet.appendRow([key, value, description]);
}

function getSetting_(key) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.settings);
  if (!sheet) return '';
  const values = sheet.getDataRange().getDisplayValues();
  for (let index = 1; index < values.length; index += 1) {
    if (values[index][0] === key) return values[index][1];
  }
  return '';
}

function normalizeCode_(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
}

function cleanText_(value, maxLength) {
  return String(value || '').replace(/\u0000/g, '').trim().slice(0, maxLength);
}

function safeCell_(value) {
  const text = String(value || '');
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function failure_(message) {
  return { ok: false, message: message };
}
