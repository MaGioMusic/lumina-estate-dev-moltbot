"use client";

import { useState, useEffect, useCallback } from 'react';
import { Deal, DealFormData, DealStage } from '@/types/crm';

interface UseDealsOptions {
  stage?: string;
  contactId?: string;
  page?: number;
  limit?: number;
}

interface DealsResponse {
  success: boolean;
  deals: Deal[];
  pipeline?: Record<DealStage, Deal[]>;
  stats?: {
    total: number;
    totalValue: number;
    wonValue: number;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useDeals(options: UseDealsOptions = {}) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pipeline, setPipeline] = useState<Record<DealStage, Deal[]> | null>(null);
  const [stats, setStats] = useState<DealsResponse['stats'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<DealsResponse['pagination'] | null>(null);

  const fetchDeals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.stage) params.set('stage', options.stage);
      if (options.contactId) params.set('contactId', options.contactId);
      if (options.page) params.set('page', options.page.toString());
      if (options.limit) params.set('limit', options.limit.toString());

      const response = await fetch(`/api/deals?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch deals');
      }

      const data: DealsResponse = await response.json();
      setDeals(data.deals || []);
      setPipeline(data.pipeline || null);
      setStats(data.stats || null);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [options.stage, options.contactId, options.page, options.limit]);

  const createDeal = useCallback(async (formData: DealFormData): Promise<Deal | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create deal');
      }

      const data = await response.json();
      await fetchDeals(); // Refresh the list
      return data.deal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDeals]);

  const updateDeal = useCallback(async (id: string, formData: Partial<DealFormData>): Promise<Deal | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/deals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update deal');
      }

      const data = await response.json();
      await fetchDeals(); // Refresh the list
      return data.deal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDeals]);

  const deleteDeal = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/deals/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete deal');
      }

      await fetchDeals(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDeals]);

  const updateDealStage = useCallback(async (id: string, newStage: DealStage): Promise<Deal | null> => {
    return updateDeal(id, { stage: newStage });
  }, [updateDeal]);

  const refresh = useCallback(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  return {
    deals,
    pipeline,
    stats,
    isLoading,
    error,
    pagination,
    createDeal,
    updateDeal,
    deleteDeal,
    updateDealStage,
    refresh,
  };
}
