const props = PropertiesService.getScriptProperties();

const TAB_NAME = 'QuestionsDB';
const SHEET_ID = props.getProperty('SPREADSHEET_ID');

function getHeaders(sheet) {
    return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function parseQuestions(sheet) {
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    return data.map((row) => Object.fromEntries(headers.map((h, i) => [h, String(row[i])])));
}

function getAllQuestions() {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
    return parseQuestions(sheet);
}

function addQuestion(q) {
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    if (!lock.tryLock(5000)) {
        return { success: false, error: 'Could not acquire lock.' };
    }

    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
        if (q.text === '') {
            return {
                success: false,
                error: "Invalid data: the question text can't be empty.",
            };
        }
        q.timestamp = String(Date.now());
        q.status = 'none';
        q.version = '0';

        const newRow = getHeaders(sheet).map((h) => q[h]);
        sheet.appendRow(newRow);
        return { success: true };
    } finally {
        lock.releaseLock();
    }
}

function updateQuestion(newQ) {
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    if (!lock.tryLock(5000)) {
        return { success: false, error: 'Could not acquire lock.' };
    }

    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
        const questions = parseQuestions(sheet);
        const headers = getHeaders(sheet);

        for (const [i, q] of questions.entries()) {
            if (q.timestamp !== newQ.timestamp) {
                continue;
            }
            if (q.version != newQ.version && q.status !== 'data') {
                return {
                    success: false,
                    error: 'Conflict: another user has updated this question.',
                };
            }
            if (newQ.text === '') {
                return {
                    success: false,
                    error: "Invalid data: the question text can't be empty.",
                };
            }
            newQ.version = String(parseInt(q.version) + 1);
            const newRow = headers.map((h) => newQ[h]);
            sheet.getRange(i + 2, 1, 1, headers.length).setValues([newRow]);
            return { success: true };
        }
        return { success: false, error: 'Question not found.' };
    } finally {
        lock.releaseLock();
    }
}

function updateQuestionStatus(newQ) {
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    if (!lock.tryLock(5000)) {
        return { success: false, error: 'Could not acquire lock.' };
    }

    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
        const questions = parseQuestions(sheet);
        const headers = getHeaders(sheet);

        for (const [i, q] of questions.entries()) {
            if (q.timestamp === newQ.timestamp) {
                q.status = newQ.status;
                const newRow = headers.map((h) => q[h]);
                sheet.getRange(i + 2, 1, 1, headers.length).setValues([newRow]);
                return { success: true };
            }
        }
        return { success: false, error: 'Question not found.' };
    } finally {
        lock.releaseLock();
    }
}

function deleteQuestion(timestamp) {
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    if (!lock.tryLock(5000)) {
        return { success: false, error: 'Could not acquire lock.' };
    }

    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
        const questions = getAllQuestions();

        for (const [i, q] of questions.entries()) {
            if (q.timestamp === timestamp) {
                sheet.deleteRow(i + 2);
                return { success: true };
            }
        }
        return { success: false, error: 'Question not found.' };
    } finally {
        lock.releaseLock();
    }
}

function deleteAllQuestions() {
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    if (!lock.tryLock(5000)) {
        return { success: false, error: 'Could not acquire lock.' };
    }

    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
        const lastRow = sheet.getLastRow();

        if (lastRow > 2) {
            sheet.deleteRows(3, lastRow - 2);
        }
        return { success: true };
    } finally {
        lock.releaseLock();
    }
}

function getTranslation(text, sourceLanguage, targetLanguage = 'en') {
    return LanguageApp.translate(text, sourceLanguage, targetLanguage);
}

function doGet() {
    return HtmlService.createHtmlOutputFromFile('Index');
}
