"use client";

import * as React from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  currentUserId: string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

export function ChatMessageList({
  messages,
  currentUserId,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  className,
}: ChatMessageListProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = React.useState(true);

  // Group messages by date
  const groupedMessages = React.useMemo(() => {
    const groups: { date: string; messages: ChatMessageType[] }[] = [];
    let currentGroup: { date: string; messages: ChatMessageType[] } | null = null;

    messages.forEach((message) => {
      const date = new Date(message.createdAt).toLocaleDateString();

      if (!currentGroup || currentGroup.date !== date) {
        currentGroup = { date, messages: [message] };
        groups.push(currentGroup);
      } else {
        currentGroup.messages.push(message);
      }
    });

    return groups;
  }, [messages]);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (shouldScrollToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldScrollToBottom]);

  // Handle scroll to check if user is at bottom
  const handleScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShouldScrollToBottom(isAtBottom);
    }
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full p-8 text-center", className)}>
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground">No messages yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Start the conversation by sending a message below
        </p>
      </div>
    );
  }

  return (
    <ScrollArea
      className={cn("h-full", className)}
      onScroll={handleScroll}
    >
      <div className="p-4 space-y-4">
        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoadMore}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Load more messages"
              )}
            </Button>
          </div>
        )}

        {/* Message Groups */}
        {groupedMessages.map((group, groupIndex) => (
          <div key={group.date} className="space-y-3">
            {/* Date Separator */}
            <div className="flex items-center justify-center">
              <div className="bg-muted px-3 py-1 rounded-full">
                <span className="text-xs text-muted-foreground font-medium">
                  {formatDate(group.date)}
                </span>
              </div>
            </div>

            {/* Messages */}
            {group.messages.map((message, messageIndex) => {
              const isOwn = message.senderId === currentUserId;
              const prevMessage = messageIndex > 0 ? group.messages[messageIndex - 1] : null;
              const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                />
              );
            })}
          </div>
        ))}

        {/* Bottom spacer for auto-scroll */}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
