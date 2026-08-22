const SHEET_NAMES = Object.freeze({
  prompts: '학생발문',
  responses: '학생답변',
  settings: '설정'
});

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('2026 수학 주제탐구 학생 질문함')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getStudentWorkspace(studentCode) {
  const code = normalizeCode_(studentCode);
  if (!code) return failure_('학생 코드를 입력해 주세요.');

  const rows = getPromptRows_().filter(function (row) {
    return normalizeCode_(row['학생코드']) === code && row['상태'] !== '비활성';
  });

  if (!rows.length) return failure_('코드를 확인하지 못했습니다. 선생님께 받은 코드를 다시 확인해 주세요.');

  return {
    ok: true,
    student: {
      code: code,
      id: rows[0]['학생ID'],
      name: rows[0]['이름']
    },
    inquiries: rows.map(function (row) {
      return {
        id: row['탐구ID'],
        subject: row['과목'],
        title: row['주제'],
        question: row['현재질문'],
        concepts: row['핵심개념'],
        promptVersion: row['발문버전'],
        prompts: [row['발문1'], row['발문2'], row['발문3']]
      };
    })
  };
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

function getPromptRows_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.prompts);
  if (!sheet) throw new Error('학생발문 시트를 찾을 수 없습니다.');
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
