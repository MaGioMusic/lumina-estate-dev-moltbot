/**
 * CSRF Token API Route
 * 
 * GET /api/csrf - Returns a new CSRF token
 * - Sets the httpOnly cookie with the secret token
 * - Returns the public token to be used in X-CSRF-Token header
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { nextAuthOptions as authOptions } from '@/lib/auth/nextAuthOptions';
import { 
  generateCsrfToken,
  setCsrfCookie,
  CsrfError 
} from '@/lib/security/csrf-server';
import { enforceRateLimit } from '@/lib/security/rateLimiter';
import { logger } from '@/lib/logger';

/**
 * GET /api/csrf
 * Generate and return a new CSRF token
 */
export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting to prevent abuse
    enforceRateLimit(`csrf:get:${session.user.id}`, {
      limit: 10,
      windowMs: 60_000, // 1 minute
      feature: 'CSRF token generation'
    });

    // Generate a new CSRF token
    const token = generateCsrfToken();

    // Create response
    const response = NextResponse.json({
      success: true,
      token,
    });

    // Set the httpOnly cookie with the same token
    // The client will send this token in the X-CSRF-Token header
    await setCsrfCookie(response, token);

    return response;
  } catch (error) {
    if (error instanceof CsrfError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    logger.error('[CSRF API] Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/csrf/validate
 * Validate a CSRF token (for testing/debugging)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { validateCsrfToken, getCsrfTokenFromHeader } = await import('@/lib/security/csrf-server');
    
    const isValid = await validateCsrfToken(req);
    const headerToken = getCsrfTokenFromHeader(req);

    return NextResponse.json({
      success: true,
      valid: isValid,
      hasHeader: !!headerToken,
    });
  } catch (error) {
    logger.error('[CSRF API] Error validating token:', error);
    return NextResponse.json(
      { error: 'Failed to validate CSRF token' },
      { status: 500 }
    );
  }
}
