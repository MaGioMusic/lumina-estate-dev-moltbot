/**
 * React Query Hooks for Deals
 * Pre-built hooks for fetching and mutating deal data
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { dealsApi } from '@/lib/api';
import {
  Deal,
  DealFormData,
  DealStage,
  DealQueryParams,
} from '@/types';
import { ApiError, ItemResponse } from '@/types/api';

// Query keys
export const dealKeys = {
  all: ['deals'] as const,
  lists: () => [...dealKeys.all, 'list'] as const,
  list: (params: DealQueryParams) => [...dealKeys.lists(), params] as const,
  details: () => [...dealKeys.all, 'detail'] as const,
  detail: (id: string) => [...dealKeys.details(), id] as const,
  pipeline: () => [...dealKeys.all, 'pipeline'] as const,
  stats: () => [...dealKeys.all, 'stats'] as const,
};

// Types for deal with relations
interface DealWithRelations extends Deal {
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  agent?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  _count?: {
    tasks: number;
    notes: number;
  };
}

interface PipelineData {
  lead: DealWithRelations[];
  qualified: DealWithRelations[];
  proposal: DealWithRelations[];
  negotiation: DealWithRelations[];
  closed_won: DealWithRelations[];
  closed_lost: DealWithRelations[];
}

interface DealStats {
  total: number;
  totalValue: number;
  wonValue: number;
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch deals with pipeline and stats
 */
export function useDeals(
  params?: DealQueryParams,
  options?: UseQueryOptions<
    {
      success: true;
      data: DealWithRelations[];
      pipeline: PipelineData;
      stats: DealStats;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    },
    ApiError
  >
) {
  return useQuery({
    queryKey: dealKeys.list(params ?? {}),
    queryFn: () => dealsApi.getDeals(params),
    ...options,
  });
}

/**
 * Hook to fetch a single deal
 */
export function useDeal(
  id: string,
  options?: UseQueryOptions<ItemResponse<DealWithRelations>, ApiError>
) {
  return useQuery({
    queryKey: dealKeys.detail(id),
    queryFn: () => dealsApi.getDeal(id),
    enabled: !!id,
    ...options,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to create a new deal
 */
export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dealsApi.createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.pipeline() });
      queryClient.invalidateQueries({ queryKey: dealKeys.stats() });
    },
  });
}

/**
 * Hook to update a deal
 */
export function useUpdateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DealFormData> }) =>
      dealsApi.updateDeal(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.pipeline() });
      queryClient.invalidateQueries({ queryKey: dealKeys.stats() });
    },
  });
}

/**
 * Hook to delete a deal
 */
export function useDeleteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dealsApi.deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.pipeline() });
      queryClient.invalidateQueries({ queryKey: dealKeys.stats() });
    },
  });
}

/**
 * Hook to update deal stage (for drag-and-drop pipeline)
 */
export function useUpdateDealStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: DealStage }) =>
      dealsApi.updateDealStage(id, stage),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.pipeline() });
    },
  });
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook to get deals by stage
 */
export function useDealsByStage(
  stage: DealStage,
  params?: Omit<DealQueryParams, 'stage'>,
  options?: UseQueryOptions<
    {
      success: true;
      data: DealWithRelations[];
      pipeline: PipelineData;
      stats: DealStats;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    },
    ApiError
  >
) {
  return useQuery({
    queryKey: [...dealKeys.lists(), 'stage', stage, params],
    queryFn: () => dealsApi.getDealsByStage(stage, params),
    ...options,
  });
}

/**
 * Hook to get deals for a specific contact
 */
export function useContactDeals(
  contactId: string,
  params?: Omit<DealQueryParams, 'contactId'>,
  options?: UseQueryOptions<
    {
      success: true;
      data: DealWithRelations[];
      pipeline: PipelineData;
      stats: DealStats;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    },
    ApiError
  >
) {
  return useQuery({
    queryKey: [...dealKeys.lists(), 'contact', contactId, params],
    queryFn: () => dealsApi.getContactDeals(contactId, params),
    enabled: !!contactId,
    ...options,
  });
}
