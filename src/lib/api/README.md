# Lumina Estate API Layer

A comprehensive, type-safe API layer for the Lumina Estate frontend application.

## Features

- ✅ **Centralized API Client** - Consistent fetch wrapper with error handling
- ✅ **TypeScript Support** - Fully typed requests and responses
- ✅ **React Query Integration** - Pre-built hooks for data fetching and caching
- ✅ **Error Handling** - Structured error types with error codes
- ✅ **Request/Response Interceptors** - Customizable middleware
- ✅ **DRY Principle** - Reusable functions and utilities

## Project Structure

```
src/
├── lib/
│   └── api/
│       ├── index.ts              # Main exports
│       ├── client.ts             # API client with fetch wrapper
│       ├── examples.ts           # Usage examples
│       └── services/
│           ├── index.ts          # Services barrel export
│           ├── contacts.ts       # Contact API calls
│           ├── deals.ts          # Deal API calls
│           ├── tasks.ts          # Task API calls
│           ├── notes.ts          # Note API calls
│           └── chat.ts           # Chat API calls
├── providers/
│   └── ReactQueryProvider.tsx    # React Query configuration
├── hooks/
│   ├── index.ts                  # Hooks barrel export
│   ├── useContacts.ts            # Contact query hooks
│   ├── useDeals.ts               # Deal query hooks
│   ├── useTasks.ts               # Task query hooks
│   ├── useNotes.ts               # Note query hooks
│   └── useChat.ts                # Chat query hooks
└── types/
    ├── index.ts                  # Types barrel export
    ├── api.ts                    # API-specific types
    ├── crm.ts                    # CRM types (Contact, Deal, Task, Note)
    └── chat.ts                   # Chat types
```

## Installation

The API layer uses `@tanstack/react-query` for data fetching. It's already installed:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

## Setup

### 1. Add React Query Provider

In your root `layout.tsx`:

```tsx
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
```

### 2. Configure Base URL (Optional)

The API client automatically uses `/api` as the base URL. To customize:

```tsx
import { apiClient } from '@/lib/api';

// Set custom configuration
const customClient = new ApiClient({
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

## Usage

### Direct API Calls

```tsx
import { contactsApi, dealsApi, tasksApi } from '@/lib/api';

// Fetch contacts
const contacts = await contactsApi.getContacts({ status: 'lead', page: 1 });

// Create a deal
const deal = await dealsApi.createDeal({
  title: 'New Property',
  contactId: 'contact-123',
  value: 100000,
  currency: 'USD',
  stage: 'lead',
});

// Complete a task
await tasksApi.completeTask('task-123');
```

### React Query Hooks (Recommended)

```tsx
import { useContacts, useCreateContact, useUpdateContact } from '@/hooks';

function ContactsList() {
  // Fetch data
  const { data, isLoading, error } = useContacts({ status: 'lead' });
  
  // Mutations
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();

  const handleCreate = () => {
    createContact.mutate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      status: 'lead',
      source: 'website',
    });
  };

  const handleUpdate = (id: string) => {
    updateContact.mutate({
      id,
      data: { status: 'prospect' },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map(contact => (
        <div key={contact.id}>{contact.firstName} {contact.lastName}</div>
      ))}
    </div>
  );
}
```

## Available Hooks

### Contacts
- `useContacts(params?)` - List contacts
- `useContact(id)` - Get single contact
- `useCreateContact()` - Create contact
- `useUpdateContact()` - Update contact
- `useDeleteContact()` - Delete contact
- `useContactSearch(query, params?)` - Search contacts
- `useContactsByStatus(status, params?)` - Filter by status

### Deals
- `useDeals(params?)` - List deals with pipeline & stats
- `useDeal(id)` - Get single deal
- `useCreateDeal()` - Create deal
- `useUpdateDeal()` - Update deal
- `useDeleteDeal()` - Delete deal
- `useUpdateDealStage()` - Update deal stage (for pipeline)
- `useDealsByStage(stage, params?)` - Filter by stage
- `useContactDeals(contactId, params?)` - Get deals for contact

### Tasks
- `useTasks(params?)` - List tasks
- `useTask(id)` - Get single task
- `useOverdueTasks(params?)` - Get overdue tasks
- `useUpcomingTasks(days?)` - Get tasks due in N days
- `useCreateTask()` - Create task
- `useUpdateTask()` - Update task
- `useDeleteTask()` - Delete task
- `useCompleteTask()` - Mark as completed
- `useStartTask()` - Mark as in progress
- `useTasksByStatus(status, params?)` - Filter by status
- `useTasksByPriority(priority, params?)` - Filter by priority

### Notes
- `useNotes(params?)` - List notes
- `useNote(id)` - Get single note
- `useContactNotes(contactId, params?)` - Get notes for contact
- `useDealNotes(dealId, params?)` - Get notes for deal
- `useCreateNote()` - Create note
- `useUpdateNote()` - Update note
- `useDeleteNote()` - Delete note
- `useCreateContactNote()` - Create note for contact
- `useCreateDealNote()` - Create note for deal

### Chat
- `useChatRooms(params?)` - List chat rooms
- `useChatRoom(id)` - Get single room
- `useChatMessages(roomId, params?)` - Get messages
- `useCreateChatRoom()` - Create room
- `useSendMessage()` - Send message
- `useSendTextMessage()` - Send text message
- `useUpdateMessage()` - Edit message
- `useDeleteMessage()` - Delete message
- `useMarkMessagesAsRead()` - Mark as read

## Error Handling

All errors are instances of `ApiError` with the following structure:

```tsx
import { ApiError, ApiErrorCode } from '@/types';

try {
  await contactsApi.getContact('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.code);       // ApiErrorCode.NOT_FOUND
    console.log(error.message);    // "Contact not found"
    console.log(error.statusCode); // 404
    console.log(error.details);    // Validation error details
  }
}
```

### Error Codes

- `UNAUTHORIZED` - 401 Not authenticated
- `FORBIDDEN` - 403 Access denied
- `NOT_FOUND` - 404 Resource not found
- `VALIDATION_ERROR` - 400/422 Validation failed
- `SERVER_ERROR` - 500+ Server error
- `NETWORK_ERROR` - Network/timeout error
- `UNKNOWN_ERROR` - Unexpected error

## Interceptors

Add custom interceptors for request/response handling:

```tsx
import { 
  addRequestInterceptor, 
  addResponseInterceptor, 
  addErrorInterceptor 
} from '@/lib/api';

// Request interceptor
const removeRequestInterceptor = addRequestInterceptor((config) => {
  config.headers = {
    ...config.headers,
    'X-Request-ID': generateUUID(),
  };
  return config;
});

// Response interceptor
const removeResponseInterceptor = addResponseInterceptor((response) => {
  console.log('Response received:', response);
  return response;
});

// Error interceptor
const removeErrorInterceptor = addErrorInterceptor((error) => {
  if (error.code === ApiErrorCode.UNAUTHORIZED) {
    // Redirect to login
    window.location.href = '/login';
  }
  return error;
});

// Remove interceptors when no longer needed
removeRequestInterceptor();
```

## Query Keys

Query keys are exported for manual cache manipulation:

```tsx
import { contactKeys, dealKeys, taskKeys, noteKeys, chatKeys } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const queryClient = useQueryClient();

  // Invalidate all contact queries
  queryClient.invalidateQueries({ queryKey: contactKeys.all });

  // Invalidate specific contact
  queryClient.invalidateQueries({ queryKey: contactKeys.detail('contact-123') });

  // Set query data manually
  queryClient.setQueryData(contactKeys.detail('contact-123'), { data: contact });
}
```

## Type Exports

All types are available from `@/types`:

```tsx
import { 
  Contact, 
  Deal, 
  Task, 
  Note, 
  ChatRoom, 
  ChatMessage,
  PaginatedResponse,
  ApiError,
  ApiErrorCode,
} from '@/types';
```

## Best Practices

1. **Use React Query hooks** instead of direct API calls for better caching
2. **Handle errors** using `ApiError` type checking
3. **Use query keys** for cache invalidation after mutations
4. **Prefetch data** when navigating for faster UX
5. **Use optimistic updates** for better perceived performance

## Examples

See `src/lib/api/examples.ts` for comprehensive usage examples.
