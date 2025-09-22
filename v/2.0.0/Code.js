const props = PropertiesService.getScriptProperties();
const SHEET_ID = props.getProperty('SPREADSHEET_ID');
const TAB_NAME = 'QuestionsDB';

const HEADERS = [
    'timestamp',
    'status',
    'language',
    'name',
    'nameTranslation',
    'text',
    'translation',
];
const STATUS_COL = 2;
const TEXT_COL = 6;
const SELECTED_ROW = 2;

function parseQuestions(sheet) {
    const data = sheet.getDataRange().getValues();
    data.shift(); // remove headers
    return data.map((row) => Object.fromEntries(HEADERS.map((h, i) => [h, String(row[i])])));
}

function getAllQuestions() {
    try {
        const cache = CacheService.getScriptCache();
        const questions = cache.get('questions');

        if (questions) {
            return JSON.parse(questions);
        } else {
            const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
            const questions = parseQuestions(sheet);
            cache.put('questions', JSON.stringify(questions), 5);
            return questions;
        }
    } catch (err) {
        console.error('Error in getAllQuestions:', err.stack || err);
        throw err;
    }
}

function addQuestion(q) {
    if (q.text === '') {
        return {
            success: false,
            error: "Invalid data: the question text can't be empty.",
        };
    }
    q.timestamp = String(Date.now());
    q.status = 'none';

    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
        const newRow = HEADERS.map((h) => q[h]);

        const lock = LockService.getScriptLock();
        lock.waitLock(5000);
        try {
            sheet.appendRow(newRow);
            return { success: true };
        } finally {
            lock.releaseLock();
        }
    } catch (err) {
        console.error('Error in addQuestion:', err.stack || err);
        throw err;
    }
}

function updateQuestion(newQ) {
    if (newQ.text === '') {
        return {
            success: false,
            error: "Invalid data: the question text can't be empty.",
        };
    }

    try {
        const questions = getAllQuestions();
        let row = null;
        for (const [i, q] of questions.entries()) {
            if (q.timestamp !== newQ.timestamp) {
                continue;
            }
            row = i + 2;
            break;
        }
        if (row === null) {
            return { success: false, error: 'Question not found.' };
        }

        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
        const newRow = HEADERS.map((h) => newQ[h]);

        const lock = LockService.getScriptLock();
        lock.waitLock(5000);
        try {
            sheet.getRange(row, 1, 1, newRow.length).setValues([newRow]);
            return { success: true };
        } finally {
            lock.releaseLock();
        }
    } catch (err) {
        console.error('Error in updateQuestion:', err.stack || err);
        throw err;
    }
}

function updateQuestionStatus(newQ) {
    try {
        const questions = getAllQuestions();

        let row = null;
        for (const [i, q] of questions.entries()) {
            if (q.timestamp === newQ.timestamp) {
                row = i + 2;
                break;
            }
        }
        if (row === null) {
            return { success: false, error: 'Question not found.' };
        }

        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);

        sheet.getRange(row, STATUS_COL, 1, 1).setValues([[newQ.status]]);
        return { success: true };
    } catch (err) {
        console.error('Error in updateQuestionStatus:', err.stack || err);
        throw err;
    }
}

function updateSelectedQuestion(timestamp) {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
        sheet.getRange(SELECTED_ROW, TEXT_COL, 1, 1).setValues([[timestamp]]);
        return { success: true };
    } catch (err) {
        console.error('Error in updateSelected:', err.stack || err);
        throw err;
    }
}

function deleteQuestion(timestamp) {
    try {
        const questions = getAllQuestions();
        let row = null;
        for (const [i, q] of questions.entries()) {
            if (q.timestamp === timestamp) {
                row = i + 2;
                break;
            }
        }

        if (row === null) {
            return { success: false, error: 'Question not found.' };
        }

        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);

        const lock = LockService.getScriptLock();
        lock.waitLock(5000);
        try {
            sheet.deleteRow(row);
            return { success: true };
        } finally {
            lock.releaseLock();
        }
    } catch (err) {
        console.error('Error in deleteQuestion:', err.stack || err);
        throw err;
    }
}

function deleteAllQuestions() {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
        const lastRow = sheet.getLastRow();
        if (lastRow <= 2) {
            return { success: false, error: 'No questions to delete.' };
        }

        const lock = LockService.getScriptLock();
        lock.waitLock(5000);
        try {
            sheet.deleteRows(3, lastRow - 2);
            return { success: true };
        } finally {
            lock.releaseLock();
        }
    } catch (err) {
        console.error('Error in deleteAllQuestions:', err.stack || err);
        throw err;
    }
}

function getTranslation(text, sourceLanguage, targetLanguage = 'en') {
    return LanguageApp.translate(text, sourceLanguage, targetLanguage);
}

function doGet() {
    return HtmlService.createHtmlOutputFromFile('Index');
}
