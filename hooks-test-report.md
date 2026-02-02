# React Hooks Comprehensive Test Report

## Executive Summary

**Date:** 2025-02-01  
**Total Hooks Analyzed:** 18  
**Issues Found:** 14  
**Severity:** 5 Critical, 6 High, 3 Medium

---

## 🔴 CRITICAL ISSUES

### 1. **Missing `enabled` Option in React Query Hooks**
**Files:** `src/hooks/useContacts.ts`, `src/hooks/useDeals.ts`, `src/hooks/useTasks.ts`, `src/hooks/useNotes.ts`, `src/hooks/useChat.ts`

**Issue:** All React Query hooks pass `enabled: !!id` for single item queries but the list queries don't have conditional fetching based on auth state. This can cause 401 errors on unauthenticated routes.

**Fix:**
```typescript
export function useContacts(
  params?: ContactQueryParams,
  options?: UseQueryOptions<...>
) {
  const { isAuthenticated } = useCurrentUser(); // Add this
  return useQuery({
    queryKey: contactKeys.list(params ?? {}),
    queryFn: () => contactsApi.getContacts(params),
    enabled: isAuthenticated, // Add this
    ...options,
  });
}
```

---

### 2. **Stale Closure in `useWebSocket`**
**File:** `src/hooks/chat/useWebSocket.ts` (Line 168)

**Issue:** The `sendTyping` callback references `lastTypingRef.current` but doesn't include it in the dependency array properly. This can cause stale closure issues where old values are referenced.

**Fix:**
```typescript
const sendTyping = useCallback((isTyping: boolean) => {
  if (!roomId) return;
  
  // Use functional update to avoid stale closure
  const now = Date.now();
  lastTypingRef.current = now;
  
  // Rate limit typing events (max 1 per second)
  if (now - lastTypingRef.current < 1000) return;
  
  // ... rest of code
}, [roomId, isConnected]); // Remove lastTypingRef from deps
```

---

### 3. **Memory Leak in `useChatMessages` Polling**
**File:** `src/hooks/chat/useChatMessages.ts` (Lines 263-293)

**Issue:** When `pollInterval` changes rapidly, multiple intervals can be created before cleanup runs. Also, `fetchMessages` creates a new AbortController on every call but cleanup only aborts the current one.

**Current problematic code:**
```typescript
useEffect(() => {
  if (pollInterval > 0 && roomId) {
    if (pollRef.current) {
      clearInterval(pollRef.current);
    }
    
    pollRef.current = setInterval(() => {
      const pollController = new AbortController();
      fetchMessages(1, pollController.signal);
    }, pollInterval);
    
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }
}, [pollInterval, roomId, fetchMessages]);
```

**Fix:**
```typescript
useEffect(() => {
  if (!pollInterval || pollInterval <= 0 || !roomId) return;
  
  // Use ref to track active controllers for cleanup
  const controllers: AbortController[] = [];
  
  const intervalId = setInterval(() => {
    const controller = new AbortController();
    controllers.push(controller);
    fetchMessages(1, controller.signal);
  }, pollInterval);
  
  return () => {
    clearInterval(intervalId);
    controllers.forEach(c => c.abort());
  };
}, [pollInterval, roomId, fetchMessages]);
```

---

### 4. **Race Condition in `useGeminiLiveSession`**
**File:** `src/hooks/ai/useGeminiLiveSession.ts` (Lines 400-450)

**Issue:** Multiple rapid start/stop calls can create race conditions where WebSocket connections aren't properly cleaned up.

**Current code:**
```typescript
const startVoice = useCallback(async () => {
  if (!enabled) return;
  if (wsRef.current) {
    if (sessionTypeRef.current === 'voice') return;
    await closeAll();
  }
  // ... creates new connection
}, [...]);
```

**Fix:** Add a connecting state to prevent concurrent connection attempts:
```typescript
const [isConnecting, setIsConnecting] = useState(false);

const startVoice = useCallback(async () => {
  if (!enabled || isConnecting) return;
  if (wsRef.current && sessionTypeRef.current === 'voice') return;
  
  setIsConnecting(true);
  try {
    if (wsRef.current) await closeAll();
    // ... create connection
  } finally {
    setIsConnecting(false);
  }
}, [enabled, isConnecting, ...]);
```

---

### 5. **Missing Error State Reset in Custom CRM Hooks**
**Files:** `src/hooks/crm/useContacts.ts`, `src/hooks/crm/useDeals.ts`, `src/hooks/crm/useTasks.ts`, `src/hooks/crm/useNotes.ts`

**Issue:** Error state persists across different operations. If `createContact` fails, the error remains even when successfully calling `updateContact`.

**Fix:** Reset error at the start of each operation:
```typescript
const createContact = useCallback(async (formData: ContactFormData): Promise<Contact | null> => {
  try {
    setIsLoading(true);
    setError(null); // Reset error first
    // ... rest of code
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
    return null;
  } finally {
    setIsLoading(false);
  }
}, [fetchContacts]);
```

---

## 🟠 HIGH SEVERITY ISSUES

### 6. **Inefficient Dependency Arrays**
**Files:** Multiple CRM hooks

**Issue:** The custom CRM hooks (`useContacts`, `useDeals`, `useTasks`, `useNotes`) include entire `options` objects in dependency arrays, causing unnecessary re-renders.

**Current code:**
```typescript
const fetchContacts = useCallback(async (signal?: AbortSignal) => {
  // ... uses options.status, options.search, etc.
}, [options.status, options.search, options.page, options.limit]);
```

**Fix:** Destructure options at hook entry:
```typescript
export function useContacts(options: UseContactsOptions = {}) {
  const { status, search, page, limit } = options; // Destructure
  
  const fetchContacts = useCallback(async (signal?: AbortSignal) => {
    // Now use the destructured values
    if (status) params.set('status', status);
    // ...
  }, [status, search, page, limit]); // Cleaner deps
```

---

### 7. **Potential Infinite Loop in `useRealtimeVoiceSession`**
**File:** `src/hooks/ai/useRealtimeVoiceSession.ts` (Lines 240-260)

**Issue:** The `requestModelResponse` callback modifies `inFlightResponseRef` which is used by the message handler, but the callback has a complex dependency array that could cause issues.

**Current problematic pattern:**
```typescript
const requestModelResponse = useCallback(() => {
  // ...
  inFlightResponseRef.current = true;
  window.setTimeout(() => {
    if (inFlightResponseRef.current) {
      inFlightResponseRef.current = false;
    }
  }, 15000);
}, []); // Empty deps but uses refs
```

**Fix:** Add proper cleanup and don't rely on refs in dependency arrays:
```typescript
const requestModelResponse = useCallback(() => {
  const dc = oaiDcRef.current;
  if (!dc || dc.readyState !== 'open') return;
  if (inFlightResponseRef.current) return;
  
  inFlightResponseRef.current = true;
  
  const timeoutId = window.setTimeout(() => {
    inFlightResponseRef.current = false;
  }, 15000);
  
  // Store timeout ID for cleanup
  return () => clearTimeout(timeoutId);
}, []);
```

---

### 8. **Missing `useMemo` for Computed Values**
**Files:** `src/hooks/chat/useChatMessages.ts`, `src/hooks/chat/useChatRooms.ts`

**Issue:** Messages and rooms transformation happens on every render without memoization.

**Fix:**
```typescript
const transformedMessages = useMemo(() => {
  return messages.map((msg) => ({
    id: msg.id,
    // ... transformation
  }));
}, [messages]);
```

---

### 9. **BroadcastChannel Not Cleaned Up Properly**
**File:** `src/hooks/ai/useGeminiLiveSession.ts` (Lines 350-380)

**Issue:** BroadcastChannel is created but there's a race condition where it might not be closed if the component unmounts during initialization.

**Fix:** Move BroadcastChannel creation to a separate effect with proper cleanup:
```typescript
useEffect(() => {
  if (!cid) return;
  
  const ch = new BroadcastChannel(`lumina-ai-${cid}`);
  bcRef.current = ch;
  
  ch.onmessage = (ev) => {
    // ... handle message
  };
  
  return () => {
    ch.close();
    bcRef.current = null;
  };
}, [cid]);
```

---

### 10. **Unsafe Window Access in `usePropertySearch`**
**File:** `src/hooks/ai/usePropertySearch.ts` (Lines 45-55)

**Issue:** Direct access to `window` without checking for SSR environment.

**Current code:**
```typescript
const getCid = useCallback((): string => {
  const sp = new URLSearchParams(window.location.search); // ❌ Unsafe
  return sp.get('cid') || window.sessionStorage.getItem('lumina_cid') || ''; // ❌ Unsafe
}, []);
```

**Fix:**
```typescript
const getCid = useCallback((): string => {
  if (typeof window === 'undefined') return '';
  const sp = new URLSearchParams(window.location.search);
  return sp.get('cid') || window.sessionStorage.getItem('lumina_cid') || '';
}, []);
```

---

### 11. **Zombie Component State Updates**
**File:** `src/hooks/crm/useContacts.ts` (Lines 65-70)

**Issue:** State updates can occur after component unmounts during async operations.

**Current code:**
```typescript
const fetchContacts = useCallback(async (signal?: AbortSignal) => {
  try {
    const response = await fetch(...);
    const data = await response.json();
    setContacts(data.contacts); // ❌ Can set state after unmount
  } catch (err) {
    setError(err.message); // ❌ Can set state after unmount
  }
}, [...]);
```

**Fix:** Use the `isMountedRef` pattern consistently (already present in chat hooks):
```typescript
const isMountedRef = useRef(true);

useEffect(() => {
  isMountedRef.current = true;
  return () => { isMountedRef.current = false; };
}, []);

const fetchContacts = useCallback(async (signal?: AbortSignal) => {
  try {
    const response = await fetch(...);
    if (!isMountedRef.current) return; // Guard
    const data = await response.json();
    if (isMountedRef.current) setContacts(data.contacts);
  } catch (err) {
    if (isMountedRef.current) setError(err.message);
  }
}, [...]);
```

---

## 🟡 MEDIUM SEVERITY ISSUES

### 12. **Duplicate Mobile Hook**
**Files:** `src/hooks/use-mobile.tsx`, `src/hooks/use-mobile.ts`

**Issue:** Two identical hooks with different extensions. This can cause confusion and potential import issues.

**Fix:** Consolidate into one file and remove the other. Keep `use-mobile.tsx` as it follows the project's naming convention.

---

### 13. **Missing Query Key Normalization**
**Files:** All React Query hooks

**Issue:** Query keys include objects directly without normalization, which can cause cache misses if object key order varies.

**Current code:**
```typescript
queryKey: contactKeys.list(params ?? {}),
```

**Fix:**
```typescript
queryKey: contactKeys.list(params ?? {}),
queryKeyHashFn: (queryKey) => JSON.stringify(queryKey), // Add for consistent hashing
```

Or normalize the params object:
```typescript
const normalizedParams = useMemo(() => ({
  status: params?.status,
  search: params?.search,
  page: params?.page ?? 1,
  limit: params?.limit ?? 10,
}), [params?.status, params?.search, params?.page, params?.limit]);

queryKey: contactKeys.list(normalizedParams),
```

---

### 14. **Timer References Not Stable**
**File:** `src/hooks/ai/useRealtimeVoiceSession.ts`

**Issue:** Multiple `setTimeout`/`setInterval` IDs are stored in refs but not properly typed or cleared on re-renders.

**Fix:** Ensure all timers are cleared in cleanup and properly typed:
```typescript
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
}, []);
```

---

## 📋 RECOMMENDATIONS

### 1. **Add ESLint Rules**
Add the following ESLint configuration to catch hook issues:
```json
{
  "extends": ["plugin:react-hooks/recommended"],
  "rules": {
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error"
  }
}
```

### 2. **Create a `useAsync` Utility Hook**
Create a standardized async hook to handle loading, error, and cancellation states:
```typescript
function useAsync<T>(asyncFn: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: Error | null }>({
    data: null,
    loading: true,
    error: null,
  });
  
  useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true }));
    
    asyncFn()
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(error => { if (!cancelled) setState({ data: null, loading: false, error }); });
    
    return () => { cancelled = true; };
  }, deps);
  
  return state;
}
```

### 3. **Use React Query for All Data Fetching**
The custom CRM hooks (`src/hooks/crm/*`) should be deprecated in favor of React Query hooks (`src/hooks/useContacts.ts`, etc.) which handle caching, deduplication, and cancellation better.

### 4. **Add Hook Testing**
Add tests for critical hooks using `@testing-library/react-hooks`:
```typescript
import { renderHook, waitFor } from '@testing-library/react';

it('should handle unmount during fetch', async () => {
  const { result, unmount } = renderHook(() => useContacts());
  unmount();
  // Should not throw
});
```

---

## ✅ HOOKS THAT ARE WELL-IMPLEMENTED

1. **`useDebounced`** - Clean implementation with proper cleanup
2. **`useStaleFlag`** - Proper sessionStorage usage with error handling
3. **`useCurrentUser`** - Simple wrapper around next-auth with correct typing
4. **React Query mutation hooks** - Proper invalidation patterns

---

## 🎯 PRIORITY ACTION ITEMS

| Priority | Issue | File |
|----------|-------|------|
| P0 | Memory leak in polling | `useChatMessages.ts` |
| P0 | Race condition in WebSocket | `useGeminiLiveSession.ts` |
| P0 | Error state persistence | `useContacts.ts`, `useDeals.ts`, etc. |
| P1 | Stale closure in sendTyping | `useWebSocket.ts` |
| P1 | Missing auth checks | React Query hooks |
| P1 | SSR unsafe window access | `usePropertySearch.ts` |
| P2 | Duplicate mobile hook | `use-mobile.tsx/ts` |
| P2 | Missing memoization | Chat hooks |

---

*Report generated by automated React hooks analysis*
