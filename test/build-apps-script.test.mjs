import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { buildAppsScript } from '../build-tools/build-apps-script.mjs';

const root = path.resolve(import.meta.dirname, '..');

function createFixture() {
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'multi-lang-qa-build-'));
    fs.mkdirSync(path.join(fixtureDir, 'build-tools'));
    fs.mkdirSync(path.join(fixtureDir, 'frontend'));

    fs.copyFileSync(
        path.join(root, 'build-tools', 'build-apps-script.mjs'),
        path.join(fixtureDir, 'build-tools', 'build-apps-script.mjs'),
    );
    fs.copyFileSync(
        path.join(root, 'frontend', 'index.html'),
        path.join(fixtureDir, 'frontend', 'index.html'),
    );
    fs.writeFileSync(
        path.join(fixtureDir, 'Code.js'),
        "function doGet() {\n    return HtmlService.createHtmlOutputFromFile('Index').setTitle('Multi Lang QA');\n}\n",
    );

    return fixtureDir;
}

test('Apps Script build injects hosted PNG favicon into HTML and HtmlService output', async () => {
    const fixtureDir = createFixture();

    await buildAppsScript({
        rootDir: fixtureDir,
        version: '1.2.3',
        pagesBaseUrl: 'https://example.test/multi-lang-qa/',
    });

    const indexHtml = fs.readFileSync(
        path.join(fixtureDir, 'dist', 'apps-script', 'Index.html'),
        'utf8',
    );
    const codeJs = fs.readFileSync(path.join(fixtureDir, 'dist', 'apps-script', 'Code.js'), 'utf8');

    assert.match(indexHtml, /<title>Multi Lang QA 1\.2\.3<\/title>/);
    assert.match(
        indexHtml,
        /<link rel="icon" type="image\/png" href="https:\/\/example\.test\/multi-lang-qa\/v\/1\.2\.3\/logo\.png" \/>/,
    );
    assert.match(
        codeJs,
        /\.setTitle\('Multi Lang QA 1\.2\.3'\)\.setFaviconUrl\('https:\/\/example\.test\/multi-lang-qa\/v\/1\.2\.3\/logo\.png'\)/,
    );
});
