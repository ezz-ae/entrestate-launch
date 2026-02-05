import { cert, getApps, initializeApp, type App, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

const FIREBASE_ADMIN_CREDENTIALS_ENV = process.env.FIREBASE_ADMIN_CREDENTIALS;

let parsedCredentials: ServiceAccount | undefined;

const isProductionLike =
  process.env.NODE_ENV === 'production' ||
  process.env.VERCEL_ENV === 'production' ||
  process.env.VERCEL_ENV === 'preview';

// Try to load from local file first, especially for local development
const serviceAccountPath = path.resolve(
  process.cwd(),
  './firebase-adminsdk.json'
);

if (fs.existsSync(serviceAccountPath)) {
  try {
    const rawConfig = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    parsedCredentials = {
      projectId: rawConfig.project_id,
      clientEmail: rawConfig.client_email,
      privateKey: rawConfig.private_key?.replace(/\\n/g, '\n'),
    };
    console.log('[firebase-admin] Local private key loaded (first 50 chars):', parsedCredentials.privateKey?.substring(0, 50));
  } catch (e) {
    console.warn(
      '[firebase-admin] Could not load local service account file. Make sure it is valid JSON.',
      e
    );
  }
}

// If not loaded from local file or if in a production-like environment, try environment variables
if (!parsedCredentials && FIREBASE_ADMIN_CREDENTIALS_ENV) {
  try {
    if (FIREBASE_ADMIN_CREDENTIALS_ENV.startsWith('{')) {
      parsedCredentials = JSON.parse(FIREBASE_ADMIN_CREDENTIALS_ENV);
    } else if (FIREBASE_ADMIN_CREDENTIALS_ENV.startsWith('@')) {
      console.warn('[firebase-admin] FIREBASE_ADMIN_CREDENTIALS is a Vercel secret reference. This should be automatically resolved at runtime. If building locally or if errors persist, ensure the actual JSON content is available.');
    }
  } catch (e) {
    console.error('[firebase-admin] Failed to parse FIREBASE_ADMIN_CREDENTIALS JSON:', e);
  }
}

if (!getApps().length && parsedCredentials) {
  initializeApp({
    credential: cert(parsedCredentials),
  });
}

export const adminApp = getApps().length > 0 ? getApps()[0] : undefined;
export const adminAuth = adminApp ? getAuth(adminApp) : undefined;
export const adminDb = adminApp ? getFirestore(adminApp) : undefined;

export function getAdminDb() {
  if (!adminDb) {
    throw new Error(
      'Firebase Admin Firestore not initialized. Ensure FIREBASE_ADMIN_CREDENTIALS is set and valid.'
    );
  }
  return adminDb;
}

export function getAdminAuth() {
  if (!adminAuth) {
    throw new Error(
      'Firebase Admin Auth not initialized. Ensure FIREBASE_ADMIN_CREDENTIALS is set and valid.'
    );
  }
  return adminAuth;
}

export function getAdminProjectId(): string | undefined {
  return adminApp?.options.projectId;
}

export function tryGetAdminDb() {
  return adminDb;
}
