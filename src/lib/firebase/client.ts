'use client';

import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { FIREBASE_AUTH_ENABLED, getFirebaseConfig } from '@/lib/firebase/config';

console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
console.log('NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

const enableFirebaseAuth = FIREBASE_AUTH_ENABLED;
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || '';
const apiKeyLooksValid = /^AIza[0-9A-Za-z_-]{35}$/.test(apiKey);

const hasFirebaseEnvConfig =
  apiKeyLooksValid &&
  !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
  !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
  !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

console.log('hasFirebaseEnvConfig:', hasFirebaseEnvConfig);

export const FIREBASE_CONFIG_READY = enableFirebaseAuth && hasFirebaseEnvConfig;

if (enableFirebaseAuth && !hasFirebaseEnvConfig && process.env.NODE_ENV !== 'production') {
  const reason = apiKeyLooksValid
    ? 'NEXT_PUBLIC_FIREBASE_* config is incomplete'
    : 'NEXT_PUBLIC_FIREBASE_API_KEY looks invalid';
  console.warn(`[firebase] Auth enabled but ${reason}. Auth is disabled.`);
}

let firebaseApp: FirebaseApp | null = null;
const firebaseInitConfig: FirebaseOptions | null =
  enableFirebaseAuth && hasFirebaseEnvConfig ? getFirebaseConfig() : null;

if (firebaseInitConfig) {
  try {
    firebaseApp = !getApps().length ? initializeApp(firebaseInitConfig) : getApp();
  } catch (error) {
    console.warn('[firebase] Failed to initialize Firebase client.', error);
    firebaseApp = null;
  }
}

let authInitFailed = false;
let auth: Auth | null = null;
if (enableFirebaseAuth && firebaseApp) {
  try {
    auth = getAuth(firebaseApp);
  } catch (error) {
    authInitFailed = true;
    console.warn('[firebase] Failed to initialize Firebase auth. Auth is disabled.', error);
    auth = null;
  }
}

export const FIREBASE_AUTH_DISABLED =
  !enableFirebaseAuth || !FIREBASE_CONFIG_READY || !firebaseApp || authInitFailed;

let db: Firestore | null = null;
if (firebaseApp) {
  try {
    db = getFirestore(firebaseApp);
  } catch (error) {
    console.warn('[firebase] Failed to initialize Firestore client.', error);
    db = null;
  }
}

export { firebaseApp, auth, db };

export function getAuthSafe(): Auth | null {
  if (FIREBASE_AUTH_DISABLED) return null;
  return auth;
}

export function getDbSafe(): Firestore | null {
  if (FIREBASE_AUTH_DISABLED) return null;
  return db;
}
