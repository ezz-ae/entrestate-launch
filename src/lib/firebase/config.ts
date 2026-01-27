import { env } from '@/lib/env';
import type { FirebaseOptions } from 'firebase/app';

const trimValue = (value?: string) => value?.trim() ?? '';

const publicFirebaseAuthFlag = process.env.NEXT_PUBLIC_ENABLE_FIREBASE_AUTH?.trim().toLowerCase();
export const FIREBASE_AUTH_ENABLED = publicFirebaseAuthFlag === 'true';

// Trimmed copy of the public Firebase config so server helpers can read the strings without forcing ENV resolution.
const trimmedFirebaseConfig: FirebaseOptions = {
  apiKey: trimValue(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: trimValue(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: trimValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  appId: trimValue(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  storageBucket: trimValue(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: trimValue(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
};

export const firebaseConfig: FirebaseOptions | null = FIREBASE_AUTH_ENABLED ? trimmedFirebaseConfig : null;

export function getFirebaseConfig(): FirebaseOptions {
  if (!FIREBASE_AUTH_ENABLED) {
    throw new Error('Cannot resolve Firebase config when auth is disabled.');
  }
  return {
    apiKey: env('NEXT_PUBLIC_FIREBASE_API_KEY'),
    authDomain: env('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: env('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    appId: env('NEXT_PUBLIC_FIREBASE_APP_ID'),
    storageBucket: env('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: env('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  };
}
