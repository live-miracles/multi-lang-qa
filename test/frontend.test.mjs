import assert from 'node:assert/strict';
import test from 'node:test';

import { createElementStub, loadFrontendScripts } from './frontend-harness.mjs';

function loadScriptHelpers() {
    return loadFrontendScripts(['frontend/script.js'], { trimScriptBoot: true });
}

function plain(value) {
    return JSON.parse(JSON.stringify(value));
}

function createGoogleRun(methodResponses) {
    return {
        withFailureHandler(onFailure) {
            return {
                withSuccessHandler(onSuccess) {
                    return Object.fromEntries(
                        Object.entries(methodResponses).map(([method, response]) => [
                            method,
                            (...args) => {
                                if (response instanceof Error) {
                                    onFailure(response);
                                } else if (typeof response === 'function') {
                                    onSuccess(response(...args));
                                } else {
                                    onSuccess(response);
                                }
                            },
                        ]),
                    );
                },
            };
        },
    };
}

test('selected question helpers read and update the data row', () => {
    const runtime = loadScriptHelpers();
    const questions = [
        { status: 'data', name: 'selected', text: '2' },
        { timestamp: '2', status: 'none' },
    ];

    assert.equal(runtime.get('getSelectedId')(questions), '2');

    runtime.get('setSelectedId')(questions, '3');

    assert.equal(questions[0].text, '3');
});

test('question stats count only question rows and answered totals', () => {
    const runtime = loadScriptHelpers();

    assert.deepEqual(
        plain(
            runtime.get('getQuestionStats')([
                { status: 'data', language: '' },
                { status: 'answered', language: 'English' },
                { status: 'none', language: 'English' },
                { status: 'answered', language: 'Hindi' },
            ]),
        ),
        {
            All: { total: 3, answered: 2 },
            English: { total: 2, answered: 1 },
            Hindi: { total: 1, answered: 1 },
        },
    );
});

test('question HTML marks answered and selected questions', () => {
    const runtime = loadScriptHelpers();
    const html = runtime.get('getQuestionHtml')(
        {
            timestamp: '42',
            status: 'answered',
            language: 'English',
            name: 'Mira',
            nameTranslation: 'Mira',
            text: 'Original text',
            translation: 'Translated text',
        },
        '42',
    );

    assert.match(html, /id="42"/);
    assert.match(html, /q-answered/);
    assert.match(html, /checked onchange="updateStatus/);
    assert.match(html, /text-warning/);
    assert.match(html, /Mira: /);
    assert.match(html, /Translated text/);
});

test('textarea and input errors toggle classes and aria-invalid', () => {
    const runtime = loadScriptHelpers();
    const questionTextarea = createElementStub({
        classes: ['q-text', 'textarea-primary', 'text-primary'],
    });
    const input = createElementStub();

    runtime.get('setTextareaError')(questionTextarea, true);

    assert.equal(questionTextarea.classList.contains('textarea-error'), true);
    assert.equal(questionTextarea.classList.contains('textarea-primary'), false);
    assert.equal(questionTextarea.getAttribute('aria-invalid'), 'true');

    runtime.get('setInputError')(input, true);

    assert.equal(input.classList.contains('input-error'), true);
    assert.equal(input.getAttribute('aria-invalid'), 'true');
});

test('Google API wrapper caches successful question loads', async () => {
    const runtime = loadFrontendScripts(['frontend/google-api.js'], {
        googleRun: createGoogleRun({
            getAllQuestions: {
                success: true,
                questions: [{ timestamp: '1', text: 'Question' }],
            },
        }),
    });
    runtime.set('showErrorAlert', () => assert.fail('showErrorAlert should not be called'));

    assert.deepEqual(plain(await runtime.get('getAllQuestions')()), [
        { timestamp: '1', text: 'Question' },
    ]);
    assert.equal(runtime.storage.get('questions'), '[{"timestamp":"1","text":"Question"}]');
});

test('Google API wrapper falls back to cached questions after load errors', async () => {
    const runtime = loadFrontendScripts(['frontend/google-api.js'], {
        googleRun: createGoogleRun({
            getAllQuestions: new Error('offline'),
        }),
    });
    const errors = [];
    runtime.storage.set('questions', '[{"timestamp":"cached","text":"Saved"}]');
    runtime.set('showErrorAlert', (msg) => errors.push(String(msg)));

    assert.deepEqual(plain(await runtime.get('getAllQuestions')()), [
        { timestamp: 'cached', text: 'Saved' },
    ]);
    assert.deepEqual(errors, ['Error loading questions: Error: offline']);
});
