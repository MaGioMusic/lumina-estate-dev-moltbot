'use client';

import React from 'react';
import { MockProperty } from '@/lib/mockProperties';
import { motion } from 'framer-motion';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isPartial: boolean;
  isFinal: boolean;
  propertyCards?: MockProperty[];
  timestamp: Date;
}

interface ChatMessageComponentProps {
  message: ChatMessage;
}

export function ChatMessageComponent({ message }: ChatMessageComponentProps) {
  const isUser = message.role === 'user';
  const bubbleBackground = isUser
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : '#f3f4f6';
  const bubbleBorder = isUser ? 'transparent' : '#e5e7eb';
  const textColor = isUser ? '#ffffff' : '#111827';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 p-3 rounded-lg"
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '100%',
        width: 'fit-content',
        background: bubbleBackground,
        border: `1px solid ${bubbleBorder}`,
        boxShadow: isUser ? '0 4px 10px rgba(0,0,0,0.12)' : 'none',
        position: 'relative',
        zIndex: 3
      }}
      aria-live={message.isFinal ? 'polite' : 'off'}
    >
      <div className="flex-1">
        {/* Message Content */}
        <div 
          className={`text-[14px] leading-relaxed ${
            message.isPartial && !message.isFinal ? 'opacity-70' : 'opacity-100'
          }`}
          style={{ color: textColor, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        >
          {message.content}
          {message.isPartial && !message.isFinal && (
            <span className="inline-block ml-1 animate-pulse">▋</span>
          )}
        </div>

        {/* Property cards in chat are disabled per product decision */}

        {/* Timestamp */}
        {message.isFinal && (
          <div className="text-xs text-white/40 mt-2">
            {message.timestamp.toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </motion.div>
  );
}