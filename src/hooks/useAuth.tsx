'use client';

import { useState, useEffect, useContext, createContext, ReactNode, useMemo } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type Auth,
  type User,
} from 'firebase/auth';
import { getAuthSafe, FIREBASE_AUTH_DISABLED } from '@/lib/firebase/client';

const SESSION_ENDPOINT = '/api/auth/session';
const SESSION_REFRESH_INTERVAL_MS = 25 * 60 * 1000;

type AppUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  roles?: string[];
  mode: 'firebase' | 'dev';
};

function mapFirebaseUser(user: User): AppUser {
  return {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    mode: 'firebase',
  };
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  error?: 'FIREBASE_NOT_CONFIGURED';
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authDisabledError() {
  return new Error('Firebase auth is disabled or not configured.');
}

function getActiveAuth(): Auth | null {
  if (FIREBASE_AUTH_DISABLED) return null;
  return getAuthSafe();
}

function useFirebaseAuthState(targetAuth?: Auth | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(targetAuth));

  useEffect(() => {
    if (!targetAuth) {
      setUser(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    try {
      const unsubscribe = onAuthStateChanged(
        targetAuth,
        (nextUser) => {
          if (!mounted) return;
          setUser(nextUser);
          setLoading(false);
        },
        () => {
          if (!mounted) return;
          setLoading(false);
        }
      );
      return () => {
        mounted = false;
        unsubscribe();
      };
    } catch (error) {
      console.warn('[auth] Failed to subscribe to auth state.', error);
      setLoading(false);
      return () => {
        mounted = false;
      };
    }
  }, [targetAuth]);

  return { user, loading };
}

function createAuthActions(targetAuth?: Auth | null) {
  if (!targetAuth) {
    return {
      signUp: async () => {
        throw authDisabledError();
      },
      logIn: async () => {
        throw authDisabledError();
      },
      logOut: async () => {},
    };
  }

  return {
    signUp: async (email: string, password: string, name?: string) => {
      const userCredential = await createUserWithEmailAndPassword(targetAuth, email, password);
      if (userCredential.user && name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
    },
    logIn: (email: string, password: string) => signInWithEmailAndPassword(targetAuth, email, password).then(() => {}),
    logOut: () => signOut(targetAuth),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const activeAuth = getActiveAuth();
  const { user: firebaseUser, loading } = useFirebaseAuthState(activeAuth);
  const actions = useMemo(() => createAuthActions(activeAuth), [activeAuth]);
  const configError: AuthContextType['error'] = FIREBASE_AUTH_DISABLED ? 'FIREBASE_NOT_CONFIGURED' : undefined;

  const appUser = firebaseUser ? mapFirebaseUser(firebaseUser) : null;
  const value = { user: appUser, loading, error: configError, ...actions };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    const clearSession = async () => {
      try {
        await fetch(SESSION_ENDPOINT, { method: 'DELETE' });
      } catch (error) {
        console.warn('[auth] Failed to clear session cookie.', error);
      }
    };

    const syncSession = async () => {
      if (cancelled) return;
      if (!firebaseUser || FIREBASE_AUTH_DISABLED) {
        await clearSession();
        return;
      }
      try {
        const token = await firebaseUser.getIdToken(true);
        const response = await fetch(SESSION_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        if (!response.ok) {
          const text = await response.text().catch(() => '');
          console.warn('[auth] Session sync failed.', response.status, text);
        }
      } catch (error) {
        console.warn('[auth] Session sync error.', error);
      }
    };

    syncSession();

    if (!FIREBASE_AUTH_DISABLED) {
      intervalId = setInterval(syncSession, SESSION_REFRESH_INTERVAL_MS);
    }

    return () => {
      cancelled = true;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [firebaseUser]);

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  const hasContext = context !== undefined;
  const activeAuth = hasContext ? null : getActiveAuth();
  const { user: firebaseUser, loading } = useFirebaseAuthState(activeAuth);
  const actions = useMemo(() => createAuthActions(activeAuth), [activeAuth]);
  const [devUser, setDevUser] = useState<AppUser | null>(null);
  const [devLoading, setDevLoading] = useState(false);
  const fallbackError: AuthContextType['error'] = FIREBASE_AUTH_DISABLED ? 'FIREBASE_NOT_CONFIGURED' : undefined;

  useEffect(() => {
    if (hasContext) return;
    if (FIREBASE_AUTH_DISABLED) return;
    let mounted = true;
    async function fetchDev() {
      if (!loading && !firebaseUser) {
        setDevLoading(true);
        try {
          const resp = await fetch('/api/auth/me');
          if (!mounted) return;
          if (resp.ok) {
            const payload = await resp.json().catch(() => null);
            if (payload?.mode === 'guest') return;
            const uid = payload?.uid ?? payload?.user?.uid ?? payload?.email ?? null;
            const email = payload?.email ?? payload?.user?.email ?? null;
            if (uid || email) {
              setDevUser({
                uid: uid ?? email ?? 'dev.user',
                email: email ?? undefined,
                displayName: payload?.user?.displayName ?? email?.split('@')[0] ?? 'Dev User',
                roles: payload?.user?.roles ?? payload?.roles ?? [],
                mode: 'dev',
              });
            }
          }
        } catch {
          // ignore
        } finally {
          if (mounted) setDevLoading(false);
        }
      }
    }
    fetchDev();
    return () => {
      mounted = false;
    };
  }, [loading, firebaseUser, hasContext]);

  const mappedFirebaseUser = firebaseUser ? mapFirebaseUser(firebaseUser) : null;

  if (context !== undefined) {
    return context;
  }

  return {
    user: mappedFirebaseUser || devUser,
    loading: loading || devLoading,
    error: fallbackError,
    ...actions,
  };
};
