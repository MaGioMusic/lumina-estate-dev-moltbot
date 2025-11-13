import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import { ForbiddenError, HttpError } from '@/lib/repo/errors';

export interface UserContext {
  id: string;
  role: UserRole;
}

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

export function requireUser(request: NextRequest, allowedRoles?: UserRole[]): UserContext {
  const userId = request.headers.get('x-user-id');
  const roleHeader = request.headers.get('x-user-role') as UserRole | null;

  if (!userId) {
    throw new HttpError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const role: UserRole = roleHeader ?? 'client';

  if (allowedRoles && !allowedRoles.includes(role)) {
    throw new ForbiddenError();
  }

  return { id: userId, role };
}

export function getOptionalUser(request: NextRequest): UserContext | null {
  const userId = request.headers.get('x-user-id');
  if (!userId) return null;
  const roleHeader = request.headers.get('x-user-role') as UserRole | null;
  return { id: userId, role: roleHeader ?? 'client' };
}
