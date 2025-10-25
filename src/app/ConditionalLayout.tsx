'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import StickyCompareBar from '@/components/StickyCompareBar';
import { logger } from '@/lib/logger';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Debug: Log current pathname (dev only)
  logger.log('ConditionalLayout pathname:', pathname);

  const isComparePage = pathname?.startsWith('/compare');

  return (
    <>
      {/* Main header should show on all pages including admin */}
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      {/* Sticky Compare Bar (hide on /compare) */}
      {!isComparePage && <StickyCompareBar />}
      {/* Global AI Chat - visible on all pages */}
      {/* Chat mounted globally in Root layout */}
    </>
  );
} 