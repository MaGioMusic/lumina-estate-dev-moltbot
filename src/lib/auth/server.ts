import type { NextRequest } from 'next/server';
import type { AccountRole, UserRole } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { nextAuthOptions } from '@/lib/auth/nextAuthOptions';
import { ForbiddenError, HttpError } from '@/lib/repo/errors';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  mode: 'session';
}

export interface RequireUserOptions {
  allowedRoles?: UserRole[];
}

const KNOWN_USER_ROLES: UserRole[] = ['guest', 'client', 'agent', 'investor', 'admin'];

const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && KNOWN_USER_ROLES.includes(value as UserRole);

const mapAccountRoleToUserRole = (accountRole?: AccountRole | null): UserRole | null => {
  switch (accountRole) {
    case 'ADMIN':
    case 'DEVELOPER':
      return 'admin';
    case 'AGENT':
      return 'agent';
    case 'USER':
      return 'client';
    default:
      return null;
  }
};

const ROLE_PRIORITY: Record<UserRole, number> = {
  guest: 0,
  client: 1,
  investor: 2,
  agent: 3,
  admin: 4,
};

const resolveEffectiveRole = (
  role?: UserRole | null,
  accountRole?: AccountRole | null,
): UserRole => {
  const normalized = isUserRole(role) ? role : 'guest';
  const mapped = mapAccountRoleToUserRole(accountRole);
  if (mapped && ROLE_PRIORITY[mapped] > ROLE_PRIORITY[normalized]) {
    return mapped;
  }
  return normalized;
};

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
      secret: nextAuthOptions.secret ?? process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub) {
      return null;
    }

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: token.sub },
      select: { id: true, role: true, accountRole: true },
    });

    if (!user) {
      return null;
    }

    const role = resolveEffectiveRole(user.role, user.accountRole);
    return {
      id: user.id,
      role,
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

  const isAdmin = user.role === 'admin';
  if (options?.allowedRoles && !options.allowedRoles.includes(user.role) && !isAdmin) {
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
