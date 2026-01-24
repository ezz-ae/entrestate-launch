'use client';

import type { ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import {
  firebaseApp,
  FIREBASE_AUTH_DISABLED,
  getAuthSafe,
  getDbSafe,
} from '@/lib/firebase/client';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseAuth = getAuthSafe();
  const firestore = getDbSafe();

  if (!firebaseApp || FIREBASE_AUTH_DISABLED || !firebaseAuth || !firestore) {
    return <>{children}</>;
  }

  return (
    <FirebaseProvider firebaseApp={firebaseApp} auth={firebaseAuth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
