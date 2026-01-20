---
name: release-checklist
description: Runs a release readiness checklist for this repo. Use when the user asks for release prep, go-live checks, or pre-deploy validation.
---

# Release Checklist

## Required checks
1. Install deps: `npm install`
2. Lint: `npm run lint`
3. Prisma client: `npm run prisma:generate`
4. Build: `npm run build`
5. Verify migrations if schema changed: `npm run prisma:migrate`

## Optional checks
- CI verify: `npm run ci:verify`
- Dependency audit: `npm audit --audit-level=high`

## Report format
- Pass/fail status per step
- Any blocking issues with file paths or logs
