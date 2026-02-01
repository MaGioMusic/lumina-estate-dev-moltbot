/**
 * API Module Index
 * Centralized exports for the entire API layer
 */

// Client
export { apiClient, addRequestInterceptor, addResponseInterceptor, addErrorInterceptor } from './client';
export { default } from './client';

// Services
export {
  api,
  contactsApi,
  dealsApi,
  tasksApi,
  notesApi,
  chatApi,
} from './services';

// Types (re-export from types/api for convenience)
export type {
  ApiClientConfig,
  RequestConfig,
} from './client';

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
} from '@/types/api';
