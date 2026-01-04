'use server';

import { getServerSession } from 'next-auth';

import { nextAuthOptions } from '@/lib/auth/nextAuthOptions';

export async function getCurrentUser() {
  const session = await getServerSession(nextAuthOptions);
  return session?.user ?? null;
}

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

