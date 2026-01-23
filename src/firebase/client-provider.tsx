'use client';

import type { ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { firebaseApp, auth, db } from '@/lib/firebase/client';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  if (!firebaseApp || !auth || !db) {
    return <>{children}</>;
  }

  return (
    <FirebaseProvider firebaseApp={firebaseApp} auth={auth} firestore={db}>
      {children}
    </FirebaseProvider>
  );
}
