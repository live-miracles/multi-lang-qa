import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const root = process.cwd();
const versionArg = process.argv[2] || process.env.VERSION || process.env.GITHUB_REF_NAME || '';
const version = versionArg.replace(/^refs\/tags\//, '').replace(/^v/, '');

const pagesBaseUrl = (
    process.env.PAGES_BASE_URL || 'https://live-miracles.github.io/multi-lang-qa'
).replace(/\/$/, '');

// Loaded in this order, same as the <script> tags in frontend/index.html.
const scriptFiles = ['bundle.umd.min.js', 'test-utils.js', 'google-api.js', 'script.js'];

// Apps Script's HTML service is fragile with non-ASCII text and treats `//` inside a template
// literal as a line comment, so keep inlined assets plain ASCII with no `//` sequences.
function escapeInlineScript(source) {
    return source
        .replace(/[^\x00-\x7f]/g, (ch) => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'))
        .replace(/\/\//g, '/\\/')
        .replace(/<\/script/gi, '<\\/script')
        .replace(/<!--/g, '<\\!--')
        .replace(/-->/g, '--\\>');
}

function escapeInlineCss(source) {
    return source.replace(/[^\x00-\x7f]/gu, (ch) => '\\' + ch.codePointAt(0).toString(16) + ' ');
}

export async function buildAppsScript({ rootDir = root, version, pagesBaseUrl }) {
    const normalizedVersion = (version || '').replace(/^refs\/tags\//, '').replace(/^v/, '');
    const logoUrl = `${pagesBaseUrl.replace(/\/$/, '')}/logo.png`;
    const appTitle = `Multi Lang QA${normalizedVersion ? ` ${normalizedVersion}` : ''}`;
    const outDir = path.join(rootDir, 'dist', 'apps-script');
    const frontendDir = path.join(rootDir, 'frontend');

    await fs.rm(outDir, { recursive: true, force: true });
    await fs.mkdir(outDir, { recursive: true });

    const indexHtml = await fs.readFile(path.join(frontendDir, 'index.html'), 'utf8');
    const assetBlockPattern =
        /    <link rel="icon" type="image\/png" href="\.\/logo\.png" \/>\r?\n    <link rel="stylesheet" href="\.\/output\.css" \/>\r?\n    <script src="\.\/bundle\.umd\.min\.js"><\/script>\r?\n    <script crossorigin src="\.\/test-utils\.js" defer><\/script>\r?\n    <script crossorigin src="\.\/google-api\.js" defer><\/script>\r?\n    <script crossorigin src="\.\/script\.js" defer><\/script>/;

    if (!assetBlockPattern.test(indexHtml)) {
        throw new Error(
            'Could not find the frontend asset block to replace in frontend/index.html.',
        );
    }

    const css = await fs.readFile(path.join(frontendDir, 'output.css'), 'utf8');
    const scripts = [];
    for (const filename of scriptFiles) {
        const code = await fs.readFile(path.join(frontendDir, filename), 'utf8');
        // Minifying drops comments and keeps top-level names, which the inline handlers rely on.
        scripts.push(
            filename.endsWith('.min.js')
                ? code.replace(/\/\/# sourceMappingURL=.*$/gm, '')
                : (await esbuild.transform(code, { loader: 'js', minify: true })).code,
        );
    }

    const inlineAssets = `    <link rel="icon" type="image/png" href="${logoUrl}" />\n    <style>${escapeInlineCss(css)}</style>`;
    const titledIndex = indexHtml
        .replace(assetBlockPattern, () => inlineAssets)
        .replace(/<title>.*?<\/title>/, `<title>${appTitle}</title>`)
        .replace(
            '</body>',
            () => `<script>${escapeInlineScript(scripts.join(';\n'))}</script>\n  </body>`,
        );

    const codeJs = await fs.readFile(path.join(rootDir, 'Code.js'), 'utf8');
    const titledCodeJs = codeJs.replace(
        ".setTitle('Multi Lang QA')",
        `.setTitle('${appTitle}').setFaviconUrl('${logoUrl}')`,
    );

    if (titledCodeJs === codeJs) {
        throw new Error("Could not find .setTitle('Multi Lang QA') to replace in Code.js.");
    }

    await fs.writeFile(path.join(outDir, 'Index.html'), titledIndex);
    await fs.writeFile(path.join(outDir, 'Code.js'), titledCodeJs);
    await fs.writeFile(
        path.join(outDir, 'appsscript.json'),
        `${JSON.stringify(
            {
                timeZone: 'Asia/Kolkata',
                exceptionLogging: 'STACKDRIVER',
                runtimeVersion: 'V8',
                webapp: {
                    executeAs: 'USER_DEPLOYING',
                    access: 'ANYONE',
                },
            },
            null,
            4,
        )}\n`,
    );

    return { outDir, version: normalizedVersion };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    try {
        const result = await buildAppsScript({ rootDir: root, version, pagesBaseUrl });
        console.log(
            `Generated Apps Script project in ${path.relative(root, result.outDir)}${result.version ? ` for v${result.version}` : ''}.`,
        );
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}
