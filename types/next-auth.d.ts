import type { AccountRole } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      accountRole: AccountRole;
    } & DefaultSession['user'];
  }

  interface User {
    accountRole: AccountRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accountRole?: AccountRole;
  }
}

