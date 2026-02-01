/**
 * Deals API Service
 * All API calls related to deals
 */

import apiClient from '../client';
import {
  Deal,
  DealFormData,
  DealStage,
  DealQueryParams,
  CreateDealBody,
  UpdateDealBody,
} from '@/types';
import { PaginatedResponse, ItemResponse } from '@/types/api';

// Extended deal type from API response
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

// Pipeline response structure
interface PipelineData {
  lead: DealWithRelations[];
  qualified: DealWithRelations[];
  proposal: DealWithRelations[];
  negotiation: DealWithRelations[];
  closed_won: DealWithRelations[];
  closed_lost: DealWithRelations[];
}

// Stats response structure
interface DealStats {
  total: number;
  totalValue: number;
  wonValue: number;
}

// Full deals response including pipeline and stats
interface DealsListResponse {
  success: true;
  deals: DealWithRelations[];
  pipeline: PipelineData;
  stats: DealStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const BASE_PATH = '/deals';

/**
 * Get all deals with optional filtering and pagination
 * Returns deals, pipeline grouping, and stats
 */
export async function getDeals(
  params?: DealQueryParams
): Promise<{
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
}> {
  const response = await apiClient.get<DealsListResponse>(BASE_PATH, { params });

  return {
    success: true,
    data: response.deals,
    pipeline: response.pipeline,
    stats: response.stats,
    pagination: response.pagination,
  };
}

/**
 * Get a single deal by ID
 */
export async function getDeal(id: string): Promise<ItemResponse<DealWithRelations>> {
  const response = await apiClient.get<{
    success: true;
    deal: DealWithRelations;
  }>(`${BASE_PATH}/${id}`);

  return {
    success: true,
    data: response.deal,
  };
}

/**
 * Create a new deal
 */
export async function createDeal(
  data: CreateDealBody | DealFormData
): Promise<ItemResponse<DealWithRelations>> {
  const response = await apiClient.post<{
    success: true;
    deal: DealWithRelations;
  }>(BASE_PATH, data);

  return {
    success: true,
    data: response.deal,
  };
}

/**
 * Update an existing deal
 */
export async function updateDeal(
  id: string,
  data: UpdateDealBody | Partial<DealFormData>
): Promise<ItemResponse<DealWithRelations>> {
  const response = await apiClient.patch<{
    success: true;
    deal: DealWithRelations;
  }>(`${BASE_PATH}/${id}`, data);

  return {
    success: true,
    data: response.deal,
  };
}

/**
 * Delete a deal
 */
export async function deleteDeal(id: string): Promise<{ success: true }> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
  return { success: true };
}

/**
 * Update deal stage (convenience method)
 */
export async function updateDealStage(
  id: string,
  stage: DealStage
): Promise<ItemResponse<DealWithRelations>> {
  return updateDeal(id, { stage });
}

/**
 * Get deals by stage
 */
export async function getDealsByStage(
  stage: DealStage,
  params?: Omit<DealQueryParams, 'stage'>
): Promise<{
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
}> {
  return getDeals({ ...params, stage });
}

/**
 * Get deals for a specific contact
 */
export async function getContactDeals(
  contactId: string,
  params?: Omit<DealQueryParams, 'contactId'>
): Promise<{
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
}> {
  return getDeals({ ...params, contactId });
}

// Export all functions
export const dealsApi = {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  updateDealStage,
  getDealsByStage,
  getContactDeals,
};

export default dealsApi;
