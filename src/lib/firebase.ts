import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const FIREBASE_AUTH_ENABLED_CLIENT = process.env.NEXT_PUBLIC_ENABLE_FIREBASE_AUTH === 'true';
export const FIREBASE_AUTH_DISABLED = !FIREBASE_AUTH_ENABLED_CLIENT;

const auth = FIREBASE_AUTH_ENABLED_CLIENT ? getAuth(app) : (null as any);

export { app as firebaseApp, auth as firebaseAuth };
