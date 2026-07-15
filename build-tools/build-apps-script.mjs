import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const versionArg = process.argv[2] || process.env.VERSION || process.env.GITHUB_REF_NAME || '';
const version = versionArg.replace(/^refs\/tags\//, '').replace(/^v/, '');

if (!version) {
    console.error('Usage: npm run apps-script:build -- <version>');
    process.exit(1);
}

const pagesBaseUrl = (
    process.env.PAGES_BASE_URL || 'https://live-miracles.github.io/multi-lang-qa'
).replace(/\/$/, '');
const versionBaseUrl = `${pagesBaseUrl}/v/${version}`;
const appTitle = `Multi Lang QA ${version}`;
const outDir = path.join(root, 'dist', 'apps-script');

const productionAssetBlock = `    <link rel="icon" type="image/svg+xml" href="${versionBaseUrl}/logo.svg" />
    <link rel="stylesheet" href="${versionBaseUrl}/output.css" />
    <script src="${versionBaseUrl}/bundle.umd.min.js"></script>
    <script crossorigin src="${versionBaseUrl}/test-utils.js" defer></script>
    <script crossorigin src="${versionBaseUrl}/google-api.js" defer></script>
    <script crossorigin src="${versionBaseUrl}/script.js" defer></script>`;

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });

const indexPath = path.join(root, 'frontend', 'index.html');
const indexHtml = await fs.readFile(indexPath, 'utf8');
const assetBlockPattern =
    /    <link rel="icon" type="image\/svg\+xml" href="\.\/logo\.svg" \/>\r?\n    <link rel="stylesheet" href="\.\/output\.css" \/>\r?\n    <script src="\.\/bundle\.umd\.min\.js"><\/script>\r?\n    <script crossorigin src="\.\/test-utils\.js" defer><\/script>\r?\n    <script crossorigin src="\.\/google-api\.js" defer><\/script>\r?\n    <script crossorigin src="\.\/script\.js" defer><\/script>/;
const appsScriptIndex = indexHtml.replace(assetBlockPattern, productionAssetBlock);

if (appsScriptIndex === indexHtml) {
    console.error('Could not find the frontend asset block to replace in frontend/index.html.');
    process.exit(1);
}

const titledIndex = appsScriptIndex.replace(/<title>.*?<\/title>/, `<title>${appTitle}</title>`);
const codeJs = await fs.readFile(path.join(root, 'Code.js'), 'utf8');
const titledCodeJs = codeJs.replace(".setTitle('Multi Lang QA')", `.setTitle('${appTitle}')`);

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

console.log(`Generated Apps Script project in ${path.relative(root, outDir)} for v${version}.`);
