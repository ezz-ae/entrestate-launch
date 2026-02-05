export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // security: allow logout only from localhost or when secret supplied
  const configuredSecret = process.env.DEV_LOGIN_SECRET;
  let providedSecret = '';
  try {
    const body = await req.json();
    providedSecret = body?.secret || req.headers.get('x-dev-login-secret') || '';
  } catch (e) {
    providedSecret = req.headers.get('x-dev-login-secret') || '';
  }
  const host = (req.headers.get('host') || '').toLowerCase();
  const xff = (req.headers.get('x-forwarded-for') || '').toLowerCase();
  const fromLocalhost = host.includes('localhost') || host.startsWith('127.') || xff.startsWith('127.') || xff.startsWith('::1') || host.startsWith('::1');

  if (configuredSecret && providedSecret !== configuredSecret) {
    return NextResponse.json({ error: 'Invalid dev logout secret' }, { status: 403 });
  }
  if (!configuredSecret && !fromLocalhost) {
    return NextResponse.json({ error: 'Dev logout only allowed from localhost when no secret is configured' }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true });
  // clear cookies
  res.headers.append('Set-Cookie', `dev_user=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  res.headers.append('Set-Cookie', `dev_uid=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  res.headers.append('Set-Cookie', `dev_roles=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  return res;
}
