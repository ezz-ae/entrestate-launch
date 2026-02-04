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

const sanitizeEnv = (val?: string) => val?.split('#')[0].trim().replace(/^["']|["']$/g, '');

const isDevEnvironment = process.env.NODE_ENV !== 'production';

const enableFirebaseAuth = FIREBASE_AUTH_ENABLED || sanitizeEnv(process.env.NEXT_PUBLIC_ENABLE_FIREBASE_AUTH) === 'true';
const devAuthBypass = sanitizeEnv(process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH_BYPASS) === 'true';

const apiKey = sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) || '';
const apiKeyLooksValid = apiKey.startsWith('AIza') && apiKey.length > 30;

const hasFirebaseEnvConfig =
  apiKeyLooksValid &&
  !!sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) &&
  !!sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) &&
  !!sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) &&
  !!sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) &&
  !!sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

export const FIREBASE_CONFIG_READY = enableFirebaseAuth && hasFirebaseEnvConfig;

if (enableFirebaseAuth && !hasFirebaseEnvConfig && isDevEnvironment && !devAuthBypass) {
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

export const FIREBASE_AUTH_BYPASSED = devAuthBypass && isDevEnvironment;

export const FIREBASE_AUTH_DISABLED =
  FIREBASE_AUTH_BYPASSED || !enableFirebaseAuth || !FIREBASE_CONFIG_READY || !firebaseApp || authInitFailed;

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
