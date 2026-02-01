/**
 * CSRF Protection Module for Lumina Estate
 * 
 * Implements Double Submit Cookie pattern for CSRF protection:
 * - Server sets a random CSRF token in an httpOnly cookie
 * - Client must send the same token in X-CSRF-Token header for mutations
 * - Server validates the token matches on mutation requests
 * 
 * Security features:
 * - Cryptographically secure random token generation
 * - HttpOnly cookie storage (not accessible via JavaScript)
 * - SameSite=Lax cookie attribute
 - - Token rotation on session changes
 */

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ============================================================================
// Constants
// ============================================================================

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32; // bytes
const CSRF_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

// ============================================================================
// Token Generation
// ============================================================================

/**
 * Generate a cryptographically secure random CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('base64url');
}

/**
 * Generate a CSRF token and hash for cookie storage
 * The token is split into a public part (sent in header) and secret part (stored in cookie)
 */
export function generateCsrfTokenPair(): { publicToken: string; secretToken: string } {
  const publicToken = generateCsrfToken();
  const secretToken = generateCsrfToken();
  return { publicToken, secretToken };
}

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

// ============================================================================
// CSRF Error Class
// ============================================================================

export class CsrfError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string = 'CSRF validation failed') {
    super(message);
    this.name = 'CsrfError';
    this.statusCode = 403;
    this.code = 'CSRF_INVALID';
  }
}

// ============================================================================
// Client-side Token Management
// ============================================================================

/**
 * Get the CSRF token for client-side use
 * This retrieves the token from the cookie and returns it for use in headers
 * Note: This only works if the cookie is not httpOnly, which defeats the purpose
 * 
 * Instead, we use a different approach:
 * - Server provides the token via a dedicated endpoint or embeds it in the page
 * - Client stores it in memory (not localStorage) and sends it in headers
 */

// Store for the CSRF token in memory (not localStorage for security)
let csrfToken: string | null = null;

/**
 * Set the CSRF token in memory (called after fetching from server)
 */
export function setClientCsrfToken(token: string): void {
  csrfToken = token;
}

/**
 * Get the CSRF token from memory
 */
export function getClientCsrfToken(): string | null {
  return csrfToken;
}

/**
 * Clear the CSRF token from memory
 */
export function clearClientCsrfToken(): void {
  csrfToken = null;
}

/**
 * Fetch a new CSRF token from the server
 */
export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/csrf', {
      method: 'GET',
      credentials: 'include', // Important: include cookies
    });
    
    if (!response.ok) {
      console.error('[CSRF] Failed to fetch CSRF token:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.token) {
      setClientCsrfToken(data.token);
      return data.token;
    }
    
    return null;
  } catch (error) {
    console.error('[CSRF] Error fetching CSRF token:', error);
    return null;
  }
}

// ============================================================================
// HTTP Method Helpers
// ============================================================================

/**
 * Check if an HTTP method requires CSRF protection
 * Only mutations (POST, PUT, PATCH, DELETE) need CSRF tokens
 */
export function requiresCsrfProtection(method: string): boolean {
  const protectedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  return protectedMethods.includes(method.toUpperCase());
}

// ============================================================================
// Re-exports
// ============================================================================

export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };
