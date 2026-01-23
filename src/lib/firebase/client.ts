'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from '@/lib/firebase/config';
import { envBool } from '@/lib/env';

const enableFirebaseAuth = envBool(
  'NEXT_PUBLIC_ENABLE_FIREBASE_AUTH',
  process.env.NODE_ENV === 'production'
);
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || '';
const apiKeyLooksValid = /^AIza[0-9A-Za-z_-]{35}$/.test(apiKey);

const hasFirebaseConfig =
  apiKeyLooksValid &&
  !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
  !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
  !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

export const FIREBASE_CONFIG_READY = hasFirebaseConfig;

if (enableFirebaseAuth && !hasFirebaseConfig && process.env.NODE_ENV !== 'production') {
  const reason = apiKeyLooksValid
    ? 'NEXT_PUBLIC_FIREBASE_* config is incomplete'
    : 'NEXT_PUBLIC_FIREBASE_API_KEY looks invalid';
  console.warn(`[firebase] Auth enabled but ${reason}. Auth is disabled.`);
}

let firebaseApp: FirebaseApp | undefined;
if (hasFirebaseConfig) {
  try {
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (error) {
    console.warn('[firebase] Failed to initialize Firebase client. Auth is disabled.', error);
  }
}

let authInitFailed = false;
let auth: Auth | undefined;
if (enableFirebaseAuth && firebaseApp) {
  try {
    auth = getAuth(firebaseApp);
  } catch (error) {
    authInitFailed = true;
    console.warn('[firebase] Failed to initialize Firebase auth. Auth is disabled.', error);
  }
}

export const FIREBASE_AUTH_DISABLED =
  !enableFirebaseAuth || !FIREBASE_CONFIG_READY || !firebaseApp || authInitFailed;

let db: Firestore | undefined;
if (firebaseApp) {
  try {
    db = getFirestore(firebaseApp);
  } catch (error) {
    console.warn('[firebase] Failed to initialize Firestore client.', error);
  }
}

export { firebaseApp, auth, db };

export function getAuthSafe(): Auth | undefined {
  return auth;
}
