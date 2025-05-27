const props = PropertiesService.getScriptProperties();

const TAB_NAME = 'QuestionsDB';
const SHEET_ID = props.getProperty('SPREADSHEET_ID');

function getAllQuestions() {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    return data.map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i]])));
}

function addQuestion(sheetId, language, name, text, translation) {
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
        const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(TAB_NAME);
        const timestamp = new Date().getTime(); // Will also be used as ID
        const answered = false;
        const skipped = false;
        const hidden = false;
        const version = 1;

        sheet.appendRow([
            timestamp,
            language,
            name,
            text,
            translation,
            answered,
            skipped,
            hidden,
            version,
        ]);
        return { success: true, timestamp };
    } finally {
        lock.releaseLock();
    }
}

function updateQuestion(id, newQuestion) {
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
            if (data[i][0] == id) {
                const sheetVersion = data[i][5];
                if (sheetVersion != newQuestion.version) {
                    return {
                        success: false,
                        error: 'Conflict: another user has updated this question.',
                    };
                }
                // Update row
                sheet
                    .getRange(i + 1, 2, 1, 5)
                    .setValues([
                        [
                            new Date().toISOString(),
                            newQuestion.language,
                            newQuestion.text,
                            newQuestion.translation,
                            sheetVersion + 1,
                        ],
                    ]);
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
