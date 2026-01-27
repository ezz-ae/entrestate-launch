import { NextResponse } from 'next/server';

import { FIREBASE_AUTH_ENABLED } from '@/lib/server/env';
import { SESSION_COOKIE_NAME } from '@/lib/server/auth';
import { getAdminAuth } from '@/server/firebase-admin';
import { logError } from '@/lib/server/log';

const SESSION_MAX_AGE = 60 * 60; // 1 hour

function buildSessionResponse({ token }: { token?: string } = {}) {
  const response = NextResponse.json({ ok: true });
  if (token) {
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
  } else {
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  }
  return response;
}

export async function POST(req: Request) {
  if (!FIREBASE_AUTH_ENABLED) {
    return NextResponse.json({ error: 'firebase_auth_disabled' }, { status: 400 });
  }

  let body: { token?: string } = {};
  try {
    body = (await req.json()) as { token?: string };
  } catch (error) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const token = typeof body.token === 'string' ? body.token.trim() : '';
  if (!token) {
    return NextResponse.json({ error: 'missing_token' }, { status: 400 });
  }

  try {
    await getAdminAuth().verifyIdToken(token);
    return buildSessionResponse({ token });
  } catch (error) {
    logError('api/auth/session', error);
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }
}

export async function DELETE() {
  return buildSessionResponse();
}
