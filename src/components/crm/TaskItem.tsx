"use client";

import * as React from "react";
import { Calendar, Clock, MoreHorizontal, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskStatus, TaskPriority } from "@/types/crm";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskItemProps {
  task: Task;
  onToggle?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  className?: string;
}

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-green-500/10 text-green-600 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  high: "bg-red-500/10 text-red-600 border-red-500/20",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  className,
}: TaskItemProps) {
  const isCompleted = task.status === 'completed';
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  const formatDueDate = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `In ${diffDays} days`;
    return d.toLocaleDateString();
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
        "hover:bg-muted/50 hover:border-[#D4AF37]/30",
        isCompleted && "opacity-60 bg-muted/30",
        isOverdue && "border-red-500/30 bg-red-500/5",
        className
      )}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={() => onToggle?.(task)}
        className="mt-0.5"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p
              className={cn(
                "font-medium text-sm text-foreground",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(task)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(task)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge
            variant="outline"
            className={cn("text-xs", priorityColors[task.priority])}
          >
            {priorityLabels[task.priority]}
          </Badge>

          {task.dueDate && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {isOverdue ? (
                <AlertCircle className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              <span>{formatDueDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
