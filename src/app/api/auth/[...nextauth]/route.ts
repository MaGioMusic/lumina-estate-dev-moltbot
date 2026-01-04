import NextAuth from 'next-auth';

import { nextAuthOptions } from '@/lib/auth/nextAuthOptions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };

