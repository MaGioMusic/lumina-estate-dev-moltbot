/**
 * Chat API Service
 * All API calls related to chat rooms and messages
 */

import apiClient from '../client';
import {
  ChatRoom,
  ChatMessage,
  ChatParticipant,
  ChatRoomFormData,
  ChatMessageFormData,
  ChatRoomQueryParams,
  ChatMessageQueryParams,
  CreateChatRoomBody,
  CreateChatMessageBody,
} from '@/types';
import { PaginatedResponse, ItemResponse } from '@/types/api';

// Extended chat room type from API response
interface ChatRoomWithRelations extends ChatRoom {
  members?: Array<{
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatar: string | null;
    };
    role: 'admin' | 'member';
  }>;
  _count?: {
    messages: number;
  };
}

// Extended chat message type from API response
interface ChatMessageWithRelations extends ChatMessage {
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

const ROOMS_PATH = '/chat/rooms';
const MESSAGES_PATH = '/chat/messages';

// ============================================================================
// Chat Rooms
// ============================================================================

/**
 * Get all chat rooms for the current user
 */
export async function getChatRooms(
  params?: ChatRoomQueryParams
): Promise<PaginatedResponse<ChatRoomWithRelations>> {
  const response = await apiClient.get<{
    success: true;
    rooms: ChatRoomWithRelations[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(ROOMS_PATH, { params });

  return {
    success: true,
    data: response.rooms,
    pagination: response.pagination,
  };
}

/**
 * Get a single chat room by ID
 */
export async function getChatRoom(id: string): Promise<ItemResponse<ChatRoomWithRelations>> {
  const response = await apiClient.get<{
    success: true;
    room: ChatRoomWithRelations;
  }>(`${ROOMS_PATH}/${id}`);

  return {
    success: true,
    data: response.room,
  };
}

/**
 * Create a new chat room
 */
export async function createChatRoom(
  data: CreateChatRoomBody | ChatRoomFormData
): Promise<ItemResponse<ChatRoomWithRelations>> {
  const response = await apiClient.post<{
    success: true;
    room: ChatRoomWithRelations;
  }>(ROOMS_PATH, data);

  return {
    success: true,
    data: response.room,
  };
}

/**
 * Update a chat room
 */
export async function updateChatRoom(
  id: string,
  data: Partial<CreateChatRoomBody>
): Promise<ItemResponse<ChatRoomWithRelations>> {
  const response = await apiClient.patch<{
    success: true;
    room: ChatRoomWithRelations;
  }>(`${ROOMS_PATH}/${id}`, data);

  return {
    success: true,
    data: response.room,
  };
}

/**
 * Delete a chat room
 */
export async function deleteChatRoom(id: string): Promise<{ success: true }> {
  await apiClient.delete(`${ROOMS_PATH}/${id}`);
  return { success: true };
}

/**
 * Join a chat room
 */
export async function joinChatRoom(
  roomId: string
): Promise<{ success: true }> {
  await apiClient.post(`${ROOMS_PATH}/${roomId}/join`);
  return { success: true };
}

/**
 * Leave a chat room
 */
export async function leaveChatRoom(
  roomId: string
): Promise<{ success: true }> {
  await apiClient.post(`${ROOMS_PATH}/${roomId}/leave`);
  return { success: true };
}

// ============================================================================
// Chat Messages
// ============================================================================

/**
 * Get messages for a specific chat room
 */
export async function getChatMessages(
  params: ChatMessageQueryParams
): Promise<PaginatedResponse<ChatMessageWithRelations>> {
  const response = await apiClient.get<{
    success: true;
    messages: ChatMessageWithRelations[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(MESSAGES_PATH, { params });

  return {
    success: true,
    data: response.messages,
    pagination: response.pagination,
  };
}

/**
 * Get a single message by ID
 */
export async function getChatMessage(id: string): Promise<ItemResponse<ChatMessageWithRelations>> {
  const response = await apiClient.get<{
    success: true;
    message: ChatMessageWithRelations;
  }>(`${MESSAGES_PATH}/${id}`);

  return {
    success: true,
    data: response.message,
  };
}

/**
 * Send a message to a chat room
 */
export async function sendChatMessage(
  data: CreateChatMessageBody | ChatMessageFormData
): Promise<ItemResponse<ChatMessageWithRelations>> {
  const response = await apiClient.post<{
    success: true;
    message: ChatMessageWithRelations;
  }>(MESSAGES_PATH, data);

  return {
    success: true,
    data: response.message,
  };
}

/**
 * Update a message (edit)
 */
export async function updateChatMessage(
  id: string,
  content: string
): Promise<ItemResponse<ChatMessageWithRelations>> {
  const response = await apiClient.patch<{
    success: true;
    message: ChatMessageWithRelations;
  }>(`${MESSAGES_PATH}/${id}`, { content });

  return {
    success: true,
    data: response.message,
  };
}

/**
 * Delete a message (soft delete)
 */
export async function deleteChatMessage(id: string): Promise<{ success: true }> {
  await apiClient.delete(`${MESSAGES_PATH}/${id}`);
  return { success: true };
}

/**
 * Mark messages as read in a room
 */
export async function markMessagesAsRead(
  roomId: string
): Promise<{ success: true }> {
  await apiClient.post(`${ROOMS_PATH}/${roomId}/read`);
  return { success: true };
}

// ============================================================================
// Convenience Methods
// ============================================================================

/**
 * Send a text message to a room
 */
export async function sendTextMessage(
  roomId: string,
  content: string
): Promise<ItemResponse<ChatMessageWithRelations>> {
  return sendChatMessage({ roomId, content, type: 'text' });
}

/**
 * Send an image message to a room
 */
export async function sendImageMessage(
  roomId: string,
  content: string,
  fileUrl: string
): Promise<ItemResponse<ChatMessageWithRelations>> {
  return sendChatMessage({
    roomId,
    content,
    type: 'image',
  });
}

/**
 * Reply to a specific message
 */
export async function replyToMessage(
  roomId: string,
  replyToMessageId: string,
  content: string
): Promise<ItemResponse<ChatMessageWithRelations>> {
  return sendChatMessage({
    roomId,
    content,
    type: 'text',
  });
}

// Export all functions
export const chatApi = {
  // Rooms
  getChatRooms,
  getChatRoom,
  createChatRoom,
  updateChatRoom,
  deleteChatRoom,
  joinChatRoom,
  leaveChatRoom,
  // Messages
  getChatMessages,
  getChatMessage,
  sendChatMessage,
  updateChatMessage,
  deleteChatMessage,
  markMessagesAsRead,
  // Convenience
  sendTextMessage,
  sendImageMessage,
  replyToMessage,
};

export default chatApi;
