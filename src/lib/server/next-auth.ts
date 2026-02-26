import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/server/db';
import { NEXTAUTH_SECRET } from '@/lib/server/env';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) {
          throw new Error('Missing credentials');
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error('Invalid credentials');
        }
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }
        return {
          id: user.id,
          email: user.email,
          name: user.email,
          role: user.role,
          tenantId: user.tenantId,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  jwt: {
    secret: NEXTAUTH_SECRET,
  },
  secret: NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? token.role;
        token.tenantId = user.tenantId ?? token.tenantId;
        if (user.role) {
          token.roles = [user.role];
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub ?? '',
        role: token.role ?? 'agency_admin',
        tenantId: token.tenantId ?? '',
        roles: token.roles,
      };
      return session;
    },
  },
};
