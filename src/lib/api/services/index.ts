/**
 * API Services Index
 * Centralized exports for all API services
 */

// Export individual services
export { contactsApi } from './contacts';
export { dealsApi } from './deals';
export { tasksApi } from './tasks';
export { notesApi } from './notes';
export { chatApi } from './chat';

// Re-export types from services for convenience
export type { contactsApi as ContactsApi } from './contacts';
export type { dealsApi as DealsApi } from './deals';
export type { tasksApi as TasksApi } from './tasks';
export type { notesApi as NotesApi } from './notes';
export type { chatApi as ChatApi } from './chat';

// Default export with all services
import { contactsApi } from './contacts';
import { dealsApi } from './deals';
import { tasksApi } from './tasks';
import { notesApi } from './notes';
import { chatApi } from './chat';

export const api = {
  contacts: contactsApi,
  deals: dealsApi,
  tasks: tasksApi,
  notes: notesApi,
  chat: chatApi,
};

export default api;
