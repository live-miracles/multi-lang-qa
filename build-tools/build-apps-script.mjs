import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const versionArg = process.argv[2] || process.env.VERSION || process.env.GITHUB_REF_NAME || '';
const version = versionArg.replace(/^refs\/tags\//, '').replace(/^v/, '');

const pagesBaseUrl = (
    process.env.PAGES_BASE_URL || 'https://live-miracles.github.io/multi-lang-qa'
).replace(/\/$/, '');

export async function buildAppsScript({ rootDir = root, version, pagesBaseUrl }) {
    if (!version) {
        throw new Error('Usage: npm run apps-script:build -- <version>');
    }

    const normalizedVersion = version.replace(/^refs\/tags\//, '').replace(/^v/, '');
    const normalizedPagesBaseUrl = pagesBaseUrl.replace(/\/$/, '');
    const versionBaseUrl = `${normalizedPagesBaseUrl}/v/${normalizedVersion}`;
    const logoUrl = `${versionBaseUrl}/logo.png`;
    const appTitle = `Multi Lang QA ${normalizedVersion}`;
    const outDir = path.join(rootDir, 'dist', 'apps-script');

    const productionAssetBlock = `    <link rel="icon" type="image/png" href="${logoUrl}" />
    <link rel="stylesheet" href="${versionBaseUrl}/output.css" />
    <script src="${versionBaseUrl}/bundle.umd.min.js"></script>
    <script crossorigin src="${versionBaseUrl}/test-utils.js" defer></script>
    <script crossorigin src="${versionBaseUrl}/google-api.js" defer></script>
    <script crossorigin src="${versionBaseUrl}/script.js" defer></script>`;

    await fs.rm(outDir, { recursive: true, force: true });
    await fs.mkdir(outDir, { recursive: true });

    const indexPath = path.join(rootDir, 'frontend', 'index.html');
    const indexHtml = await fs.readFile(indexPath, 'utf8');
    const assetBlockPattern =
        /    <link rel="icon" type="image\/png" href="\.\/logo\.png" \/>\r?\n    <link rel="stylesheet" href="\.\/output\.css" \/>\r?\n    <script src="\.\/bundle\.umd\.min\.js"><\/script>\r?\n    <script crossorigin src="\.\/test-utils\.js" defer><\/script>\r?\n    <script crossorigin src="\.\/google-api\.js" defer><\/script>\r?\n    <script crossorigin src="\.\/script\.js" defer><\/script>/;
    const appsScriptIndex = indexHtml.replace(assetBlockPattern, productionAssetBlock);

    if (appsScriptIndex === indexHtml) {
        throw new Error(
            'Could not find the frontend asset block to replace in frontend/index.html.',
        );
    }

    const titledIndex = appsScriptIndex.replace(
        /<title>.*?<\/title>/,
        `<title>${appTitle}</title>`,
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
            `Generated Apps Script project in ${path.relative(root, result.outDir)} for v${result.version}.`,
        );
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}
