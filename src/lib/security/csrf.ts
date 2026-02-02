/**
 * CSRF Protection Module for Lumina Estate - Client-Safe Version
 * 
 * This file contains only client-safe functions.
 * Server-only functions have been moved to csrf-server.ts
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
 * - Token rotation on session changes
 */

import { NextRequest } from 'next/server';
import crypto from 'crypto';

// ============================================================================
// Constants
// ============================================================================

export const CSRF_COOKIE_NAME = 'csrf_token';
export const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32; // bytes

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
// Server-side functions (re-exported for convenience)
// ============================================================================
// 
// NOTE: The following functions import 'next/headers' which is server-only.
// They are re-exported here for backward compatibility, but when used in 
// server components/API routes, they will work correctly.
//
// For client components, only use the client-side functions above.

// These are type-only exports to maintain compatibility
// The actual implementations are in csrf-server.ts and should be imported from there
// for server-side code to avoid bundling issues.

export type { };
