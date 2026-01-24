import { NextResponse } from 'next/server';
import { FIREBASE_AUTH_DISABLED, FIREBASE_CONFIG_READY } from '@/lib/firebase/client';
import { logError } from '@/lib/server/log';

export async function GET() {
  const scope = 'api/health/env';
  try {
    const supabaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    );

    return NextResponse.json({
      ok: true,
      flags: {
        firebaseAuthEnabled: !FIREBASE_AUTH_DISABLED,
        firebaseConfigReady: FIREBASE_CONFIG_READY,
        supabaseConfigured,
        nodeEnv: process.env.NODE_ENV === 'production',
        vercelEnv: Boolean(process.env.VERCEL),
      },
    });
  } catch (error) {
    logError(scope, error);
    return NextResponse.json({ ok: false, error: 'INTERNAL', scope }, { status: 500 });
  }
}
