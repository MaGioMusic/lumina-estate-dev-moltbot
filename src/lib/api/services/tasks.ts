/**
 * Tasks API Service
 * All API calls related to tasks
 */

import apiClient from '../client';
import {
  Task,
  TaskFormData,
  TaskStatus,
  TaskPriority,
  TaskQueryParams,
  CreateTaskBody,
  UpdateTaskBody,
} from '@/types';
import { PaginatedResponse, ItemResponse } from '@/types/api';

// Extended task type from API response
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

const BASE_PATH = '/tasks';

/**
 * Get all tasks with optional filtering and pagination
 */
export async function getTasks(
  params?: TaskQueryParams
): Promise<PaginatedResponse<TaskWithRelations>> {
  const response = await apiClient.get<{
    success: true;
    tasks: TaskWithRelations[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(BASE_PATH, { params });

  return {
    success: true,
    data: response.tasks,
    pagination: response.pagination,
  };
}

/**
 * Get a single task by ID
 */
export async function getTask(id: string): Promise<ItemResponse<TaskWithRelations>> {
  const response = await apiClient.get<{
    success: true;
    task: TaskWithRelations;
  }>(`${BASE_PATH}/${id}`);

  return {
    success: true,
    data: response.task,
  };
}

/**
 * Create a new task
 */
export async function createTask(
  data: CreateTaskBody | TaskFormData
): Promise<ItemResponse<TaskWithRelations>> {
  const response = await apiClient.post<{
    success: true;
    task: TaskWithRelations;
  }>(BASE_PATH, data);

  return {
    success: true,
    data: response.task,
  };
}

/**
 * Update an existing task
 */
export async function updateTask(
  id: string,
  data: UpdateTaskBody | Partial<TaskFormData>
): Promise<ItemResponse<TaskWithRelations>> {
  const response = await apiClient.patch<{
    success: true;
    task: TaskWithRelations;
  }>(`${BASE_PATH}/${id}`, data);

  return {
    success: true,
    data: response.task,
  };
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<{ success: true }> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
  return { success: true };
}

/**
 * Mark a task as completed
 */
export async function completeTask(id: string): Promise<ItemResponse<TaskWithRelations>> {
  return updateTask(id, { status: 'completed' });
}

/**
 * Mark a task as in progress
 */
export async function startTask(id: string): Promise<ItemResponse<TaskWithRelations>> {
  return updateTask(id, { status: 'in_progress' });
}

/**
 * Reopen a completed task
 */
export async function reopenTask(id: string): Promise<ItemResponse<TaskWithRelations>> {
  return updateTask(id, { status: 'pending' });
}

/**
 * Get tasks by status
 */
export async function getTasksByStatus(
  status: TaskStatus,
  params?: Omit<TaskQueryParams, 'status'>
): Promise<PaginatedResponse<TaskWithRelations>> {
  return getTasks({ ...params, status });
}

/**
 * Get tasks by priority
 */
export async function getTasksByPriority(
  priority: TaskPriority,
  params?: Omit<TaskQueryParams, 'priority'>
): Promise<PaginatedResponse<TaskWithRelations>> {
  return getTasks({ ...params, priority });
}

/**
 * Get tasks assigned to the current user
 */
export async function getMyTasks(
  params?: TaskQueryParams
): Promise<PaginatedResponse<TaskWithRelations>> {
  return getTasks({ ...params, assignedToMe: true });
}

/**
 * Get tasks for a specific deal
 */
export async function getDealTasks(
  dealId: string,
  params?: TaskQueryParams
): Promise<PaginatedResponse<TaskWithRelations>> {
  return getTasks({ ...params });
}

/**
 * Get tasks for a specific contact
 */
export async function getContactTasks(
  contactId: string,
  params?: TaskQueryParams
): Promise<PaginatedResponse<TaskWithRelations>> {
  return getTasks({ ...params });
}

/**
 * Get overdue tasks
 */
export async function getOverdueTasks(
  params?: Omit<TaskQueryParams, 'status'>
): Promise<PaginatedResponse<TaskWithRelations>> {
  // Filter tasks that are pending or in_progress with dueDate in the past
  const response = await getTasks({
    ...params,
    status: 'pending',
  });

  // Filter overdue on client side since API might not support this directly
  const now = new Date().toISOString();
  const overdueTasks = response.data.filter(
    (task) => task.dueDate && task.dueDate < now
  );

  return {
    ...response,
    data: overdueTasks,
  };
}

/**
 * Get upcoming tasks (due in the next N days)
 */
export async function getUpcomingTasks(
  days: number = 7,
  params?: Omit<TaskQueryParams, 'status'>
): Promise<PaginatedResponse<TaskWithRelations>> {
  const response = await getTasks({
    ...params,
    status: 'pending',
  });

  // Filter upcoming on client side
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  const upcomingTasks = response.data.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= now && dueDate <= futureDate;
  });

  return {
    ...response,
    data: upcomingTasks,
  };
}

// Export all functions
export const tasksApi = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  startTask,
  reopenTask,
  getTasksByStatus,
  getTasksByPriority,
  getMyTasks,
  getDealTasks,
  getContactTasks,
  getOverdueTasks,
  getUpcomingTasks,
};

export default tasksApi;
