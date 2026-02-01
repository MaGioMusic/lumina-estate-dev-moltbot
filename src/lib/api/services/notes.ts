/**
 * Notes API Service
 * All API calls related to notes
 */

import apiClient from '../client';
import {
  Note,
  NoteFormData,
  NoteQueryParams,
  CreateNoteBody,
  UpdateNoteBody,
} from '@/types';
import { PaginatedResponse, ItemResponse } from '@/types/api';

// Extended note type from API response
interface NoteWithRelations extends Note {
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  deal?: {
    id: string;
    title: string;
  };
}

const BASE_PATH = '/notes';

/**
 * Get all notes with optional filtering and pagination
 */
export async function getNotes(
  params?: NoteQueryParams
): Promise<PaginatedResponse<NoteWithRelations>> {
  const response = await apiClient.get<{
    success: true;
    notes: NoteWithRelations[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(BASE_PATH, { params });

  return {
    success: true,
    data: response.notes,
    pagination: response.pagination,
  };
}

/**
 * Get a single note by ID
 */
export async function getNote(id: string): Promise<ItemResponse<NoteWithRelations>> {
  const response = await apiClient.get<{
    success: true;
    note: NoteWithRelations;
  }>(`${BASE_PATH}/${id}`);

  return {
    success: true,
    data: response.note,
  };
}

/**
 * Create a new note
 */
export async function createNote(
  data: CreateNoteBody | NoteFormData
): Promise<ItemResponse<NoteWithRelations>> {
  const response = await apiClient.post<{
    success: true;
    note: NoteWithRelations;
  }>(BASE_PATH, data);

  return {
    success: true,
    data: response.note,
  };
}

/**
 * Update an existing note
 */
export async function updateNote(
  id: string,
  data: UpdateNoteBody | Partial<NoteFormData>
): Promise<ItemResponse<NoteWithRelations>> {
  const response = await apiClient.patch<{
    success: true;
    note: NoteWithRelations;
  }>(`${BASE_PATH}/${id}`, data);

  return {
    success: true,
    data: response.note,
  };
}

/**
 * Delete a note
 */
export async function deleteNote(id: string): Promise<{ success: true }> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
  return { success: true };
}

/**
 * Get notes for a specific contact
 */
export async function getContactNotes(
  contactId: string,
  params?: Omit<NoteQueryParams, 'contactId'>
): Promise<PaginatedResponse<NoteWithRelations>> {
  return getNotes({ ...params, contactId });
}

/**
 * Get notes for a specific deal
 */
export async function getDealNotes(
  dealId: string,
  params?: Omit<NoteQueryParams, 'dealId'>
): Promise<PaginatedResponse<NoteWithRelations>> {
  return getNotes({ ...params, dealId });
}

/**
 * Create a note for a contact (convenience method)
 */
export async function createContactNote(
  contactId: string,
  content: string
): Promise<ItemResponse<NoteWithRelations>> {
  return createNote({ contactId, content });
}

/**
 * Create a note for a deal (convenience method)
 */
export async function createDealNote(
  dealId: string,
  content: string
): Promise<ItemResponse<NoteWithRelations>> {
  return createNote({ dealId, content });
}

// Export all functions
export const notesApi = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getContactNotes,
  getDealNotes,
  createContactNote,
  createDealNote,
};

export default notesApi;
