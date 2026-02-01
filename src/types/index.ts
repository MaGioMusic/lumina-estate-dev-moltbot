/**
 * Types Index
 * Centralized exports for all types
 */

// CRM Types
export type {
  ContactStatus,
  ContactSource,
  Contact,
  DealStage,
  DealPriority,
  Deal,
  TaskStatus,
  TaskPriority,
  Task,
  Note,
  ContactFormData,
  DealFormData,
  TaskFormData,
  NoteFormData,
} from './crm';

// Chat Types
export type {
  ChatRoomType,
  ChatRoom,
  MessageType,
  ChatMessage,
  ChatParticipant,
  ChatMessageFormData,
  ChatRoomFormData,
} from './chat';

// API Types
export type {
  PaginationParams,
  PaginationMeta,
  PaginatedResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiResponse,
  ListResponse,
  ItemResponse,
  ApiErrorCode,
  ApiError,
  CreateContactBody,
  UpdateContactBody,
  CreateDealBody,
  UpdateDealBody,
  CreateTaskBody,
  UpdateTaskBody,
  CreateNoteBody,
  UpdateNoteBody,
  CreateChatRoomBody,
  CreateChatMessageBody,
  ContactQueryParams,
  DealQueryParams,
  TaskQueryParams,
  NoteQueryParams,
  ChatRoomQueryParams,
  ChatMessageQueryParams,
  HttpMethod,
  ApiClientConfig,
  RequestConfig,
} from './api';

// Re-export error class
export { ApiError } from './api';
