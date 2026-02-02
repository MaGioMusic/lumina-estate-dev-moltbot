import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../logger';

let cached:
  | ReturnType<typeof createClient>
  | null = null;

function extractHostFromEnvLine(value: string): string | null {
  try {
    return new URL(value).hostname;
  } catch {
    return null;
  }
}

function debugEnvSupabaseUrlSource() {
  if (process.env.NODE_ENV === 'production') return;
  try {
    const cwd = process.cwd();
    const candidates = ['.env.local', '.env'];
    for (const filename of candidates) {
      const p = path.join(cwd, filename);
      if (!fs.existsSync(p)) continue;
      const content = fs.readFileSync(p, 'utf8');
      const match = content.match(/^SUPABASE_URL\s*=\s*(.+)\s*$/m);
      if (!match) continue;
      const raw = match[1]!.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      const host = extractHostFromEnvLine(raw);
      logger.log(`[supabase/admin] SUPABASE_URL found in ${filename}:`, host ?? '(invalid url)');
      return;
    }
    logger.log('[supabase/admin] SUPABASE_URL not found in .env.local or .env (using process.env)');
  } catch {
    // ignore
  }
}

function base64UrlDecode(input: string): string {
  // base64url -> base64
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf8');
}

function deriveSupabaseUrlFromJwtIssuer(serviceRoleKey: string): string | null {
  // Supabase keys are JWTs; payload.iss typically looks like:
  // "https://<project-ref>.supabase.co/auth/v1"
  const parts = serviceRoleKey.split('.');
  if (parts.length < 2) return null;

  try {
    const payloadJson = base64UrlDecode(parts[1]!);
    const payload = JSON.parse(payloadJson) as { iss?: string; ref?: string };

    // Preferred: issuer is a full URL
    const iss = payload.iss;
    if (iss) {
      try {
        const issUrl = new URL(iss);
        if (issUrl.hostname.endsWith('supabase.co')) return issUrl.origin;
      } catch {
        // ignore
      }
    }

    // Fallback: some Supabase JWTs include "ref" (project ref)
    if (payload.ref && /^[a-z0-9]{12,}$/.test(payload.ref)) {
      return `https://${payload.ref}.supabase.co`;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validates environment variables for Supabase admin client.
 * Throws descriptive errors if configuration is invalid.
 */
function validateSupabaseEnv(): { url: string; serviceRoleKey: string } {
  const rawUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Validate service role key
  if (!serviceRoleKey) {
    throw new Error(
      'Supabase admin configuration error: SUPABASE_SERVICE_ROLE_KEY is not set. ' +
      'This environment variable is required for server-side Supabase operations.'
    );
  }

  // Quick sanity check: Supabase keys are JWTs (3 dot-separated parts)
  if (serviceRoleKey.split('.').length < 3) {
    throw new Error(
      'Supabase admin configuration error: SUPABASE_SERVICE_ROLE_KEY appears to be invalid. ' +
      'Expected a JWT format (3 dot-separated parts). ' +
      'Ensure you are using the full "service_role" key from your Supabase project settings.'
    );
  }

  // Check for placeholder values in production
  const isPlaceholderUrl = !!rawUrl && (
    rawUrl.toLowerCase().includes('your_project_ref') ||
    rawUrl.toLowerCase().includes('localhost') && process.env.NODE_ENV === 'production'
  );

  if (process.env.NODE_ENV === 'production' && isPlaceholderUrl) {
    throw new Error(
      'Supabase admin configuration error: SUPABASE_URL contains a placeholder value in production. ' +
      'Set the actual Supabase project URL in your production environment.'
    );
  }

  // Determine the URL to use
  let url: string | null = null;

  if (rawUrl && !isPlaceholderUrl) {
    url = rawUrl;
  } else {
    // Try to derive from JWT issuer
    url = deriveSupabaseUrlFromJwtIssuer(serviceRoleKey);
  }

  if (!url) {
    throw new Error(
      'Supabase admin configuration error: Unable to determine Supabase URL. ' +
      'Set SUPABASE_URL environment variable with your Supabase project URL ' +
      '(e.g., https://your-project-ref.supabase.co)'
    );
  }

  // Validate URL format
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(
      `Supabase admin configuration error: SUPABASE_URL "${url}" is not a valid URL`
    );
  }

  // Security: Only allow supabase.co domains
  if (!parsedUrl.hostname.endsWith('.supabase.co')) {
    throw new Error(
      `Supabase admin configuration error: SUPABASE_URL host must end with ".supabase.co" ` +
      `(got "${parsedUrl.hostname}"). Using non-Supabase URLs is not supported for security reasons.`
    );
  }

  // Validate HTTPS in production
  if (process.env.NODE_ENV === 'production' && parsedUrl.protocol !== 'https:') {
    throw new Error(
      'Supabase admin configuration error: HTTPS is required for Supabase URL in production'
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    // Safe to log hostname in development; never log service role key
    logger.log('[supabase/admin] Using Supabase host:', parsedUrl.hostname);
  }

  return { url, serviceRoleKey };
}

/**
 * Supabase admin client (service role) for server-side only usage.
 *
 * IMPORTANT:
 * - Never import this from client components.
 * - Requires env vars:
 *   - SUPABASE_URL (optional if derivable from SUPABASE_SERVICE_ROLE_KEY)
 *   - SUPABASE_SERVICE_ROLE_KEY (required)
 * 
 * SECURITY:
 * - URL must end with .supabase.co (prevents connecting to malicious endpoints)
 * - Service role key is validated to be a proper JWT
 * - HTTPS enforced in production
 * - No hardcoded fallbacks - environment variables are strictly required
 * 
 * @throws Error if environment variables are missing or invalid
 */
export function getSupabaseAdmin() {
  if (cached) return cached;

  const { url, serviceRoleKey } = validateSupabaseEnv();

  try {
    cached = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  } catch (error) {
    throw new Error(
      `Failed to create Supabase admin client: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return cached;
}
