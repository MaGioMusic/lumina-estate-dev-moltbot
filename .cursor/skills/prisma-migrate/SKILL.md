---
name: prisma-migrate
description: Handle Prisma schema changes safely (generate, migrate, verify). Use only with approval.
license: Complete terms in LICENSE.txt
---

This skill applies Prisma schema changes safely.

## Steps
1) Validate schema
2) Run generate
3) Check migration status
4) Summarize changes

## Output Format
- Schema changes
- Migration status

## Guardrails
- Must ask before applying migrations.