/**
 * React Query Hooks for Notes
 * Pre-built hooks for fetching and mutating note data
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { notesApi } from '@/lib/api';
import {
  Note,
  NoteFormData,
  NoteQueryParams,
} from '@/types';
import { ApiError, PaginatedResponse, ItemResponse } from '@/types/api';

// Query keys
export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  list: (params: NoteQueryParams) => [...noteKeys.lists(), params] as const,
  details: () => [...noteKeys.all, 'detail'] as const,
  detail: (id: string) => [...noteKeys.details(), id] as const,
  contact: (contactId: string) => [...noteKeys.lists(), 'contact', contactId] as const,
  deal: (dealId: string) => [...noteKeys.lists(), 'deal', dealId] as const,
};

// Types for note with relations
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

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch notes with optional filtering
 */
export function useNotes(
  params?: NoteQueryParams,
  options?: UseQueryOptions<PaginatedResponse<NoteWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: noteKeys.list(params ?? {}),
    queryFn: () => notesApi.getNotes(params),
    ...options,
  });
}

/**
 * Hook to fetch a single note
 */
export function useNote(
  id: string,
  options?: UseQueryOptions<ItemResponse<NoteWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => notesApi.getNote(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook to fetch notes for a specific contact
 */
export function useContactNotes(
  contactId: string,
  params?: Omit<NoteQueryParams, 'contactId'>,
  options?: UseQueryOptions<PaginatedResponse<NoteWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: noteKeys.contact(contactId),
    queryFn: () => notesApi.getContactNotes(contactId, params),
    enabled: !!contactId,
    ...options,
  });
}

/**
 * Hook to fetch notes for a specific deal
 */
export function useDealNotes(
  dealId: string,
  params?: Omit<NoteQueryParams, 'dealId'>,
  options?: UseQueryOptions<PaginatedResponse<NoteWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: noteKeys.deal(dealId),
    queryFn: () => notesApi.getDealNotes(dealId, params),
    enabled: !!dealId,
    ...options,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to create a new note
 */
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}

/**
 * Hook to update a note
 */
export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NoteFormData> }) =>
      notesApi.updateNote(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}

/**
 * Hook to delete a note
 */
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}

/**
 * Hook to create a note for a contact
 */
export function useCreateContactNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, content }: { contactId: string; content: string }) =>
      notesApi.createContactNote(contactId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.contact(variables.contactId) });
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}

/**
 * Hook to create a note for a deal
 */
export function useCreateDealNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dealId, content }: { dealId: string; content: string }) =>
      notesApi.createDealNote(dealId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.deal(variables.dealId) });
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}
