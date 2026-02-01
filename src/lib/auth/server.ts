import type { NextRequest } from 'next/server';
import type { UserRole } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { ForbiddenError, HttpError } from '@/lib/repo/errors';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  mode: 'session';
}

export interface RequireUserOptions {
  allowedRoles?: UserRole[];
}

/**
 * Resolve the current user from the incoming request using NextAuth JWT session.
 *
 * Production-ready: Validates JWT token and retrieves user from database.
 * Falls back to null only if no valid session exists.
 */
export const getCurrentUser = async (request: NextRequest): Promise<AuthenticatedUser | null> => {
  try {
    // Extract JWT token from the request using NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub) {
      return null;
    }

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: token.sub },
      select: { id: true, accountRole: true },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      role: user.accountRole as UserRole,
      mode: 'session',
    };
  } catch (error) {
    console.error('[auth/server] Error getting current user:', error);
    return null;
  }
};

export const requireUser = async (
  request: NextRequest,
  options?: RequireUserOptions,
): Promise<AuthenticatedUser> => {
  const user = await getCurrentUser(request);
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
