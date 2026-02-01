"use client";

import * as React from "react";
import { Search, Plus, Users, MessageSquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatRoom, ChatRoomType } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatRoomListProps {
  rooms: ChatRoom[];
  selectedRoomId?: string | null;
  isLoading?: boolean;
  onSelect?: (room: ChatRoom) => void;
  onCreate?: () => void;
  className?: string;
}

const typeIcons: Record<ChatRoomType, typeof Users> = {
  direct: MessageSquare,
  group: Users,
  support: MessageSquare,
};

const typeLabels: Record<ChatRoomType, string> = {
  direct: "Direct",
  group: "Group",
  support: "Support",
};

export function ChatRoomList({
  rooms,
  selectedRoomId,
  isLoading = false,
  onSelect,
  onCreate,
  className,
}: ChatRoomListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredRooms = React.useMemo(() => {
    if (!searchQuery.trim()) return rooms;
    const query = searchQuery.toLowerCase();
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(query) ||
        (room.lastMessage?.content.toLowerCase().includes(query))
    );
  }, [rooms, searchQuery]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const totalUnread = React.useMemo(() => {
    return rooms.reduce((sum, room) => sum + room.unreadCount, 0);
  }, [rooms]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-card border-r", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Messages</h2>
            {totalUnread > 0 && (
              <p className="text-xs text-muted-foreground">
                {totalUnread} unread message{totalUnread !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={onCreate}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Room List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => {
              const TypeIcon = typeIcons[room.type];
              const isSelected = selectedRoomId === room.id;

              return (
                <button
                  key={room.id}
                  onClick={() => onSelect?.(room)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left",
                    "hover:bg-muted/50",
                    isSelected && "bg-[#1E3A8A]/10 hover:bg-[#1E3A8A]/15 border-l-2 border-l-[#D4AF37]"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 border border-[#D4AF37]/20">
                      <AvatarImage src={room.avatar || undefined} alt={room.name} />
                      <AvatarFallback className="bg-[#1E3A8A] text-white text-xs">
                        <TypeIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    {room.type === 'group' && (
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-muted rounded-full flex items-center justify-center text-xs border">
                        {room.participantCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={cn(
                        "font-medium text-sm truncate",
                        room.unreadCount > 0 && "text-foreground",
                        room.unreadCount === 0 && "text-muted-foreground"
                      )}>
                        {room.name}
                      </h3>
                      {room.lastMessage && (
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTimestamp(room.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className={cn(
                        "text-sm truncate",
                        room.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        {room.lastMessage ? (
                          <>
                            <span className="text-muted-foreground">
                              {room.lastMessage.senderName}:
                            </span>{" "}
                            {room.lastMessage.content}
                          </>
                        ) : (
                          <span className="italic">No messages yet</span>
                        )}
                      </p>
                      {room.unreadCount > 0 && (
                        <Badge
                          className="h-5 min-w-5 flex items-center justify-center bg-[#D4AF37] text-white text-xs px-1.5"
                        >
                          {room.unreadCount > 99 ? '99+' : room.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {searchQuery
                  ? "Try a different search term"
                  : "Start a new conversation to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={onCreate} variant="outline" size="sm" className="mt-3">
                  <Plus className="h-4 w-4 mr-2" />
                  New Conversation
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
