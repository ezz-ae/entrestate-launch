'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firebaseAuth = auth;

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!firebaseAuth) throw new Error('Firebase auth is not configured.');
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!firebaseAuth) throw new Error('Firebase auth is not configured.');
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    if (!firebaseAuth) {
      throw new Error('Firebase auth is not configured.');
    }
    await firebaseAuth.signOut();
  };

  return { signIn, signUp, logOut, loading, error };
};
