# Testing Guide - Lumina Estate

## Pre-Merge Testing Checklist

### 1. Environment Setup
```bash
# Copy environment variables
cp .env.example .env.local

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate
```

### 2. Build Verification
```bash
# Run production build
npm run build

# Expected: Build completes with warnings but no fatal errors
# Note: Current build has ~176 TypeScript errors (non-blocking)
```

### 3. Lint Check
```bash
npm run lint
```

### 4. Type Checking
```bash
npx tsc --noEmit

# Current status: 176 errors (documented in TYPE_CHECK_REPORT.md)
# Critical errors to watch for:
# - Missing imports
# - Module resolution failures
# - Prisma type mismatches
```

## Manual Testing Steps

### Authentication Flow
1. **Login Page** (`/login`)
   - Test credentials login
   - Verify error messages display correctly
   - Check CSRF token is present

2. **Protected Routes**
   - Access `/agents` without login → should redirect to login
   - Login → should redirect to dashboard
   - Session persistence across page reloads

3. **Role-based Access**
   - Agent role: Access to CRM, properties, dashboard
   - Admin role: Additional admin panel access
   - Client role: Limited to client-facing features

### CRM Functionality
1. **Contacts Management** (`/agents/crm`)
   - Create new contact
   - Edit existing contact
   - Delete contact
   - Search/filter contacts

2. **Deals Pipeline**
   - View deals in pipeline view
   - Move deal between stages
   - Create new deal
   - Update deal value/stage

3. **Tasks**
   - Create task
   - Mark task complete
   - Filter by status

4. **Notes**
   - Add note to contact
   - Edit note
   - Delete note

### Property Features
1. **Property Search** (`/properties`)
   - Search by location
   - Filter by price range
   - Filter by property type
   - Sort results

2. **Property Details**
   - View property images
   - Check map integration
   - Contact agent form

3. **Voice AI** (if enabled)
   - Click voice button
   - Test microphone access
   - Verify AI responses

### Internationalization
1. **Language Switching**
   - Test Georgian (default)
   - Test English
   - Test Russian
   - Verify URL prefixes: `/ka/`, `/en/`, `/ru/`

### API Endpoints
Test these endpoints return proper JSON:
```bash
# Health check
curl http://localhost:3000/api/health

# CSRF token
curl http://localhost:3000/api/csrf

# Contacts (requires auth)
curl -H "Cookie: your-session-cookie" http://localhost:3000/api/contacts
```

## Known Issues

### TypeScript Errors (Non-blocking)
The following errors exist but don't prevent the build:

1. **Hook Return Types** (`src/hooks/crm/*.ts`)
   - Hooks return `UseQueryResult` instead of destructured values
   - Components using these hooks have type mismatches

2. **Prisma Schema Mismatches**
   - `roomId_userId` compound key type issue
   - `sender` vs `senderId` field naming
   - `ChatRoomMemberRole` enum type issues

3. **Test File Types**
   - Missing Jest/Vitest type definitions
   - Test files use `describe`, `it`, `expect` without types

### Missing Components
- ✅ `progress.tsx` - Now created

### Import Fixes Applied
- Fixed 9 API routes importing `authOptions` → `nextAuthOptions as authOptions`

## Testing Checklist Template

```markdown
- [ ] Build passes (`npm run build`)
- [ ] No critical console errors
- [ ] Login/logout works
- [ ] Protected routes redirect correctly
- [ ] CRM contacts CRUD works
- [ ] CRM deals pipeline works
- [ ] Property search/filter works
- [ ] Maps load correctly
- [ ] Language switching works
- [ ] Voice AI initializes (if enabled)
- [ ] Mobile responsiveness OK
- [ ] Dark mode toggle works
```

## Debugging Tips

### Common Issues

1. **Prisma Client Issues**
   ```bash
   npm run prisma:generate
   ```

2. **Module Not Found**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Type Errors in Development**
   ```bash
   # Restart TypeScript server in IDE
   npx tsc --build --force
   ```

### Environment Variables Required for Testing
```env
# Minimum required for basic testing
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## CI/CD Testing
```bash
# Run all verification steps
npm run ci:verify

# This runs:
# - npm run lint
# - npm run erd:check
```

## Performance Testing
- Lighthouse score target: 70+ for all categories
- First Contentful Paint: < 2s
- Time to Interactive: < 4s

## Security Testing
- Verify CSRF protection on forms
- Check XSS sanitization
- Confirm auth middleware on protected routes
- Validate RLS policies in Supabase
