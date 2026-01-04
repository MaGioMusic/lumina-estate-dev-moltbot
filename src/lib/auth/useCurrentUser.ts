'use client';

import { useSession } from 'next-auth/react';

export function useCurrentUser() {
  const { data, status, update } = useSession();

  return {
    user: data?.user ?? null,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    update,
  };
}

