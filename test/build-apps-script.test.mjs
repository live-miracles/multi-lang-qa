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
    fs.writeFileSync(path.join(fixtureDir, 'frontend', 'output.css'), 'body{content:"é"}');
    for (const file of ['bundle.umd.min.js', 'test-utils.js', 'google-api.js', 'script.js']) {
        const name = file.replace(/\W/g, '_');
        fs.writeFileSync(
            path.join(fixtureDir, 'frontend', file),
            `// comment\nvar ${name} = "https://x.test/é";\n`,
        );
    }
    fs.writeFileSync(
        path.join(fixtureDir, 'Code.js'),
        "function doGet() {\n    return HtmlService.createHtmlOutputFromFile('Index')\n        .setTitle('Multi Lang QA')\n        .addMetaTag('viewport', 'width=device-width, initial-scale=1');\n}\n",
    );

    return fixtureDir;
}

test('Apps Script build inlines CSS and JS and points the favicon at the hosted PNG', async () => {
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
        /<link rel="icon" type="image\/png" href="https:\/\/example\.test\/multi-lang-qa\/logo\.png" \/>/,
    );
    assert.match(
        codeJs,
        /\.setTitle\('Multi Lang QA 1\.2\.3'\)\.setFaviconUrl\('https:\/\/example\.test\/multi-lang-qa\/logo\.png'\)/,
    );
    assert.ok(indexHtml.includes('<style>body{content:"\\e9 "}</style>'));
    assert.doesNotMatch(indexHtml, /<script[^>]* src="\.\//);
    assert.doesNotMatch(indexHtml, /output\.css/);
    assert.ok(indexHtml.includes('var script_js="https:/\\/x.test/\\xE9"'));
    assert.ok(indexHtml.includes('var google_api_js='));
    assert.match(codeJs, /\.addMetaTag\('viewport', 'width=device-width, initial-scale=1'\)/);
});
