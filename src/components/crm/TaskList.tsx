"use client";

import * as React from "react";
import { Plus, Loader2, CheckCircle2, Circle, Clock, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskStatus, TaskPriority } from "@/types/crm";
import { TaskItem } from "./TaskItem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onAdd?: () => void;
  onToggle?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  className?: string;
}

export function TaskList({
  tasks,
  isLoading = false,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
  className,
}: TaskListProps) {
  const [activeTab, setActiveTab] = React.useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = React.useMemo(() => {
    switch (activeTab) {
      case 'pending':
        return tasks.filter(t => t.status !== 'completed');
      case 'completed':
        return tasks.filter(t => t.status === 'completed');
      default:
        return tasks;
    }
  }, [tasks, activeTab]);

  const taskStats = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const overdue = tasks.filter(t => 
      t.status !== 'completed' && 
      t.dueDate && 
      new Date(t.dueDate) < new Date()
    ).length;
    return { total, completed, pending, overdue };
  }, [tasks]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tasks</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {taskStats.completed} of {taskStats.total} completed
            {taskStats.overdue > 0 && (
              <span className="text-red-500 ml-2">
                ({taskStats.overdue} overdue)
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={onAdd}
          className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Progress */}
      {taskStats.total > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {Math.round((taskStats.completed / taskStats.total) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1E3A8A] to-[#D4AF37] transition-all duration-500"
              style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="gap-2">
            <ListTodo className="h-4 w-4" />
            <span className="hidden sm:inline">All</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {taskStats.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Pending</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {taskStats.pending}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">Done</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {taskStats.completed}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredTasks.length > 0 ? (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                {activeTab === 'completed' ? (
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <Circle className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-lg font-medium text-foreground">
                {activeTab === 'completed'
                  ? "No completed tasks"
                  : activeTab === 'pending'
                  ? "No pending tasks"
                  : "No tasks yet"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {activeTab === 'completed'
                  ? "Complete some tasks to see them here"
                  : "Add a new task to get started"}
              </p>
              {activeTab !== 'completed' && (
                <Button onClick={onAdd} variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
