
import { getAuthSafe, FIREBASE_AUTH_DISABLED } from '@/lib/firebase/client';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authorizedFetch = async (url: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // If Firebase auth is disabled or bypassed, skip token injection.
  if (FIREBASE_AUTH_DISABLED) {
    // Signal to the server that this is an intentional bypass
    headers.set('x-dev-auth-bypass', 'true');
    return fetch(url, { ...options, headers });
  }

  const activeAuth = getAuthSafe();
  if (!activeAuth) {
    return fetch(url, { ...options, headers });
  }

  const user = activeAuth.currentUser;
  if (!user) {
    throw new AuthError('User not logged in');
  }

  const token = await user.getIdToken();
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let json: Record<string, unknown> | null = null;
    try {
      json = await response.json();
    } catch (error) {
      console.warn('[authorizedFetch] failed to parse error body', error);
    }

    const requestId = response.headers.get('x-request-id') || undefined;
    const scope = typeof json?.scope === 'string' ? json.scope : undefined;
    const digest = typeof json?.digest === 'string' ? json.digest : undefined;
    const pieces = [
      `HTTP ${response.status}`,
      scope ? `scope=${scope}` : undefined,
      requestId ? `requestId=${requestId}` : undefined,
      digest ? `digest=${digest}` : undefined,
      `url=${response.url}`,
      typeof json?.error === 'string' ? `error=${json.error}` : undefined,
    ].filter(Boolean);

    const message = pieces.join(' ');
    const error = new Error(message || `HTTP ${response.status} ${response.url}`);
    (error as any).requestId = requestId;
    (error as any).scope = scope;
    if (digest) {
      (error as any).digest = digest;
    }
    throw error;
  }

  return response;
};
