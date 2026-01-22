
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { env } from '@/lib/env';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const FIREBASE_AUTH_DISABLED = env('DISABLE_FIREBASE_AUTH', 'false') === 'true';
const auth = FIREBASE_AUTH_DISABLED ? (null as any) : getAuth(app);

export { app, auth };
