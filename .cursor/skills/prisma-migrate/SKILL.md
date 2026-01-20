---
name: prisma-migrate
description: Runs Prisma generate and migration workflows safely. Use when the user asks to migrate the database, update Prisma Client, or change the schema.
---

# Prisma Migrate

## Preconditions
- Ensure `DATABASE_URL` is set in `.env` or `.env.local`.

## Workflow
1. Update Prisma Client: `npm run prisma:generate`
2. Apply migrations: `npm run prisma:migrate`
3. Restart the dev server after schema changes.

## Notes
- If `prisma migrate dev` prompts for a migration name, provide a short, descriptive name.
- Report any migration files created under `prisma/migrations/`.
