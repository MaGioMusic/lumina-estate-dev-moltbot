/**
 * API Layer Usage Examples
 * 
 * This file demonstrates how to use the API layer in your components.
 * These are examples only - do not import from this file.
 */

// =============================================================================
// BASIC USAGE - Direct API Calls
// =============================================================================

import { apiClient, contactsApi, dealsApi, tasksApi, notesApi, chatApi } from '@/lib/api';

// Direct API client usage
async function exampleDirectApi() {
  // GET request
  const response = await apiClient.get('/some-endpoint');
  
  // POST request
  const newItem = await apiClient.post('/some-endpoint', { name: 'John' });
  
  // PUT request
  const updatedItem = await apiClient.put('/some-endpoint/123', { name: 'Jane' });
  
  // PATCH request
  const patchedItem = await apiClient.patch('/some-endpoint/123', { status: 'active' });
  
  // DELETE request
  await apiClient.delete('/some-endpoint/123');
  
  // With query parameters
  const filtered = await apiClient.get('/contacts', {
    params: { status: 'lead', page: 1, limit: 20 }
  });
}

// =============================================================================
// SERVICE API USAGE
// =============================================================================

async function exampleServiceApi() {
  // Contacts
  const contacts = await contactsApi.getContacts({ status: 'lead', page: 1 });
  const contact = await contactsApi.getContact('contact-id-123');
  const newContact = await contactsApi.createContact({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    status: 'lead',
    source: 'website',
  });
  const updatedContact = await contactsApi.updateContact('contact-id-123', {
    status: 'prospect',
  });
  await contactsApi.deleteContact('contact-id-123');

  // Deals
  const deals = await dealsApi.getDeals({ stage: 'lead' });
  const deal = await dealsApi.getDeal('deal-id-123');
  const newDeal = await dealsApi.createDeal({
    title: 'New Property Deal',
    contactId: 'contact-id-123',
    value: 100000,
    currency: 'USD',
    stage: 'lead',
  });
  await dealsApi.updateDealStage('deal-id-123', 'qualified');

  // Tasks
  const tasks = await tasksApi.getTasks({ status: 'pending' });
  const overdueTasks = await tasksApi.getOverdueTasks();
  const upcomingTasks = await tasksApi.getUpcomingTasks(7); // Next 7 days
  await tasksApi.completeTask('task-id-123');

  // Notes
  const notes = await notesApi.getNotes({ contactId: 'contact-id-123' });
  await notesApi.createContactNote('contact-id-123', 'Called the client today.');

  // Chat
  const rooms = await chatApi.getChatRooms();
  const messages = await chatApi.getChatMessages({ roomId: 'room-id-123', page: 1 });
  await chatApi.sendTextMessage('room-id-123', 'Hello!');
}

// =============================================================================
// REACT QUERY HOOKS USAGE (Recommended)
// =============================================================================

import {
  // Contacts
  useContacts,
  useContact,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  
  // Deals
  useDeals,
  useDeal,
  useCreateDeal,
  useUpdateDeal,
  useUpdateDealStage,
  
  // Tasks
  useTasks,
  useTask,
  useOverdueTasks,
  useUpcomingTasks,
  useCreateTask,
  useCompleteTask,
  
  // Notes
  useNotes,
  useCreateNote,
  
  // Chat
  useChatRooms,
  useChatMessages,
  useSendMessage,
} from '@/hooks';

// Example React component using hooks
function ExampleContactsComponent() {
  // Fetch contacts with filtering
  const { data: contacts, isLoading, error } = useContacts({
    status: 'lead',
    page: 1,
    limit: 20,
  });

  // Mutations
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const handleCreate = async () => {
    await createContact.mutateAsync({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      status: 'lead',
      source: 'website',
    });
  };

  const handleUpdate = async (id: string) => {
    await updateContact.mutateAsync({
      id,
      data: { status: 'prospect' },
    });
  };

  const handleDelete = async (id: string) => {
    await deleteContact.mutateAsync(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {contacts?.data.map((contact) => (
        <div key={contact.id}>{contact.firstName} {contact.lastName}</div>
      ))}
    </div>
  );
}

// Example Deals component with pipeline
function ExampleDealsComponent() {
  const { data: dealsData, isLoading } = useDeals();
  
  const updateStage = useUpdateDealStage();

  const handleStageChange = async (dealId: string, newStage: string) => {
    await updateStage.mutateAsync({
      id: dealId,
      stage: newStage as any,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  // Access pipeline data
  const { pipeline, stats } = dealsData || {};
  
  return (
    <div>
      <div>Total Value: {stats?.totalValue}</div>
      <div>Won Value: {stats?.wonValue}</div>
      
      {/* Render pipeline columns */}
      {pipeline?.lead.map((deal) => (
        <div key={deal.id}>{deal.title}</div>
      ))}
    </div>
  );
}

// Example Tasks component
function ExampleTasksComponent() {
  const { data: tasks } = useTasks({ status: 'pending' });
  const { data: overdueTasks } = useOverdueTasks();
  const { data: upcomingTasks } = useUpcomingTasks(7);
  
  const completeTask = useCompleteTask();

  return (
    <div>
      <h2>Overdue ({overdueTasks?.data.length || 0})</h2>
      <h2>Due This Week ({upcomingTasks?.data.length || 0})</h2>
      
      {tasks?.data.map((task) => (
        <div key={task.id}>
          {task.title}
          <button onClick={() => completeTask.mutate(task.id)}>
            Complete
          </button>
        </div>
      ))}
    </div>
  );
}

// Example Chat component
function ExampleChatComponent({ roomId }: { roomId: string }) {
  const { data: messages } = useChatMessages(roomId);
  const sendMessage = useSendMessage();

  const handleSend = async (content: string) => {
    await sendMessage.mutateAsync({
      roomId,
      content,
      type: 'text',
    });
  };

  return (
    <div>
      {messages?.data.map((message) => (
        <div key={message.id}>
          <strong>{message.sender?.firstName}:</strong> {message.content}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

import { ApiError, ApiErrorCode } from '@/types';

async function exampleErrorHandling() {
  try {
    await contactsApi.getContact('invalid-id');
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.code) {
        case ApiErrorCode.UNAUTHORIZED:
          // Handle unauthorized - redirect to login
          break;
        case ApiErrorCode.FORBIDDEN:
          // Handle forbidden - show access denied message
          break;
        case ApiErrorCode.NOT_FOUND:
          // Handle not found - show 404 message
          break;
        case ApiErrorCode.VALIDATION_ERROR:
          // Handle validation errors - display field errors
          break;
        case ApiErrorCode.NETWORK_ERROR:
          // Handle network error - retry or show offline message
          break;
        default:
          // Handle generic error
      }
    }
  }
}

// =============================================================================
// SETUP REACT QUERY PROVIDER
// =============================================================================

// In your root layout.tsx:
/*
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
*/
