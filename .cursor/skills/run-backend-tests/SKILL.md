---
name: run-backend-tests
description: Run backend tests and API checks; validate Prisma schema, migrations, and server routes. Use after API or DB changes.
license: Complete terms in LICENSE.txt
---

This skill validates backend integrity: API routes, schema, and migrations.

## Pre-Check Thinking

- **Database dependencies**: Is DATABASE_URL valid?
- **Schema changes**: Any Prisma migrations needed?
- **Auth impact**: Any protected routes touched?

## Backend Test Workflow

1) **Install Dependencies**
2) **Prisma Generate**
   - Run `npx prisma generate` if needed.
3) **Migrations**
   - Run `npx prisma migrate status`
4) **API Tests**
   - Run `npm run test:api` if available (or note missing).
5) **Summarize Failures**
   - Provide failing endpoints + error categories.

## Output Format
- Summary (pass/fail)
- Prisma status
- Failing routes/tests
- Suggested fixes

## Guardrails
- Do not apply migrations without approval.
- Ask before touching schema.