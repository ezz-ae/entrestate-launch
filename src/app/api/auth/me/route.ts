import { NextResponse } from 'next/server';
import { FIREBASE_AUTH_ENABLED } from '@/lib/server/env';

export async function GET(req: Request) {
  try {
    // Check dev cookie set by /api/dev-login
    const cookieHeader = req.headers.get('cookie') || '';
    let devUser: string | null = null;
    let devUid: string | null = null;
    let devRoles: string | null = null;

    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map((c) => c.trim());
      for (const c of cookies) {
        if (c.startsWith('dev_user=')) devUser = decodeURIComponent(c.slice('dev_user='.length));
        if (c.startsWith('dev_uid=')) devUid = decodeURIComponent(c.slice('dev_uid='.length));
        if (c.startsWith('dev_roles=')) devRoles = decodeURIComponent(c.slice('dev_roles='.length));
      }
    }

    const enableDev = !FIREBASE_AUTH_ENABLED || process.env.NODE_ENV !== 'production';
    if (enableDev && (devUser || devUid)) {
      const email = devUser || (devUid ? `${devUid}@dev.local` : null);
      const uid = devUid || (devUser ? devUser.split('@')[0] : 'dev.user');
      const roles = devRoles ? devRoles.split(',').map((r) => r.trim()).filter(Boolean) : ['agency_admin'];
      return NextResponse.json({ uid, email, roles });
    }

    return NextResponse.json({ ok: false }, { status: 204 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
