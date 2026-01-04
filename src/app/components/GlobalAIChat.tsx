'use client';

import React, { Component, Suspense } from 'react';
import dynamic from 'next/dynamic';

const ChatFallback = ({ message }: { message: string }) => (
  <div
    aria-live="polite"
    style={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      zIndex: 9980,
      fontSize: 12,
      color: '#0f172a',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: '8px 10px',
      boxShadow: '0 8px 18px rgba(0,0,0,0.10)',
      maxWidth: 240,
      lineHeight: 1.5,
    }}
  >
    {message}
  </div>
);

class ChatErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[GlobalAIChat] render error', error);
  }

  render() {
    if (this.state.hasError) {
      return <ChatFallback message="AI chat temporarily unavailable. Please refresh." />;
    }
    return this.props.children;
  }
}

// Client-only render to avoid SSR issues
const AIChatComponent = dynamic(
  () => import('@/app/(marketing)/properties/components/AIChatComponent'),
  {
    ssr: false,
    loading: () => <ChatFallback message="Loading AI assistant..." />,
  }
);

export default function GlobalAIChat() {
  return (
    <ChatErrorBoundary>
      <Suspense fallback={<ChatFallback message="Loading AI assistant..." />}>
        <AIChatComponent />
      </Suspense>
    </ChatErrorBoundary>
  );
}

