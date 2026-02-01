"use client";

import * as React from "react";
import { Clock, Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Note } from "@/types/crm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  className?: string;
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
  className,
}: NoteCardProps) {
  const initials = note.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffDays === 1) {
      return `Yesterday at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffDays < 7) {
      return d.toLocaleDateString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isEdited = note.isEdited || note.updatedAt !== note.createdAt;

  return (
    <Card
      className={cn(
        "group transition-all duration-200 hover:shadow-sm hover:border-[#D4AF37]/20",
        className
      )}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-[#D4AF37]/20">
              <AvatarImage src={note.authorAvatar || undefined} alt={note.authorName} />
              <AvatarFallback className="bg-[#1E3A8A] text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm text-foreground">
                {note.authorName}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatDate(note.createdAt)}</span>
                {isEdited && <span className="italic">(edited)</span>}
              </div>
            </div>
          </div>

          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(note)}>
                    <Edit2 className="h-3.5 w-3.5 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(note)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <p className="text-sm text-foreground whitespace-pre-wrap">
          {note.content}
        </p>
      </CardContent>
    </Card>
  );
}
