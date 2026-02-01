# Row Level Security (RLS) Policy Setup Guide

**Project:** Lumina Estate  
**Date:** 2026-02-01  
**Status:** ✅ IMPLEMENTED  

---

## Executive Summary

This document outlines the comprehensive Row Level Security (RLS) policies implemented for the Lumina Estate Supabase database. RLS ensures that users can only access, modify, and delete data they are authorized to interact with, providing defense-in-depth security at the database layer.

### Security Goals Achieved

- ✅ **Data Isolation**: Users can only see their own data and data shared with them
- ✅ **Write Protection**: Users can only modify data they own or have permission to edit
- ✅ **Admin Oversight**: Administrators maintain full access for support and management
- ✅ **Audit Trail**: All changes to sensitive tables are logged
- ✅ **Defense in Depth**: Security enforced at both application AND database layers

---

## Tables with RLS Protection

| Table | Primary Access Control | Admin Bypass |
|-------|------------------------|--------------|
| `contacts` | `assigned_agent_id` | ✅ Yes |
| `deals` | `agent_id` + contact ownership | ✅ Yes |
| `tasks` | `assigned_to_id` | ✅ Yes |
| `notes` | `created_by_id` | ✅ Yes |
| `chat_rooms` | membership-based | ✅ Yes |
| `chat_messages` | room membership-based | ✅ Yes |
| `chat_room_members` | room membership-based | ✅ Yes |
| `users` | self only | ✅ Yes |

---

## Policy Details

### 1. Contacts Table

**Access Control:** Based on `assigned_agent_id`

| Operation | Policy Rule |
|-----------|-------------|
| **SELECT** | Agent can view contacts assigned to them |
| **INSERT** | Agent can create contacts assigned to themselves or unassigned |
| **UPDATE** | Agent can update their assigned contacts |
| **DELETE** | Agent can delete their assigned contacts |
| **ADMIN** | Full access to all records |

**SQL Snippet:**
```sql
-- Example: Only see contacts assigned to you
CREATE POLICY "contacts_select_own"
ON contacts FOR SELECT
USING (assigned_agent_id = auth.uid() OR is_admin());
```

---

### 2. Deals Table

**Access Control:** Based on `agent_id` OR contact's assigned agent

| Operation | Policy Rule |
|-----------|-------------|
| **SELECT** | Agent can view their deals OR deals for their contacts |
| **INSERT** | Agent can create deals for themselves or their contacts |
| **UPDATE** | Agent can update their own deals |
| **DELETE** | Agent can delete their own deals |
| **ADMIN** | Full access to all records |

**Cross-Table Logic:**
```sql
-- Example: Access deals for contacts you own
EXISTS (
  SELECT 1 FROM contacts 
  WHERE contacts.id = deals.contact_id 
  AND contacts.assigned_agent_id = auth.uid()
)
```

---

### 3. Tasks Table

**Access Control:** Based on `assigned_to_id`

| Operation | Policy Rule |
|-----------|-------------|
| **SELECT** | User can view tasks assigned to them OR tasks for their deals/contacts |
| **INSERT** | User can create tasks for themselves or their deals/contacts |
| **UPDATE** | User can update tasks assigned to them |
| **DELETE** | User can delete tasks assigned to them |
| **ADMIN** | Full access to all records |

---

### 4. Notes Table

**Access Control:** Based on `created_by_id` + ownership of related records

| Operation | Policy Rule |
|-----------|-------------|
| **SELECT** | User can view notes they created OR notes on their contacts/deals |
| **INSERT** | User can create notes on their contacts/deals |
| **UPDATE** | Only note creator can update |
| **DELETE** | Only note creator or admin can delete |
| **ADMIN** | Full access to all records |

---

### 5. Chat Rooms Table

**Access Control:** Membership-based

| Operation | Policy Rule |
|-----------|-------------|
| **SELECT** | Members can view rooms they belong to |
| **INSERT** | Any authenticated user can create rooms |
| **UPDATE** | Only room creator or room admins can update |
| **DELETE** | Only room creator can delete |
| **ADMIN** | Full access to all records |

---

### 6. Chat Messages Table

**Access Control:** Room membership-based

| Operation | Policy Rule |
|-----------|-------------|
| **SELECT** | Room members can view messages |
| **INSERT** | Room members can send messages |
| **UPDATE** | Only message sender can edit |
| **DELETE** | Message sender or room admin can delete |
| **ADMIN** | Full access to all records |

**Soft Delete Pattern:**
```typescript
// Instead of DELETE, set is_deleted flag
await supabase
  .from('chat_messages')
  .update({ is_deleted: true })
  .eq('id', messageId);
```

---

### 7. Chat Room Members Table

**Access Control:** Room membership-based

| Operation | Policy Rule |
|-----------|-------------|
| **SELECT** | Members can view other members of their rooms |
| **INSERT** | Users can join rooms OR admins can add members |
| **UPDATE** | Only room admins can update roles |
| **DELETE** | Users can leave OR admins can remove members |
| **ADMIN** | Full access to all records |

---

## Helper Functions

### `is_admin()`
Checks if the current user has admin privileges.

```sql
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
```

### `is_chat_room_member(room_uuid UUID)`
Checks if current user is a member of a specific chat room.

```sql
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
```

### `is_chat_room_admin(room_uuid UUID)`
Checks if current user is an admin of a specific chat room.

```sql
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
```

---

## Deployment Instructions

### Step 1: Apply Migration

Run the SQL migration in Supabase SQL Editor:

```bash
# File: /supabase/migration_2026_02_01.sql
```

1. Navigate to Supabase Dashboard → SQL Editor
2. Create a new query
3. Paste the entire migration file content
4. Run the query

### Step 2: Verify RLS is Enabled

```sql
-- Check RLS is enabled on all tables
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename IN ('contacts', 'deals', 'tasks', 'notes', 'chat_rooms', 'chat_messages', 'chat_room_members', 'users')
AND schemaname = 'public';
```

Expected: All tables show `rowsecurity = true`

### Step 3: List All Policies

```sql
-- List all policies
SELECT 
  tablename, 
  policyname, 
  cmd
FROM pg_policies 
WHERE tablename IN ('contacts', 'deals', 'tasks', 'notes', 'chat_rooms', 'chat_messages', 'chat_room_members', 'users')
ORDER BY tablename, policyname;
```

Expected: Each table has SELECT, INSERT, UPDATE, DELETE, and admin policies

---

## Testing RLS Policies

### Test 1: Contact Access Isolation

```typescript
// As Agent A (user_id: 'agent-a-uuid')
const supabaseA = createClient(supabaseUrl, agentA_token);

// Should succeed - viewing own contact
const { data: myContacts } = await supabaseA
  .from('contacts')
  .select('*')
  .eq('assigned_agent_id', 'agent-a-uuid');

// Should return empty - viewing other agent's contact
const { data: otherContacts } = await supabaseA
  .from('contacts')
  .select('*')
  .eq('assigned_agent_id', 'agent-b-uuid');

console.assert(otherContacts?.length === 0, 'RLS should prevent viewing other agent contacts');
```

### Test 2: Deal Cross-Table Access

```typescript
// Agent A owns Contact X
// Deal Y is linked to Contact X but assigned to Agent B

// Agent A should be able to view Deal Y (because they own the contact)
const { data: deals } = await supabaseA
  .from('deals')
  .select('*, contacts!inner(*)')
  .eq('id', 'deal-y-uuid');

// Agent B should also be able to view Deal Y (because it's assigned to them)
const { data: dealsB } = await supabaseB
  .from('deals')
  .select('*')
  .eq('id', 'deal-y-uuid');
```

### Test 3: Chat Room Membership

```typescript
// User A creates a room
const { data: room } = await supabaseA
  .from('chat_rooms')
  .insert({ name: 'Private Room', created_by_id: 'user-a-uuid' })
  .select()
  .single();

// User B (not a member) should NOT see the room
const { data: roomsB } = await supabaseB
  .from('chat_rooms')
  .select('*');

console.assert(!roomsB?.find(r => r.id === room.id), 'Non-member should not see private room');

// Add User B as member
await supabaseA
  .from('chat_room_members')
  .insert({ room_id: room.id, user_id: 'user-b-uuid', role: 'member' });

// Now User B CAN see the room
const { data: roomsBAfter } = await supabaseB
  .from('chat_rooms')
  .select('*');

console.assert(roomsBAfter?.find(r => r.id === room.id), 'Member should see the room');
```

### Test 4: Admin Bypass

```typescript
// As Admin user
const supabaseAdmin = createClient(supabaseUrl, admin_token);

// Admin should see ALL contacts
const { data: allContacts } = await supabaseAdmin
  .from('contacts')
  .select('*');

// Admin should see ALL deals
const { data: allDeals } = await supabaseAdmin
  .from('deals')
  .select('*');

// Admin should see ALL chat rooms
const { data: allRooms } = await supabaseAdmin
  .from('chat_rooms')
  .select('*');
```

---

## Common RLS Issues and Solutions

### Issue 1: "Permission Denied" on Authenticated Requests

**Cause:** User's JWT token doesn't contain the user ID in the expected format.

**Solution:**
```typescript
// Ensure auth.uid() matches your user ID format
// Check with:
const { data: { user } } = await supabase.auth.getUser();
console.log('Auth UID:', user?.id);

// Verify against your users table
const { data: dbUser } = await supabase
  .from('users')
  .select('id')
  .eq('id', user?.id)
  .single();
```

### Issue 2: Infinite Recursion in Policies

**Cause:** Policy references a table that also has RLS with a policy referencing back.

**Solution:** Use SECURITY DEFINER functions or restructure policies to avoid circular references.

### Issue 3: Policies Not Applied

**Cause:** RLS not enabled or FORCE ROW LEVEL SECURITY not set.

**Solution:**
```sql
-- Ensure RLS is enabled and forced
ALTER TABLE "contacts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contacts" FORCE ROW LEVEL SECURITY;
```

### Issue 4: Service Role Bypass Not Working

**Cause:** Service role key doesn't automatically bypass RLS unless explicitly configured.

**Solution:** Use `auth.admin()` or explicitly disable RLS for service role operations:
```sql
-- For service role operations, use SECURITY DEFINER functions
-- or temporarily disable policies (not recommended for production)
```

---

## Audit Logging

All changes to sensitive tables are automatically logged to `rls_audit_log`:

| Column | Description |
|--------|-------------|
| `table_name` | Table where change occurred |
| `record_id` | UUID of the affected record |
| `action` | INSERT, UPDATE, or DELETE |
| `old_values` | JSON of previous values (UPDATE/DELETE) |
| `new_values` | JSON of new values (INSERT/UPDATE) |
| `user_id` | UUID of user who made the change |
| `performed_at` | Timestamp of the change |

### Query Audit Logs

```sql
-- Get recent changes to contacts
SELECT * FROM rls_audit_log 
WHERE table_name = 'contacts' 
ORDER BY performed_at DESC 
LIMIT 100;

-- Get all changes by a specific user
SELECT * FROM rls_audit_log 
WHERE user_id = 'specific-user-uuid'
ORDER BY performed_at DESC;

-- Get all deletions in the last 24 hours
SELECT * FROM rls_audit_log 
WHERE action = 'DELETE' 
AND performed_at > NOW() - INTERVAL '24 hours';
```

---

## Best Practices

### 1. Always Use `auth.uid()`

Never rely on client-side user IDs. Always use `auth.uid()` in RLS policies:

```sql
-- ❌ BAD: Trusting client input
USING (user_id = request_data->>'user_id')

-- ✅ GOOD: Using Supabase auth
USING (user_id = auth.uid())
```

### 2. Test with Real Users

Always test RLS policies with actual user sessions, not just service role:

```typescript
// Create authenticated client
const supabase = createClient(url, user_access_token);

// Test actual user permissions
const { data, error } = await supabase.from('contacts').select('*');
```

### 3. Keep Policies Simple

Complex policies are hard to debug. Use helper functions for complex logic:

```sql
-- ❌ BAD: Complex inline policy
USING (
  user_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM organization_members 
    WHERE org_id = (
      SELECT org_id FROM projects WHERE id = project_id
    ) AND user_id = auth.uid() AND role = 'admin'
  )
)

-- ✅ GOOD: Use helper function
USING (user_id = auth.uid() OR is_org_admin(project_id))
```

### 4. Document Exceptions

If you need to temporarily disable RLS for a specific operation, document it:

```sql
-- TEMPORARY: Disabling RLS for data migration
-- Date: 2026-02-01
-- Reason: Bulk import of legacy data
-- Re-enable after: 2026-02-02
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
-- ... migration code ...
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
```

---

## Migration Rollback

If you need to rollback RLS policies:

```sql
-- Disable RLS on all tables
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop all policies (optional)
DROP POLICY IF EXISTS contacts_select_own ON contacts;
DROP POLICY IF EXISTS contacts_insert_own ON contacts;
DROP POLICY IF EXISTS contacts_update_own ON contacts;
DROP POLICY IF EXISTS contacts_delete_own ON contacts;
DROP POLICY IF EXISTS contacts_admin_bypass ON contacts;
-- ... repeat for all tables

-- Drop helper functions
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_chat_room_member(UUID);
DROP FUNCTION IF EXISTS is_chat_room_admin(UUID);
DROP FUNCTION IF EXISTS get_contact_agent_id(UUID);
```

---

## Security Checklist

- [x] RLS enabled on all sensitive tables
- [x] SELECT policies restrict data visibility
- [x] INSERT policies prevent unauthorized creation
- [x] UPDATE policies prevent unauthorized modification
- [x] DELETE policies prevent unauthorized deletion
- [x] Admin bypass policies exist for all tables
- [x] Helper functions created for complex logic
- [x] Audit logging enabled for sensitive tables
- [x] Policies tested with real user sessions
- [x] Documentation updated

---

## Related Documents

- **Migration File:** `/supabase/migration_2026_02_01.sql`
- **Schema:** `/prisma/schema.prisma`
- **Security Audit:** `/SECURITY_AUDIT_API.md`

---

**Last Updated:** 2026-02-01  
**Maintainer:** Security Team  
**Review Cycle:** Quarterly
