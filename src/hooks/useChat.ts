/**
 * React Query Hooks for Chat
 * Pre-built hooks for fetching and mutating chat data
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { chatApi } from '@/lib/api';
import {
  ChatRoom,
  ChatMessage,
  ChatRoomFormData,
  ChatMessageFormData,
  ChatRoomQueryParams,
  ChatMessageQueryParams,
} from '@/types';
import { ApiError, PaginatedResponse, ItemResponse } from '@/types/api';

// Query keys
export const chatKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatKeys.all, 'rooms'] as const,
  room: (id: string) => [...chatKeys.rooms(), id] as const,
  roomList: (params?: ChatRoomQueryParams) => [...chatKeys.rooms(), 'list', params] as const,
  messages: (roomId: string) => [...chatKeys.all, 'messages', roomId] as const,
  messageList: (params: ChatMessageQueryParams) => [...chatKeys.messages(params.roomId), 'list', params] as const,
};

// Types for chat with relations
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

interface ChatMessageWithRelations extends ChatMessage {
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

// ============================================================================
// Room Query Hooks
// ============================================================================

/**
 * Hook to fetch all chat rooms for the current user
 */
export function useChatRooms(
  params?: ChatRoomQueryParams,
  options?: UseQueryOptions<PaginatedResponse<ChatRoomWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: chatKeys.roomList(params),
    queryFn: () => chatApi.getChatRooms(params),
    ...options,
  });
}

/**
 * Hook to fetch a single chat room
 */
export function useChatRoom(
  id: string,
  options?: UseQueryOptions<ItemResponse<ChatRoomWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: chatKeys.room(id),
    queryFn: () => chatApi.getChatRoom(id),
    enabled: !!id,
    ...options,
  });
}

// ============================================================================
// Message Query Hooks
// ============================================================================

/**
 * Hook to fetch messages for a specific chat room
 */
export function useChatMessages(
  roomId: string,
  params?: Omit<ChatMessageQueryParams, 'roomId'>,
  options?: UseQueryOptions<PaginatedResponse<ChatMessageWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: chatKeys.messageList({ roomId, ...params }),
    queryFn: () => chatApi.getChatMessages({ roomId, ...params }),
    enabled: !!roomId,
    ...options,
  });
}

/**
 * Hook to fetch a single message
 */
export function useChatMessage(
  id: string,
  options?: UseQueryOptions<ItemResponse<ChatMessageWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: [...chatKeys.all, 'message', id],
    queryFn: () => chatApi.getChatMessage(id),
    enabled: !!id,
    ...options,
  });
}

// ============================================================================
// Room Mutation Hooks
// ============================================================================

/**
 * Hook to create a new chat room
 */
export function useCreateChatRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.createChatRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
}

/**
 * Hook to update a chat room
 */
export function useUpdateChatRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ChatRoomFormData> }) =>
      chatApi.updateChatRoom(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.room(variables.id) });
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
}

/**
 * Hook to delete a chat room
 */
export function useDeleteChatRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.deleteChatRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
}

/**
 * Hook to join a chat room
 */
export function useJoinChatRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.joinChatRoom,
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.room(roomId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
}

/**
 * Hook to leave a chat room
 */
export function useLeaveChatRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.leaveChatRoom,
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.room(roomId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
}

// ============================================================================
// Message Mutation Hooks
// ============================================================================

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.sendChatMessage,
    onSuccess: (_, variables) => {
      const roomId = 'roomId' in variables ? variables.roomId : null;
      if (roomId) {
        queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) });
        queryClient.invalidateQueries({ queryKey: chatKeys.room(roomId) });
      }
    },
  });
}

/**
 * Hook to update (edit) a message
 */
export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      chatApi.updateChatMessage(id, content),
    onSuccess: () => {
      // Invalidate all message lists since we don't know which room
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}

/**
 * Hook to delete a message
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.deleteChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}

/**
 * Hook to mark messages as read in a room
 */
export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.markMessagesAsRead,
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.room(roomId) });
    },
  });
}

// ============================================================================
// Convenience Hooks
// ============================================================================

/**
 * Hook to send a text message to a room
 */
export function useSendTextMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, content }: { roomId: string; content: string }) =>
      chatApi.sendTextMessage(roomId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(variables.roomId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.room(variables.roomId) });
    },
  });
}

/**
 * Hook to reply to a message
 */
export function useReplyToMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      replyToMessageId,
      content,
    }: {
      roomId: string;
      replyToMessageId: string;
      content: string;
    }) => chatApi.replyToMessage(roomId, replyToMessageId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(variables.roomId) });
    },
  });
}
