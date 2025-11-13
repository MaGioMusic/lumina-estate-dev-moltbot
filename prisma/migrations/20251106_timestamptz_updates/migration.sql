-- Convert timestamp fields to timestamptz and align updated_at defaults

ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;
ALTER TABLE "users"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(6) USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "last_login" TYPE TIMESTAMPTZ(6) USING "last_login" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ(6) USING "updated_at" AT TIME ZONE 'UTC';

ALTER TABLE "agents" ALTER COLUMN "updated_at" DROP DEFAULT;
ALTER TABLE "agents"
  ALTER COLUMN "verification_date" TYPE TIMESTAMPTZ(6) USING "verification_date" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(6) USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ(6) USING "updated_at" AT TIME ZONE 'UTC';

ALTER TABLE "properties" ALTER COLUMN "updated_at" DROP DEFAULT;
ALTER TABLE "properties"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(6) USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ(6) USING "updated_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "featured_until" TYPE TIMESTAMPTZ(6) USING "featured_until" AT TIME ZONE 'UTC';

ALTER TABLE "favorites"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(6) USING "created_at" AT TIME ZONE 'UTC';

ALTER TABLE "appointments" ALTER COLUMN "updated_at" DROP DEFAULT;
ALTER TABLE "appointments"
  ALTER COLUMN "scheduled_date" TYPE TIMESTAMPTZ(6) USING "scheduled_date" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(6) USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ(6) USING "updated_at" AT TIME ZONE 'UTC';

ALTER TABLE "reviews"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(6) USING "created_at" AT TIME ZONE 'UTC';

ALTER TABLE "inquiries"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(6) USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "responded_at" TYPE TIMESTAMPTZ(6) USING "responded_at" AT TIME ZONE 'UTC';

ALTER TABLE "search_history"
  ALTER COLUMN "search_date" TYPE TIMESTAMPTZ(6) USING "search_date" AT TIME ZONE 'UTC';

ALTER TABLE "transactions"
  ALTER COLUMN "transaction_date" TYPE TIMESTAMPTZ(6) USING "transaction_date" AT TIME ZONE 'UTC';

ALTER TABLE "notifications"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(6) USING "created_at" AT TIME ZONE 'UTC';

ALTER TABLE "mortgage_calculations"
  ALTER COLUMN "calculated_at" TYPE TIMESTAMPTZ(6) USING "calculated_at" AT TIME ZONE 'UTC';

ALTER TABLE "user_preferences" ALTER COLUMN "updated_at" DROP DEFAULT;
ALTER TABLE "user_preferences"
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ(6) USING "updated_at" AT TIME ZONE 'UTC';

ALTER TABLE "audit_log"
  ALTER COLUMN "timestamp" TYPE TIMESTAMPTZ(6) USING "timestamp" AT TIME ZONE 'UTC';

ALTER TABLE "images"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(6) USING "created_at" AT TIME ZONE 'UTC';

ALTER TABLE "listings"
  ALTER COLUMN "date_listed" TYPE TIMESTAMPTZ(6) USING "date_listed" AT TIME ZONE 'UTC',
  ALTER COLUMN "expiry_date" TYPE TIMESTAMPTZ(6) USING "expiry_date" AT TIME ZONE 'UTC';

