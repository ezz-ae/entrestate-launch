export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceCookieName, hasWorkspaceAccess } from '@/lib/server/workspace-access';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const orderId = String(body?.orderId || '').trim();
  const token = String(body?.token || '').trim();

  if (!orderId) {
    return NextResponse.json({ ok: false, error: 'order_id_required' }, { status: 400 });
  }

  const allowed = await hasWorkspaceAccess(orderId, token || null);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: 'workspace_forbidden' }, { status: 403 });
  }

  if (token) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(getWorkspaceCookieName(orderId), token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ ok: true });
}
