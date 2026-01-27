'use client';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

import {
  firebaseApp,
  FIREBASE_AUTH_DISABLED,
  getAuthSafe,
  getDbSafe,
} from '@/lib/firebase/client';

const firebaseAuth = getAuthSafe();
const firestoreInstance = getDbSafe();

export { firebaseApp, FIREBASE_AUTH_DISABLED };
export { firebaseAuth as auth, firestoreInstance as db };

export function getSdks(): {
  firebaseApp?: FirebaseApp | null;
  auth?: Auth | null;
  db?: Firestore | null;
  disabled: boolean;
} {
  return {
    firebaseApp,
    auth: firebaseAuth,
    db: firestoreInstance,
    disabled: FIREBASE_AUTH_DISABLED,
  };
}
