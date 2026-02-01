import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/server/auth';
import { FIREBASE_AUTH_ENABLED } from '@/lib/server/env';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    
    if (!idToken) {
      return NextResponse.json({ ok: false, error: 'Missing ID token' }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });

    // Set the session cookie so server-side auth (dashboard-auth.ts) can read it
    response.cookies.set(SESSION_COOKIE_NAME, idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 5, // 5 days
    });

    return response;
  } catch (error) {
    console.error('[api/auth/session] Error setting session:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}