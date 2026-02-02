import { NextRequest, NextResponse } from 'next/server';
import type { UserRole } from '@prisma/client';
import { HttpError } from '@/lib/repo/errors';
import {
  getCurrentUser as resolveCurrentUser,
  requireUser as coreRequireUser,
  type AuthenticatedUser,
} from '@/lib/auth/server';
import { z } from 'zod';

export function jsonResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function errorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details ?? null,
        },
      },
      { status: error.status }
    );
  }

  console.error('Unhandled API error', error);
  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  );
}

/**
 * SECURITY FIX: Centralized error handler with standardized responses
 */
export function handleApiError(error: unknown): NextResponse {
  // Zod validation errors
  if (error instanceof z.ZodError) {
    // Only expose validation errors in development
    const isDev = process.env.NODE_ENV === 'development';
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        details: isDev ? error.errors : undefined,
      },
      { status: 400 }
    );
  }

  // HTTP errors
  if (error instanceof HttpError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.status }
    );
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: any };
    
    // Handle common Prisma errors
    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'A record with this information already exists' },
        { status: 409 }
      );
    }
    
    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }
  }

  // Generic errors - log but don't expose details
  console.error('API Error:', error);
  return NextResponse.json(
    { success: false, error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

/**
 * Standard success response format
 */
export function successResponse<T>(data: T, statusCode: number = 200): NextResponse {
  return NextResponse.json(
    { success: true, ...data },
    { status: statusCode }
  );
}

export type UserContext = AuthenticatedUser;

export async function requireUser(
  request: NextRequest,
  allowedRoles?: UserRole[],
): Promise<UserContext> {
  return coreRequireUser(request, { allowedRoles });
}

export async function getOptionalUser(request: NextRequest): Promise<UserContext | null> {
  return resolveCurrentUser(request);
}
