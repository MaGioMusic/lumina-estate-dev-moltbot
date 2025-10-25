'use client';

import dynamic from 'next/dynamic';

// Client-only render to avoid SSR issues
const AIChatComponent = dynamic(
  () => import('@/app/properties/components/AIChatComponent'),
  { ssr: false }
);

export default function GlobalAIChat() {
  return <AIChatComponent />;
}


