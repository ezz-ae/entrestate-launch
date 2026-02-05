export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { FIREBASE_AUTH_ENABLED } from '@/lib/server/env';

type Body = {
  user?: string;
  email?: string;
  roles?: string;
};

export async function POST(req: Request) {
  try {
    const enableDev = !FIREBASE_AUTH_ENABLED || process.env.NODE_ENV !== 'production';
    if (!enableDev) {
      return NextResponse.json({ error: 'Dev login disabled' }, { status: 403 });
    }
    const body = (await req.json()) as Body & { secret?: string };
    const user = (body.user || body.email || 'dev.user').toString();
    const email = (body.email || (user.includes('@') ? user : `${user}@dev.local`)).toString();
    const uid = user.includes('@') ? user.split('@')[0] : user;
    const roles = (body.roles || 'agency_admin').toString();

    // Security: require either a configured secret OR that the request originates from localhost.
    const configuredSecret = process.env.DEV_LOGIN_SECRET;
    const providedSecret = body.secret || req.headers.get('x-dev-login-secret') || '';
    const host = (req.headers.get('host') || '').toLowerCase();
    const xff = (req.headers.get('x-forwarded-for') || '').toLowerCase();

    const fromLocalhost = host.includes('localhost') || host.startsWith('127.') || xff.startsWith('127.') || xff.startsWith('::1') || host.startsWith('::1');

    if (configuredSecret) {
      if (!providedSecret || providedSecret !== configuredSecret) {
        return NextResponse.json({ error: 'Invalid dev login secret' }, { status: 403 });
      }
    } else {
      // no secret configured: only allow from localhost
      if (!fromLocalhost) {
        return NextResponse.json({ error: 'Dev login only allowed from localhost when no secret is configured' }, { status: 403 });
      }
    }

    const maxAge = 60 * 60 * 24 * 7; // 7 days

    const res = NextResponse.redirect(new URL('/dashboard', req.url));
    // set HttpOnly cookies so browser JS can't tamper with them
    res.headers.append('Set-Cookie', `dev_user=${encodeURIComponent(email)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`);
    res.headers.append('Set-Cookie', `dev_uid=${encodeURIComponent(uid)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`);
    res.headers.append('Set-Cookie', `dev_roles=${encodeURIComponent(roles)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`);

    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
