const props = PropertiesService.getScriptProperties();

const TAB_NAME = 'QuestionsDB';
const SHEET_ID = props.getProperty('SPREADSHEET_ID');

function getAllQuestions() {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    return data.map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i]])));
}

function addQuestion(q) {
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
        const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(TAB_NAME);
        const timestamp = new Date().getTime(); // Will also be used as ID
        const status = 'none';
        const version = 0;

        sheet.appendRow([
            timestamp,
            status,
            version,
            q.language,
            q.name,
            q.nameTranslation,
            q.text,
            q.translation,
        ]);
        return { success: true, timestamp };
    } finally {
        lock.releaseLock();
    }
}

function updateQuestion(newQ) {
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
        const data = sheet.getDataRange().getValues();
        const headers = data[0];
        for (let i = 1; i < data.length; i++) {
            const q = {};
            headers.forEach((key, i) => {
                q[key] = row[i];
            });

            if (q.timestamp == newQ.timestamp) {
                if (q.version != newQ.version) {
                    return {
                        success: false,
                        error: 'Conflict: another user has updated this question.',
                    };
                }
                newQ.version = parseInt(q.version) + 1;

                const newRow = headers.map((h) => newQ[h]);
                sheet.getRange(i + 1, 1, 1, headers.length).setValues([newRow]);
                return { success: true };
            }
        }
        return { success: false, error: 'Question not found.' };
    } finally {
        lock.releaseLock();
    }
}

function deleteQuestion(id) {
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
            if (data[i][0] == id) {
                sheet.deleteRow(i + 1);
                return { success: true };
            }
        }
        return { success: false, error: 'Question not found.' };
    } finally {
        lock.releaseLock();
    }
}

function doGet() {
    return HtmlService.createHtmlOutputFromFile('Index');
}
