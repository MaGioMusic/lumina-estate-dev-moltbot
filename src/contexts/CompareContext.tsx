'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface CompareContextValue {
  ids: number[];
  isSelected: (id: number) => boolean;
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  max: number;
}

const MAX_COMPARE = 4;
const STORAGE_KEY = 'lumina_compare';

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setIds(parsed.filter((n) => typeof n === 'number').slice(0, MAX_COMPARE));
        }
      }
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  }, [ids]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setIds(parsed.filter((n) => typeof n === 'number').slice(0, MAX_COMPARE));
          }
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isSelected = (id: number) => ids.includes(id);

  const add = (id: number) => {
    if (ids.includes(id)) return;
    if (ids.length >= MAX_COMPARE) {
      console.warn('Compare: max 4 items reached');
      return;
    }
    const next = [...ids, id];
    setIds(next);
    console.log('analytics:event', 'compare_add', { id });
  };

  const remove = (id: number) => {
    const next = ids.filter((x) => x !== id);
    setIds(next);
    console.log('analytics:event', 'compare_remove', { id });
  };

  const toggle = (id: number) => {
    if (ids.includes(id)) remove(id); else add(id);
  };

  const clear = () => {
    setIds([]);
    console.log('analytics:event', 'compare_clear');
  };

  const value = useMemo<CompareContextValue>(() => ({ ids, isSelected, add, remove, toggle, clear, max: MAX_COMPARE }), [ids]);

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}


