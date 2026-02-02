/**
 * React Query Hooks Index
 * Centralized exports for all API hooks
 */

// CRM Hooks (from crm/ folder)
export {
  // Contacts
  useContacts,
  useContact,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useContactSearch,
  useContactsByStatus,
  contactKeys,
  // Deals
  useDeals,
  useDeal,
  useCreateDeal,
  useUpdateDeal,
  useDeleteDeal,
  useUpdateDealStage,
  useDealsByStage,
  useContactDeals,
  dealKeys,
  // Tasks
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
  // Notes
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
} from './crm';

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

// Mobile
export { useIsMobile } from './use-mobile';

// Stale flag
export { useStaleFlag } from './useStaleFlag';
