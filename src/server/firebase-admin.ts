import { cert, getApps, initializeApp, type App, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

type AdminCredentials = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

type RawServiceAccount = ServiceAccount & {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

const isProductionLike =
  process.env.NODE_ENV === 'production' ||
  process.env.VERCEL_ENV === 'production' ||
  process.env.VERCEL_ENV === 'preview';

const isDebugMode = !isProductionLike || process.env.DEBUG_ENV === 'true';

let cachedCredentials: AdminCredentials | null = null;
let adminApp: App | null = null;

function normalizePrivateKey(value?: string) {
  return value?.replace(/\\n/g, '\n');
}

function logDebug(message: string) {
  if (isDebugMode) {
    console.warn(message);
  }
}

function parseJsonCredentials(raw?: string): AdminCredentials {
  const trimmed = raw?.trim();
  if (!trimmed) {
    throw new Error('Empty FIREBASE_ADMIN_CREDENTIALS payload.');
  }
  const parsed = JSON.parse(trimmed) as RawServiceAccount;
  const projectId = parsed.projectId || parsed.project_id;
  const clientEmail = parsed.clientEmail || parsed.client_email;
  const privateKey = normalizePrivateKey(parsed.privateKey || parsed.private_key);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('FIREBASE_ADMIN_CREDENTIALS JSON is missing required fields.');
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

function readCredentials(): AdminCredentials | null {
  if (cachedCredentials) {
    return cachedCredentials;
  }

  const rawJson = process.env.FIREBASE_ADMIN_CREDENTIALS;
  if (rawJson) {
    try {
      const parsed = parseJsonCredentials(rawJson);
      cachedCredentials = parsed;
      return parsed;
    } catch (error) {
      const parsedError =
        error instanceof Error ? error : new Error('Unable to parse FIREBASE_ADMIN_CREDENTIALS payload.');
      logDebug(`[firebase-admin] ${parsedError.message}`);
      throw parsedError;
    }
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.project_id;
  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
    process.env.FIREBASE_CLIENT_EMAIL ||
    process.env.client_email;
  const privateKey = normalizePrivateKey(
    process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
      process.env.FIREBASE_PRIVATE_KEY ||
      process.env.private_key
  );

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  const parsed = { projectId, clientEmail, privateKey };
  cachedCredentials = parsed;
  return parsed;
}

function requireCredentials(): AdminCredentials {
  const credentials = readCredentials();
  if (!credentials) {
    throw describeMissingCredentials();
  }
  return credentials;
}

function describeMissingCredentials() {
  return new Error(
    'Missing Firebase admin credentials. Set FIREBASE_ADMIN_CREDENTIALS or FIREBASE_ADMIN_PROJECT_ID/FIREBASE_ADMIN_CLIENT_EMAIL/FIREBASE_ADMIN_PRIVATE_KEY.'
  );
}

function initAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  if (getApps().length) {
    adminApp = getApps()[0];
    return adminApp;
  }

  const credentials = requireCredentials();
  try {
    adminApp = initializeApp({ credential: cert(credentials) });
  } catch (error) {
    const initError = error instanceof Error ? error : new Error('Failed to initialize Firebase admin SDK.');
    logDebug(`[firebase-admin] Initialization failed while constructing admin SDK: ${initError.message}`);
    throw initError;
  }

  return adminApp;
}

export function getAdminProjectId() {
  if (adminApp?.options?.projectId) {
    return adminApp.options.projectId;
  }
  try {
    return readCredentials()?.projectId || null;
  } catch {
    return null;
  }
}

export function getAdminDb() {
  const app = initAdminApp();
  return getFirestore(app);
}

export function getAdminAuth() {
  const app = initAdminApp();
  return getAuth(app);
}
