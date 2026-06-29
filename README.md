# Multi Language QA

<img width="979" alt="Screenshot 2025-06-10 at 20 59 07" src="https://github.com/user-attachments/assets/7903406f-7e0c-43fd-9bae-f3f47e565a96" />

A Google Apps Script web app that uses a Google Sheet as a database. People can submit questions with translations, and the host can star, hide, or mark any of the questions as completed.

## Demo

A demo is available at [live-miracles.github.io/multi-lang-qa](https://live-miracles.github.io/multi-lang-qa/), but all changes will be gone after a refresh.

## Project structure

```
├── Code.js          # Google Apps Script backend (server-side)
├── frontend/
│   ├── index.html   # Main HTML page
│   ├── script.js    # UI logic
│   ├── google-api.js  # Calls to the Apps Script backend
│   ├── tools.js     # UI utilities
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
git tag v2.0.2 && git push --tags
```

## Deploying to Google Apps Script

If you want to collaborate with others in real time you will need to create a Google Apps Script project (it is free).

1. Go to [script.google.com/home](https://script.google.com/home).
2. Create a new project.
3. Copy the contents of `Code.js` into the default `Code.gs` file.
4. Create a new HTML file named `Index` and paste the contents of `frontend/index.html`.
    - In `index.html`, swap the local `<script>` and `<link>` tags for the commented-out block that loads assets from the versioned GitHub Pages URL.
5. Go to **Project Settings** and add a script property named `SPREADSHEET_ID` with the ID of your Google Spreadsheet (found in its URL).
6. Click **Deploy** → New deployment → Web app → Execute as: Me; Who has access: Anyone with a Google account.
7. A link to your new web app will appear — share it with your audience!
