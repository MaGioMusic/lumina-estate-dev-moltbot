"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/lib/logger';

// Types for WebSocket/polling messages
export interface WebSocketMessage {
  type: 'message' | 'typing' | 'presence' | 'room_update' | 'error';
  roomId?: string;
  userId?: string;
  data: any;
  timestamp: string;
}

export interface TypingIndicator {
  roomId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface PresenceUpdate {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface UseWebSocketOptions {
  roomId?: string | null;
  enabled?: boolean;
  pollInterval?: number; // in milliseconds, for fallback polling
  onMessage?: (message: WebSocketMessage) => void;
  onTyping?: (typing: TypingIndicator) => void;
  onPresence?: (presence: PresenceUpdate) => void;
  onError?: (error: Error) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  onlineUsers: Set<string>;
  typingUsers: Map<string, TypingIndicator>; // roomId -> typing info
  sendTyping: (isTyping: boolean) => void;
  reconnect: () => void;
}

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    roomId,
    enabled = true,
    pollInterval = 3000,
    onMessage,
    onTyping,
    onPresence,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingIndicator>>(new Map());
  
  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingRef = useRef<number>(0);

  // WebSocket URL - use relative URL for same-origin
  const wsUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/chat/ws`
    : '';

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!enabled || !roomId) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      // Check if WebSocket is supported and available
      if (typeof WebSocket === 'undefined') {
        throw new Error('WebSocket not supported in this environment');
      }

      // Try to establish WebSocket connection
      const ws = new WebSocket(`${wsUrl}?roomId=${encodeURIComponent(roomId)}`);
      
      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        
        // Join room
        ws.send(JSON.stringify({
          type: 'join',
          roomId,
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'message':
              onMessage?.(message);
              break;
            case 'typing':
              if (message.data) {
                const typing: TypingIndicator = {
                  roomId: message.roomId || roomId,
                  userId: message.userId || message.data.userId,
                  userName: message.data.userName,
                  isTyping: message.data.isTyping,
                };
                
                setTypingUsers(prev => {
                  const next = new Map(prev);
                  if (typing.isTyping) {
                    next.set(typing.userId, typing);
                  } else {
                    next.delete(typing.userId);
                  }
                  return next;
                });
                
                onTyping?.(typing);
              }
              break;
            case 'presence':
              if (message.data) {
                const presence: PresenceUpdate = {
                  userId: message.userId || message.data.userId,
                  isOnline: message.data.isOnline,
                  lastSeen: message.data.lastSeen,
                };
                
                setOnlineUsers(prev => {
                  const next = new Set(prev);
                  if (presence.isOnline) {
                    next.add(presence.userId);
                  } else {
                    next.delete(presence.userId);
                  }
                  return next;
                });
                
                onPresence?.(presence);
              }
              break;
            case 'error':
              logger.error('WebSocket error message:', message.data);
              break;
          }
        } catch (err) {
          logger.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };

      ws.onerror = (err) => {
        setError('WebSocket connection error');
        setIsConnected(false);
        setIsConnecting(false);
        onError?.(new Error('WebSocket connection error'));
      };

      wsRef.current = ws;
    } catch (err) {
      // WebSocket not available, fall back to polling
      setIsConnecting(false);
      setError('WebSocket not available, using polling fallback');
    }
  }, [enabled, roomId, wsUrl, onMessage, onTyping, onPresence, onError]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Reconnect
  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [disconnect, connect]);

  // Send typing indicator
  const sendTyping = useCallback((isTyping: boolean) => {
    if (!roomId) return;
    
    // Rate limit typing events (max 1 per second)
    const now = Date.now();
    if (now - lastTypingRef.current < 1000) return;
    lastTypingRef.current = now;

    if (isConnected && wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        roomId,
        isTyping,
      }));
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-clear typing after 3 seconds
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        if (isConnected && wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'typing',
            roomId,
            isTyping: false,
          }));
        }
      }, 3000);
    }
  }, [roomId, isConnected]);

  // Polling fallback for presence/typing when WebSocket is not available
  useEffect(() => {
    if (!enabled || !roomId) return;
    
    // If WebSocket is not connected, use polling
    if (!isConnected && pollInterval > 0) {
      pollRef.current = setInterval(() => {
        // Fetch presence data via HTTP API
        fetch(`/api/chat/rooms/${roomId}/presence`)
          .then(res => {
            if (res.ok) return res.json();
            return null;
          })
          .then(data => {
            if (data?.onlineUsers) {
              setOnlineUsers(new Set(data.onlineUsers));
            }
          })
          .catch(() => {
            // Silent fail - presence is not critical
          });
      }, pollInterval);

      return () => {
        if (pollRef.current) {
          clearInterval(pollRef.current);
        }
      };
    }
  }, [enabled, roomId, isConnected, pollInterval]);

  // Connect/disconnect based on roomId changes
  useEffect(() => {
    if (enabled && roomId) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [enabled, roomId, connect, disconnect]);

  // Clean up typing indicators after timeout
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => {
        const next = new Map(prev);
        let changed = false;
        prev.forEach((typing, userId) => {
          // Remove typing indicators older than 5 seconds
          const timestamp = new Date(typing.isTyping ? now : now - 5000).getTime();
          if (now - timestamp > 5000) {
            next.delete(userId);
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    onlineUsers,
    typingUsers,
    sendTyping,
    reconnect,
  };
}
