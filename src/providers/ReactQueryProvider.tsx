/**
 * React Query Provider for Lumina Estate
 * Configures QueryClient with default options for caching and error handling
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          // Time until data is considered stale (5 minutes)
          staleTime: 1000 * 60 * 5,
          // Time until inactive data is removed from cache (10 minutes)
          gcTime: 1000 * 60 * 10,
          // Retry failed requests 3 times
          retry: 3,
          // Refetch on window focus
          refetchOnWindowFocus: true,
          // Refetch on network reconnect
          refetchOnReconnect: true,
          // Don't refetch on mount if data exists
          refetchOnMount: false,
        },
        mutations: {
          // Retry failed mutations once
          retry: 1,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
