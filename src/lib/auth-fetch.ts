
import { getAuthSafe, FIREBASE_AUTH_DISABLED } from '@/lib/firebase/client';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authorizedFetch = async (url: string, options: RequestInit = {}) => {
  // If Firebase auth is disabled, allow unauthenticated requests for dev/smoke runs.
  if (FIREBASE_AUTH_DISABLED) {
    const headers = new Headers(options.headers || {});
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return fetch(url, { ...options, headers });
  }

  const activeAuth = getAuthSafe();
  if (!activeAuth) {
    const headers = new Headers(options.headers || {});
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return fetch(url, { ...options, headers });
  }

  const user = activeAuth.currentUser;
  if (!user) {
    throw new AuthError('User not logged in');
  }

  const token = await user.getIdToken();
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, { ...options, headers });
};
