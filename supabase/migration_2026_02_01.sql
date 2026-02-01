-- ============================================================================
-- LUMINA ESTATE - ROW LEVEL SECURITY (RLS) POLICIES
-- Migration Date: 2026-02-01
-- Purpose: Implement comprehensive RLS policies for all CRM and Chat tables
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND (account_role = 'ADMIN' OR account_role = 'DEVELOPER' OR role = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is a member of a chat room
CREATE OR REPLACE FUNCTION public.is_chat_room_member(room_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM chat_room_members 
    WHERE room_id = room_uuid 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is an admin of a chat room
CREATE OR REPLACE FUNCTION public.is_chat_room_admin(room_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM chat_room_members 
    WHERE room_id = room_uuid 
    AND user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get agent_id for a contact
CREATE OR REPLACE FUNCTION public.get_contact_agent_id(contact_uuid UUID)
RETURNS UUID AS $$
DECLARE
  agent_uuid UUID;
BEGIN
  SELECT assigned_agent_id INTO agent_uuid 
  FROM contacts 
  WHERE id = contact_uuid;
  RETURN agent_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 1. CONTACTS TABLE RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE "contacts" ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners (bypass only for admins)
ALTER TABLE "contacts" FORCE ROW LEVEL SECURITY;

-- DROP existing policies if any (for idempotency)
DROP POLICY IF EXISTS "contacts_select_own" ON contacts;
DROP POLICY IF EXISTS "contacts_insert_own" ON contacts;
DROP POLICY IF EXISTS "contacts_update_own" ON contacts;
DROP POLICY IF EXISTS "contacts_delete_own" ON contacts;
DROP POLICY IF EXISTS "contacts_admin_bypass" ON contacts;

-- SELECT: Users can view contacts assigned to them
CREATE POLICY "contacts_select_own"
ON contacts FOR SELECT
USING (
  assigned_agent_id = auth.uid() 
  OR is_admin()
);

-- INSERT: Users can create contacts and assign to themselves or leave unassigned
CREATE POLICY "contacts_insert_own"
ON contacts FOR INSERT
WITH CHECK (
  assigned_agent_id = auth.uid() 
  OR assigned_agent_id IS NULL
  OR is_admin()
);

-- UPDATE: Users can update contacts assigned to them, admins can update any
CREATE POLICY "contacts_update_own"
ON contacts FOR UPDATE
USING (
  assigned_agent_id = auth.uid() 
  OR is_admin()
)
WITH CHECK (
  assigned_agent_id = auth.uid() 
  OR is_admin()
);

-- DELETE: Users can delete contacts assigned to them, admins can delete any
CREATE POLICY "contacts_delete_own"
ON contacts FOR DELETE
USING (
  assigned_agent_id = auth.uid() 
  OR is_admin()
);

-- ADMIN BYPASS: Full access for admin users (redundant with above but explicit)
CREATE POLICY "contacts_admin_bypass"
ON contacts FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================================================
-- 2. DEALS TABLE RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE "deals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "deals" FORCE ROW LEVEL SECURITY;

-- DROP existing policies if any
DROP POLICY IF EXISTS "deals_select_own" ON deals;
DROP POLICY IF EXISTS "deals_insert_own" ON deals;
DROP POLICY IF EXISTS "deals_update_own" ON deals;
DROP POLICY IF EXISTS "deals_delete_own" ON deals;
DROP POLICY IF EXISTS "deals_admin_bypass" ON deals;

-- SELECT: Agents can view deals where they are the agent OR deals for their contacts
CREATE POLICY "deals_select_own"
ON deals FOR SELECT
USING (
  agent_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM contacts 
    WHERE contacts.id = deals.contact_id 
    AND contacts.assigned_agent_id = auth.uid()
  )
  OR is_admin()
);

-- INSERT: Agents can create deals for themselves or their contacts
CREATE POLICY "deals_insert_own"
ON deals FOR INSERT
WITH CHECK (
  agent_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM contacts 
    WHERE contacts.id = deals.contact_id 
    AND contacts.assigned_agent_id = auth.uid()
  )
  OR is_admin()
);

-- UPDATE: Agents can update their own deals, or deals for their contacts
CREATE POLICY "deals_update_own"
ON deals FOR UPDATE
USING (
  agent_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM contacts 
    WHERE contacts.id = deals.contact_id 
    AND contacts.assigned_agent_id = auth.uid()
  )
  OR is_admin()
)
WITH CHECK (
  agent_id = auth.uid() 
  OR is_admin()
);

-- DELETE: Agents can delete their own deals, admins can delete any
CREATE POLICY "deals_delete_own"
ON deals FOR DELETE
USING (
  agent_id = auth.uid() 
  OR is_admin()
);

-- ADMIN BYPASS: Full access for admin users
CREATE POLICY "deals_admin_bypass"
ON deals FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================================================
-- 3. TASKS TABLE RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tasks" FORCE ROW LEVEL SECURITY;

-- DROP existing policies if any
DROP POLICY IF EXISTS "tasks_select_own" ON tasks;
DROP POLICY IF EXISTS "tasks_insert_own" ON tasks;
DROP POLICY IF EXISTS "tasks_update_own" ON tasks;
DROP POLICY IF EXISTS "tasks_delete_own" ON tasks;
DROP POLICY IF EXISTS "tasks_admin_bypass" ON tasks;

-- SELECT: Users can view tasks assigned to them OR tasks for their deals/contacts
CREATE POLICY "tasks_select_own"
ON tasks FOR SELECT
USING (
  assigned_to_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM deals 
    WHERE deals.id = tasks.deal_id 
    AND (deals.agent_id = auth.uid() OR is_admin())
  )
  OR EXISTS (
    SELECT 1 FROM contacts 
    WHERE contacts.id = tasks.contact_id 
    AND contacts.assigned_agent_id = auth.uid()
  )
  OR is_admin()
);

-- INSERT: Users can create tasks for themselves or their deals/contacts
CREATE POLICY "tasks_insert_own"
ON tasks FOR INSERT
WITH CHECK (
  assigned_to_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM deals 
    WHERE deals.id = tasks.deal_id 
    AND deals.agent_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM contacts 
    WHERE contacts.id = tasks.contact_id 
    AND contacts.assigned_agent_id = auth.uid()
  )
  OR is_admin()
);

-- UPDATE: Users can update tasks assigned to them, or their own created tasks
CREATE POLICY "tasks_update_own"
ON tasks FOR UPDATE
USING (
  assigned_to_id = auth.uid() 
  OR is_admin()
)
WITH CHECK (
  assigned_to_id = auth.uid() 
  OR is_admin()
);

-- DELETE: Users can delete tasks assigned to them, admins can delete any
CREATE POLICY "tasks_delete_own"
ON tasks FOR DELETE
USING (
  assigned_to_id = auth.uid() 
  OR is_admin()
);

-- ADMIN BYPASS: Full access for admin users
CREATE POLICY "tasks_admin_bypass"
ON tasks FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================================================
-- 4. NOTES TABLE RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE "notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notes" FORCE ROW LEVEL SECURITY;

-- DROP existing policies if any
DROP POLICY IF EXISTS "notes_select_own" ON notes;
DROP POLICY IF EXISTS "notes_insert_own" ON notes;
DROP POLICY IF EXISTS "notes_update_own" ON notes;
DROP POLICY IF EXISTS "notes_delete_own" ON notes;
DROP POLICY IF EXISTS "notes_admin_bypass" ON notes;

-- SELECT: Users can view notes on their contacts/deals OR notes they created
CREATE POLICY "notes_select_own"
ON notes FOR SELECT
USING (
  created_by_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM contacts 
    WHERE contacts.id = notes.contact_id 
    AND contacts.assigned_agent_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM deals 
    WHERE deals.id = notes.deal_id 
    AND deals.agent_id = auth.uid()
  )
  OR is_admin()
);

-- INSERT: Users can create notes on their contacts/deals
CREATE POLICY "notes_insert_own"
ON notes FOR INSERT
WITH CHECK (
  created_by_id = auth.uid() 
  AND (
    contact_id IS NULL 
    OR EXISTS (
      SELECT 1 FROM contacts 
      WHERE contacts.id = notes.contact_id 
      AND (contacts.assigned_agent_id = auth.uid() OR is_admin())
    )
  )
  AND (
    deal_id IS NULL 
    OR EXISTS (
      SELECT 1 FROM deals 
      WHERE deals.id = notes.deal_id 
      AND (deals.agent_id = auth.uid() OR is_admin())
    )
  )
  OR is_admin()
);

-- UPDATE: Only note creator can update their notes
CREATE POLICY "notes_update_own"
ON notes FOR UPDATE
USING (
  created_by_id = auth.uid() 
  OR is_admin()
)
WITH CHECK (
  created_by_id = auth.uid() 
  OR is_admin()
);

-- DELETE: Only note creator or admins can delete
CREATE POLICY "notes_delete_own"
ON notes FOR DELETE
USING (
  created_by_id = auth.uid() 
  OR is_admin()
);

-- ADMIN BYPASS: Full access for admin users
CREATE POLICY "notes_admin_bypass"
ON notes FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================================================
-- 5. CHAT_ROOMS TABLE RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE "chat_rooms" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_rooms" FORCE ROW LEVEL SECURITY;

-- DROP existing policies if any
DROP POLICY IF EXISTS "chat_rooms_select_member" ON chat_rooms;
DROP POLICY IF EXISTS "chat_rooms_insert_authenticated" ON chat_rooms;
DROP POLICY IF EXISTS "chat_rooms_update_creator_or_admin" ON chat_rooms;
DROP POLICY IF EXISTS "chat_rooms_delete_creator" ON chat_rooms;
DROP POLICY IF EXISTS "chat_rooms_admin_bypass" ON chat_rooms;

-- SELECT: Users can view rooms where they are a member
CREATE POLICY "chat_rooms_select_member"
ON chat_rooms FOR SELECT
USING (
  created_by_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM chat_room_members 
    WHERE chat_room_members.room_id = chat_rooms.id 
    AND chat_room_members.user_id = auth.uid()
  )
  OR is_admin()
);

-- INSERT: Any authenticated user can create rooms
CREATE POLICY "chat_rooms_insert_authenticated"
ON chat_rooms FOR INSERT
WITH CHECK (
  created_by_id = auth.uid() 
  OR is_admin()
);

-- UPDATE: Only room creator or room admins can update
CREATE POLICY "chat_rooms_update_creator_or_admin"
ON chat_rooms FOR UPDATE
USING (
  created_by_id = auth.uid() 
  OR is_chat_room_admin(id)
  OR is_admin()
)
WITH CHECK (
  created_by_id = auth.uid() 
  OR is_chat_room_admin(id)
  OR is_admin()
);

-- DELETE: Only room creator can delete, or admins
CREATE POLICY "chat_rooms_delete_creator"
ON chat_rooms FOR DELETE
USING (
  created_by_id = auth.uid() 
  OR is_admin()
);

-- ADMIN BYPASS: Full access for admin users
CREATE POLICY "chat_rooms_admin_bypass"
ON chat_rooms FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================================================
-- 6. CHAT_MESSAGES TABLE RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE "chat_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_messages" FORCE ROW LEVEL SECURITY;

-- DROP existing policies if any
DROP POLICY IF EXISTS "chat_messages_select_member" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert_member" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_update_sender" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_delete_sender_or_admin" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_admin_bypass" ON chat_messages;

-- SELECT: Users can view messages in rooms they are members of
CREATE POLICY "chat_messages_select_member"
ON chat_messages FOR SELECT
USING (
  is_chat_room_member(room_id) 
  OR is_admin()
);

-- INSERT: Room members can send messages
CREATE POLICY "chat_messages_insert_member"
ON chat_messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND is_chat_room_member(room_id)
  OR is_admin()
);

-- UPDATE: Only message sender can edit their messages (soft edit only)
CREATE POLICY "chat_messages_update_sender"
ON chat_messages FOR UPDATE
USING (
  sender_id = auth.uid() 
  OR is_admin()
)
WITH CHECK (
  sender_id = auth.uid() 
  OR is_admin()
);

-- DELETE: Soft delete - only sender or room admin can "delete" (update is_deleted flag)
-- Hard delete only by sender or admin
CREATE POLICY "chat_messages_delete_sender_or_admin"
ON chat_messages FOR DELETE
USING (
  sender_id = auth.uid() 
  OR is_chat_room_admin(room_id)
  OR is_admin()
);

-- ADMIN BYPASS: Full access for admin users
CREATE POLICY "chat_messages_admin_bypass"
ON chat_messages FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================================================
-- 7. CHAT_ROOM_MEMBERS TABLE RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE "chat_room_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_room_members" FORCE ROW LEVEL SECURITY;

-- DROP existing policies if any
DROP POLICY IF EXISTS "chat_room_members_select_member" ON chat_room_members;
DROP POLICY IF EXISTS "chat_room_members_insert_self_or_admin" ON chat_room_members;
DROP POLICY IF EXISTS "chat_room_members_update_admin" ON chat_room_members;
DROP POLICY IF EXISTS "chat_room_members_delete_self_or_admin" ON chat_room_members;
DROP POLICY IF EXISTS "chat_room_members_admin_bypass" ON chat_room_members;

-- SELECT: Users can view members of rooms they belong to
CREATE POLICY "chat_room_members_select_member"
ON chat_room_members FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM chat_room_members AS my_membership
    WHERE my_membership.room_id = chat_room_members.room_id 
    AND my_membership.user_id = auth.uid()
  )
  OR is_admin()
);

-- INSERT: Users can add themselves (join), room admins can add others, room creator auto-admin
CREATE POLICY "chat_room_members_insert_self_or_admin"
ON chat_room_members FOR INSERT
WITH CHECK (
  user_id = auth.uid()  -- Self join
  OR is_chat_room_admin(room_id)  -- Admin adding others
  OR EXISTS (  -- Room creator adding first members
    SELECT 1 FROM chat_rooms 
    WHERE chat_rooms.id = room_id 
    AND chat_rooms.created_by_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM chat_room_members 
      WHERE chat_room_members.room_id = room_id
    )
  )
  OR is_admin()
);

-- UPDATE: Only room admins can update member roles
CREATE POLICY "chat_room_members_update_admin"
ON chat_room_members FOR UPDATE
USING (
  is_chat_room_admin(room_id) 
  OR is_admin()
)
WITH CHECK (
  is_chat_room_admin(room_id) 
  OR is_admin()
);

-- DELETE: Users can leave rooms (self-delete), room admins can remove others
CREATE POLICY "chat_room_members_delete_self_or_admin"
ON chat_room_members FOR DELETE
USING (
  user_id = auth.uid()  -- Self leave
  OR is_chat_room_admin(room_id)  -- Admin removing others
  OR is_admin()
);

-- ADMIN BYPASS: Full access for admin users
CREATE POLICY "chat_room_members_admin_bypass"
ON chat_room_members FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================================================
-- ADDITIONAL USER TABLE RLS (Optional - for user profile protection)
-- ============================================================================

-- Enable RLS on users table if not already enabled
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;

-- DROP existing policies if any
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_admin_bypass" ON users;

-- SELECT: Users can view their own profile, agents can view client profiles
CREATE POLICY "users_select_own"
ON users FOR SELECT
USING (
  id = auth.uid() 
  OR is_admin()
);

-- UPDATE: Users can update their own profile only
CREATE POLICY "users_update_own"
ON users FOR UPDATE
USING (
  id = auth.uid() 
  OR is_admin()
)
WITH CHECK (
  id = auth.uid() 
  OR is_admin()
);

-- ADMIN BYPASS: Full access for admin users
CREATE POLICY "users_admin_bypass"
ON users FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================================================
-- VERIFICATION COMMANDS (Run these to verify RLS is working)
-- ============================================================================

/*
-- Check RLS is enabled on all tables
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename IN ('contacts', 'deals', 'tasks', 'notes', 'chat_rooms', 'chat_messages', 'chat_room_members', 'users')
AND schemaname = 'public';

-- List all policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE tablename IN ('contacts', 'deals', 'tasks', 'notes', 'chat_rooms', 'chat_messages', 'chat_room_members', 'users')
ORDER BY tablename, policyname;

-- Check helper functions exist
SELECT 
  proname, 
  prorettype::regtype,
  proargtypes::regtype[]
FROM pg_proc 
WHERE proname IN ('is_admin', 'is_chat_room_member', 'is_chat_room_admin', 'get_contact_agent_id');
*/

-- ============================================================================
-- AUDIT TRIGGER (Optional - Track changes to sensitive tables)
-- ============================================================================

-- Create audit log table if not exists
CREATE TABLE IF NOT EXISTS "rls_audit_log" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(10) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID,
  performed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "idx_rls_audit_table" ON "rls_audit_log"(table_name);
CREATE INDEX IF NOT EXISTS "idx_rls_audit_record" ON "rls_audit_log"(record_id);
CREATE INDEX IF NOT EXISTS "idx_rls_audit_user" ON "rls_audit_log"(user_id);
CREATE INDEX IF NOT EXISTS "idx_rls_audit_time" ON "rls_audit_log"(performed_at);

-- Function to log changes
CREATE OR REPLACE FUNCTION public.log_rls_audit()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO rls_audit_log (table_name, record_id, action, old_values, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), auth.uid());
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO rls_audit_log (table_name, record_id, action, old_values, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), auth.uid());
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO rls_audit_log (table_name, record_id, action, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
DROP TRIGGER IF EXISTS contacts_audit ON contacts;
CREATE TRIGGER contacts_audit
AFTER INSERT OR UPDATE OR DELETE ON contacts
FOR EACH ROW EXECUTE FUNCTION log_rls_audit();

DROP TRIGGER IF EXISTS deals_audit ON deals;
CREATE TRIGGER deals_audit
AFTER INSERT OR UPDATE OR DELETE ON deals
FOR EACH ROW EXECUTE FUNCTION log_rls_audit();

DROP TRIGGER IF EXISTS chat_messages_audit ON chat_messages;
CREATE TRIGGER chat_messages_audit
AFTER INSERT OR UPDATE OR DELETE ON chat_messages
FOR EACH ROW EXECUTE FUNCTION log_rls_audit();

-- ============================================================================
-- END OF RLS MIGRATION
-- ============================================================================
