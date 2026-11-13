// Local dev loop: build the exact Apps Script project that production ships, push it to a
// separate *dev* Apps Script project, and repeat on every change. Open that project's
// test deployment (".../dev" URL) to see the change running against the real backend.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execa } from 'execa';
import { buildAppsScript } from './build-apps-script.mjs';

const root = process.cwd();
const claspConfigPath = path.join(root, '.clasp.json');
const devScriptId = process.env.APPS_SCRIPT_DEV_ID;

if (devScriptId) {
    fs.writeFileSync(
        claspConfigPath,
        `${JSON.stringify({ scriptId: devScriptId, rootDir: 'dist/apps-script' })}\n`,
    );
}

if (!fs.existsSync(claspConfigPath)) {
    console.error(
        [
            'No dev Apps Script project configured.',
            '',
            'One-time setup (see "Local development" in README.md):',
            '  1. npx clasp login',
            '  2. Pick an Apps Script project (the production one is fine: pushes only update',
            '     HEAD, served by its /dev URL; /exec stays on the last tagged version).',
            "     It shares that project's spreadsheet, so avoid testing during live sessions.",
            '  3. APPS_SCRIPT_DEV_ID=<script id> npm run dev',
            '     (written to the git-ignored .clasp.json, so later runs need no variable)',
        ].join('\n'),
    );
    process.exit(1);
}

const watched = new Set(['index.html', 'script.js', 'google-api.js', 'input.css']);

let running = false;
let pending = false;

async function deploy() {
    if (running) {
        pending = true;
        return;
    }
    running = true;
    try {
        do {
            pending = false;
            const started = Date.now();
            await execa('npm', ['run', 'css'], { stdio: 'inherit' });
            await buildAppsScript({
                rootDir: root,
                version: 'dev',
                pagesBaseUrl:
                    process.env.PAGES_BASE_URL || 'https://live-miracles.github.io/multi-lang-qa',
            });
            await execa('npx', ['clasp', 'push', '--force'], { stdio: 'inherit' });
            console.log(
                `Deployed to dev project in ${((Date.now() - started) / 1000).toFixed(1)}s`,
            );
        } while (pending);
    } catch (err) {
        console.error(`Deploy failed: ${err.shortMessage || err.message}`);
    } finally {
        running = false;
    }
}

let timer;
function schedule(file) {
    if (!file) return;
    const name = path.basename(String(file));
    if (!watched.has(name) && name !== 'Code.js') return;
    clearTimeout(timer);
    timer = setTimeout(deploy, 400);
}

fs.watch(path.join(root, 'frontend'), schedule);
fs.watch(root, (_event, file) => file === 'Code.js' && schedule(file));

await deploy();
console.log(
    'Watching for changes. Open your dev project in the Apps Script editor → Deploy → Test deployments to get the web app URL (ends in /dev); refresh it after each "Deployed" line.',
);
