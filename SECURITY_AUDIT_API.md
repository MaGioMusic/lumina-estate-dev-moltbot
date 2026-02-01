# Lumina Estate API Security Audit Report

**Date:** 2026-02-01  
**Auditor:** Security Expert (API)  
**Scope:** API Routes and Services Layer

---

## Executive Summary

**CRITICAL VULNERABILITIES FOUND: 4**  
**HIGH SEVERITY: 6**  
**MEDIUM SEVERITY: 8**  
**LOW SEVERITY: 4**

The API layer has several critical and high-severity vulnerabilities that allow authentication bypass, unauthorized data access (IDOR), and privilege escalation. Immediate action is required.

---

## 🔴 CRITICAL VULNERABILITIES

### 1. Authentication Bypass in /api/appointments

**File:** `src/app/api/appointments/route.ts`  
**Endpoint:** `POST /api/appointments`  
**OWASP:** A01:2021 – Broken Access Control  
**Severity:** CRITICAL

**Vulnerability:** The `requireUser` function is called synchronously but is async, causing the function to return a Promise instead of throwing. The code continues execution without authentication.

**Proof of Concept:**
```typescript
// Current vulnerable code:
const user = requireUser(request, ['client', 'agent', 'investor', 'admin']); 
// Returns Promise, doesn't await - user is Promise, not authenticated user
```

**Exploitation:**
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"propertyId":"any-uuid","scheduledDate":"2026-01-01T00:00:00Z","type":"viewing"}'
# Creates appointment without authentication!
```

**Remediation:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request, ['client', 'agent', 'investor', 'admin']);
    // ... rest of handler
  }
}
```

---

### 2. IDOR - Create Tasks for Any User

**File:** `src/app/api/tasks/route.ts`  
**Endpoint:** `POST /api/tasks`  
**OWASP:** A01:2021 – Broken Access Control / IDOR  
**Severity:** CRITICAL

**Vulnerability:** The API accepts `assignedToId` without verifying the user exists or the requester has permission to assign tasks to that user.

**Proof of Concept:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Cookie: session=valid_session" \
  -d '{
    "title": "Malicious Task",
    "assignedToId": "<ANY_USER_UUID>",
    "description": "Spam task for victim"
  }'
```

**Impact:** 
- Spam any user with tasks
- Potential DoS by creating thousands of tasks for a target user
- Could be combined with XSS in task content

**Remediation:**
```typescript
export async function POST(req: NextRequest) {
  // ... auth check ...
  
  const body = await req.json();
  const validatedData = taskSchema.parse(body);
  
  // SECURITY: Verify assignedToId is the current user or user has admin rights
  if (validatedData.assignedToId !== session.user.id && session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Cannot assign tasks to other users' }, { status: 403 });
  }
  
  // Optionally verify target user exists
  const targetUser = await prisma.user.findUnique({
    where: { id: validatedData.assignedToId },
    select: { id: true }
  });
  if (!targetUser) {
    return NextResponse.json({ error: 'Assigned user not found' }, { status: 404 });
  }
  
  // ... create task
}
```

---

### 3. Mass Assignment - Tasks Allow Unrestricted dealId/contactId

**File:** `src/app/api/tasks/route.ts`  
**Endpoint:** `POST /api/tasks`  
**OWASP:** A03:2021 – Injection / Mass Assignment  
**Severity:** CRITICAL

**Vulnerability:** Can create tasks linked to any deal/contact without ownership verification.

**Proof of Concept:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Cookie: session=valid_session" \
  -d '{
    "title": "Spy on competitor deal",
    "assignedToId": "my-user-id",
    "dealId": "<COMPETITOR_DEAL_UUID>"
  }'
```

**Remediation:**
```typescript
// Verify deal ownership before creating task
if (validatedData.dealId) {
  const deal = await prisma.deal.findFirst({
    where: { id: validatedData.dealId, agentId: session.user.id }
  });
  if (!deal) {
    return NextResponse.json({ error: 'Deal not found or access denied' }, { status: 403 });
  }
}

if (validatedData.contactId) {
  const contact = await prisma.contact.findFirst({
    where: { id: validatedData.contactId, assignedAgentId: session.user.id }
  });
  if (!contact) {
    return NextResponse.json({ error: 'Contact not found or access denied' }, { status: 403 });
  }
}
```

---

### 4. Chat Room - Force Add Users Without Consent

**File:** `src/app/api/chat/rooms/route.ts`  
**Endpoint:** `POST /api/chat/rooms`  
**OWASP:** A01:2021 – Broken Access Control  
**Severity:** CRITICAL

**Vulnerability:** Can create rooms and add any users (by UUID) without their consent or verification they exist.

**Proof of Concept:**
```bash
curl -X POST http://localhost:3000/api/chat/rooms \
  -H "Content-Type: application/json" \
  -H "Cookie: session=valid_session" \
  -d '{
    "name": "Harassment Room",
    "type": "group",
    "memberIds": ["<VICTIM_UUID_1>", "<VICTIM_UUID_2>"]
  }'
```

**Impact:**
- Add users to unwanted chat rooms
- Potential harassment vector
- Information disclosure (room names may be sensitive)

**Remediation:**
```typescript
const chatRoomSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['direct', 'group']).default('group'),
  memberIds: z.array(z.string().uuid()).max(10).default([]),
});

export async function POST(req: NextRequest) {
  // ... auth check ...
  
  const validatedData = chatRoomSchema.parse(body);
  
  // Verify all memberIds exist and are valid users
  if (validatedData.memberIds.length > 0) {
    const users = await prisma.user.findMany({
      where: { id: { in: validatedData.memberIds } },
      select: { id: true }
    });
    
    if (users.length !== validatedData.memberIds.length) {
      return NextResponse.json({ error: 'One or more members not found' }, { status: 400 });
    }
    
    // Optional: Send invitations instead of force-adding
    // Or restrict to only adding users from same organization
  }
  
  // ... create room
}
```

---

## 🟠 HIGH SEVERITY VULNERABILITIES

### 5. No Rate Limiting on Any API Endpoints

**Files:** All API routes  
**OWASP:** A07:2021 – Identification and Authentication Failures  
**Severity:** HIGH

**Vulnerability:** No rate limiting applied to any endpoints despite having a rate limiter utility.

**Attack Scenarios:**
- Credential stuffing on `/api/auth/[...nextauth]`
- DoS by flooding `/api/contacts`, `/api/deals`, etc.
- Enumeration attacks on UUIDs

**Remediation:**
```typescript
// src/app/api/contacts/route.ts
import { enforceRateLimit } from '@/lib/security/rateLimiter';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Apply rate limiting per user
    enforceRateLimit(`contacts:get:${session.user.id}`, {
      limit: 100,
      windowMs: 60_000,
      feature: 'contacts list'
    });
    
    // ... rest of handler
  }
}

export async function POST(req: NextRequest) {
  // ... auth check ...
  enforceRateLimit(`contacts:create:${session.user.id}`, {
    limit: 10,
    windowMs: 60_000,
    feature: 'contact creation'
  });
  // ... rest of handler
}
```

---

### 6. Missing Individual Resource Endpoints

**Files:** 
- Missing: `src/app/api/tasks/[id]/route.ts`
- Missing: `src/app/api/notes/[id]/route.ts`  
- Missing: `src/app/api/deals/[id]/route.ts` (exists but empty!)
- Missing: `src/app/api/chat/rooms/[id]/route.ts`
- Missing: `src/app/api/chat/messages/[id]/route.ts`

**OWASP:** A01:2021 – Broken Access Control  
**Severity:** HIGH

**Vulnerability:** No PATCH/DELETE endpoints for individual resources mean:
- Cannot properly manage resources
- Client-side "updates" may work via different mechanisms (potential inconsistency)
- No centralized authorization for updates/deletes

**Remediation:** Create complete CRUD endpoints for all resources with proper ownership checks.

---

### 7. Notes Creation - No Contact/Deal Ownership Verification

**File:** `src/app/api/notes/route.ts`  
**Endpoint:** `POST /api/notes`  
**OWASP:** A01:2021 – Broken Access Control  
**Severity:** HIGH

**Vulnerability:** Can create notes on any contact or deal by UUID without ownership verification.

**Proof of Concept:**
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Cookie: session=valid_session" \
  -d '{
    "content": "Competitor intel gathered",
    "dealId": "<COMPETITOR_DEAL_UUID>"
  }'
```

**Remediation:**
```typescript
export async function POST(req: NextRequest) {
  // ... auth check ...
  const validatedData = noteSchema.parse(body);
  
  // Verify ownership of related resources
  if (validatedData.contactId) {
    const contact = await prisma.contact.findFirst({
      where: { id: validatedData.contactId, assignedAgentId: session.user.id }
    });
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
  }
  
  if (validatedData.dealId) {
    const deal = await prisma.deal.findFirst({
      where: { id: validatedData.dealId, agentId: session.user.id }
    });
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
  }
  
  // ... create note
}
```

---

### 8. Missing Request Body Size Limits

**Files:** All API routes accepting POST/PUT/PATCH  
**OWASP:** A05:2021 – Security Misconfiguration  
**Severity:** HIGH

**Vulnerability:** No request size limits can lead to:
- DoS via memory exhaustion
- Large payload attacks

**Remediation:**
```typescript
// next.config.js
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Adjust per endpoint
    },
    responseLimit: '8mb',
  },
};

// Or for specific routes, export config:
// src/app/api/contacts/route.ts
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '256kb',
    },
  },
};
```

---

### 9. Information Disclosure in Error Messages (Partial)

**Files:** Multiple routes  
**OWASP:** A06:2021 – Vulnerable and Outdated Components / Information Disclosure  
**Severity:** HIGH

**Vulnerability:** Some routes expose Prisma/database errors in development mode:

```typescript
// chat/history/route.ts - lines 87-96
return NextResponse.json(
  {
    error: {
      code: 'DB_WRITE_FAILED',
      message: 'Failed to create conversation',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
      supabaseHost: process.env.NODE_ENV !== 'production' && process.env.SUPABASE_URL
        ? new URL(process.env.SUPABASE_URL).hostname
        : undefined,
    },
  },
  { status: 500 },
);
```

While conditionally hidden in production, this pattern is risky. Also, Zod validation errors expose field names and validation rules.

**Remediation:**
```typescript
// Use centralized error handler
import { handleApiError } from '../utils';

catch (error) {
  return handleApiError(error);
}
```

---

### 10. Chat Messages - No Message Ownership Verification on Update/Delete

**File:** `src/lib/api/services/chat.ts`  
**OWASP:** A01:2021 – Broken Access Control  
**Severity:** HIGH

**Vulnerability:** Service layer defines `updateChatMessage` and `deleteChatMessage` but there's no corresponding API route with ownership verification.

When implemented, must verify:
- Only message sender can edit/delete
- Or room admins can moderate

---

## 🟡 MEDIUM SEVERITY VULNERABILITIES

### 11. No CORS Configuration for API Routes

**Files:** All API routes  
**OWASP:** A05:2021 – Security Misconfiguration  
**Severity:** MEDIUM

**Vulnerability:** Default Next.js CORS settings may be too permissive. No explicit CORS configuration.

**Remediation:**
```typescript
// Add to API routes or middleware
import { NextResponse } from 'next/server';

const allowedOrigins = [
  'https://lumina-estate.com',
  'https://app.lumina-estate.com',
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  
  const response = NextResponse.next();
  
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  return response;
}
```

---

### 12. Missing API Versioning

**Files:** All API routes  
**OWASP:** A05:2021 – Security Misconfiguration  
**Severity:** MEDIUM

**Vulnerability:** No API versioning makes backward-incompatible changes difficult.

**Remediation:**
```
/api/v1/contacts
/api/v2/contacts
```

---

### 13. Search Regex DoS (ReDoS) Potential

**File:** `src/app/api/contacts/route.ts`  
**Line:** 45  
**OWASP:** A03:2021 – Injection  
**Severity:** MEDIUM

**Vulnerability:**
```typescript
if (!/^[a-zA-Z0-9\s@.-]*$/.test(sanitizedSearch)) {
  return NextResponse.json({ error: 'Invalid search query' }, { status: 400 });
}
```

While this regex is safe, consider using a proper validation library.

---

### 14. Zod Schema Allowing Extra Properties

**Files:** All routes using Zod  
**OWASP:** A03:2021 – Injection / Mass Assignment  
**Severity:** MEDIUM

**Vulnerability:** Default Zod schemas allow extra properties through unless `.strict()` is used.

**Remediation:**
```typescript
const contactSchema = z.object({
  firstName: z.string().min(1).max(100),
  // ... other fields
}).strict(); // Reject unknown properties
```

---

### 15. No Input Sanitization on Search Parameters

**File:** `src/app/api/deals/route.ts`  
**Line:** 30  
**OWASP:** A03:2021 – Injection  
**Severity:** MEDIUM

**Vulnerability:** Stage and contactId query parameters aren't validated.

---

### 16. Weak Session Configuration in Development

**File:** `src/lib/auth/nextAuthOptions.ts`  
**OWASP:** A07:2021 – Identification and Authentication Failures  
**Severity:** MEDIUM

**Vulnerability:** Development mode generates temporary secrets that change on restart, potentially invalidating sessions unexpectedly.

---

### 17. Timing Attack on User Enumeration (Partial Fix Present)

**File:** `src/lib/auth/nextAuthOptions.ts`  
**Line:** 95-102  
**OWASP:** A07:2021 – Identification and Authentication Failures  
**Severity:** MEDIUM

**Observation:** The code attempts to prevent timing attacks with dummy hash comparison, but this is only effective if the bcrypt rounds match between real and dummy hashes.

---

### 18. In-Memory Rate Limiter Not Production-Ready

**File:** `src/lib/security/rateLimiter.ts`  
**OWASP:** A05:2021 – Security Misconfiguration  
**Severity:** MEDIUM

**Vulnerability:** In-memory rate limiting doesn't work across multiple server instances.

---

## 🟢 LOW SEVERITY VULNERABILITIES

### 19. Missing Security Headers on API Routes

**OWASP:** A05:2021 – Security Misconfiguration  
**Severity:** LOW

API responses don't include security headers (X-Content-Type-Options, etc.).

---

### 20. Verbose Logging in Production

**Files:** Multiple routes  
**OWASP:** A09:2021 – Security Logging and Monitoring Failures  
**Severity:** LOW

Some routes log sensitive information that could end up in logs.

---

### 21. No Request ID Tracking

**OWASP:** A09:2021 – Security Logging and Monitoring Failures  
**Severity:** LOW

No correlation IDs for tracing requests through the system.

---

### 22. Prisma Client Not Properly Configured for Production

**File:** `src/lib/prisma.ts`  
**OWASP:** A05:2021 – Security Misconfiguration  **Severity:** LOW

Connection pooling and timeout settings should be reviewed.

---

## Attack Scenarios Verified

### Scenario 1: Can User A Access User B's Contacts?
**Status:** ❌ **VULNERABLE** (via notes/tasks creation)

While direct contact access is protected, User A can create notes/tasks linked to User B's contacts if they guess the UUID.

### Scenario 2: Can User Modify/Delete Other Users' Data?
**Status:** ⚠️ **PARTIALLY VULNERABLE**

- Contacts: Protected ✓
- Deals: Individual endpoints missing - cannot test
- Tasks: No update/delete endpoints
- Notes: No update/delete endpoints
- Chat: Cannot edit others' messages (endpoints missing)

### Scenario 3: What Happens with Malformed JSON?
**Status:** ⚠️ **ACCEPTABLE**

Zod validation catches most malformed requests, returning 400 errors.

### Scenario 4: What Happens with Extremely Large Payloads?
**Status:** ❌ **VULNERABLE**

No body size limits configured - potential DoS vector.

### Scenario 5: Are Timing Attacks Possible?
**Status:** ⚠️ **PARTIALLY MITIGATED**

Login has dummy hash comparison, but other endpoints may leak timing information.

---

## Remediation Priority Matrix

| Priority | Vulnerability | Effort | Impact |
|----------|--------------|--------|--------|
| P0 | Fix appointments auth bypass | Low | Critical |
| P0 | Add ownership checks to tasks POST | Low | Critical |
| P0 | Add ownership checks to notes POST | Low | Critical |
| P0 | Fix chat room member addition | Medium | Critical |
| P1 | Implement rate limiting | Medium | High |
| P1 | Add missing CRUD endpoints | High | High |
| P1 | Add body size limits | Low | High |
| P2 | Implement API versioning | Medium | Medium |
| P2 | Add CORS configuration | Low | Medium |
| P2 | Use strict Zod schemas | Low | Medium |

---

## Secure Code Examples

### Protected Task Creation
```typescript
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  enforceRateLimit(`tasks:create:${session.user.id}`, { limit: 20, windowMs: 60_000 });
  
  const body = await req.json();
  const validatedData = taskSchema.parse(body);
  
  // Verify can only assign to self (or admin can assign to anyone)
  if (validatedData.assignedToId !== session.user.id && session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Verify target user exists
  const targetUser = await prisma.user.findUnique({
    where: { id: validatedData.assignedToId },
    select: { id: true, status: true }
  });
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Verify deal ownership if specified
  if (validatedData.dealId) {
    const deal = await prisma.deal.findFirst({
      where: { id: validatedData.dealId, agentId: session.user.id }
    });
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
  }
  
  // ... create task
}
```

### Secure Update Endpoint Pattern
```typescript
// src/app/api/tasks/[id]/route.ts
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const task = await prisma.task.findUnique({ where: { id: params.id } });
  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  // Verify ownership - can only update own tasks or admin
  if (task.assignedToId !== session.user.id && task.createdById !== session.user.id && session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // ... update logic
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // Similar ownership check
}
```

---

## Conclusion

The Lumina Estate API has several critical vulnerabilities that need immediate attention:

1. **CRITICAL:** The appointments endpoint has a complete authentication bypass
2. **CRITICAL:** IDOR vulnerabilities allow creating tasks/notes on others' resources
3. **HIGH:** No rate limiting makes the API vulnerable to abuse
4. **HIGH:** Missing endpoints leave the API incomplete and potentially inconsistent

**Recommended immediate actions:**
1. Fix the authentication bypass in appointments
2. Add ownership verification to all resource creation endpoints
3. Implement rate limiting on all endpoints
4. Add request body size limits
5. Create missing individual resource endpoints with proper authorization

**Estimated remediation time:** 3-5 days for critical/high issues.

---

*Report generated by Security Expert (API) for Lumina Estate*
