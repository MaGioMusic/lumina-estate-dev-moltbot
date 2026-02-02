/**
 * CSRF Protection Module for Lumina Estate - Server-Only Functions
 * 
 * This file contains server-only functions that use 'next/headers'.
 * Import this only in server components, API routes, and server utilities.
 * 
 * For client components, use the functions from csrf.ts instead.
 */

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Re-export shared constants and functions from csrf.ts
export { 
  CSRF_COOKIE_NAME, 
  CSRF_HEADER_NAME, 
  generateCsrfToken, 
  generateCsrfTokenPair,
  CsrfError,
  requiresCsrfProtection 
} from './csrf';

import { 
  CSRF_COOKIE_NAME, 
  CSRF_HEADER_NAME, 
  generateCsrfToken, 
  CsrfError 
} from './csrf';

// ============================================================================
// Constants
// ============================================================================

const CSRF_TOKEN_LENGTH = 32; // bytes
const CSRF_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

// ============================================================================
// Cookie Management (Server-side)
// ============================================================================

/**
 * Set the CSRF token cookie
 * Uses httpOnly, secure, and SameSite=Lax for maximum security
 */
export async function setCsrfCookie(response: NextResponse, secretToken: string): Promise<void> {
  const cookieStore = await cookies();
  
  // In production, use secure cookies
  const isSecure = process.env.NODE_ENV === 'production';
  
  cookieStore.set(CSRF_COOKIE_NAME, secretToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: CSRF_COOKIE_MAX_AGE,
    path: '/',
    // No domain restriction - cookie is valid for current domain only
  });
}

/**
 * Get the CSRF token from the cookie
 */
export async function getCsrfCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value;
}

/**
 * Clear the CSRF cookie (used on logout)
 */
export async function clearCsrfCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CSRF_COOKIE_NAME);
}

// ============================================================================
// Token Validation (Server-side)
// ============================================================================

/**
 * Extract CSRF token from request header
 */
export function getCsrfTokenFromHeader(request: NextRequest): string | null {
  return request.headers.get(CSRF_HEADER_NAME);
}

/**
 * Validate the CSRF token from the request
 * Returns true if valid, false otherwise
 */
export async function validateCsrfToken(request: NextRequest): Promise<boolean> {
  // Get the token from the header
  const headerToken = getCsrfTokenFromHeader(request);
  
  if (!headerToken) {
    console.warn('[CSRF] Missing CSRF token in request header');
    return false;
  }
  
  // Get the secret token from the cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  
  if (!cookieToken) {
    console.warn('[CSRF] Missing CSRF token cookie');
    return false;
  }
  
  // Use timing-safe comparison to prevent timing attacks
  try {
    const headerBuffer = Buffer.from(headerToken, 'base64url');
    const cookieBuffer = Buffer.from(cookieToken, 'base64url');
    
    // Constant-time comparison
    return headerBuffer.length === cookieBuffer.length && 
           crypto.timingSafeEqual(headerBuffer, cookieBuffer);
  } catch {
    // Invalid base64 or length mismatch
    return false;
  }
}

/**
 * Middleware-style CSRF validation for API routes
 * Throws an error if validation fails
 */
export async function requireCsrfToken(request: NextRequest): Promise<void> {
  const isValid = await validateCsrfToken(request);
  
  if (!isValid) {
    throw new CsrfError('Invalid or missing CSRF token');
  }
}
