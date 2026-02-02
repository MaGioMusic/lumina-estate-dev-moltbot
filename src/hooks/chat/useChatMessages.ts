"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, MessageType } from '@/types/chat';
import { getClientCsrfToken, fetchCsrfToken, CSRF_HEADER_NAME } from '@/lib/security/csrf';
import { logger } from '@/lib/logger';

interface UseChatMessagesOptions {
  roomId: string | null;
  autoFetch?: boolean;
  pollInterval?: number; // in milliseconds
  pageSize?: number;
}

interface SendMessageData {
  content: string;
  type?: MessageType;
  file?: File | null;
  replyTo?: string | null;
}

interface UseChatMessagesReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  fetchMessages: (page?: number) => Promise<void>;
  sendMessage: (data: SendMessageData) => Promise<ChatMessage | null>;
  loadMore: () => Promise<void>;
  refresh: () => void;
  addOptimisticMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  removeMessage: (messageId: string) => void;
}

// Generate a temporary ID for optimistic updates
const generateTempId = () => `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function useChatMessages(options: UseChatMessagesOptions): UseChatMessagesReturn {
  const { roomId, autoFetch = true, pollInterval = 3000, pageSize = 50 } = options;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const fetchMessages = useCallback(async (page: number = 1, signal?: AbortSignal) => {
    if (!roomId) {
      if (isMountedRef.current) {
        setMessages([]);
      }
      return;
    }
    
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
      const response = await fetch(
        `/api/chat/messages?roomId=${encodeURIComponent(roomId)}&page=${page}&limit=${pageSize}`,
        { signal: finalSignal }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return;
      
      if (data.success && Array.isArray(data.messages)) {
        // Transform Prisma data to match ChatMessage type
        const transformedMessages: ChatMessage[] = data.messages.map((msg: any) => ({
          id: msg.id,
          roomId: msg.roomId,
          senderId: msg.senderId,
          senderName: msg.sender ? `${msg.sender.firstName || ''} ${msg.sender.lastName || ''}`.trim() : 'Unknown',
          senderAvatar: msg.sender?.avatar || null,
          type: msg.type,
          content: msg.content,
          fileUrl: msg.fileUrl,
          fileName: msg.fileName,
          fileSize: msg.fileSize,
          isEdited: msg.isEdited,
          editedAt: msg.editedAt,
          replyTo: msg.replyTo,
          createdAt: msg.createdAt,
        }));
        
        if (page === 1) {
          setMessages(transformedMessages);
        } else {
          // Prepend older messages
          setMessages(prev => [...transformedMessages, ...prev]);
        }
        
        setHasMore(data.pagination?.page < data.pagination?.totalPages);
        setCurrentPage(page);
      }
    } catch (err) {
      // Don't update state if request was aborted or component unmounted
      if ((err instanceof Error && err.name === 'AbortError') || !isMountedRef.current) {
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
      logger.error('Error fetching messages:', err);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [roomId, pageSize]);

  const sendMessage = useCallback(async (data: SendMessageData): Promise<ChatMessage | null> => {
    if (!roomId) {
      setError('No room selected');
      return null;
    }
    
    setIsSending(true);
    setError(null);
    
    try {
      // Handle file upload if present
      let fileUrl = null;
      let fileName = null;
      let fileSize = null;
      
      if (data.file) {
        // Upload file first
        const formData = new FormData();
        formData.append('file', data.file);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }
        
        const uploadResult = await uploadResponse.json();
        fileUrl = uploadResult.url;
        fileName = data.file.name;
        fileSize = data.file.size;
      }
      
      // Get CSRF token for mutation
      let csrfToken = getClientCsrfToken();
      if (!csrfToken) {
        csrfToken = await fetchCsrfToken();
      }

      // Send message
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          [CSRF_HEADER_NAME]: csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify({
          roomId,
          content: data.content,
          type: data.type || 'text',
          fileUrl,
          fileName,
          fileSize,
          replyTo: data.replyTo,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to send message: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.message) {
        const newMessage: ChatMessage = {
          id: result.message.id,
          roomId: result.message.roomId,
          senderId: result.message.senderId,
          senderName: result.message.sender ? 
            `${result.message.sender.firstName || ''} ${result.message.sender.lastName || ''}`.trim() : 
            'You',
          senderAvatar: result.message.sender?.avatar || null,
          type: result.message.type,
          content: result.message.content,
          fileUrl: result.message.fileUrl,
          fileName: result.message.fileName,
          fileSize: result.message.fileSize,
          isEdited: result.message.isEdited,
          editedAt: result.message.editedAt,
          replyTo: result.message.replyTo,
          createdAt: result.message.createdAt,
        };
        
        // Replace optimistic message or add new one
        setMessages(prev => {
          // Remove any optimistic message with same content
          const filtered = prev.filter(m => 
            !(m.id.startsWith('temp-') && m.content === data.content && m.senderId === result.message.senderId)
          );
          return [...filtered, newMessage];
        });
        
        return newMessage;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      logger.error('Error sending message:', err);
      return null;
    } finally {
      setIsSending(false);
    }
  }, [roomId]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await fetchMessages(currentPage + 1);
  }, [hasMore, isLoading, currentPage, fetchMessages]);

  const refresh = useCallback(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  // Optimistic update helpers
  const addOptimisticMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateMessage = useCallback((messageId: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Auto-fetch when roomId changes
  useEffect(() => {
    if (autoFetch && roomId) {
      const controller = new AbortController();
      fetchMessages(1, controller.signal);
      
      return () => {
        controller.abort();
      };
    }
  }, [roomId, autoFetch, fetchMessages]);

  // Set up polling for real-time updates
  useEffect(() => {
    if (pollInterval > 0 && roomId) {
      // Clear any existing interval
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
      
      pollRef.current = setInterval(() => {
        // Create new abort controller for each poll request
        const pollController = new AbortController();
        fetchMessages(1, pollController.signal);
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
  }, [pollInterval, roomId, fetchMessages]);

  return {
    messages,
    isLoading,
    isSending,
    error,
    hasMore,
    currentPage,
    fetchMessages,
    sendMessage,
    loadMore,
    refresh,
    addOptimisticMessage,
    updateMessage,
    removeMessage,
  };
}
