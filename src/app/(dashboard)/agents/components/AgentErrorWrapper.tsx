'use client';

import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface AgentErrorWrapperProps {
  children: React.ReactNode;
}

export function AgentErrorWrapper({ children }: AgentErrorWrapperProps) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}

export default AgentErrorWrapper;
