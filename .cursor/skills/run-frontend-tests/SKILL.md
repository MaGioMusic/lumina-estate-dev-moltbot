---
name: run-frontend-tests
description: Runs frontend unit, integration, or e2e tests and summarizes results. Use when the user asks to run UI, frontend, or browser-based tests.
---

# Run Frontend Tests

## Quick start
1. Check `package.json` scripts for frontend test commands (`test:frontend`, `test:e2e`, `playwright`, `cypress`, `vitest`).
2. Run the most specific frontend test script.
3. If no script exists, identify the test runner from dependencies, then run it directly.

## Commands
- Preferred: `npm run test:frontend` or `npm run test:e2e`
- If Playwright is used (confirm in `package.json`), run `npx playwright test`
- If Vitest is used, run `npx vitest --run`

## Report format
- Passing/failing counts
- Failing test names and file paths
- If nothing runs, state: "No frontend test scripts configured."
