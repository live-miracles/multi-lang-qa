// One-command setup and update: `npm run setup`.
//
// First run: logs in to Google, creates an Apps Script project, uploads the app and publishes
// it as a web app. The spreadsheet is created automatically the first time the app is opened.
// Later runs: re-uploads the app and moves the existing web app deployment to the new version,
// so the public link stays the same.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execa } from 'execa';
import { buildAppsScript } from './build-apps-script.mjs';

const root = process.cwd();
const claspConfigPath = path.join(root, '.clasp.json');
const rootDir = 'dist/apps-script';
const pagesBaseUrl = process.env.PAGES_BASE_URL || 'https://live-miracles.github.io/multi-lang-qa';

function step(message) {
    console.log(`\n==> ${message}`);
}

function clasp(args, options = {}) {
    return execa('npx', ['clasp', ...args], options);
}

// clasp prints a spinner next to its JSON, so pull the JSON out of the text.
function parseJson(text) {
    const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])\s*$/);
    if (!match) throw new Error(`Could not read clasp output:\n${text}`);
    return JSON.parse(match[0]);
}

async function ensureLoggedIn() {
    try {
        const { stdout } = await clasp(['show-authorized-user']);
        if (!/not logged in/i.test(stdout)) return;
    } catch {
        // Not logged in yet; fall through to the browser login.
    }
    console.log(
        'A browser window will open. Sign in with the Google account that should own the app.',
    );
    await clasp(['login'], { stdio: 'inherit' });
}

async function main() {
    step('Checking your Google login');
    await ensureLoggedIn();

    const isUpdate = fs.existsSync(claspConfigPath);
    if (!isUpdate) {
        step('Creating the Apps Script project');
        fs.mkdirSync(path.join(root, rootDir), { recursive: true });
        await clasp(
            ['create', '--type', 'standalone', '--title', 'Multi Lang QA', '--rootDir', rootDir],
            { stdio: 'inherit' },
        );
    }
    const { scriptId } = JSON.parse(fs.readFileSync(claspConfigPath, 'utf8'));

    step('Building the app');
    await execa('npm', ['run', 'css'], { stdio: 'inherit' });
    await buildAppsScript({ rootDir: root, version: '', pagesBaseUrl });

    step('Uploading the app');
    await clasp(['push', '--force'], { stdio: 'inherit' });

    // Reuse the existing web app deployment if there is one, so the link never changes.
    const { stdout: deploymentsOut } = await clasp(['--json', 'deployments']);
    const existing = parseJson(deploymentsOut).find((d) => d.versionNumber);

    step(existing ? 'Updating the published app' : 'Publishing the app');
    const description = `Setup ${new Date().toISOString().slice(0, 10)}`;
    const { stdout: versionOut } = await clasp(['--json', 'version', description]);
    const { versionNumber } = parseJson(versionOut);
    const deployArgs = ['--json', 'deploy', '--versionNumber', String(versionNumber)];
    deployArgs.push('--description', description);
    if (existing) deployArgs.push('--deploymentId', existing.deploymentId);
    const { stdout: deployOut } = await clasp(deployArgs);
    const { deploymentId } = parseJson(deployOut);

    const appUrl = `https://script.google.com/macros/s/${deploymentId}/exec`;
    const editorUrl = `https://script.google.com/d/${scriptId}/edit`;
    console.log(`
Done!

  App link (share this):  ${appUrl}
  Apps Script project:    ${editorUrl}
`);
    if (!isUpdate) {
        console.log(`One last step: open the app link yourself first.
Google will ask you to allow access. It says the app is "not verified" because you made it:
click Advanced -> Go to Multi Lang QA (unsafe) -> Allow.
Opening it also creates the "Multi Lang QA" spreadsheet in your Google Drive.
`);
    }
}

try {
    await main();
} catch (err) {
    const text = `${err.stderr || ''}\n${err.stdout || ''}\n${err.message || ''}`;
    console.error(`\nSetup failed: ${err.shortMessage || err.message}`);
    if (/Apps Script API|has not been used|PERMISSION_DENIED|User has not enabled/i.test(text)) {
        console.error(
            '\nTurn on the Google Apps Script API for your account, then run this again:\n' +
                '  https://script.google.com/home/usersettings',
        );
    }
    process.exit(1);
}
