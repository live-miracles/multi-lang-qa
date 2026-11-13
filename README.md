# Multi Language QA

[![Build and deploy](https://github.com/live-miracles/multi-lang-qa/actions/workflows/deploy.yml/badge.svg)](https://github.com/live-miracles/multi-lang-qa/actions/workflows/deploy.yml)
[![Version](https://img.shields.io/github/v/tag/live-miracles/multi-lang-qa?label=version)](https://github.com/live-miracles/multi-lang-qa/tags)
[![Last commit](https://img.shields.io/github/last-commit/live-miracles/multi-lang-qa)](https://github.com/live-miracles/multi-lang-qa/commits/master)
[![License: MIT](https://img.shields.io/github/license/live-miracles/multi-lang-qa)](LICENSE)
[![Node.js 22+](https://img.shields.io/badge/node-%E2%89%A522-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

<img width="900" alt="Multi Lang QA Demo" src="https://github.com/user-attachments/assets/0d3efd90-c10d-4ae8-b584-40371833049d" />

A Google Apps Script web app that uses a Google Sheet as a database. People can submit questions with translations, and the host can star or mark any of the questions as completed.

## Set up your own copy

About 5 minutes. You need a Google account and [Node.js](https://nodejs.org/) (version 22 or newer, the "LTS" download). No coding is required.

### Quick setup (recommended)

1. **One-time:** turn on the Apps Script API for your Google account at [script.google.com/home/usersettings](https://script.google.com/home/usersettings) (switch "Google Apps Script API" **On**).
2. Open a terminal in the project folder and run:

```bash
npm install
npm run setup
```

A browser window opens so you can sign in with the Google account that should own the app. The command then creates the Apps Script project, uploads the app, publishes it, and prints your **app link**.

3. **Open the app link yourself first.** Google asks you to allow access. It says the app is "not verified" because you made it: click **Advanced** → **Go to Multi Lang QA (unsafe)** → **Allow**. This also creates the **Multi Lang QA** spreadsheet in your Google Drive, which is where the questions are stored. Then share the link with your audience.

Anyone signed in to Google (including regular Gmail accounts) can open the app.

> **Using a work or school (Google Workspace) account?** If the link looks like `script.google.com/a/macros/yourdomain.org/s/.../exec`, only people from your organization can sign in. Delete the `a/macros/yourdomain.org/` part so it reads `script.google.com/macros/s/.../exec` before sharing. If outside people are still blocked, your Workspace admin has disabled sharing outside the organization.

### Updating later

After pulling new changes, run `npm run setup` again. It uploads the new version and updates the same published app, so the link doesn't change.

### Setting up by hand (no terminal)

If you can't run the command above, you can copy and paste instead. You still need Node.js once, to build two files.

1. Run `npm install`, `npm run css` and `npm run apps-script:build`. This creates **`Code.js`** and **`Index.html`** in `dist/apps-script/`.
2. Go to [script.google.com/home](https://script.google.com/home) and click **New project**.
3. Open the file `Code.gs`, delete its text, and paste the contents of `dist/apps-script/Code.js`.
4. Next to **Files**, click **+** → **HTML**, name it exactly **`Index`**, and paste the contents of `dist/apps-script/Index.html`.
5. Click **Deploy** → **New deployment** → gear icon → **Web app**. Set **Execute as** to **Me** and **Who has access** to **Anyone with Google account**, then click **Deploy**.
6. Click **Authorize access**, pick your account, then **Advanced** → **Go to (project name) (unsafe)** → **Allow**.
7. Open the **Web app URL** yourself once (this creates the spreadsheet), then share it.

To update, paste the new files over the old ones, then **Deploy** → **Manage deployments** → pencil icon → **Version: New version** → **Deploy**.

### Using a spreadsheet you already have

By default the app creates its own spreadsheet. To use an existing one instead, open the Apps Script project → **Project Settings** (gear icon) → **Script properties** → add `SPREADSHEET_ID` with the ID from the spreadsheet's address bar (the text between `/d/` and `/edit`). Do this before opening the app for the first time. The spreadsheet needs a tab named exactly `QuestionsDB`, with these column names in row 1 (A to G): `timestamp`, `status`, `language`, `name`, `nameTranslation`, `text`, `translation`. In row 2, set **B2** = `data`, **D2** = `selected` and **F2** = `-1`. The app uses row 2 to remember which question is highlighted, so don't delete it.

### If something goes wrong

| What you see                                                  | Likely cause                                                                                                         |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `npm run setup` says to turn on the Apps Script API           | Do step 1 of the quick setup, then run it again.                                                                     |
| Others can't open the link                                    | See the Workspace note above, and check **Who has access** under Deploy → Manage deployments.                        |
| An error about the sheet, or "Cannot read properties of null" | Only when using your own spreadsheet: the tab isn't named exactly `QuestionsDB`, or `SPREADSHEET_ID` is wrong.       |
| Questions load but highlighting a question doesn't work       | Only when using your own spreadsheet: row 2 is missing or edited. Re-enter **B2**, **D2** and **F2** as shown above. |
| Translation doesn't work                                      | You didn't click **Allow** when authorizing. Open the app link again and allow access.                               |
| Your changes don't show up (manual setup)                     | You saved the code but didn't create a **New version** in Manage deployments.                                        |

## For contributors

### Project structure

```
├── Code.js          # Google Apps Script backend (server-side)
├── frontend/
│   ├── index.html   # Main HTML page
│   ├── script.js    # UI logic
│   ├── google-api.js  # Calls to the Apps Script backend
│   └── input.css    # Tailwind CSS source
├── build-tools/
│   ├── build-apps-script.mjs  # Builds the Apps Script project into dist/apps-script/
│   ├── check-version.mjs      # Checks a release tag matches package.json
│   ├── setup.mjs              # One-command setup/update of an Apps Script deployment
│   └── dev.mjs                # Local dev loop: build + push to an Apps Script project
└── test/            # Unit tests (npm test)
```

### Local development

There is no standalone or mock version of the frontend. Development runs the same generated Apps Script project that production ships, so translation and everything else behaves as it does in production.

One-time setup:

1. Pick the Apps Script project to develop against. Reusing the production project is fine: `clasp push` only updates the project's HEAD code, which is served by the `/dev` test deployment, while the public `/exec` deployment stays on the last tagged version. The spreadsheet is shared, so don't test while a live session is running (a dev "delete all" would wipe real questions). For full isolation, use a separate project with its own `SPREADSHEET_ID` instead.
2. Log in to clasp: `npx clasp login`
3. Copy `.env.example` to `.env` (git-ignored) and set `APPS_SCRIPT_DEV_ID` to the project's **script ID** (Project Settings in the Apps Script editor, not the deployment ID). A real environment variable of the same name overrides `.env`.
4. Start the loop:

```bash
npm install
npm run dev
```

`npm run dev` compiles the CSS, builds `dist/apps-script/`, and runs `clasp push` to the dev project. It repeats whenever `Code.js` or a file in `frontend/` changes. Open the dev project's test deployment URL (Apps Script editor → Deploy → Test deployments, ends in `/dev`) and refresh after each "Deployed" line. Only the project owner can open the `/dev` URL.

To only compile CSS:

```bash
npm run css
```

Before committing, `npm run format:check` and `npm test` must pass (CI runs the same checks).

### Releases

GitHub Pages serves only the images the Apps Script app links to (`logo.png`, `funny-cat.svg`), from the current `master`. Old versions are not kept there.

Pushing a git tag deploys to Google Apps Script. The generated Apps Script `Index.html` keeps the full app markup from `frontend/index.html` but inlines the CSS and all JavaScript, so a deployed version is self-contained. Only the images (`logo.png`, `funny-cat.svg`) are loaded from GitHub Pages.

```bash
npm version 2.0.2
git push origin master --tags
```

`npm version 2.0.2` updates the version fields in `package.json` and `package-lock.json`, creates a version commit, and creates the matching git tag. `git push origin master --tags` then pushes both the commit and the tag to GitHub.

The tag version must match `package.json`. GitHub Actions checks this before deploying, so tagging `v2.0.2` while `package.json` says `2.0.1` will fail the release.

To preview the generated Apps Script project locally (run `npm run css` first):

```bash
npm run apps-script:build -- v2.0.2
```

The output is written to `dist/apps-script/`.

#### One-time deployment setup for automated releases

Create these GitHub repository secrets before expecting tag releases to update the Apps Script web app:

- `APPS_SCRIPT_ID`: the script ID from the Apps Script project settings.
- `APPS_SCRIPT_DEPLOYMENT_ID`: the deployment ID for the existing web app deployment that should keep the same public URL.
- `CLASPRC_JSON`: the contents of the `.clasprc.json` file created by `npx clasp login`.

Once these are set, a tag like `v2.0.2` will push `Code.js` and the generated `Index.html` to Apps Script, create a new Apps Script version, and update the existing web app deployment to that version.
