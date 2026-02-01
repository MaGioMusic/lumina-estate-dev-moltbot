"use client";

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFormData, TaskStatus } from '@/types/crm';

interface UseTasksOptions {
  status?: string;
  priority?: string;
  assignedToMe?: boolean;
  page?: number;
  limit?: number;
}

interface TasksResponse {
  success: boolean;
  tasks: Task[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<TasksResponse['pagination'] | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.status) params.set('status', options.status);
      if (options.priority) params.set('priority', options.priority);
      if (options.assignedToMe) params.set('assignedToMe', 'true');
      if (options.page) params.set('page', options.page.toString());
      if (options.limit) params.set('limit', options.limit.toString());

      const response = await fetch(`/api/tasks?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch tasks');
      }

      const data: TasksResponse = await response.json();
      setTasks(data.tasks || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [options.status, options.priority, options.assignedToMe, options.page, options.limit]);

  const createTask = useCallback(async (formData: TaskFormData): Promise<Task | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      const data = await response.json();
      await fetchTasks(); // Refresh the list
      return data.task;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (id: string, formData: Partial<TaskFormData>): Promise<Task | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      const data = await response.json();
      await fetchTasks(); // Refresh the list
      return data.task;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }

      await fetchTasks(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTasks]);

  const toggleTaskStatus = useCallback(async (task: Task): Promise<Task | null> => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    return updateTask(task.id, { status: newStatus });
  }, [updateTask]);

  const refresh = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    pagination,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refresh,
  };
}
