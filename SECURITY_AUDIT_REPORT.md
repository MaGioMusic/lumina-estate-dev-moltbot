# Lumina Estate Security Audit Report
**Date:** February 1, 2026  
**Scope:** Full-stack security assessment (XSS, CSRF, Rate Limiting, Auth, SQL Injection, RLS)

---

## Executive Summary

The Lumina Estate codebase demonstrates **strong security practices** overall. Most critical and high-severity vulnerabilities have been properly addressed through:

- ✅ DOMPurify for XSS sanitization
- ✅ Double-submit cookie pattern for CSRF protection
- ✅ NextAuth.js for secure session management
- ✅ Zod input validation across API routes
- ✅ Prisma ORM preventing SQL injection
- ✅ Comprehensive RLS policies (documented in migration)

**No Critical or High severity vulnerabilities were found.**

---

## Vulnerabilities by Severity

### 🔴 CRITICAL (0)
*No critical vulnerabilities detected.*

### 🟠 HIGH (0)
*No high-severity vulnerabilities detected.*

### 🟡 MEDIUM (3)

#### MEDIUM-1: `dangerouslySetInnerHTML` in Chart Component Without Explicit Sanitization
**Location:** `src/components/ui/chart.tsx:116`

**Issue:** The ChartStyle component uses `dangerouslySetInnerHTML` to inject CSS custom properties. While the content is generated from controlled config values (colors), there's no explicit sanitization before injection.

**Current Code:**
```tsx
<style
  dangerouslySetInnerHTML={{
    __html: Object.entries(THEMES)
      .map(([theme, prefix]) => `...`)
      .join("\n"),
  }}
/>
```

**Risk:** If color values in config could be user-controlled, this could lead to XSS via CSS injection.

**Recommendation:** 
- Validate/sanitize color values before using in template
- Ensure config.colors only accept valid CSS color values

**Status:** ACCEPTABLE RISK - Colors are hardcoded in config, not user-input

---

#### MEDIUM-2: Missing CSRF Token Validation in Some API Routes
**Location:** Various API routes using `requireUser` without explicit CSRF validation

**Issue:** While CSRF protection infrastructure exists and is enforced via `withCsrfProtection` wrapper, not all mutation routes explicitly use it. The `requireUser` function checks auth but not CSRF tokens.

**Affected Routes (need CSRF enforcement):**
- `/api/appointments/route.ts` (POST)
- `/api/favorites/route.ts` (POST)
- `/api/inquiries/route.ts` (POST)
- `/api/listings/route.ts` (POST)
- `/api/contacts/route.ts` (POST, PUT, DELETE)
- `/api/deals/route.ts` (POST, PUT, DELETE)
- `/api/notes/route.ts` (POST, PUT, DELETE)
- `/api/tasks/route.ts` (POST, PUT, DELETE)

**Current State:**
```ts
// Some routes use:
const user = await requireUser(request); // No CSRF check

// Should use:
const user = await requireUser(request);
await validateCsrf(request); // Missing
```

**Recommendation:** 
- Apply `withCsrfProtection` wrapper to all mutation routes
- Or add explicit `await validateCsrf(request)` after auth check

**Priority:** Medium - Modern browsers with SameSite=Lax cookies provide partial protection

---

#### MEDIUM-3: RLS Policies Not Applied in Application Code
**Location:** Database layer (Supabase)

**Issue:** Comprehensive RLS policies are documented in `supabase/migration_2026_02_01.sql` but there's no evidence they have been applied to the database. All data access is through Prisma, which bypasses RLS.

**RLS Status:**
| Table | RLS Status | Notes |
|-------|------------|-------|
| contacts | ❌ Not Enforced | Application-level auth only |
| deals | ❌ Not Enforced | Application-level auth only |
| tasks | ❌ Not Enforced | Application-level auth only |
| notes | ❌ Not Enforced | Application-level auth only |
| chat_rooms | ❌ Not Enforced | Application-level auth only |
| chat_messages | ❌ Not Enforced | Application-level auth only |
| users | ❌ Not Enforced | Application-level auth only |

**Risk:** If Prisma connection is compromised or used incorrectly, database-level access controls are absent.

**Recommendation:**
1. Apply the migration: `psql -f supabase/migration_2026_02_01.sql`
2. Verify RLS is working: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'contacts';`
3. Run test suite: `npx ts-node supabase/test-rls.ts`

---

### 🟢 LOW (4)

#### LOW-1: Missing Security Headers on Some API Routes
**Location:** API routes without explicit security headers

**Issue:** While `next.config.js` sets security headers for page routes, some API routes don't explicitly set security headers on responses.

**Example (chat/messages/route.ts has headers, others don't):**
```ts
// Good example:
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'none'; object-src 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
return NextResponse.json(data, { headers: securityHeaders });
```

**Recommendation:** Add security headers middleware or consistent header setting across all API routes.

---

#### LOW-2: Information Disclosure in Error Messages (Development Mode)
**Location:** `src/app/api/chat/message/route.ts` and others

**Issue:** Error responses include database details in non-production environments:
```ts
details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
supabaseHost: process.env.NODE_ENV !== 'production' ? ... : undefined,
```

**Risk:** If `NODE_ENV` is misconfigured, internal details could leak.

**Recommendation:** Use a more explicit `isDevelopment` flag that doesn't rely on NODE_ENV.

---

#### LOW-3: AI Chat Endpoint Missing Authentication
**Location:** `/api/chat/message/route.ts`, `/api/chat/history/route.ts`

**Issue:** AI chat endpoints use cookie-based visitor tracking without requiring user authentication. This allows anonymous access.

**Current Behavior:**
```ts
// No auth check - uses visitorId from cookie
const visitorId = existingVisitor || createId();
```

**Risk:** Could be abused for spam or resource exhaustion (though rate limiting would help).

**Recommendation:** Consider requiring at least a valid session or implement stricter rate limiting for anonymous users.

---

#### LOW-4: NEXTAUTH_SECRET Validation Only at Module Load
**Location:** `src/lib/auth/nextAuthOptions.ts`

**Issue:** NEXTAUTH_SECRET is validated once at module load. If the secret is changed at runtime, the application won't detect it until restart.

**Recommendation:** This is acceptable for most use cases, but consider documenting the need for restart after secret changes.

---

## Security Implementation Status

### ✅ XSS Protection (DOMPurify)
| Component | Status | Notes |
|-----------|--------|-------|
| `sanitizeString()` | ✅ Implemented | Uses DOMPurify with `ALLOWED_TAGS: []` |
| `sanitizeObject()` | ✅ Implemented | Recursive object sanitization |
| `sanitizeFields()` | ✅ Implemented | Field-specific sanitization |
| Chat messages | ✅ Secured | Content sanitized in API and component |
| User inputs | ✅ Secured | Zod validation + sanitization |
| dangerouslySetInnerHTML | ⚠️ Review | Chart component needs review |

**Test Coverage:** `src/lib/__tests__/sanitize.xss.test.ts` ✅

### ✅ CSRF Protection
| Component | Status | Notes |
|-----------|--------|-------|
| Token generation | ✅ Implemented | `crypto.randomBytes(32)` |
| Cookie storage | ✅ Implemented | httpOnly, secure, SameSite=Lax |
| Header validation | ✅ Implemented | `validateCsrfToken()` with timing-safe comparison |
| API client integration | ✅ Implemented | `getAuthHeaders()` adds CSRF token |
| Route enforcement | ⚠️ Partial | Not all mutation routes enforce CSRF |

### ✅ Rate Limiting
| Component | Status | Notes |
|-----------|--------|-------|
| In-memory rate limiter | ✅ Implemented | `enforceRateLimit()` with configurable windows |
| Chat endpoints | ✅ Protected | 100 req/min GET, 50 req/min POST |
| CSRF token endpoint | ✅ Protected | 10 req/min |
| Contacts/Deals/Tasks | ✅ Protected | Various limits applied |

**Note:** In-memory rate limiter is for single-instance deployment. Production should use Redis/Upstash.

### ✅ Authentication/Authorization
| Component | Status | Notes |
|-----------|--------|-------|
| NextAuth.js session | ✅ Implemented | JWT strategy with secure cookies |
| NEXTAUTH_SECRET validation | ✅ Implemented | Min 32 chars, rejects placeholders |
| Role-based access | ✅ Implemented | `requireUser(request, ['agent', 'admin'])` |
| Session security | ✅ Implemented | httpOnly, SameSite=strict, secure in production |
| Password hashing | ✅ Implemented | bcryptjs with proper comparison timing |

### ✅ Input Sanitization
| Component | Status | Notes |
|-----------|--------|-------|
| Zod validation | ✅ Implemented | All API routes use Zod schemas |
| String sanitization | ✅ Implemented | DOMPurify for HTML content |
| Search input validation | ✅ Implemented | Regex validation on search params |
| Pagination limits | ✅ Implemented | `Math.min(200, ...)` pattern |

### ✅ SQL Injection Prevention
| Component | Status | Notes |
|-----------|--------|-------|
| Prisma ORM | ✅ Implemented | Parameterized queries throughout |
| Raw queries | ✅ None Found | No `prisma.$queryRaw` with user input |
| Input validation | ✅ Implemented | Zod schemas prevent injection |

### ⚠️ Row Level Security (RLS)
| Component | Status | Notes |
|-----------|--------|-------|
| RLS Policies Defined | ✅ Comprehensive | Full migration in `supabase/migration_2026_02_01.sql` |
| RLS Applied to DB | ❌ Unknown | Needs verification |
| Helper Functions | ✅ Defined | `is_admin()`, `is_chat_room_member()`, etc. |
| Test Suite | ✅ Provided | `supabase/test-rls.ts` |

---

## Security Headers Status

| Header | Status | Config Location |
|--------|--------|-----------------|
| X-DNS-Prefetch-Control | ✅ | next.config.js |
| X-Frame-Options | ✅ | next.config.js |
| X-Content-Type-Options | ✅ | next.config.js |
| Referrer-Policy | ✅ | next.config.js |
| Permissions-Policy | ✅ | next.config.js |
| Strict-Transport-Security | ✅ (prod) | next.config.js |
| Content-Security-Policy | ✅ (prod) | next.config.js |

---

## Recommendations Summary

### Immediate (High Priority)
1. **Apply RLS migration** to database: `psql -f supabase/migration_2026_02_01.sql`
2. **Run RLS test suite** to verify policies work: `npx ts-node supabase/test-rls.ts`
3. **Add CSRF validation** to all mutation API routes using `withCsrfProtection`

### Short-term (Medium Priority)
4. Review `dangerouslySetInnerHTML` usage in Chart component
5. Add consistent security headers to all API responses
6. Implement Redis-based rate limiter for production

### Long-term (Low Priority)
7. Consider adding authentication to AI chat endpoints
8. Implement audit logging for sensitive operations
9. Add Content Security Policy reporting endpoint

---

## Conclusion

The Lumina Estate application demonstrates **good security hygiene** with:

- **XSS Protection:** Properly implemented with DOMPurify
- **CSRF Protection:** Well-designed double-submit pattern
- **Authentication:** Secure NextAuth.js implementation
- **Input Validation:** Comprehensive Zod schemas
- **SQL Injection:** Fully prevented via Prisma ORM

**Main areas for improvement:**
1. Apply documented RLS policies to the database
2. Ensure CSRF validation is consistently applied across all mutation routes
3. Run the provided RLS test suite to verify database security

**Overall Security Grade: B+** (Excellent foundation, minor implementation gaps)
