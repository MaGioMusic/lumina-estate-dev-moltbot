---
name: lint-and-format
description: Runs linting and formatting checks and applies safe fixes when requested. Use when the user asks to lint, format, or fix style issues.
---

# Lint and Format

## Quick start
1. Run the repo lint script if present.
2. If a format script exists and the user asked for formatting, run it.
3. Only run auto-fix when explicitly requested.

## Commands
- Lint: `npm run lint`
- Format (only if script exists): `npm run format`
- Auto-fix (only if requested and ESLint is configured): `npx eslint . --fix`

## Report format
- Lint results summary
- Files auto-fixed (if any)
- Any remaining errors with file paths
