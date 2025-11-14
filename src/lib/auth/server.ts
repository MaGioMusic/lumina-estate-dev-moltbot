import type { NextRequest } from 'next/server';
import type { UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ForbiddenError, HttpError } from '@/lib/repo/errors';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  mode: 'dev' | 'mock';
}

export interface RequireUserOptions {
  allowedRoles?: UserRole[];
}

/**
 * Resolve the current user from the incoming request.
 *
 * Dev mode permits a small set of mock identities (header/cookie-based).
 * Production currently returns null until Supabase/real auth is wired.
 *
 * TODO: Replace with real session-based auth (Supabase/NextAuth) before production launch.
 */
export const getCurrentUser = (request: NextRequest): AuthenticatedUser | null => {
  const isDev = process.env.NODE_ENV !== 'production';

  if (!isDev) {
    // სანამ რეალურ სესიებს არ დავამატებთ, პროდაქშენში treated as unauthenticated.
    return null;
  }

  const headerUser = request.headers.get('x-lumina-dev-user');
  const cookieUser = request.cookies.get('lumina_dev_token')?.value;
  const userId = headerUser ?? cookieUser ?? null;
  if (!userId) {
    return null;
  }

  const headerRole = request.headers.get('x-lumina-dev-role') as UserRole | null;
  const role = headerRole ?? 'client';

  return {
    id: userId,
    role,
    mode: 'dev',
  };
};

export const requireUser = (
  request: NextRequest,
  options?: RequireUserOptions,
): AuthenticatedUser => {
  const user = getCurrentUser(request);
  if (!user) {
    throw new HttpError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  if (options?.allowedRoles && !options.allowedRoles.includes(user.role)) {
    throw new ForbiddenError();
  }

  return user;
};

export interface ActorContext {
  userId: string;
  agentId: string | null;
  isAdmin: boolean;
}

export const resolveActorContext = async (user: AuthenticatedUser): Promise<ActorContext> => {
  const isAdmin = user.role === 'admin';
  let agentId: string | null = null;
  if (user.role === 'agent') {
    const agent = await prisma.agent.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    agentId = agent?.id ?? null;
  }
  return {
    userId: user.id,
    agentId,
    isAdmin,
  };
};


