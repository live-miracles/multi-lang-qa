## Agent skills

### Issue tracker

Issues live in GitHub Issues for `live-miracles/multi-lang-qa` (via the `gh` CLI). See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Before committing

Always run these and make sure they pass before every commit. CI runs the same checks and blocks the deploy if they fail.

- `npm run format:check` — if it fails, run `npm run format` and re-check
- `npm test`
