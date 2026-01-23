'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from '@/lib/firebase/config';

const enableFirebaseAuth = process.env.NEXT_PUBLIC_ENABLE_FIREBASE_AUTH === 'true';

const hasFirebaseConfig =
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
  !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
  !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

export const FIREBASE_AUTH_DISABLED = !enableFirebaseAuth || !hasFirebaseConfig;

if (enableFirebaseAuth && !hasFirebaseConfig && process.env.NODE_ENV !== 'production') {
  console.warn('[firebase] Auth enabled but NEXT_PUBLIC_FIREBASE_* config is incomplete. Auth is disabled.');
}

export const firebaseApp: FirebaseApp | undefined =
  hasFirebaseConfig ? (!getApps().length ? initializeApp(firebaseConfig) : getApp()) : undefined;

export const auth: Auth | undefined =
  !FIREBASE_AUTH_DISABLED && firebaseApp ? getAuth(firebaseApp) : undefined;

export const db: Firestore | undefined =
  firebaseApp ? getFirestore(firebaseApp) : undefined;

export function getAuthSafe(): Auth | undefined {
  return auth;
}
