"use client";

import * as React from "react";
import { MoreVertical, Phone, Video, Users, ArrowLeft, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatRoom, ChatRoomType } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ChatRoomHeaderProps {
  room: ChatRoom | null;
  isMobile?: boolean;
  onBack?: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  onViewInfo?: () => void;
  onLeaveRoom?: () => void;
  className?: string;
}

const typeIcons: Record<ChatRoomType, typeof Users> = {
  direct: Phone,
  group: Users,
  support: Info,
};

const typeLabels: Record<ChatRoomType, string> = {
  direct: "Direct Message",
  group: "Group Chat",
  support: "Support Chat",
};

export function ChatRoomHeader({
  room,
  isMobile = false,
  onBack,
  onVoiceCall,
  onVideoCall,
  onViewInfo,
  onLeaveRoom,
  className,
}: ChatRoomHeaderProps) {
  const [onlineCount, setOnlineCount] = React.useState(0);

  if (!room) {
    return (
      <div className={cn("h-16 border-b bg-card flex items-center px-4", className)}>
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  const TypeIcon = typeIcons[room.type];

  return (
    <div className={cn("h-16 border-b bg-card flex items-center justify-between px-4", className)}>
      <div className="flex items-center gap-3">
        {/* Back Button (Mobile) */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 -ml-1"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Room Avatar */}
        <div className="relative">
          <Avatar className="h-10 w-10 border border-[#D4AF37]/20">
            <AvatarImage src={room.avatar || undefined} alt={room.name} />
            <AvatarFallback className="bg-[#1E3A8A] text-white">
              <TypeIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          {room.type === 'direct' && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
          )}
        </div>

        {/* Room Info */}
        <div className="min-w-0">
          <h2 className="font-semibold text-foreground truncate">
            {room.name}
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {room.type === 'group' ? (
              <>
                <Users className="h-3 w-3" />
                <span>{room.participantCount} members</span>
              </>
            ) : room.type === 'direct' ? (
              <span className="text-green-500">Online</span>
            ) : (
              <span>{typeLabels[room.type]}</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Voice Call */}
        {room.type === 'direct' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hidden sm:flex"
            onClick={onVoiceCall}
          >
            <Phone className="h-5 w-5" />
          </Button>
        )}

        {/* Video Call */}
        {room.type === 'direct' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hidden sm:flex"
            onClick={onVideoCall}
          >
            <Video className="h-5 w-5" />
          </Button>
        )}

        {/* Room Info / Settings */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <Info className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Chat Info</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Room Info */}
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 border-2 border-[#D4AF37]/20 mb-3">
                  <AvatarImage src={room.avatar || undefined} alt={room.name} />
                  <AvatarFallback className="bg-[#1E3A8A] text-white text-xl">
                    <TypeIcon className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{room.name}</h3>
                <Badge variant="outline" className="mt-1">
                  {typeLabels[room.type]}
                </Badge>
                {room.type === 'group' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {room.participantCount} members
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={onViewInfo}
                >
                  <Info className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                {room.type === 'group' && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={onLeaveRoom}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Leave Group
                  </Button>
                )}
              </div>

              {/* Created At */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Created on {new Date(room.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* More Options Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onViewInfo}>
              <Info className="h-4 w-4 mr-2" />
              Chat Info
            </DropdownMenuItem>
            {room.type === 'direct' && (
              <>
                <DropdownMenuItem onClick={onVoiceCall}>
                  <Phone className="h-4 w-4 mr-2" />
                  Voice Call
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onVideoCall}>
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLeaveRoom}
              className="text-destructive focus:text-destructive"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {room.type === 'group' ? 'Leave Group' : 'Close Chat'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
