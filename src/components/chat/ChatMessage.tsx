"use client";

import * as React from "react";
import { Check, CheckCheck, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType, MessageType } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn?: boolean;
  showAvatar?: boolean;
  className?: string;
}

export function ChatMessage({
  message,
  isOwn = false,
  showAvatar = true,
  className,
}: ChatMessageProps) {
  const initials = message.senderName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="space-y-2">
            {message.fileUrl && (
              <img
                src={message.fileUrl}
                alt={message.fileName || 'Image'}
                className="max-w-[200px] max-h-[200px] rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => message.fileUrl && window.open(message.fileUrl, '_blank')}
              />
            )}
            {message.content && (
              <p className="text-sm">{message.content}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <a
            href={message.fileUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              isOwn ? "bg-white/10" : "bg-muted hover:bg-muted/80"
            )}
          >
            <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {message.fileName || 'File'}
              </p>
              {message.fileSize && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(message.fileSize)}
                </p>
              )}
            </div>
          </a>
        );

      case 'system':
        return (
          <p className="text-sm italic">{message.content}</p>
        );

      default:
        return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
    }
  };

  if (message.type === 'system') {
    return (
      <div className={cn("flex justify-center my-4", className)}>
        <div className="bg-muted px-4 py-2 rounded-full">
          <p className="text-xs text-muted-foreground">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3",
        isOwn ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {/* Avatar */}
      {showAvatar ? (
        <Avatar className="h-8 w-8 flex-shrink-0 border border-[#D4AF37]/20">
          <AvatarImage src={message.senderAvatar || undefined} alt={message.senderName} />
          <AvatarFallback className="bg-[#1E3A8A] text-white text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="h-8 w-8 flex-shrink-0" />
      )}

      {/* Message Bubble */}
      <div className={cn("max-w-[70%]", isOwn ? "items-end" : "items-start")}>
        {/* Sender Name */}
        {showAvatar && !isOwn && (
          <p className="text-xs text-muted-foreground mb-1 ml-1">
            {message.senderName}
          </p>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2.5",
            isOwn
              ? "bg-[#1E3A8A] text-white rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          )}
        >
          {renderContent()}
        </div>

        {/* Footer */}
        <div
          className={cn(
            "flex items-center gap-1 mt-1",
            isOwn ? "justify-end mr-1" : "justify-start ml-1"
          )}
        >
          <span className="text-xs text-muted-foreground">
            {formatTime(message.createdAt)}
          </span>
          {message.isEdited && (
            <span className="text-xs text-muted-foreground italic">(edited)</span>
          )}
          {isOwn && (
            <CheckCheck className="h-3 w-3 text-[#D4AF37]" />
          )}
        </div>
      </div>
    </div>
  );
}
