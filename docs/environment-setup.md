# Environment Setup Guide

Complete guide for setting up environment variables for the Lumina Estate application.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Required Variables](#required-variables)
3. [Getting API Keys](#getting-api-keys)
4. [Optional Variables](#optional-variables)
5. [Development vs Production](#development-vs-production)
6. [Security Best Practices](#security-best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required variables (see below)

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Required Variables

### Minimum Required for Basic Operation

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `DATABASE_URL` | PostgreSQL connection | Local Postgres or Supabase |
| `NEXTAUTH_SECRET` | Session encryption | Generate locally |
| `NEXTAUTH_URL` | App base URL | Your domain |

### Required for Voice AI Features

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `OPENAI_API_KEY` | OpenAI Realtime API | OpenAI Dashboard |
| `VOICE_MODEL` | Realtime model selection | - |

### Required for Google Maps

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Maps JavaScript API | Google Cloud Console |
| `GOOGLE_MAPS_API_KEY` | Server-side geocoding | Same as above |

### Required for Database & Auth (Supabase)

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `SUPABASE_URL` | Supabase project URL (server) | Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin database access | Supabase Dashboard |
| `SUPABASE_ANON_KEY` | Anon key for server usage | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL (client) | Same as SUPABASE_URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key for client usage | Same as SUPABASE_ANON_KEY |

### Required for Gemini Live (Alternative Voice AI)

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `GCP_PROJECT_ID` | Google Cloud project | Google Cloud Console |
| `GOOGLE_APPLICATION_CREDENTIALS` | Service account key | Google Cloud IAM |

---

## Getting API Keys

### 1. OpenAI API Key

**Used for:** Voice AI (Realtime API), AI chat features

**Steps:**
1. Go to https://platform.openai.com/signup
2. Create an account or sign in
3. Navigate to **API Keys** → https://platform.openai.com/api-keys
4. Click **Create new secret key**
5. Copy the key immediately (you can't see it again!)
6. Add billing information if needed

**Required Models Access:**
- `gpt-4o-realtime-preview-2024-12-17` or `gpt-4o-realtime-mini` for voice
- Your account needs Realtime API access (may require Tier 1 verification)

**Cost Estimate:**
- Realtime API: ~$0.10-0.50 per minute of conversation
- Set up usage limits in your OpenAI dashboard

---

### 2. Google Maps API Key

**Used for:** Property maps, location search, geocoding

**Steps:**
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **API Key**
5. Restrict the key (recommended):
   - HTTP referrers: Add your domains
   - APIs: Maps JavaScript API, Places API, Geocoding API

**Required APIs to Enable:**
- Maps JavaScript API
- Places API (New)
- Geocoding API

**Cost Estimate:**
- $200 free credit per month covers most small apps
- Check pricing at https://cloud.google.com/maps-platform/pricing

---

### 3. Supabase Credentials

**Used for:** Database, authentication, storage, realtime subscriptions

**Steps:**
1. Go to https://supabase.com and sign up
2. Create a new project
3. Go to **Project Settings** → **Database**
4. Copy the connection strings:
   - **Connection string** (for `DATABASE_URL`)
   - **Connection string** with URI mode (for `DIRECT_URL`)
5. Go to **Project Settings** → **API**
6. Copy the following values:
   - **Project URL** → Set for both `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Set for both `SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → Set for `SUPABASE_SERVICE_ROLE_KEY` only

**Understanding Supabase Keys:**

| Key Type | Variable | Visibility | Use Case |
|----------|----------|------------|----------|
| **Anon Key** | `SUPABASE_ANON_KEY`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Client-side auth, RLS-respected queries |
| **Service Role** | `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Admin operations, bypasses RLS |

**⚠️ Security Warning:**
- The `service_role` key **bypasses all RLS policies** - it has superuser privileges
- **Never** expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code or public repos
- Only use `service_role` key in server-side API routes
- Client-side code should always use the `anon` key with proper RLS policies

**Supabase Auth Architecture:**

This project uses a **dual authentication system**:

1. **NextAuth.js** (`NEXTAUTH_*` variables)
   - Session-based authentication
   - Traditional cookie-based web sessions
   - Used for: Admin dashboard, protected pages

2. **Supabase Auth** (`SUPABASE_*` variables)
   - JWT-based authentication
   - Used for: Realtime subscriptions, Storage, Edge Functions
   - Can work alongside NextAuth or standalone

You can configure the project to use:
- **Both systems together**: NextAuth for web sessions, Supabase Auth for realtime features
- **Supabase Auth only**: Remove NextAuth dependencies and use Supabase exclusively
- **NextAuth only**: Use Supabase only as a database (not for auth)

**To use Supabase Auth OAuth providers:**
1. Configure providers in Supabase Dashboard → Authentication → Providers
2. Add redirect URLs in Authentication → URL Configuration
3. Use Supabase client in your code:
   ```typescript
   // Sign in with Google
   await supabase.auth.signInWithOAuth({ 
     provider: 'google',
     options: { redirectTo: `${window.location.origin}/auth/callback` }
   })
   
   // Listen to auth changes
   supabase.auth.onAuthStateChange((event, session) => {
     console.log('Auth event:', event, session)
   })
   ```

---

### 4. Google Cloud / Vertex AI Setup

**Used for:** Gemini Live voice conversations (alternative to OpenAI)

**Steps:**
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable the **Vertex AI API**:
   - Go to **APIs & Services** → **Library**
   - Search "Vertex AI API" and enable it
4. Create a service account:
   - Go to **IAM & Admin** → **Service Accounts**
   - Click **Create Service Account**
   - Name: `lumina-estate-api`
   - Role: **Vertex AI User**
5. Create a key:
   - Click on your service account
   - Go to **Keys** tab
   - **Add Key** → **Create new key** → **JSON**
   - Download and save securely
6. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/downloaded-key.json"
   ```

**Required Permissions:**
- `aiplatform.endpoints.predict`
- `aiplatform.endpoints.streamGenerateContent`

---

### 5. Gemini API Key (Direct API)

**Alternative to:** Vertex AI (simpler setup)

**Steps:**
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click **Create API Key**
4. Copy the key

**Note:** Using `GEMINI_API_KEY` is simpler but has different rate limits than Vertex AI.

---

### 6. Generating Secrets

#### NextAuth Secret
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Online generator (not recommended for production)
# Use only for development
```

#### Pre-shared Secret (LUMINA_REALTIME_PRESHARED_SECRET)
```bash
# Generate a strong random string
openssl rand -base64 48
```

---

## Optional Variables

### Voice AI Fine-tuning

| Variable | Default | Description |
|----------|---------|-------------|
| `VOICE_TTS_VOICE` | `verse` | Voice personality (alloy, echo, fable, onyx, nova, shimmer, etc.) |
| `VOICE_TEMPERATURE` | `0.8` | Response creativity (0.0-1.0) |
| `VOICE_VAD_MODE` | `client` | Voice activity detection mode |
| `VOICE_VAD_EAGERNESS` | `auto` | How quickly to detect speech end |
| `DEFAULT_VOICE_LANG` | `ka` | Default language code (ISO 639-1) |

### Feature Flags

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_DEMO_MODE` | `1` | Enable demo data and features |
| `NEXT_PUBLIC_ENABLE_GEMINI` | `0` | Enable Gemini AI features |
| `NEXT_PUBLIC_VOICE_PROVIDER` | `openai` | Voice provider: `openai` or `gemini` |

### Chat Retention

| Variable | Default | Description |
|----------|---------|-------------|
| `CHAT_RETENTION_DAYS` | `30` | Days to keep chat history |

---

## Development vs Production

### Development Environment

```bash
# .env.local for development
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=1

# Use local database or Supabase free tier
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lumina

# Debug mode (optional)
DEBUG=1
```

**Characteristics:**
- ✅ Dev fallback for `NEXTAUTH_SECRET` exists (not recommended to rely on)
- ✅ Detailed error messages shown
- ✅ Hot reloading enabled
- ⚠️ Slower performance

### Production Environment

```bash
# Required in production
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-strong-secret>
LUMINA_REALTIME_PRESHARED_SECRET=<generate-strong-secret>

# Production database
DATABASE_URL=<your-production-db-url>
DIRECT_URL=<your-production-direct-url>

# Security
NEXT_PUBLIC_DEMO_MODE=0
```

**Required Checklist:**
- [ ] `NEXTAUTH_SECRET` is set to a strong random value
- [ ] `LUMINA_REALTIME_PRESHARED_SECRET` is set
- [ ] `NEXTAUTH_URL` matches your actual domain
- [ ] All API keys are production keys (not test/development)
- [ ] Database is production database
- [ ] `NODE_ENV` is set to `production`
- [ ] `.env.local` is in `.gitignore`

---

## Security Best Practices

### 1. Never Commit Secrets

```bash
# Ensure .env.local is in .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
```

### 2. Use Different Keys for Different Environments

- Development: Use test/sandbox keys
- Staging: Use separate project keys
- Production: Use production keys only

### 3. Restrict API Keys

**Google Maps:**
- Restrict by HTTP referrer
- Restrict by API (only enable needed APIs)

**OpenAI:**
- Set usage limits
- Monitor usage dashboard
- Rotate keys periodically

**Supabase:**
- Never expose `service_role` key in client code
- Use Row Level Security (RLS) policies
- Enable database backups

### 4. Environment Variable Naming

- **Public** (client-side): Prefix with `NEXT_PUBLIC_`
- **Private** (server-only): No prefix

**Example:**
```bash
# Client can access this
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxx

# Client CANNOT access this
OPENAI_API_KEY=xxx
```

### 5. Secret Rotation

Rotate secrets periodically:
- API keys: Every 90 days
- Service accounts: Every 180 days
- NextAuth secrets: Can rotate on each deployment

### 6. Credential File Permissions

For `GOOGLE_APPLICATION_CREDENTIALS`:
```bash
# Set restrictive permissions
chmod 600 /path/to/service-account-key.json

# Never commit to git
echo "*.json" >> .gitignore  # If in project directory
```

---

## Troubleshooting

### Common Issues

#### "Invalid API Key" Errors

**OpenAI:**
- Verify key is copied completely (starts with `sk-`)
- Check account has billing enabled
- Verify Realtime API access is granted

**Google Maps:**
- Check API key restrictions
- Verify required APIs are enabled
- Check billing is enabled on Google Cloud project

**Supabase:**
- Verify URL format: `https://xxx.supabase.co`
- Use `service_role` key (not `anon` key) for admin operations
- Check network connectivity to Supabase

#### "Authentication Failed" Errors

**NextAuth:**
- Ensure `NEXTAUTH_SECRET` is set in production
- Verify `NEXTAUTH_URL` matches your actual URL
- Check cookies are being set (not blocked by browser)

#### Database Connection Issues

```bash
# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT 1;"

# Check Prisma connection
npx prisma db pull
```

#### Voice AI Not Working

1. Check browser console for WebRTC errors
2. Verify `OPENAI_API_KEY` has Realtime API access
3. Check TURN server configuration if behind firewall
4. Verify HTTPS in production (required for microphone access)

### Getting Help

1. Check application logs:
   ```bash
   # Development
   npm run dev
   
   # View server logs
   journalctl -u your-app-service  # Linux systemd
   ```

2. Enable debug mode:
   ```bash
   DEBUG=* npm run dev
   ```

3. Verify environment variables are loaded:
   ```bash
   # Add to any API route temporarily
   console.log('ENV CHECK:', {
     hasOpenAI: !!process.env.OPENAI_API_KEY,
     hasDB: !!process.env.DATABASE_URL,
     nodeEnv: process.env.NODE_ENV,
   });
   ```

---

## Complete Example: Local Development Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd lumina-estate
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Edit .env.local with your keys
# (see sections above for how to get each key)

# 4. Set up database
# Option A: Local PostgreSQL
brew install postgresql@15  # macOS
# or
sudo apt-get install postgresql  # Ubuntu

# Create database
createdb lumina

# Option B: Supabase
# Just use the connection strings from Supabase dashboard

# 5. Run migrations
npx prisma migrate dev

# 6. Start development server
npm run dev

# 7. (Optional) Start Gemini Live proxy for Gemini voice
npm run live-proxy
```

---

## Environment Variable Reference Table

| Variable | Required | Client | Server | Default |
|----------|----------|--------|--------|---------|
| `DATABASE_URL` | ✅ | ❌ | ✅ | - |
| `DIRECT_URL` | ✅ | ❌ | ✅ | - |
| `NEXTAUTH_URL` | ✅ | ❌ | ✅ | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | ✅* | ❌ | ✅ | dev fallback |
| `OPENAI_API_KEY` | ✅** | ❌ | ✅ | - |
| `VOICE_MODEL` | ✅** | ❌ | ✅ | `gpt-4o-realtime-preview-2024-12-17` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ | ✅ | ✅ | - |
| `GOOGLE_MAPS_API_KEY` | ✅ | ❌ | ✅ | - |
| `SUPABASE_URL` | ✅ | ❌ | ✅ | - |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ | ✅ | - |
| `SUPABASE_ANON_KEY` | ✅ | ❌ | ✅ | - |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ✅ | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ | - |
| `GCP_PROJECT_ID` | ✅*** | ❌ | ✅ | - |
| `GOOGLE_APPLICATION_CREDENTIALS` | ✅*** | ❌ | ✅ | - |
| `LUMINA_REALTIME_PRESHARED_SECRET` | ✅**** | ❌ | ✅ | - |

*Required in production only  
**Required for voice features  
***Required for Gemini voice  
****Required for production proxy endpoints

---

## Additional Resources

### Authentication
- [NextAuth.js Documentation](https://next-auth.js.org/configuration/options)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Supabase Row Level Security (RLS)](https://supabase.com/docs/guides/database/postgres/row-level-security)

### AI & Voice
- [OpenAI Realtime API Guide](https://platform.openai.com/docs/guides/realtime)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)

### Maps & Database
- [Google Maps Platform Docs](https://developers.google.com/maps/documentation)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Connection Guide](https://www.prisma.io/docs/orm/overview/databases/postgresql)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres)
