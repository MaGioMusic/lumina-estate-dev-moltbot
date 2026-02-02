import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { AccountRole } from '@prisma/client';
import type { NextAuthOptions, Session, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

import { prisma } from '../prisma';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

interface LuminaUser extends User {
  id: string;
  accountRole: AccountRole;
}

/**
 * Validates that NEXTAUTH_SECRET is properly configured.
 * Throws in production if secret is missing or insecure.
 */
const validateNextAuthSecret = (): string => {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    const error = new Error(
      'NEXTAUTH_SECRET is required. Set a strong secret (min 32 chars) in your environment variables.'
    );
    
    if (process.env.NODE_ENV === 'production') {
      console.error('[auth] FATAL: NEXTAUTH_SECRET is not set in production');
      throw error;
    }
    
    // In development, warn but don't crash
    console.warn('[auth] WARNING: NEXTAUTH_SECRET not set. Using a temporary secret for development only.');
    // Generate a random temporary secret for dev (changes on each restart)
    return `temp-dev-secret-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  // Validate secret strength
  if (secret.length < 32) {
    const error = new Error(
      `NEXTAUTH_SECRET must be at least 32 characters long (currently ${secret.length}). ` +
      'Generate a secure secret with: openssl rand -base64 32'
    );
    console.error('[auth] FATAL: NEXTAUTH_SECRET is too short');
    throw error;
  }

  // Check for common weak secrets
  const lower = secret.toLowerCase();
  const weakPatterns = [
    'changeme', 'placeholder', 'example', 'default', 'secret',
    'password', '123456', 'qwerty', 'nextauth', 'lumina'
  ];
  
  if (weakPatterns.some(pattern => lower.includes(pattern))) {
    console.error('[auth] WARNING: NEXTAUTH_SECRET appears to be a placeholder or weak value');
  }

  return secret;
};

// Validate secret at module load - will throw in production if invalid
const resolvedSecret = validateNextAuthSecret();

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login on error
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: normalizeEmail(credentials.email) },
          });

          if (!user || !user.passwordHash) {
            // Use constant time to prevent user enumeration
            await compare(credentials.password, '$2a$10$dummy.hash.to.prevent.timing.attacks.on.user.enum');
            return null;
          }

          const passwordMatches = await compare(credentials.password, user.passwordHash);
          if (!passwordMatches) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            accountRole: user.accountRole,
          };
        } catch (error) {
          console.error('[auth/authorize] Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        if (session.user && token?.sub) {
          const sessionUser = session.user as any;
          sessionUser.id = token.sub;
          sessionUser.accountRole = (token.accountRole as AccountRole) ?? 'USER';
        }
        return session;
      } catch (error) {
        console.error('[auth/session] Error in session callback:', error);
        return session;
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          const typedUser = user as LuminaUser;
          token.sub = typedUser.id;
          token.accountRole = (typedUser.accountRole as AccountRole) ?? 'USER';
        }
        return token;
      } catch (error) {
        console.error('[auth/jwt] Error in JWT callback:', error);
        return token;
      }
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'strict', // Changed from 'lax' to 'strict' for better security
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Add additional protection in production
        ...(process.env.NODE_ENV === 'production' && {
          domain: undefined, // Let browser set default (host-only cookie)
        }),
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: resolvedSecret,
  logger: {
    error(code, metadata) {
      console.error('NextAuth error:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth warning:', code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('NextAuth debug:', code, metadata);
      }
    },
  },
  // Enable events for security logging
  events: {
    async signIn(message) {
      console.log('[auth] User signed in:', message.user.email);
    },
    async signOut(message) {
      console.log('[auth] User signed out:', message.token?.email || 'unknown');
    },
    async createUser(message) {
      console.log('[auth] New user created:', message.user.email);
    },
  },
};

// Backwards-compatible alias for existing imports
export const authOptions = nextAuthOptions;
