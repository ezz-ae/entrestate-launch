import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    role?: string;
    tenantId?: string;
    subscriptionStatus?: string;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: string;
      tenantId: string;
      roles?: string[];
      subscriptionStatus?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    tenantId?: string;
    roles?: string[];
    subscriptionStatus?: string;
  }
}
