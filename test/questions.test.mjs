import assert from 'node:assert/strict';
import test from 'node:test';

import { createSheetStub, loadAppsScript } from './apps-script-harness.mjs';

function plain(value) {
    return JSON.parse(JSON.stringify(value));
}

test('parseQuestions maps spreadsheet rows into question objects', () => {
    const sheet = createSheetStub({
        rows: [
            ['timestamp', 'status', 'language', 'name', 'nameTranslation', 'text', 'translation'],
            [111, 'none', 'hi', 'Anu', 'Anu', 'Namaste?', 'Hello?'],
        ],
    });
    const runtime = loadAppsScript({ sheet });

    assert.deepEqual(plain(runtime.get('parseQuestions')(sheet)), [
        {
            timestamp: '111',
            status: 'none',
            language: 'hi',
            name: 'Anu',
            nameTranslation: 'Anu',
            text: 'Namaste?',
            translation: 'Hello?',
        },
    ]);
});

test('getAllQuestions returns cached questions without opening the sheet', () => {
    const runtime = loadAppsScript({
        cacheValues: {
            questions: JSON.stringify([{ timestamp: '111', text: 'Cached question' }]),
        },
    });

    assert.deepEqual(plain(runtime.get('getAllQuestions')()), {
        success: true,
        questions: [{ timestamp: '111', text: 'Cached question' }],
    });
    assert.deepEqual(runtime.calls.openedSheets, []);
});

test('addQuestion validates text and appends a normalized row', () => {
    const sheet = createSheetStub();
    const runtime = loadAppsScript({ sheet });
    const addQuestion = runtime.get('addQuestion');

    assert.deepEqual(plain(addQuestion({ text: '' })), {
        success: false,
        error: "Invalid data: the question text can't be empty.",
    });
    assert.deepEqual(sheet.calls.appendRows, []);

    assert.deepEqual(
        plain(
            addQuestion({
                language: 'en',
                name: 'Mira',
                nameTranslation: 'Mira',
                text: 'What is next?',
                translation: 'What is next?',
            }),
        ),
        { success: true },
    );
    assert.deepEqual(plain(sheet.calls.appendRows), [
        ['1234567890', 'none', 'en', 'Mira', 'Mira', 'What is next?', 'What is next?'],
    ]);
    assert.deepEqual(runtime.calls.lockWaits, [5000]);
    assert.equal(runtime.calls.lockReleases, 1);
});

test('updateQuestionStatus updates only the status cell for a matching question', () => {
    const sheet = createSheetStub();
    const runtime = loadAppsScript({
        sheet,
        cacheValues: {
            questions: JSON.stringify([
                { timestamp: '111', status: 'none' },
                { timestamp: '222', status: 'none' },
            ]),
        },
    });

    assert.deepEqual(
        plain(runtime.get('updateQuestionStatus')({ timestamp: '222', status: 'answered' })),
        {
            success: true,
        },
    );
    assert.equal(sheet.calls.ranges[0].row, 3);
    assert.equal(sheet.calls.ranges[0].column, 2);
    assert.deepEqual(plain(sheet.calls.ranges[0].values), [['answered']]);
});

test('deleteQuestion reports missing rows and deletes matching rows', () => {
    const sheet = createSheetStub();
    const runtime = loadAppsScript({
        sheet,
        cacheValues: {
            questions: JSON.stringify([{ timestamp: '111' }, { timestamp: '222' }]),
        },
    });

    assert.deepEqual(plain(runtime.get('deleteQuestion')('333')), {
        success: false,
        error: 'Question not found.',
    });
    assert.deepEqual(plain(runtime.get('deleteQuestion')('222')), { success: true });
    assert.deepEqual(sheet.calls.deletedRows, [3]);
});

test('deleteAllQuestions refuses empty sheets and deletes question rows', () => {
    const emptyRuntime = loadAppsScript({ sheet: createSheetStub({ lastRow: 2 }) });

    assert.deepEqual(plain(emptyRuntime.get('deleteAllQuestions')()), {
        success: false,
        error: 'No questions to delete.',
    });

    const sheet = createSheetStub({ lastRow: 5 });
    const runtime = loadAppsScript({ sheet });

    assert.deepEqual(plain(runtime.get('deleteAllQuestions')()), { success: true });
    assert.deepEqual(sheet.calls.deletedRows, [{ row: 3, count: 3 }]);
});
