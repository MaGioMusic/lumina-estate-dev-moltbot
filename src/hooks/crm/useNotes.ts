"use client";

import { useState, useEffect, useCallback } from 'react';
import { Note, NoteFormData } from '@/types/crm';
import { getClientCsrfToken, fetchCsrfToken, CSRF_HEADER_NAME } from '@/lib/security/csrf';

interface UseNotesOptions {
  contactId?: string;
  dealId?: string;
  page?: number;
  limit?: number;
}

interface NotesResponse {
  success: boolean;
  notes: Note[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useNotes(options: UseNotesOptions = {}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<NotesResponse['pagination'] | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.contactId) params.set('contactId', options.contactId);
      if (options.dealId) params.set('dealId', options.dealId);
      if (options.page) params.set('page', options.page.toString());
      if (options.limit) params.set('limit', options.limit.toString());

      const response = await fetch(`/api/notes?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch notes');
      }

      const data: NotesResponse = await response.json();
      setNotes(data.notes || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [options.contactId, options.dealId, options.page, options.limit]);

  const createNote = useCallback(async (formData: NoteFormData & { contactId?: string; dealId?: string }): Promise<Note | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Get CSRF token for mutation
      let csrfToken = getClientCsrfToken();
      if (!csrfToken) {
        csrfToken = await fetchCsrfToken();
      }

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          [CSRF_HEADER_NAME]: csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create note');
      }

      const data = await response.json();
      await fetchNotes(); // Refresh the list
      return data.note;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchNotes]);

  const updateNote = useCallback(async (id: string, formData: Partial<NoteFormData>): Promise<Note | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Get CSRF token for mutation
      let csrfToken = getClientCsrfToken();
      if (!csrfToken) {
        csrfToken = await fetchCsrfToken();
      }

      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          [CSRF_HEADER_NAME]: csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update note');
      }

      const data = await response.json();
      await fetchNotes(); // Refresh the list
      return data.note;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchNotes]);

  const deleteNote = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Get CSRF token for mutation
      let csrfToken = getClientCsrfToken();
      if (!csrfToken) {
        csrfToken = await fetchCsrfToken();
      }

      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 
          [CSRF_HEADER_NAME]: csrfToken || '',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete note');
      }

      await fetchNotes(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchNotes]);

  const refresh = useCallback(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    isLoading,
    error,
    pagination,
    createNote,
    updateNote,
    deleteNote,
    refresh,
  };
}
