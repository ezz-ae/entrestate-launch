'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

type AuthUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  roles?: string[];
};

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error?: Error;
  isAuthenticated: boolean;
  isAuthDisabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = session?.user
    ? {
        uid: session.user.id,
        email: session.user.email ?? null,
        displayName: session.user.name ?? null,
        roles: session.user.role ? [session.user.role] : undefined,
      }
    : null;

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isAuthDisabled: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};
