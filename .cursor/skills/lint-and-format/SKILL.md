---
name: lint-and-format
description: Run lint/format checks and report violations with prioritized fixes. Use after code changes or before merge.
license: Complete terms in LICENSE.txt
---

This skill enforces code quality. It reports errors and provides fix steps without editing code.

## Workflow

1) Run `npm run lint`
2) If formatters exist, run them (or report missing)
3) Group issues by severity
4) Provide quick fixes

## Output Format
- Lint summary
- Errors (blockers)
- Warnings (non-blockers)
- Quick fix suggestions

## Guardrails
- Never auto-fix unless explicitly asked.