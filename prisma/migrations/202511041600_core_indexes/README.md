# Core index migration

This migration captures the ERD recommendations for:

- Preventing duplicate favorites per user/property.
- Avoiding appointment slot collisions and improving lookup speed.
- Enforcing one analytics row per property per day.

Apply with `npx prisma migrate deploy` (or `prisma migrate dev`) once a PostgreSQL
`DATABASE_URL` is configured.
