"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatRoom, ChatRoomType } from '@/types/chat';
import { getClientCsrfToken, fetchCsrfToken, CSRF_HEADER_NAME } from '@/lib/security/csrf';
import { logger } from '@/lib/logger';

interface UseChatRoomsOptions {
  autoFetch?: boolean;
  pollInterval?: number; // in milliseconds
}

interface CreateRoomData {
  name: string;
  type: ChatRoomType;
  memberIds: string[];
}

interface UseChatRoomsReturn {
  rooms: ChatRoom[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  fetchRooms: () => Promise<void>;
  createRoom: (data: CreateRoomData) => Promise<ChatRoom | null>;
  joinRoom: (roomId: string) => Promise<boolean>;
  refresh: () => void;
}

export function useChatRooms(options: UseChatRoomsOptions = {}): UseChatRoomsReturn {
  const { autoFetch = true, pollInterval = 5000 } = options;
  
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const fetchRooms = useCallback(async (signal?: AbortSignal) => {
    // Abort any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    // Use provided signal if available, otherwise use controller's signal
    const finalSignal = signal || controller.signal;
    
    if (isMountedRef.current) {
      setIsLoading(true);
      setError(null);
    }
    
    try {
      const response = await fetch('/api/chat/rooms', {
        signal: finalSignal,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch rooms: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return;
      
      if (data.success && Array.isArray(data.rooms)) {
        // Transform Prisma data to match ChatRoom type
        const transformedRooms: ChatRoom[] = data.rooms.map((room: any) => ({
          id: room.id,
          name: room.name,
          type: room.type,
          avatar: room.avatar,
          participantIds: room.members?.map((m: any) => m.userId) || [],
          participantCount: room.members?.length || 0,
          lastMessage: room.lastMessage ? {
            content: room.lastMessage.content,
            senderId: room.lastMessage.senderId,
            senderName: room.lastMessage.sender?.name || 'Unknown',
            timestamp: room.lastMessage.createdAt,
          } : null,
          unreadCount: room._count?.messages || 0, // This should be actual unread count from API
          createdBy: room.createdById,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        }));
        
        setRooms(transformedRooms);
      } else {
        setRooms([]);
      }
    } catch (err) {
      // Don't update state if request was aborted or component unmounted
      if ((err instanceof Error && err.name === 'AbortError') || !isMountedRef.current) {
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rooms';
      setError(errorMessage);
      logger.error('Error fetching chat rooms:', err);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const createRoom = useCallback(async (data: CreateRoomData): Promise<ChatRoom | null> => {
    setIsCreating(true);
    setError(null);
    
    try {
      // Get CSRF token for mutation
      let csrfToken = getClientCsrfToken();
      if (!csrfToken) {
        csrfToken = await fetchCsrfToken();
      }

      const response = await fetch('/api/chat/rooms', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          [CSRF_HEADER_NAME]: csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create room: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.room) {
        // Refresh rooms list after creating
        await fetchRooms();
        return result.room;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create room';
      setError(errorMessage);
      logger.error('Error creating chat room:', err);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [fetchRooms]);

  const joinRoom = useCallback(async (roomId: string): Promise<boolean> => {
    setError(null);
    
    try {
      // Note: The API doesn't have a direct join endpoint, but we can use the room creation
      // or a dedicated join endpoint if available
      const response = await fetch(`/api/chat/rooms/${roomId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        // If endpoint doesn't exist, just refresh rooms
        if (response.status === 404) {
          await fetchRooms();
          return true;
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to join room: ${response.status}`);
      }
      
      await fetchRooms();
      return true;
    } catch (err) {
      // If join endpoint doesn't exist, just refresh rooms
      await fetchRooms();
      return true;
    }
  }, [fetchRooms]);

  const refresh = useCallback(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      const controller = new AbortController();
      fetchRooms(controller.signal);
      
      return () => {
        controller.abort();
      };
    }
  }, [autoFetch, fetchRooms]);

  // Set up polling for real-time updates
  useEffect(() => {
    if (pollInterval > 0) {
      // Clear any existing interval
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
      
      pollRef.current = setInterval(() => {
        // Create new abort controller for each poll request
        const pollController = new AbortController();
        fetchRooms(pollController.signal);
      }, pollInterval);
      
      return () => {
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
        // Abort any pending request on unmount or dependency change
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
      };
    }
  }, [pollInterval, fetchRooms]);

  return {
    rooms,
    isLoading,
    isCreating,
    error,
    fetchRooms,
    createRoom,
    joinRoom,
    refresh,
  };
}
