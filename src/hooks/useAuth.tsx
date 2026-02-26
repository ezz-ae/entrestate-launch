'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

type AppUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  image?: string | null;
  photoURL?: string | null;
  roles?: string[];
  mode: 'nextauth';
};

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  error?: string;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function handleCredentialsSignIn(email: string, password: string) {
  const response = await signIn('credentials', {
    email,
    password,
    redirect: false,
  });
  if (!response || response.error) {
    throw new Error(response?.error || 'Authentication failed.');
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const sessionError = (session as { error?: string } | null)?.error ?? undefined;
  const user: AppUser | null = session?.user
    ? {
        uid: session.user.id,
        email: session.user.email ?? null,
        displayName: session.user.name ?? null,
        image: session.user.image ?? null,
        photoURL: session.user.image ?? null,
        roles: session.user.role ? [session.user.role] : undefined,
        mode: 'nextauth',
      }
    : null;

  const logIn = async (email: string, password: string) => {
    await handleCredentialsSignIn(email, password);
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      throw new Error(payload?.error || 'Registration failed.');
    }
    await handleCredentialsSignIn(email, password);
  };

  const logOut = async () => {
    await signOut({ redirect: false });
  };

  const value = useMemo(
    () => ({
      user,
      loading: status === 'loading',
      error: sessionError,
      logIn,
      signUp,
      logOut,
    }),
    [user, status, sessionError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
