# Multi Language QA

<img width="900" alt="Multi Lang QA Demo" src="https://github.com/user-attachments/assets/0d3efd90-c10d-4ae8-b584-40371833049d" />

A Google Apps Script web app that uses a Google Sheet as a database. People can submit questions with translations, and the host can star or mark any of the questions as completed.

## Project structure

```
├── Code.js          # Google Apps Script backend (server-side)
├── frontend/
│   ├── index.html   # Main HTML page
│   ├── script.js    # UI logic
│   ├── google-api.js  # Calls to the Apps Script backend
│   └── input.css    # Tailwind CSS source
└── build-tools/
    └── dev.mjs      # Local dev loop: build + push to a dev Apps Script project
```

## Local development

There is no standalone or mock version of the frontend. Development runs the same generated Apps Script project that production ships, against a separate dev Apps Script project and spreadsheet, so translation and everything else behaves as it does in production.

One-time setup:

1. Pick the Apps Script project to develop against. Reusing the production project is fine: `clasp push` only updates the project's HEAD code, which is served by the `/dev` test deployment, while the public `/exec` deployment stays on the last tagged version. The spreadsheet is shared, so don't test while a live session is running (a dev "delete all" would wipe real questions). For full isolation, use a separate project with its own `SPREADSHEET_ID` instead.
2. Log in to clasp: `npx clasp login`
3. Start the loop with the dev script ID. It is saved to the git-ignored `.clasp.json`, so later runs need no variable.

```bash
npm install
APPS_SCRIPT_DEV_ID=<dev script id> npm run dev
```

`npm run dev` compiles the CSS, builds `dist/apps-script/`, and runs `clasp push` to the dev project. It repeats whenever `Code.js` or a file in `frontend/` changes. Open the dev project's test deployment URL (Apps Script editor → Deploy → Test deployments, ends in `/dev`) and refresh after each "Deployed" line.

To only compile CSS:

```bash
npm run css
```

## Releases

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

### One-time Apps Script deployment setup

Create these GitHub repository secrets before expecting tag releases to update the Apps Script web app:

- `APPS_SCRIPT_ID`: the script ID from the Apps Script project settings.
- `APPS_SCRIPT_DEPLOYMENT_ID`: the deployment ID for the existing web app deployment that should keep the same public URL.
- `CLASPRC_JSON`: the contents of the `.clasprc.json` file created by `npx clasp login`.

Once these are set, a tag like `v2.0.2` will push `Code.js` and the generated `Index.html` to Apps Script, create a new Apps Script version, and update the existing web app deployment to that version.

## Deploying to Google Apps Script

If you want to collaborate with others in real time you will need to create a Google Apps Script project (it is free).

1. Go to [script.google.com/home](https://script.google.com/home).
2. Create a new project.
3. Copy the contents of `Code.js` into the default `Code.gs` file, or use the generated `dist/apps-script/Code.js` after running `npm run apps-script:build -- v2.0.2`.
4. Create a new HTML file named `Index` and paste the generated `dist/apps-script/Index.html`.
5. Go to **Project Settings** and add a script property named `SPREADSHEET_ID` with the ID of your Google Spreadsheet (found in its URL).
6. Click **Deploy** → New deployment → Web app → Execute as: Me; Who has access: Anyone with a Google account.
7. A link to your new web app will appear — share it with your audience!
