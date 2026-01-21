import { cert, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { SERVER_ENV } from '@/lib/server/env';
import fs from 'fs';
import path from 'path';

let adminApp: import('firebase-admin/app').App | null = null;
let credentialsFound = false;

function getServiceAccount(): ServiceAccount | null {
    // --- SECONDARY METHOD: Load from Environment Variables (Production/Vercel) ---
    const projectId = process.env.FIREBASE_PROJECT_ID || SERVER_ENV.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || SERVER_ENV.FIREBASE_CLIENT_EMAIL;
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || SERVER_ENV.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
        credentialsFound = true;
        return { projectId, clientEmail, privateKey };
    }
    
    // --- PRIMARY METHOD: Load service account from file (for Local Dev) ---
    try {
        const files = fs.readdirSync(process.cwd()).filter(f => f.endsWith('.json'));
        for (const file of files) {
            try {
                const filePath = path.resolve(process.cwd(), file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const key = JSON.parse(content);
                if (key.type === 'service_account' && key.project_id && key.private_key) {
                    credentialsFound = true;
                    return {
                        projectId: key.project_id,
                        clientEmail: key.client_email,
                        privateKey: key.private_key
                    };
                }
            } catch (e) {}
        }
    } catch (e) {}
    
    return null;
}

function initAdmin() {
  if (adminApp) return;

  if (getApps().length) {
    adminApp = getApps()[0];
    return;
  }

  const credentials = getServiceAccount();
  
  if (credentials) {
    adminApp = initializeApp({ credential: cert(credentials) });
  }
}

// Initialize on load. If credentials are not present, this will do nothing.
initAdmin();

export function getAdminDb() {
  if (!adminApp) {
      // During build, return a mock-like object to prevent crash
      if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV) {
        return { collection: () => ({ doc: () => ({ get: async () => ({ exists: false }) }) }) } as any;
      }
      throw new Error("Firebase Admin not initialized. Missing credentials.");
  }
  return getFirestore(adminApp);
}

export function getAdminAuth() {
  if (!adminApp) {
    if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV) {
        return {} as any; // Return mock for build
    }
    throw new Error("Firebase Admin not initialized. Missing credentials.");
  }
  return getAuth(adminApp);
}
