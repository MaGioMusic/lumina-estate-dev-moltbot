'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { CompareProvider } from '@/contexts/CompareContext';

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CompareProvider>{children}</CompareProvider>
        </FavoritesProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

