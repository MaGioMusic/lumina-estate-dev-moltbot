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

// Image type declarations for static imports
declare module '@/../public/images/photos/Roadmap Photos/Lumina App Preview.png' {
  const content: import('next/image').StaticImageData;
  export default content;
}

declare module '@/../public/images/photos/Roadmap Photos/Advanced Analytics.png' {
  const content: import('next/image').StaticImageData;
  export default content;
}

