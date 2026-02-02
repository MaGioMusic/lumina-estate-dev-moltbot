/**
 * React Query Hooks for Contacts
 * Pre-built hooks for fetching and mutating contact data
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
  UseQueryOptions,
} from '@tanstack/react-query';
import { contactsApi } from '@/lib/api';
import {
  Contact,
  ContactFormData,
  ContactQueryParams,
} from '@/types';
import { ApiError, PaginatedResponse, ItemResponse } from '@/types/api';

// Query keys
export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (params: ContactQueryParams) => [...contactKeys.lists(), params] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
};

// Types for contact with relations (from API response)
interface ContactWithRelations extends Contact {
  assignedAgent?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  deals?: Array<{
    id: string;
    title: string;
    stage: string;
    value: number;
  }>;
  _count?: {
    tasks: number;
    notes: number;
  };
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch contacts with optional filtering
 */
export function useContacts(
  params?: ContactQueryParams,
  options?: UseQueryOptions<
    PaginatedResponse<ContactWithRelations>,
    ApiError
  >
) {
  return useQuery({
    queryKey: contactKeys.list(params ?? {}),
    queryFn: () => contactsApi.getContacts(params),
    ...options,
  });
}

/**
 * Hook to fetch a single contact
 */
export function useContact(
  id: string,
  options?: UseQueryOptions<ItemResponse<ContactWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn: () => contactsApi.getContact(id),
    enabled: !!id,
    ...options,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to create a new contact
 */
export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactsApi.createContact,
    onSuccess: () => {
      // Invalidate contacts list to refetch
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}

/**
 * Hook to update a contact
 */
export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContactFormData> }) =>
      contactsApi.updateContact(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific contact and lists
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}

/**
 * Hook to delete a contact
 */
export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactsApi.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook to search contacts
 */
export function useContactSearch(
  query: string,
  params?: Omit<ContactQueryParams, 'search'>,
  options?: UseQueryOptions<PaginatedResponse<ContactWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: [...contactKeys.lists(), 'search', query, params],
    queryFn: () => contactsApi.searchContacts(query, params),
    enabled: query.length > 0,
    ...options,
  });
}

/**
 * Hook to get contacts by status
 */
export function useContactsByStatus(
  status: 'lead' | 'prospect' | 'client',
  params?: Omit<ContactQueryParams, 'status'>,
  options?: UseQueryOptions<PaginatedResponse<ContactWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: [...contactKeys.lists(), 'status', status, params],
    queryFn: () => contactsApi.getContactsByStatus(status, params),
    ...options,
  });
}
