# Multi Language QA

<img width="979" alt="Screenshot 2025-06-10 at 20 59 07" src="https://github.com/user-attachments/assets/7903406f-7e0c-43fd-9bae-f3f47e565a96" />

A Google Apps Script web app that uses a Google Sheet as a database. People can submit questions with translations, and the host can star or mark any of the questions as completed.

## Demo

A demo is available at [live-miracles.github.io/multi-lang-qa](https://live-miracles.github.io/multi-lang-qa/), but all changes will be gone after a refresh.

## Project structure

```
├── Code.js          # Google Apps Script backend (server-side)
├── frontend/
│   ├── index.html   # Main HTML page
│   ├── script.js    # UI logic
│   ├── google-api.js  # Calls to the Apps Script backend
│   ├── test-utils.js  # Test/demo data
│   └── input.css    # Tailwind CSS source
└── build-tools/
    └── dev.mjs      # Local dev server
```

## Local development

```bash
npm install
npm run dev
```

This does an initial CSS compile, then watches for changes and auto-reloads the browser at `http://localhost:3000`.

To only compile CSS:

```bash
npm run css
```

## Releases

Pushing a git tag publishes a versioned snapshot of the frontend to GitHub Pages (e.g. `v/2.0.2/`), which stays accessible at that URL permanently. This lets the Apps Script deployment load a pinned version of the assets without being affected by future updates.

```bash
npm version 2.0.2 --no-git-tag-version
git add package.json package-lock.json
git commit -m "Release v2.0.2"
git tag v2.0.2
git push origin master v2.0.2
```

`npm version 2.0.2 --no-git-tag-version` updates the version fields in `package.json` and `package-lock.json`, but does not create a git commit or tag. The commit and tag are created explicitly in the next commands so the release history stays easy to review.

The tag version must match `package.json`. GitHub Actions checks this before deploying, so tagging `v2.0.2` while `package.json` says `2.0.1` will fail the release.

For tag releases, GitHub Actions also generates and deploys the Google Apps Script project with `clasp`. The generated Apps Script `Index.html` keeps the full app markup from `frontend/index.html`, but rewrites the CSS and JavaScript URLs to the tagged GitHub Pages assets.

To preview that generated Apps Script project locally:

```bash
npm run apps-script:build -- v2.0.2
```

The output is written to `dist/apps-script/`.

### One-time Apps Script deployment setup

Create these GitHub repository secrets before expecting tag releases to update the Apps Script web app:

- `APPS_SCRIPT_ID`: the script ID from the Apps Script project settings.
- `APPS_SCRIPT_DEPLOYMENT_ID`: the deployment ID for the existing web app deployment that should keep the same public URL.
- `CLASPRC_JSON`: the contents of the `.clasprc.json` file created by `npx clasp login`.

Once these are set, a tag like `v2.0.2` will publish `https://live-miracles.github.io/multi-lang-qa/v/2.0.2/`, push `Code.js` and the generated `Index.html` to Apps Script, create a new Apps Script version, and update the existing web app deployment to that version.

## Deploying to Google Apps Script

If you want to collaborate with others in real time you will need to create a Google Apps Script project (it is free).

1. Go to [script.google.com/home](https://script.google.com/home).
2. Create a new project.
3. Copy the contents of `Code.js` into the default `Code.gs` file, or use the generated `dist/apps-script/Code.js` after running `npm run apps-script:build -- v2.0.2`.
4. Create a new HTML file named `Index` and paste the generated `dist/apps-script/Index.html`.
5. Go to **Project Settings** and add a script property named `SPREADSHEET_ID` with the ID of your Google Spreadsheet (found in its URL).
6. Click **Deploy** → New deployment → Web app → Execute as: Me; Who has access: Anyone with a Google account.
7. A link to your new web app will appear — share it with your audience!
