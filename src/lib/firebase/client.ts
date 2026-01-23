
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const enableFirebaseAuth = process.env.NEXT_PUBLIC_ENABLE_FIREBASE_AUTH === 'true';
export const FIREBASE_AUTH_DISABLED = !enableFirebaseAuth;
const auth = enableFirebaseAuth ? getAuth(app) : (null as any);

export { app, auth };
