---
name: record-demo
description: Re-record the README demo GIF (assets/multi-lang-qa-demo.gif) and stills. Use when the UI changes and the demo needs refreshing.
---

# Record the README demo

The real app needs Google sign-in and has no standalone mode, so the demo runs the **built** app
(`dist/apps-script/Index.html`) with a mocked `google.script.run` backend (`mock-backend.js`) inside
Electron. It follows the general `app-demo` skill (`record.mjs` / `render.py`); this folder holds the
project-specific parts. Everything on screen is invented (Maria, Aarav, Sofia...).

Work in a scratch dir `$S` outside the repo. Paths below are relative to the repo root.

1. Build: `npm run css && npm run apps-script:build`
2. `node .agents/skills/record-demo/build-demo.mjs $S/demo`
3. Start the page server (background): `node .agents/skills/record-demo/serve.mjs $S/demo`
4. Install Electron once: `npm i electron@38` in `$S/el` (Electron 33's Node is too old for `record.mjs`).
5. Record (PowerShell: `Start-Process <electron.exe> -Wait`):
   `electron.exe <app-demo>/scripts/record.mjs --app .agents/skills/record-demo/main.mjs --scenario .agents/skills/record-demo/scenario.mjs --out $S/rec --size 1100x720`
   Read `$S/rec/log.txt`; success ends with `done: N frames` and a state line (5 questions, both toggles on).
6. Render: `python <app-demo>/scripts/render.py $S/rec --gif $S/demo.gif --sheet $S/sheet.png`; check the sheet.
7. Copy `demo.gif` to `assets/multi-lang-qa-demo.gif` and `rec/shots/selected.png` to `assets/multi-lang-qa-selected.png`.
   Keep the GIF under ~5 MB. Run `npm run format:check` and `npm test`.

## Gotchas

- Never pass a URL on Electron's command line (`--url`): it exits -1 silently. `main.mjs` loads it instead.
- Native `<select>` popups are not captured, so `scenario.mjs` draws a lookalike list (`pick()`), then sets the
  real value. Inside a modal the lookalike must be appended to the `<dialog>` (top layer).
- If `serve.mjs` omits `charset=utf-8`, non-Latin text turns into mojibake.
- Update `scenario.mjs` selectors if the UI markup changes. Toggles are hidden checkboxes: click their `<label>`.
