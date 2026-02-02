/**
 * CRM React Query Hooks
 * Pre-built hooks for fetching and mutating CRM data
 */

// Contacts
export {
  useContacts,
  useContact,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useContactSearch,
  useContactsByStatus,
  contactKeys,
} from './useContacts';

// Deals
export {
  useDeals,
  useDeal,
  useCreateDeal,
  useUpdateDeal,
  useDeleteDeal,
  useUpdateDealStage,
  useDealsByStage,
  useContactDeals,
  dealKeys,
} from './useDeals';

// Tasks
export {
  useTasks,
  useTask,
  useOverdueTasks,
  useUpcomingTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useCompleteTask,
  useStartTask,
  useTasksByStatus,
  useTasksByPriority,
  useMyTasks,
  taskKeys,
} from './useTasks';

// Notes
export {
  useNotes,
  useNote,
  useContactNotes,
  useDealNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
  useCreateContactNote,
  useCreateDealNote,
  noteKeys,
} from './useNotes';
