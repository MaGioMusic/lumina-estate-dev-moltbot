import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import type { UserRole } from '@prisma/client';
import { HttpError } from '@/lib/repo/errors';

interface GuardResult {
  userId: string;
  role: UserRole;
  mode: 'internal';
  rateLimitKey: string;
}

const getClientIp = (request: NextRequest) =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
  request.headers.get('x-real-ip') ??
  request.headers.get('cf-connecting-ip') ??
  'unknown';

const toRateLimitKey = (identifier: string, request: NextRequest) => {
  const ip = getClientIp(request);
  return `${identifier}:${ip}`;
};

/**
 * Constant-time string comparison to prevent timing attacks.
 * Returns true only if strings have equal length and content.
 */
const matchesSecret = (incoming: string | null, secret: string): boolean => {
  if (!incoming) return false;
  try {
    const a = Buffer.from(incoming);
    const b = Buffer.from(secret);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
};

/**
 * Validates that the secret meets minimum security requirements.
 * Production secrets must be at least 32 characters.
 */
const isValidSecret = (secret: string | undefined): secret is string => {
  if (!secret) return false;
  if (secret.length < 32) return false;
  // Reject obvious placeholder values
  const lower = secret.toLowerCase();
  const placeholders = ['changeme', 'placeholder', 'example', 'default', 'secret'];
  return !placeholders.some(p => lower.includes(p));
};

/**
 * Production-ready guard for realtime/internal endpoints.
 *
 * - Requires a secure pre-shared secret configured via LUMINA_REALTIME_PRESHARED_SECRET
 * - Validates secret using constant-time comparison to prevent timing attacks
 * - Enforces minimum secret length (32+ characters)
 * - Rejects placeholder/weak secrets
 * - Blocks all access if secret is not properly configured
 *
 * @throws HttpError 503 if realtime access is disabled (no secret configured)
 * @throws HttpError 401 if secret is missing, invalid, or doesn't match
 */
export const ensureRealtimeAccess = (request: NextRequest): GuardResult => {
  const secret = process.env.LUMINA_REALTIME_PRESHARED_SECRET;

  if (!isValidSecret(secret)) {
    console.error('[auth/devGuard] LUMINA_REALTIME_PRESHARED_SECRET is not configured or is insecure');
    throw new HttpError(
      'Realtime access disabled - service not properly configured',
      503,
      'REALTIME_DISABLED',
    );
  }

  const provided = request.headers.get('x-lumina-internal-secret');
  if (!matchesSecret(provided, secret)) {
    // Log the attempt for security monitoring (but not the secret itself)
    console.warn('[auth/devGuard] Invalid realtime access attempt from:', getClientIp(request));
    throw new HttpError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  return {
    userId: 'internal-realtime',
    role: 'admin',
    mode: 'internal',
    rateLimitKey: toRateLimitKey('internal-realtime', request),
  };
};
