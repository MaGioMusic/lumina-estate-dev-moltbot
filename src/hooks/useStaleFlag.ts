'use client';

import { useEffect, useMemo, useState } from 'react';

export function useStaleFlag(storageKey: string, ttlMs: number) {
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      if (raw) setUpdatedAt(Number(raw));
    } catch {}
  }, [storageKey]);

  const isStale = useMemo(() => {
    if (!updatedAt) return true;
    return Date.now() - updatedAt > ttlMs;
  }, [updatedAt, ttlMs]);

  const touch = () => {
    const ts = Date.now();
    try {
      window.sessionStorage.setItem(storageKey, String(ts));
    } catch {}
    setUpdatedAt(ts);
  };

  return { isStale, updatedAt, touch };
}


