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
    const publicFirebaseAuthEnabled =
      process.env.NEXT_PUBLIC_ENABLE_FIREBASE_AUTH?.trim().toLowerCase() === 'true';
    const nodeEnvProduction = process.env.NODE_ENV === 'production';
    const onVercel = Boolean(process.env.VERCEL);

    return NextResponse.json({
      ok: true,
      flags: {
        publicFirebaseAuthEnabled,
        firebasePublicConfigReady: FIREBASE_CONFIG_READY,
        firebaseAuthEnabled: !FIREBASE_AUTH_DISABLED,
        supabaseConfigured,
        nodeEnvProduction,
        onVercel,
      },
    });
  } catch (error) {
    logError(scope, error);
    return NextResponse.json({ ok: false, error: 'INTERNAL', scope }, { status: 500 });
  }
}
