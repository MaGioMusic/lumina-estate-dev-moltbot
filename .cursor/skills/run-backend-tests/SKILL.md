---
name: run-backend-tests
description: Runs server-side or API test suites and reports results. Use when the user asks to run backend tests, API tests, or server-side coverage.
---

# Run Backend Tests

## Quick start
1. Check `package.json` scripts for backend test commands (`test`, `test:backend`, `api:test`, `vitest`, `jest`).
2. Run the most specific backend test script.
3. If no script exists, identify the test runner from dependencies, then run it directly.

## Commands
- Preferred: `npm run test:backend` or `npm run test`
- If the repo uses Vitest or Jest (confirm in `package.json`), run `npx vitest` or `npx jest`

## Report format
- Passing/failing counts
- Failing test names and file paths
- If nothing runs, state: "No backend test scripts configured."
