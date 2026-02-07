/**
 * API Types for Lumina Estate
 * Centralized type definitions for all API operations
 */

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: Array<{
    path: string | number;
    message: string;
  }>;
  statusCode?: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Generic wrapper for list responses
export type ListResponse<T> = PaginatedResponse<T>;

// Single item response
export type ItemResponse<T> = ApiSuccessResponse<T>;

// ============================================================================
// Error Types
// ============================================================================

export enum ApiErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class ApiError extends Error {
  code: ApiErrorCode;
  statusCode: number;
  details?: Array<{ path: string | number; message: string }>;

  constructor(
    message: string,
    code: ApiErrorCode = ApiErrorCode.UNKNOWN_ERROR,
    statusCode: number = 500,
    details?: Array<{ path: string | number; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// ============================================================================
// Request Body Types
// ============================================================================

// Contacts
export interface CreateContactBody {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status?: 'lead' | 'prospect' | 'client';
  source?: string;
  notes?: string;
}

export type UpdateContactBody = Partial<CreateContactBody>;

// Deals
export interface CreateDealBody {
  title: string;
  contactId: string;
  stage?: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  value?: number;
  currency?: 'GEL' | 'USD' | 'EUR' | 'RUB';
  probability?: number;
  expectedCloseDate?: string;
  description?: string;
}

export type UpdateDealBody = Partial<CreateDealBody>;

// Tasks
export interface CreateTaskBody {
  title: string;
  description?: string;
  assignedToId: string;
  dealId?: string;
  contactId?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
}

export type UpdateTaskBody = Partial<CreateTaskBody>;

// Notes
export interface CreateNoteBody {
  content: string;
  contactId?: string;
  dealId?: string;
}

export type UpdateNoteBody = Partial<CreateNoteBody>;

// Chat
export interface CreateChatRoomBody {
  name: string;
  type?: 'direct' | 'group';
  memberIds?: string[];
}

export interface CreateChatMessageBody {
  roomId: string;
  content: string;
  type?: 'text' | 'image' | 'file' | 'system';
}

export interface UpdateChatMessageBody {
  content: string;
}

// ============================================================================
// Query Parameter Types
// ============================================================================

export interface ContactQueryParams extends PaginationParams {
  status?: 'lead' | 'prospect' | 'client';
  search?: string;
}

export interface DealQueryParams extends PaginationParams {
  stage?: string;
  contactId?: string;
}

export interface TaskQueryParams extends PaginationParams {
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  assignedToMe?: boolean;
}

export interface NoteQueryParams extends PaginationParams {
  contactId?: string;
  dealId?: string;
}

export type ChatRoomQueryParams = PaginationParams;

export interface ChatMessageQueryParams extends PaginationParams {
  roomId: string;
}

// ============================================================================
// HTTP Methods
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// ============================================================================
// API Client Configuration
// ============================================================================

export interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
}
