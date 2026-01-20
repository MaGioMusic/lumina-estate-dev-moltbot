---
name: run-frontend-tests
description: Run frontend checks (lint, typecheck, unit tests) and summarize failures with fix suggestions. Use after UI changes or before merge.
license: Complete terms in LICENSE.txt
---

This skill runs or validates frontend checks and produces a concise failure report. It assumes a Next.js + TypeScript + Tailwind stack.

## Pre-Check Thinking

Before running:
- **Scope**: What changed? UI only or shared logic?
- **Risk**: Any affected routes (CRM, chat, dashboard)?
- **Environment**: Ensure dependencies installed.

## Frontend Test Workflow

1) **Install Dependencies**
   - Ensure `npm install` is complete.

2) **Lint**
   - Run `npm run lint`
   - Report warnings/errors with file + line.

3) **Type Check**
   - Run `npm run type-check` if available.
   - If missing, note and suggest adding.

4) **Unit/Component Tests**
   - Run `npm test` or `npm run test` if configured.
   - Identify failing tests and categorize.

5) **Summarize**
   - Provide top 3 blockers.
   - Provide fix suggestions.

## Output Format

- Summary (pass/fail)
- Failures (file:line + error)
- Suggested Fixes
- Risk Notes

## Guardrails
- Never modify code directly.
- If a test is missing, flag it as a requirement.