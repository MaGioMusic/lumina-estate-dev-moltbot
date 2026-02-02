/**
 * React Query Hooks for Tasks
 * Pre-built hooks for fetching and mutating task data
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { tasksApi } from '@/lib/api';
import {
  Task,
  TaskFormData,
  TaskStatus,
  TaskPriority,
  TaskQueryParams,
} from '@/types';
import { ApiError, PaginatedResponse, ItemResponse } from '@/types/api';

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (params: TaskQueryParams) => [...taskKeys.lists(), params] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  overdue: () => [...taskKeys.all, 'overdue'] as const,
  upcoming: (days: number) => [...taskKeys.all, 'upcoming', days] as const,
};

// Types for task with relations
interface TaskWithRelations extends Task {
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  deal?: {
    id: string;
    title: string;
  };
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch tasks with optional filtering
 */
export function useTasks(
  params?: TaskQueryParams,
  options?: UseQueryOptions<PaginatedResponse<TaskWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: taskKeys.list(params ?? {}),
    queryFn: () => tasksApi.getTasks(params),
    ...options,
  });
}

/**
 * Hook to fetch a single task
 */
export function useTask(
  id: string,
  options?: UseQueryOptions<ItemResponse<TaskWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook to fetch overdue tasks
 */
export function useOverdueTasks(
  params?: Omit<TaskQueryParams, 'status'>,
  options?: UseQueryOptions<PaginatedResponse<TaskWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: taskKeys.overdue(),
    queryFn: () => tasksApi.getOverdueTasks(params),
    ...options,
  });
}

/**
 * Hook to fetch upcoming tasks (due in next N days)
 */
export function useUpcomingTasks(
  days: number = 7,
  params?: Omit<TaskQueryParams, 'status'>,
  options?: UseQueryOptions<PaginatedResponse<TaskWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: taskKeys.upcoming(days),
    queryFn: () => tasksApi.getUpcomingTasks(days, params),
    ...options,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.overdue() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming(7) });
    },
  });
}

/**
 * Hook to update a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskFormData> }) =>
      tasksApi.updateTask(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.overdue() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming(7) });
    },
  });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.overdue() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming(7) });
    },
  });
}

/**
 * Hook to mark a task as completed
 */
export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.completeTask,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.overdue() });
    },
  });
}

/**
 * Hook to start a task (mark as in_progress)
 */
export function useStartTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.startTask,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook to get tasks by status
 */
export function useTasksByStatus(
  status: TaskStatus,
  params?: Omit<TaskQueryParams, 'status'>,
  options?: UseQueryOptions<PaginatedResponse<TaskWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: [...taskKeys.lists(), 'status', status, params],
    queryFn: () => tasksApi.getTasksByStatus(status, params),
    ...options,
  });
}

/**
 * Hook to get tasks by priority
 */
export function useTasksByPriority(
  priority: TaskPriority,
  params?: Omit<TaskQueryParams, 'priority'>,
  options?: UseQueryOptions<PaginatedResponse<TaskWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: [...taskKeys.lists(), 'priority', priority, params],
    queryFn: () => tasksApi.getTasksByPriority(priority, params),
    ...options,
  });
}

/**
 * Hook to get tasks assigned to current user
 */
export function useMyTasks(
  params?: TaskQueryParams,
  options?: UseQueryOptions<PaginatedResponse<TaskWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: [...taskKeys.lists(), 'mine', params],
    queryFn: () => tasksApi.getMyTasks(params),
    ...options,
  });
}
