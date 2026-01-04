-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('guest', 'client', 'agent', 'investor', 'admin');

-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('USER', 'AGENT', 'ADMIN', 'DEVELOPER');

-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('GEL', 'USD', 'EUR', 'RUB');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('apartment', 'house', 'villa', 'studio', 'penthouse', 'commercial', 'land', 'office');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('sale', 'rent', 'lease');

-- CreateEnum
CREATE TYPE "PropertyCondition" AS ENUM ('new', 'excellent', 'good', 'needs_renovation');

-- CreateEnum
CREATE TYPE "FurnishedType" AS ENUM ('furnished', 'partially_furnished', 'unfurnished');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('active', 'pending', 'sold', 'rented', 'inactive');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('viewing', 'consultation', 'signing', 'inspection');

-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('agent', 'property');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('new', 'in_progress', 'responded', 'closed');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('new_property', 'price_change', 'appointment', 'review', 'system');

-- CreateEnum
CREATE TYPE "ThemeType" AS ENUM ('light', 'dark');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('active', 'expired', 'withdrawn', 'sold', 'rented');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "OrgRole" AS ENUM ('owner', 'admin', 'agent', 'member', 'viewer');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "avatar" VARCHAR(500),
    "role" "UserRole" NOT NULL DEFAULT 'client',
    "account_role" "AccountRole" NOT NULL DEFAULT 'USER',
    "phone" VARCHAR(20),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "password_hash" VARCHAR(255) NOT NULL,
    "email_verification_token" VARCHAR(100),
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "license_number" VARCHAR(50) NOT NULL,
    "experience_years" INTEGER DEFAULT 0,
    "rating" DECIMAL(3,2),
    "specialization" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bio" TEXT,
    "languages" TEXT[] DEFAULT ARRAY['ქართული']::TEXT[],
    "company_name" VARCHAR(200),
    "company_logo" VARCHAR(500),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_date" TIMESTAMPTZ(6),
    "commission_rate" DECIMAL(5,2) DEFAULT 3.00,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "agent_id" UUID,
    "organization_id" UUID,
    "title" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" "CurrencyType" NOT NULL DEFAULT 'GEL',
    "location" VARCHAR(300) NOT NULL,
    "district" VARCHAR(100),
    "city" VARCHAR(100) NOT NULL DEFAULT 'თბილისი',
    "country" VARCHAR(100) NOT NULL DEFAULT 'საქართველო',
    "property_type" "PropertyType" NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "area" DECIMAL(8,2) NOT NULL,
    "floor" INTEGER,
    "total_floors" INTEGER,
    "construction_year" INTEGER,
    "condition" "PropertyCondition" NOT NULL DEFAULT 'good',
    "furnished" "FurnishedType" NOT NULL DEFAULT 'unfurnished',
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "status" "PropertyStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "featured_until" TIMESTAMPTZ(6),
    "views_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "client_id" UUID NOT NULL,
    "agent_id" UUID,
    "property_id" UUID NOT NULL,
    "scheduled_date" TIMESTAMPTZ(6) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "type" "AppointmentType" NOT NULL DEFAULT 'viewing',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "meeting_location" VARCHAR(300),

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "author_id" UUID NOT NULL,
    "agent_id" UUID,
    "property_id" UUID,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "review_type" "ReviewType" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "property_id" UUID NOT NULL,
    "agent_id" UUID,
    "message" TEXT NOT NULL,
    "contact_phone" VARCHAR(20),
    "contact_email" VARCHAR(255),
    "status" "InquiryStatus" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMPTZ(6),

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "search_criteria" JSONB NOT NULL,
    "results_count" INTEGER NOT NULL DEFAULT 0,
    "search_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "search_name" VARCHAR(200),
    "is_saved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "search_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL,
    "buyer_id" UUID,
    "seller_id" UUID,
    "agent_id" UUID,
    "sale_price" DECIMAL(12,2) NOT NULL,
    "currency" "CurrencyType" NOT NULL DEFAULT 'GEL',
    "transaction_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "commission" DECIMAL(8,2),
    "notes" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_analytics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "favorite_count" INTEGER NOT NULL DEFAULT 0,
    "inquiry_count" INTEGER NOT NULL DEFAULT 0,
    "appointment_count" INTEGER NOT NULL DEFAULT 0,
    "analytics_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "view_sources" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "property_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mortgage_calculations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "property_id" UUID,
    "loan_amount" DECIMAL(12,2) NOT NULL,
    "interest_rate" DECIMAL(5,2) NOT NULL,
    "loan_term_years" INTEGER NOT NULL,
    "down_payment" DECIMAL(12,2) NOT NULL,
    "monthly_payment" DECIMAL(10,2) NOT NULL,
    "calculated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_saved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "mortgage_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "search_preferences" JSONB NOT NULL DEFAULT '{}',
    "notification_settings" JSONB NOT NULL DEFAULT '{}',
    "preferred_language" VARCHAR(5) NOT NULL DEFAULT 'ka',
    "theme" "ThemeType" NOT NULL DEFAULT 'light',
    "currency" "CurrencyType" NOT NULL DEFAULT 'GEL',
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "table_name" VARCHAR(50) NOT NULL,
    "operation" VARCHAR(10) NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "user_id" UUID,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL,
    "agent_id" UUID,
    "user_id" UUID,
    "organization_id" UUID,
    "date_listed" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiry_date" TIMESTAMPTZ(6),
    "price" DECIMAL(12,2) NOT NULL,
    "currency" "CurrencyType" NOT NULL DEFAULT 'GEL',
    "status" "ListingStatus" NOT NULL DEFAULT 'active',
    "notes" TEXT,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_memberships" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "OrgRole" NOT NULL DEFAULT 'member',
    "invited_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "organization_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "agents_user_id_key" ON "agents"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "agents_license_number_key" ON "agents"("license_number");

-- CreateIndex
CREATE INDEX "idx_properties_status" ON "properties"("status");

-- CreateIndex
CREATE INDEX "idx_properties_organization" ON "properties"("organization_id");

-- CreateIndex
CREATE INDEX "idx_properties_search" ON "properties"("city", "property_type", "transaction_type", "status");

-- CreateIndex
CREATE INDEX "idx_properties_price" ON "properties"("price");

-- CreateIndex
CREATE INDEX "idx_properties_created_at" ON "properties"("created_at");

-- CreateIndex
CREATE INDEX "idx_favorites_user" ON "favorites"("user_id");

-- CreateIndex
CREATE INDEX "idx_favorites_property" ON "favorites"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_property_id_key" ON "favorites"("user_id", "property_id");

-- CreateIndex
CREATE INDEX "idx_appointments_client" ON "appointments"("client_id");

-- CreateIndex
CREATE INDEX "idx_appointments_agent" ON "appointments"("agent_id");

-- CreateIndex
CREATE INDEX "idx_appointments_property" ON "appointments"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_client_id_agent_id_property_id_scheduled_date_key" ON "appointments"("client_id", "agent_id", "property_id", "scheduled_date");

-- CreateIndex
CREATE INDEX "idx_reviews_agent" ON "reviews"("agent_id");

-- CreateIndex
CREATE INDEX "idx_reviews_property" ON "reviews"("property_id");

-- CreateIndex
CREATE INDEX "idx_inquiries_user" ON "inquiries"("user_id");

-- CreateIndex
CREATE INDEX "idx_inquiries_property" ON "inquiries"("property_id");

-- CreateIndex
CREATE INDEX "idx_inquiries_agent" ON "inquiries"("agent_id");

-- CreateIndex
CREATE INDEX "idx_search_history_user" ON "search_history"("user_id");

-- CreateIndex
CREATE INDEX "idx_transactions_property" ON "transactions"("property_id");

-- CreateIndex
CREATE INDEX "idx_transactions_buyer" ON "transactions"("buyer_id");

-- CreateIndex
CREATE INDEX "idx_transactions_seller" ON "transactions"("seller_id");

-- CreateIndex
CREATE INDEX "idx_transactions_agent" ON "transactions"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "property_analytics_property_id_analytics_date_key" ON "property_analytics"("property_id", "analytics_date");

-- CreateIndex
CREATE INDEX "idx_notifications_user" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "idx_mortgage_user" ON "mortgage_calculations"("user_id");

-- CreateIndex
CREATE INDEX "idx_mortgage_property" ON "mortgage_calculations"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "idx_images_property" ON "images"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "images_property_id_sort_order_key" ON "images"("property_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_listings_property_date" ON "listings"("property_id", "date_listed");

-- CreateIndex
CREATE INDEX "idx_listings_status" ON "listings"("status");

-- CreateIndex
CREATE INDEX "idx_listings_price" ON "listings"("price");

-- CreateIndex
CREATE INDEX "idx_listings_organization" ON "listings"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE INDEX "idx_membership_org" ON "organization_memberships"("organization_id");

-- CreateIndex
CREATE INDEX "idx_membership_user" ON "organization_memberships"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_memberships_organization_id_user_id_key" ON "organization_memberships"("organization_id", "user_id");

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_history" ADD CONSTRAINT "search_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_analytics" ADD CONSTRAINT "property_analytics_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mortgage_calculations" ADD CONSTRAINT "mortgage_calculations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mortgage_calculations" ADD CONSTRAINT "mortgage_calculations_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
