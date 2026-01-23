'use client';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

import { firebaseApp, auth, db, FIREBASE_AUTH_DISABLED } from '@/lib/firebase/client';

// Backwards compatible exports:
export { firebaseApp, auth, db };

export function getSdks(): {
  firebaseApp?: FirebaseApp;
  auth?: Auth;
  db?: Firestore;
  disabled: boolean;
} {
  return {
    firebaseApp,
    auth,
    db,
    disabled: FIREBASE_AUTH_DISABLED,
  };
}
