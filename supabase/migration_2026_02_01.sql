-- Lumina Estate Database Migration
-- Run this SQL in your Supabase SQL Editor
-- This creates all tables including the new CRM and Chat tables

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('guest', 'client', 'agent', 'investor', 'admin');
CREATE TYPE "AccountRole" AS ENUM ('USER', 'AGENT', 'ADMIN', 'DEVELOPER');
CREATE TYPE "CurrencyType" AS ENUM ('GEL', 'USD', 'EUR', 'RUB');
CREATE TYPE "PropertyType" AS ENUM ('apartment', 'house', 'villa', 'studio', 'penthouse', 'commercial', 'land', 'office');
CREATE TYPE "TransactionType" AS ENUM ('sale', 'rent', 'lease');
CREATE TYPE "PropertyCondition" AS ENUM ('new', 'excellent', 'good', 'needs_renovation');
CREATE TYPE "FurnishedType" AS ENUM ('furnished', 'partially_furnished', 'unfurnished');
CREATE TYPE "PropertyStatus" AS ENUM ('active', 'pending', 'sold', 'rented', 'inactive');
CREATE TYPE "AppointmentStatus" AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE "AppointmentType" AS ENUM ('viewing', 'consultation', 'signing', 'inspection');
CREATE TYPE "ReviewType" AS ENUM ('agent', 'property');
CREATE TYPE "InquiryStatus" AS ENUM ('new', 'in_progress', 'responded', 'closed');
CREATE TYPE "NotificationType" AS ENUM ('new_property', 'price_change', 'appointment', 'review', 'system');
CREATE TYPE "ThemeType" AS ENUM ('light', 'dark');
CREATE TYPE "ContactStatus" AS ENUM ('lead', 'prospect', 'client');
CREATE TYPE "DealStage" AS ENUM ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE "TaskPriority" AS ENUM ('low', 'medium', 'high');
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE "ChatRoomType" AS ENUM ('direct', 'group');
CREATE TYPE "ChatMessageType" AS ENUM ('text', 'image', 'file');
CREATE TYPE "ChatRoomMemberRole" AS ENUM ('admin', 'member');
CREATE TYPE "ListingStatus" AS ENUM ('active', 'expired', 'withdrawn', 'sold', 'rented');
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE "OrgRole" AS ENUM ('owner', 'admin', 'agent', 'member', 'viewer');

-- CreateTable: users (existing)
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

-- CreateTable: CRM Tables (NEW)
CREATE TABLE "contacts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "status" "ContactStatus" NOT NULL DEFAULT 'lead',
    "source" VARCHAR(100),
    "assigned_agent_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "deals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(300) NOT NULL,
    "contact_id" UUID NOT NULL,
    "agent_id" UUID,
    "stage" "DealStage" NOT NULL DEFAULT 'lead',
    "value" DECIMAL(12,2),
    "currency" "CurrencyType" NOT NULL DEFAULT 'GEL',
    "probability" INTEGER DEFAULT 0,
    "expected_close_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "assigned_to_id" UUID NOT NULL,
    "deal_id" UUID,
    "contact_id" UUID,
    "due_date" TIMESTAMPTZ(6),
    "priority" "TaskPriority" NOT NULL DEFAULT 'medium',
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "contact_id" UUID,
    "deal_id" UUID,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Chat Tables (NEW)
CREATE TABLE "chat_rooms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(200),
    "type" "ChatRoomType" NOT NULL DEFAULT 'direct',
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "chat_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "room_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "type" "ChatMessageType" NOT NULL DEFAULT 'text',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "chat_room_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "room_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "ChatRoomMemberRole" NOT NULL DEFAULT 'member',
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_room_members_pkey" PRIMARY KEY ("id")
);

-- Indexes for CRM tables
CREATE INDEX "idx_contacts_status" ON "contacts"("status");
CREATE INDEX "idx_contacts_assigned_agent" ON "contacts"("assigned_agent_id");
CREATE INDEX "idx_contacts_email" ON "contacts"("email");
CREATE INDEX "idx_contacts_created_at" ON "contacts"("created_at");

CREATE INDEX "idx_deals_contact" ON "deals"("contact_id");
CREATE INDEX "idx_deals_agent" ON "deals"("agent_id");
CREATE INDEX "idx_deals_stage" ON "deals"("stage");
CREATE INDEX "idx_deals_expected_close" ON "deals"("expected_close_date");
CREATE INDEX "idx_deals_created_at" ON "deals"("created_at");

CREATE INDEX "idx_tasks_assigned_to" ON "tasks"("assigned_to_id");
CREATE INDEX "idx_tasks_deal" ON "tasks"("deal_id");
CREATE INDEX "idx_tasks_contact" ON "tasks"("contact_id");
CREATE INDEX "idx_tasks_status" ON "tasks"("status");
CREATE INDEX "idx_tasks_priority" ON "tasks"("priority");
CREATE INDEX "idx_tasks_due_date" ON "tasks"("due_date");

CREATE INDEX "idx_notes_contact" ON "notes"("contact_id");
CREATE INDEX "idx_notes_deal" ON "notes"("deal_id");
CREATE INDEX "idx_notes_created_by" ON "notes"("created_by_id");
CREATE INDEX "idx_notes_created_at" ON "notes"("created_at");

-- Indexes for Chat tables
CREATE INDEX "idx_chat_rooms_type" ON "chat_rooms"("type");
CREATE INDEX "idx_chat_rooms_created_by" ON "chat_rooms"("created_by_id");
CREATE INDEX "idx_chat_rooms_created_at" ON "chat_rooms"("created_at");

CREATE INDEX "idx_chat_messages_room" ON "chat_messages"("room_id");
CREATE INDEX "idx_chat_messages_sender" ON "chat_messages"("sender_id");
CREATE INDEX "idx_chat_messages_created_at" ON "chat_messages"("created_at");
CREATE INDEX "idx_chat_messages_room_created" ON "chat_messages"("room_id", "created_at");

CREATE INDEX "idx_chat_room_members_room" ON "chat_room_members"("room_id");
CREATE INDEX "idx_chat_room_members_user" ON "chat_room_members"("user_id");
CREATE UNIQUE INDEX "chat_room_members_room_id_user_id_key" ON "chat_room_members"("room_id", "user_id");

-- Foreign Keys for CRM tables
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_assigned_agent_id_fkey" FOREIGN KEY ("assigned_agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "deals" ADD CONSTRAINT "deals_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "deals" ADD CONSTRAINT "deals_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notes" ADD CONSTRAINT "notes_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notes" ADD CONSTRAINT "notes_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notes" ADD CONSTRAINT "notes_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign Keys for Chat tables
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "chat_room_members" ADD CONSTRAINT "chat_room_members_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_room_members" ADD CONSTRAINT "chat_room_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable RLS (Row Level Security) - Optional but recommended
-- ALTER TABLE "contacts" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "deals" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "notes" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "chat_rooms" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "chat_messages" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "chat_room_members" ENABLE ROW LEVEL SECURITY;

-- Add comments for documentation
COMMENT ON TABLE "contacts" IS 'CRM contacts - clients and leads';
COMMENT ON TABLE "deals" IS 'Sales pipeline deals';
COMMENT ON TABLE "tasks" IS 'Agent tasks and todos';
COMMENT ON TABLE "notes" IS 'Notes on contacts and deals';
COMMENT ON TABLE "chat_rooms" IS 'Chat conversation rooms';
COMMENT ON TABLE "chat_messages" IS 'Individual chat messages';
COMMENT ON TABLE "chat_room_members" IS 'Room membership with roles';
