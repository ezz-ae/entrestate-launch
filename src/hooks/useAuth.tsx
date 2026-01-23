'use client';

import { auth } from '@/lib/firebase/client'; // Assuming you have this configured
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type Auth,
  type User
} from 'firebase/auth';
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ensureAuth = (): Auth => {
  if (!auth) {
    throw new Error('Firebase auth is disabled. Set NEXT_PUBLIC_ENABLE_FIREBASE_AUTH=true with valid Firebase config.');
  }
  return auth;
};

function useSafeAuthState(targetAuth: Auth | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(targetAuth));

  useEffect(() => {
    if (!targetAuth) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onAuthStateChanged(targetAuth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [targetAuth]);

  return [user, loading] as const;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(ensureAuth(), email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      setUser(userCredential.user);
    }
  };

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(ensureAuth(), email, password).then(() => {});
  };

  const logOut = () => {
    return signOut(ensureAuth());
  };

  const value = { user, loading, signUp, logIn, logOut };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  const [fallbackUser, fallbackLoading] = useSafeAuthState(auth);
  const [devUser, setDevUser] = useState<any | null>(null);
  const [devLoading, setDevLoading] = useState(false);

  const signUp = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(ensureAuth(), email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
    }
  };

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(ensureAuth(), email, password).then(() => {});
  };

  const logOut = () => {
    return signOut(ensureAuth());
  };

  if (context !== undefined) {
    // don't return early here — keep hooks order stable. We'll respect the provided context
    // below when returning the final shape.
  }

  // If Firebase client doesn't have a user, try the server-side dev cookie endpoint
  useEffect(() => {
    // If a real AuthContext is present, skip the dev fetch logic.
    if (context !== undefined) return;
    let mounted = true;
    async function fetchDev() {
      if (!fallbackLoading && !fallbackUser) {
        setDevLoading(true);
        try {
          const resp = await fetch('/api/auth/me');
          if (!mounted) return;
          if (resp.ok) {
            const j = await resp.json();
            // create a minimal user-like object for client checks
            setDevUser({ uid: j.uid, email: j.email, displayName: j.email?.split('@')[0] || j.uid });
          }
        } catch (e) {
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
  }, [fallbackLoading, fallbackUser, context]);

  // If an AuthContext provider exists, prefer it; otherwise return the fallback/dev blended object.
  if (context !== undefined) return context;

  return {
    user: fallbackUser || devUser,
    loading: fallbackLoading || devLoading,
    signUp,
    logIn,
    logOut,
  };
};
