# CODE QUALITY AUDIT REPORT
## Lumina Estate Project - Duplicate Code & Best Practice Violations

**Date:** 2026-02-01  
**Scope:** `/src/components/**/*.tsx`, `/src/hooks/**/*.ts`, `/src/lib/**/*.ts`, `/src/app/api/**/*.ts`

---

## 🔴 CRITICAL DUPLICATES (High Priority)

### 1. **Dual Hook Implementations for CRM Data**
**DRY Violation - 100% Duplicate Logic Pattern**

| File A (React Query) | File B (useState/useEffect) | Purpose |
|---------------------|----------------------------|---------|
| `src/hooks/useContacts.ts` | `src/hooks/crm/useContacts.ts` | Contact management |
| `src/hooks/useTasks.ts` | `src/hooks/crm/useTasks.ts` | Task management |
| `src/hooks/useNotes.ts` | `src/hooks/crm/useNotes.ts` | Note management |
| `src/hooks/useDeals.ts` | `src/hooks/crm/useDeals.ts` | Deal management |

**Problem:** Two completely different hook implementations exist for the same CRM entities:
- **React Query hooks** (`src/hooks/*.ts`): Modern, cached, optimistic updates, proper invalidation
- **Legacy hooks** (`src/hooks/crm/*.ts`): Manual fetch, useState/useEffect, no caching

**Code Sample (Identical Pattern in all 4 entities):**
```typescript
// Both files implement:
// - fetchContacts/fetchTasks/fetchNotes/fetchDeals (identical structure)
// - create/update/delete operations (identical CSRF handling)
// - Loading/error state management
// - AbortController cleanup
```

**Consolidation Strategy:**
```typescript
// RECOMMENDED: Delete src/hooks/crm/*.ts
// Use src/hooks/use*.ts (React Query) exclusively
// Update imports in components using the old hooks

// Migration path:
// 1. Identify all imports from '@/hooks/crm/*'
// 2. Replace with '@/hooks/use*'
// 3. Adapt to React Query return types (data.data vs direct access)
// 4. Delete legacy hooks
```

---

### 2. **Duplicate useIsMobile Hook**
**Exact Duplicate Files**

| File | Lines | Content |
|------|-------|---------|
| `src/hooks/use-mobile.ts` | 22 | `export function useIsMobile()` |
| `src/hooks/use-mobile.tsx` | 22 | `export function useIsMobile()` |

**Problem:** Identical content, different extensions. Both files export the exact same function.

**Consolidation:** Delete one file, update imports. Standardize on `.ts` extension for hooks.

---

### 3. **PropertyCard Wrapper Anti-Pattern**
**Unnecessary Delegation Pattern**

| File | Role |
|------|------|
| `src/components/PropertyCard.tsx` | Thin wrapper (18 lines) |
| `src/app/(marketing)/properties/components/PropertyCard.tsx` | Actual implementation (260+ lines) |

**Problem:** The root-level PropertyCard simply re-exports the nested one with type casting. This adds unnecessary abstraction and type safety issues (`as any` cast).

**Consolidation:**
```typescript
// Option 1: Delete src/components/PropertyCard.tsx
// Update all imports to use canonical location

// Option 2: Re-export properly without casting
export { default as PropertyCard } from '@/app/(marketing)/properties/components/PropertyCard';
```

---

## 🟠 MAJOR DUPLICATES (Medium Priority)

### 4. **CRUD API Route Boilerplate Duplication**
**Copy-Paste Pattern Across 4 Entities**

Files affected:
- `src/app/api/contacts/route.ts` & `[id]/route.ts`
- `src/app/api/tasks/route.ts` & `[id]/route.ts`
- `src/app/api/notes/route.ts` & `[id]/route.ts`
- `src/app/api/deals/route.ts` & `[id]/route.ts`

**Identical Code Blocks (~90% similar):**

| Pattern | Occurrences | Lines Duplicated |
|---------|-------------|------------------|
| Auth check boilerplate | 8 files | 5 lines × 8 = 40 |
| Rate limiting setup | 8 files | 8 lines × 8 = 64 |
| Pagination logic | 4 files | 6 lines × 4 = 24 |
| Zod error handling | 8 files | 6 lines × 8 = 48 |
| Prisma error responses | 8 files | 6 lines × 8 = 48 |
| Ownership verification | 4 files [id]/route.ts | 10 lines × 4 = 40 |

**Specific Duplicates Found:**

```typescript
// DUPLICATED in all [id]/route.ts files - Ownership Check Pattern
const existingEntity = await prisma.entity.findFirst({
  where: {
    id: params.id,
    agentId/assignedToId/createdById: session.user.id,
  },
});

if (!existingEntity) {
  return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
}
```

```typescript
// DUPLICATED in all route.ts files - Pagination Pattern
const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
const skip = (page - 1) * limit;
```

```typescript
// DUPLICATED in all files - Rate Limiting Pattern
enforceRateLimit(`entity:action:${session.user.id}`, {
  limit: 20/30/100,
  windowMs: 60_000,
  feature: 'entity action'
});
```

**Consolidation Strategy:**
```typescript
// Create: src/lib/api/crud-factory.ts
export function createCrudHandlers<T>(options: CrudOptions<T>) {
  return {
    GET: createGetHandler(options),
    POST: createPostHandler(options),
    PATCH: createPatchHandler(options),
    DELETE: createDeleteHandler(options),
  };
}

// Usage in each route.ts:
export const { GET, POST } = createCrudHandlers({
  model: prisma.contact,
  schema: contactSchema,
  resourceName: 'contact',
  ownershipField: 'assignedAgentId',
});
```

---

### 5. **API Service Layer Duplication**
**Identical CRUD Patterns in Services**

| File | Duplicated Pattern |
|------|-------------------|
| `src/lib/api/services/contacts.ts` | `getContacts`, `getContact`, `createContact`, `updateContact`, `deleteContact` |
| `src/lib/api/services/tasks.ts` | Same pattern |
| `src/lib/api/services/notes.ts` | Same pattern |
| `src/lib/api/services/deals.ts` | Same pattern |

**Identical Code Structure (~80 lines duplicated × 4 = 320 lines):**

```typescript
// Each service has IDENTICAL:
const BASE_PATH = '/entities';

// Same 5 CRUD functions with same return type wrapping:
return {
  success: true,
  data: response.entities,
  pagination: response.pagination,
};

// Same relation type definitions pattern
interface EntityWithRelations extends Entity {
  relatedEntity?: { id, name, ... }
}
```

**Consolidation Strategy:**
```typescript
// Create: src/lib/api/services/base-crud-service.ts
export class BaseCrudService<T, TWithRelations> {
  constructor(private basePath: string) {}
  
  async getAll(params?: QueryParams): Promise<PaginatedResponse<TWithRelations>>
  async getById(id: string): Promise<ItemResponse<TWithRelations>>
  async create(data: CreateDto): Promise<ItemResponse<TWithRelations>>
  async update(id: string, data: UpdateDto): Promise<ItemResponse<TWithRelations>>
  async delete(id: string): Promise<{ success: true }>
}

// Usage:
export const contactsApi = new BaseCrudService<Contact, ContactWithRelations>('/contacts');
```

---

### 6. **Login/Register Modal Duplication**
**Three Different Modal Implementations for Same Feature**

| File | Lines | Purpose | Status |
|------|-------|---------|--------|
| `src/components/LoginModal.tsx` | 240 | Login only | Active? |
| `src/components/SignUpModal.tsx` | 280 | Register only | Active? |
| `src/components/LoginRegisterModal.tsx` | 200 | Combined with tabs | Active? |

**Duplicated Elements:**
- Form field styling (theme-aware dark/light classes repeated)
- Password visibility toggle logic
- Social login button integration
- Error message display
- Loading spinner UI

**Consolidation Strategy:**
```typescript
// Keep: LoginRegisterModal.tsx (most flexible - has tabs)
// Delete: LoginModal.tsx, SignUpModal.tsx
// Or merge best features from all three into single component
```

---

### 7. **Filter Sidebar Implementations (Experimental/Code Debt)**
**Four Parallel Implementations**

| File | Library | Lines | Status |
|------|---------|-------|--------|
| `FiltersSidebar.tsx` | Raw HTML/CSS | 827+ | Production? |
| `ShadcnFilterSidebar.tsx` | Shadcn UI | 245+ | Experimental |
| `MantineFilterSidebar.tsx` | Mantine | 408+ | Experimental |
| `ProSidebarFilter.tsx` | Pro Sidebar | ? | Experimental |

**Problem:** Four completely different implementations of the same filters UI. Same `FiltersState` interface duplicated across all.

**Identical Duplicated Interface:**
```typescript
// Same in all 4 files:
interface FiltersState {
  priceRange: [number, number];
  bedrooms: string[];
  bathrooms: string[];
  propertyTypes: string[];
  transactionType: string;
  constructionStatus: string;
  floor: string;
  furniture: string;
  area: [number, number];
  amenities: string[];
}
```

**Consolidation:** Choose one implementation, delete others. Move `FiltersState` to shared types.

---

## 🟡 MINOR DUPLICATES & INCONSISTENCIES

### 8. **CSRF Token Handling Duplication**
**Repeated in All Legacy CRM Hooks**

Pattern appears in:
- `src/hooks/crm/useContacts.ts` (createContact, updateContact, deleteContact)
- `src/hooks/crm/useTasks.ts` (createTask, updateTask, deleteTask)
- `src/hooks/crm/useNotes.ts` (createNote, updateNote, deleteNote)
- `src/hooks/crm/useDeals.ts` (createDeal, updateDeal, deleteDeal)

**Duplicated Code Block (~10 lines × 12 occurrences = 120 lines):**
```typescript
// Get CSRF token for mutation
let csrfToken = getClientCsrfToken();
if (!csrfToken) {
  csrfToken = await fetchCsrfToken();
}

const response = await fetch('/api/entities', {
  method: 'POST/PUT/DELETE',
  headers: { 
    'Content-Type': 'application/json',
    [CSRF_HEADER_NAME]: csrfToken || '',
  },
  credentials: 'include',
  body: JSON.stringify(formData),
});
```

**Consolidation:** 
```typescript
// Create: src/lib/api/with-csrf.ts
export async function fetchWithCsrf(
  url: string, 
  options: RequestInit
): Promise<Response>
```

---

### 9. **AbortController Pattern Duplication**
**Identical Cleanup Logic in Legacy Hooks**

Same pattern in all 4 CRM hooks:
```typescript
const abortControllerRef = useRef<AbortController | null>(null);

// Fetch function with AbortController
// Cleanup in useEffect return
// ~20 lines duplicated per hook × 4 = 80 lines
```

**Consolidation:** Create `useAbortableFetch` hook or migrate to React Query (already done in the other hook set).

---

### 10. **Zod Schema Error Handling Duplication**
**Identical try-catch blocks in API routes**

Pattern in all API routes:
```typescript
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation error', details: error.errors },
      { status: 400 }
    );
  }
  console.error('Error ...:', error);
  return NextResponse.json(
    { error: 'Failed to ...' },
    { status: 500 }
  );
}
```

**Consolidation:** Create error handling middleware or wrapper function.

---

## 📊 SUMMARY STATISTICS

| Category | Count | Estimated Lines Duplicated | Priority |
|----------|-------|---------------------------|----------|
| **Complete File Duplicates** | 2 | 44 lines | 🔴 High |
| **Hook Implementation Pairs** | 4 pairs | ~800 lines | 🔴 High |
| **API Route Boilerplate** | 8 files | ~320 lines | 🟠 Medium |
| **Service Layer Duplicates** | 4 files | ~320 lines | 🟠 Medium |
| **Modal Components** | 3 files | ~150 lines | 🟠 Medium |
| **Filter Sidebars** | 4 files | ~1000+ lines | 🟠 Medium |
| **Small Pattern Duplicates** | 12+ occurrences | ~400 lines | 🟡 Low |

**Total Estimated Duplication: ~3,000+ lines**

---

## 🎯 RECOMMENDED ACTIONS (Prioritized)

### Immediate (Week 1)
1. **Delete duplicate `use-mobile.tsx`** - Keep `.ts` version
2. **Remove or consolidate PropertyCard wrapper** - Single source of truth
3. **Decide on hooks strategy** - Delete `src/hooks/crm/*` OR `src/hooks/*.ts` (not both)

### Short-term (Weeks 2-3)
4. **Create CRUD factory for API routes** - Reduce 8 route files to ~100 lines each
5. **Create base service class** - Reduce service duplication by 80%
6. **Consolidate login modals** - Single modal with configurable modes

### Medium-term (Month 2)
7. **Choose filter sidebar implementation** - Delete 3 experimental versions
8. **Extract shared error handling** - Middleware for API routes
9. **Extract CSRF wrapper** - Reusable fetch with CSRF

---

## 💡 ARCHITECTURAL RECOMMENDATIONS

### 1. **Adopt React Query Throughout**
The React Query hooks (`src/hooks/use*.ts`) are superior to the legacy hooks. Benefits:
- Automatic caching
- Optimistic updates
- Query invalidation
- Loading/error states handled
- Less boilerplate

### 2. **Implement Repository Pattern**
Current: Direct Prisma calls in API routes  
Recommended: Repository layer (`src/lib/repo/`) with standardized CRUD

### 3. **API Route Factory**
Implement higher-order functions or class-based approach for CRUD routes to eliminate the ~90% duplicated boilerplate.

### 4. **Component Composition Over Duplication**
The filter sidebars should share common components, not be completely separate implementations.

---

## 🔍 FILES REQUIRING ATTENTION

```
src/hooks/
  ├── use-mobile.tsx                    [DELETE - duplicate]
  ├── useContacts.ts                    [KEEP - React Query]
  ├── useTasks.ts                       [KEEP - React Query]
  ├── useNotes.ts                       [KEEP - React Query]
  ├── useDeals.ts                       [KEEP - React Query]
  └── crm/                              [DELETE OR DEPRECATE]
      ├── useContacts.ts
      ├── useTasks.ts
      ├── useNotes.ts
      └── useDeals.ts

src/components/
  ├── PropertyCard.tsx                  [DELETE - wrapper]
  ├── LoginModal.tsx                    [CONSOLIDATE]
  ├── SignUpModal.tsx                   [CONSOLIDATE]
  └── LoginRegisterModal.tsx            [KEEP - merge others]

src/app/api/
  └── {contacts,tasks,notes,deals}/     [REFACTOR - use factory]
      ├── route.ts
      └── [id]/route.ts

src/app/(marketing)/properties/components/
  ├── FiltersSidebar.tsx                [DECIDE - keep one]
  ├── ShadcnFilterSidebar.tsx           [DELETE or KEEP]
  ├── MantineFilterSidebar.tsx          [DELETE or KEEP]
  └── ProSidebarFilter.tsx              [DELETE or KEEP]
```

---

## ✅ VERIFICATION CHECKLIST

After consolidation:
- [ ] All imports resolve correctly
- [ ] No `as any` type casts needed
- [ ] Single source of truth for each entity
- [ ] Reduced bundle size (eliminated dead code)
- [ ] Consistent error handling across API routes
- [ ] Unified hook patterns (all React Query or all consistent)

---

*End of Audit Report*
