/**
 * RLS Policy Test Suite
 * 
 * Run these tests after applying the migration to verify RLS is working correctly.
 * 
 * Usage:
 * 1. Set up test users (Agent A, Agent B, Admin)
 * 2. Run each test function
 * 3. Verify assertions pass
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Test user credentials (create these in your test environment)
const TEST_USERS = {
  agentA: { email: 'test-agent-a@lumina.estate', password: 'TestPass123!' },
  agentB: { email: 'test-agent-b@lumina.estate', password: 'TestPass123!' },
  admin: { email: 'test-admin@lumina.estate', password: 'TestPass123!' },
  client: { email: 'test-client@lumina.estate', password: 'TestPass123!' },
};

interface TestResult {
  test: string;
  passed: boolean;
  error?: string;
}

class RLSTestSuite {
  private results: TestResult[] = [];
  private clients: Map<string, SupabaseClient> = new Map();

  async setup(): Promise<void> {
    console.log('🔧 Setting up test clients...');
    
    // Create authenticated clients for each test user
    for (const [role, creds] of Object.entries(TEST_USERS)) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data, error } = await supabase.auth.signInWithPassword(creds);
      
      if (error) {
        console.warn(`⚠️ Could not sign in ${role}: ${error.message}`);
      } else {
        this.clients.set(role, supabase);
        console.log(`✅ ${role} authenticated`);
      }
    }
  }

  async runAllTests(): Promise<void> {
    console.log('\n🧪 Running RLS Policy Tests...\n');
    
    await this.testContactIsolation();
    await this.testDealAccess();
    await this.testTaskOwnership();
    await this.testNotePermissions();
    await this.testChatRoomMembership();
    await this.testChatMessageAccess();
    await this.testAdminBypass();
    await this.testUnauthorizedAccess();
    
    this.printResults();
  }

  private async testContactIsolation(): Promise<void> {
    const testName = 'Contact Isolation';
    
    try {
      const agentA = this.clients.get('agentA');
      const agentB = this.clients.get('agentB');
      
      if (!agentA || !agentB) {
        this.skipTest(testName, 'Missing test users');
        return;
      }

      // Create a contact as Agent A
      const { data: contact, error: createError } = await agentA
        .from('contacts')
        .insert({
          first_name: 'Test',
          last_name: 'Contact',
          email: 'test@example.com',
          assigned_agent_id: (await agentA.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Agent B should NOT see this contact
      const { data: contactsB, error: readError } = await agentB
        .from('contacts')
        .select('*')
        .eq('id', contact.id);

      if (readError) throw readError;

      if (contactsB && contactsB.length === 0) {
        this.passTest(testName);
      } else {
        this.failTest(testName, 'Agent B could see Agent A contact');
      }

      // Cleanup
      await agentA.from('contacts').delete().eq('id', contact.id);
      
    } catch (error) {
      this.failTest(testName, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testDealAccess(): Promise<void> {
    const testName = 'Deal Access Control';
    
    try {
      const agentA = this.clients.get('agentA');
      const agentB = this.clients.get('agentB');
      
      if (!agentA || !agentB) {
        this.skipTest(testName, 'Missing test users');
        return;
      }

      // Create contact and deal as Agent A
      const userA = await agentA.auth.getUser();
      const { data: contact } = await agentA
        .from('contacts')
        .insert({
          first_name: 'Test',
          last_name: 'Contact',
          assigned_agent_id: userA.data.user?.id,
        })
        .select()
        .single();

      const { data: deal } = await agentA
        .from('deals')
        .insert({
          title: 'Test Deal',
          contact_id: contact!.id,
          agent_id: userA.data.user?.id,
          stage: 'lead',
        })
        .select()
        .single();

      // Agent B should NOT see this deal
      const { data: dealsB } = await agentB
        .from('deals')
        .select('*')
        .eq('id', deal!.id);

      if (dealsB && dealsB.length === 0) {
        this.passTest(testName);
      } else {
        this.failTest(testName, 'Agent B could see Agent A deal');
      }

      // Cleanup
      await agentA.from('deals').delete().eq('id', deal!.id);
      await agentA.from('contacts').delete().eq('id', contact!.id);
      
    } catch (error) {
      this.failTest(testName, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testTaskOwnership(): Promise<void> {
    const testName = 'Task Ownership';
    
    try {
      const agentA = this.clients.get('agentA');
      const agentB = this.clients.get('agentB');
      
      if (!agentA || !agentB) {
        this.skipTest(testName, 'Missing test users');
        return;
      }

      const userA = await agentA.auth.getUser();
      const userB = await agentB.auth.getUser();

      // Create task assigned to Agent B
      const { data: task } = await agentA
        .from('tasks')
        .insert({
          title: 'Test Task',
          assigned_to_id: userB.data.user?.id,
          status: 'pending',
          priority: 'medium',
        })
        .select()
        .single();

      // Agent B should see the task
      const { data: tasksB } = await agentB
        .from('tasks')
        .select('*')
        .eq('id', task!.id);

      // Agent A should NOT see the task (not assigned to them)
      const { data: tasksA } = await agentA
        .from('tasks')
        .select('*')
        .eq('id', task!.id);

      if (tasksB && tasksB.length === 1 && tasksA && tasksA.length === 0) {
        this.passTest(testName);
      } else {
        this.failTest(testName, 'Task visibility incorrect');
      }

      // Cleanup
      await agentB.from('tasks').delete().eq('id', task!.id);
      
    } catch (error) {
      this.failTest(testName, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testNotePermissions(): Promise<void> {
    const testName = 'Note Permissions';
    
    try {
      const agentA = this.clients.get('agentA');
      const agentB = this.clients.get('agentB');
      
      if (!agentA || !agentB) {
        this.skipTest(testName, 'Missing test users');
        return;
      }

      const userA = await agentA.auth.getUser();

      // Create note as Agent A
      const { data: note } = await agentA
        .from('notes')
        .insert({
          content: 'Test note content',
          created_by_id: userA.data.user?.id,
        })
        .select()
        .single();

      // Agent B should NOT see the note
      const { data: notesB } = await agentB
        .from('notes')
        .select('*')
        .eq('id', note!.id);

      if (notesB && notesB.length === 0) {
        this.passTest(testName);
      } else {
        this.failTest(testName, 'Agent B could see Agent A note');
      }

      // Cleanup
      await agentA.from('notes').delete().eq('id', note!.id);
      
    } catch (error) {
      this.failTest(testName, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testChatRoomMembership(): Promise<void> {
    const testName = 'Chat Room Membership';
    
    try {
      const agentA = this.clients.get('agentA');
      const agentB = this.clients.get('agentB');
      
      if (!agentA || !agentB) {
        this.skipTest(testName, 'Missing test users');
        return;
      }

      const userA = await agentA.auth.getUser();

      // Create room as Agent A
      const { data: room } = await agentA
        .from('chat_rooms')
        .insert({
          name: 'Private Room',
          type: 'group',
          created_by_id: userA.data.user?.id,
        })
        .select()
        .single();

      // Agent B should NOT see the room (not a member)
      const { data: roomsB } = await agentB
        .from('chat_rooms')
        .select('*')
        .eq('id', room!.id);

      if (roomsB && roomsB.length === 0) {
        this.passTest(testName);
      } else {
        this.failTest(testName, 'Non-member could see private room');
      }

      // Cleanup
      await agentA.from('chat_rooms').delete().eq('id', room!.id);
      
    } catch (error) {
      this.failTest(testName, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testChatMessageAccess(): Promise<void> {
    const testName = 'Chat Message Access';
    
    try {
      const agentA = this.clients.get('agentA');
      const agentB = this.clients.get('agentB');
      
      if (!agentA || !agentB) {
        this.skipTest(testName, 'Missing test users');
        return;
      }

      const userA = await agentA.auth.getUser();
      const userB = await agentB.auth.getUser();

      // Create room and add both members
      const { data: room } = await agentA
        .from('chat_rooms')
        .insert({
          name: 'Shared Room',
          type: 'group',
          created_by_id: userA.data.user?.id,
        })
        .select()
        .single();

      // Add Agent B as member
      await agentA.from('chat_room_members').insert({
        room_id: room!.id,
        user_id: userB.data.user?.id,
        role: 'member',
      });

      // Send message as Agent A
      const { data: message } = await agentA
        .from('chat_messages')
        .insert({
          room_id: room!.id,
          sender_id: userA.data.user?.id,
          content: 'Hello!',
          type: 'text',
        })
        .select()
        .single();

      // Agent B should see the message (is a member)
      const { data: messagesB } = await agentB
        .from('chat_messages')
        .select('*')
        .eq('id', message!.id);

      if (messagesB && messagesB.length === 1) {
        this.passTest(testName);
      } else {
        this.failTest(testName, 'Member could not see room messages');
      }

      // Cleanup
      await agentA.from('chat_messages').delete().eq('room_id', room!.id);
      await agentA.from('chat_room_members').delete().eq('room_id', room!.id);
      await agentA.from('chat_rooms').delete().eq('id', room!.id);
      
    } catch (error) {
      this.failTest(testName, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testAdminBypass(): Promise<void> {
    const testName = 'Admin Bypass';
    
    try {
      const agentA = this.clients.get('agentA');
      const admin = this.clients.get('admin');
      
      if (!agentA || !admin) {
        this.skipTest(testName, 'Missing test users');
        return;
      }

      // Create contact as Agent A
      const userA = await agentA.auth.getUser();
      const { data: contact } = await agentA
        .from('contacts')
        .insert({
          first_name: 'Test',
          last_name: 'Contact',
          assigned_agent_id: userA.data.user?.id,
        })
        .select()
        .single();

      // Admin should see the contact
      const { data: contactsAdmin } = await admin
        .from('contacts')
        .select('*')
        .eq('id', contact!.id);

      if (contactsAdmin && contactsAdmin.length === 1) {
        this.passTest(testName);
      } else {
        this.failTest(testName, 'Admin could not bypass RLS');
      }

      // Cleanup
      await agentA.from('contacts').delete().eq('id', contact!.id);
      
    } catch (error) {
      this.failTest(testName, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testUnauthorizedAccess(): Promise<void> {
    const testName = 'Unauthorized Access Blocked';
    
    try {
      const agentA = this.clients.get('agentA');
      const agentB = this.clients.get('agentB');
      
      if (!agentA || !agentB) {
        this.skipTest(testName, 'Missing test users');
        return;
      }

      const userA = await agentA.auth.getUser();

      // Create contact as Agent A
      const { data: contact } = await agentA
        .from('contacts')
        .insert({
          first_name: 'Test',
          last_name: 'Contact',
          assigned_agent_id: userA.data.user?.id,
        })
        .select()
        .single();

      // Agent B tries to update Agent A's contact
      const { error: updateError } = await agentB
        .from('contacts')
        .update({ first_name: 'Hacked' })
        .eq('id', contact!.id);

      // Agent B tries to delete Agent A's contact
      const { error: deleteError } = await agentB
        .from('contacts')
        .delete()
        .eq('id', contact!.id);

      // Verify the contact is unchanged
      const { data: verifyContact } = await agentA
        .from('contacts')
        .select('*')
        .eq('id', contact!.id)
        .single();

      if (verifyContact?.first_name === 'Test') {
        this.passTest(testName);
      } else {
        this.failTest(testName, 'Unauthorized modification succeeded');
      }

      // Cleanup
      await agentA.from('contacts').delete().eq('id', contact!.id);
      
    } catch (error) {
      this.failTest(testName, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private passTest(testName: string): void {
    this.results.push({ test: testName, passed: true });
    console.log(`✅ ${testName}`);
  }

  private failTest(testName: string, error: string): void {
    this.results.push({ test: testName, passed: false, error });
    console.log(`❌ ${testName}: ${error}`);
  }

  private skipTest(testName: string, reason: string): void {
    console.log(`⏭️  ${testName}: SKIPPED (${reason})`);
  }

  private printResults(): void {
    console.log('\n📊 Test Results Summary\n');
    
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed > 0) {
      console.log('\nFailed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => console.log(`  - ${r.test}: ${r.error}`));
    }
    
    console.log('\n' + (failed === 0 ? '🎉 All RLS policies working correctly!' : '⚠️ Some tests failed - review policies'));
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const suite = new RLSTestSuite();
  suite.setup().then(() => suite.runAllTests());
}

export { RLSTestSuite };
export default RLSTestSuite;
