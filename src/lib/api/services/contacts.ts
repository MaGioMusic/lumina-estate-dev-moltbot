/**
 * Contacts API Service
 * All API calls related to contacts
 */

import apiClient from '../client';
import {
  Contact,
  ContactFormData,
  ContactQueryParams,
  ListResponse,
  ItemResponse,
  CreateContactBody,
  UpdateContactBody,
} from '@/types';
import { PaginatedResponse, ApiSuccessResponse } from '@/types/api';

// Extended contact type from API response
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

const BASE_PATH = '/contacts';

/**
 * Get all contacts with optional filtering and pagination
 */
export async function getContacts(
  params?: ContactQueryParams
): Promise<PaginatedResponse<ContactWithRelations>> {
  const response = await apiClient.get<{
    success: true;
    contacts: ContactWithRelations[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(BASE_PATH, { params });

  return {
    success: true,
    data: response.contacts,
    pagination: response.pagination,
  };
}

/**
 * Get a single contact by ID
 */
export async function getContact(id: string): Promise<ItemResponse<ContactWithRelations>> {
  const response = await apiClient.get<{
    success: true;
    contact: ContactWithRelations;
  }>(`${BASE_PATH}/${id}`);

  return {
    success: true,
    data: response.contact,
  };
}

/**
 * Create a new contact
 */
export async function createContact(
  data: CreateContactBody | ContactFormData
): Promise<ItemResponse<ContactWithRelations>> {
  const response = await apiClient.post<{
    success: true;
    contact: ContactWithRelations;
  }>(BASE_PATH, data);

  return {
    success: true,
    data: response.contact,
  };
}

/**
 * Update an existing contact
 */
export async function updateContact(
  id: string,
  data: UpdateContactBody | Partial<ContactFormData>
): Promise<ItemResponse<ContactWithRelations>> {
  const response = await apiClient.patch<{
    success: true;
    contact: ContactWithRelations;
  }>(`${BASE_PATH}/${id}`, data);

  return {
    success: true,
    data: response.contact,
  };
}

/**
 * Delete a contact
 */
export async function deleteContact(id: string): Promise<{ success: true }> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
  return { success: true };
}

/**
 * Search contacts by name, email, or phone
 */
export async function searchContacts(
  query: string,
  params?: Omit<ContactQueryParams, 'search'>
): Promise<PaginatedResponse<ContactWithRelations>> {
  return getContacts({ ...params, search: query });
}

/**
 * Get contacts by status
 */
export async function getContactsByStatus(
  status: 'lead' | 'prospect' | 'client',
  params?: Omit<ContactQueryParams, 'status'>
): Promise<PaginatedResponse<ContactWithRelations>> {
  return getContacts({ ...params, status });
}

// Export all functions
export const contactsApi = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
  getContactsByStatus,
};

export default contactsApi;
