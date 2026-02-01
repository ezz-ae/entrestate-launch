import { getAuth } from 'firebase/auth';

/**
 * Client-side fetch wrapper that automatically attaches the Firebase ID token.
 * Retries once with a fresh token if a 401 is encountered.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const auth = getAuth();
  const user = auth.currentUser;

  const headers = new Headers(options.headers);

  if (user) {
    try {
      let token = await user.getIdToken();
      headers.set('Authorization', `Bearer ${token}`);
      
      const response = await fetch(url, { ...options, headers });
      
      if (response.status === 401) {
        // Token might have expired, force refresh and retry once
        token = await user.getIdToken(true);
        headers.set('Authorization', `Bearer ${token}`);
        const retryResponse = await fetch(url, { ...options, headers });
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Error ${retryResponse.status}: ${retryResponse.statusText}`);
        }
        return retryResponse;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      console.error('[api-client] failed to get token', error);
      throw error;
    }
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response;
}