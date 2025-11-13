-- Organization models (pre-Supabase)

-- Enum for membership roles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrgRole') THEN
    CREATE TYPE "OrgRole" AS ENUM ('owner','admin','agent','member','viewer');
  END IF;
END $$;

-- Organizations table
CREATE TABLE IF NOT EXISTS "organizations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(200) NOT NULL,
  "slug" varchar(120) NOT NULL UNIQUE,
  "description" text,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL
);

-- Organization memberships table
CREATE TABLE IF NOT EXISTS "organization_memberships" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "organization_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "role" "OrgRole" NOT NULL DEFAULT 'member',
  "invited_at" timestamptz(6) NOT NULL DEFAULT now(),
  "joined_at" timestamptz(6) NOT NULL DEFAULT now(),
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL,
  CONSTRAINT "organization_membership_unique" UNIQUE ("organization_id", "user_id"),
  CONSTRAINT "fk_membership_org" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_membership_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_membership_org" ON "organization_memberships" ("organization_id");
CREATE INDEX IF NOT EXISTS "idx_membership_user" ON "organization_memberships" ("user_id");


