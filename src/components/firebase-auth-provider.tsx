'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuthSafe, FIREBASE_AUTH_DISABLED } from '@/lib/firebase/client';
import type { User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null | undefined;
  loading: boolean;
  error?: Error;
  isAuthenticated: boolean;
  isAuthDisabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = getAuthSafe();
  const [user, loading, error] = auth ? useAuthState(auth) : [null, false, undefined];

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user && !loading,
    isAuthDisabled: FIREBASE_AUTH_DISABLED,
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
