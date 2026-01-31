import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export const useAuth = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    }
  };

  const signInWithOtp = async (emailOrPhone, fullName = '') => {
    setLoading(true);
    const isEmail = emailOrPhone.includes('@');
    const { error } = await supabase.auth.signInWithOtp({
      [isEmail ? 'email' : 'phone']: emailOrPhone,
      options: {
        data: { full_name: fullName }
      }
    });
    setLoading(false);
    return { error };
  };

  const verifyOtp = async (emailOrPhone, token, rememberMe = true) => {
    setLoading(true);
    const isEmail = emailOrPhone.includes('@');
    const { data, error } = await supabase.auth.verifyOtp({
      [isEmail ? 'email' : 'phone']: emailOrPhone,
      token,
      type: isEmail ? 'email' : 'sms',
    });

    if (data?.user && rememberMe) {
      // Store the "remember me" preference and current timestamp
      localStorage.setItem('auth_remember_me', 'true');
      localStorage.setItem('auth_login_date', Date.now().toString());
    } else if (data?.user) {
      localStorage.removeItem('auth_remember_me');
      localStorage.removeItem('auth_login_date');
    }

    setLoading(false);
    return { data, error };
  };

  const signUp = async (emailOrPhone, fullName) => {
    // In OTP flow, signUp is essentially signInWithOtp with metadata
    return await signInWithOtp(emailOrPhone, fullName);
  };

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (initialSession?.user) {
        const rememberMe = localStorage.getItem('auth_remember_me') === 'true';
        const loginDate = parseInt(localStorage.getItem('auth_login_date') || '0');
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        
        // If "remember me" was checked, we enforce a 7-day limit as requested
        if (rememberMe && (Date.now() - loginDate > sevenDaysInMs)) {
          supabase.auth.signOut();
          setSession(null);
        } else {
          setSession(initialSession);
          fetchProfile(initialSession.user.id);
        }
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_IN' && newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = () => supabase.auth.signOut();

  return { userProfile, session, loading, signOut, fetchProfile, signInWithOtp, verifyOtp, signUp };
};