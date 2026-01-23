
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';

const enableFirebaseAuth = process.env.NEXT_PUBLIC_ENABLE_FIREBASE_AUTH === 'true';
const hasFirebaseConfig =
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
  !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
  !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// Initialize Firebase only when config is complete to avoid broken auth instances.
const app = hasFirebaseConfig
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : undefined;

export const FIREBASE_AUTH_DISABLED = !enableFirebaseAuth || !hasFirebaseConfig;

if (enableFirebaseAuth && !hasFirebaseConfig && process.env.NODE_ENV !== 'production') {
  console.warn('[firebase] Auth enabled but NEXT_PUBLIC_FIREBASE_* config is incomplete. Auth is disabled.');
}

const auth = !FIREBASE_AUTH_DISABLED && app ? getAuth(app) : undefined;

export { app, auth };
