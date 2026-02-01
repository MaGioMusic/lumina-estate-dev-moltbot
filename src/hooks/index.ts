/**
 * React Query Hooks Index
 * Centralized exports for all API hooks
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

// Chat
export {
  useChatRooms,
  useChatRoom,
  useChatMessages,
  useChatMessage,
  useCreateChatRoom,
  useUpdateChatRoom,
  useDeleteChatRoom,
  useJoinChatRoom,
  useLeaveChatRoom,
  useSendMessage,
  useUpdateMessage,
  useDeleteMessage,
  useMarkMessagesAsRead,
  useSendTextMessage,
  useReplyToMessage,
  chatKeys,
} from './useChat';
