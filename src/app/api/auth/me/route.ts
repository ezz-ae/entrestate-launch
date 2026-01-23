import { NextResponse } from 'next/server';
import { FIREBASE_AUTH_ENABLED } from '@/lib/server/env';

export async function GET(req: Request) {
  try {
    const hasClientConfig = Boolean(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );
    if (!FIREBASE_AUTH_ENABLED || !hasClientConfig) {
      return NextResponse.json({ user: null, mode: 'guest' });
    }

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

    const enableDev = process.env.NODE_ENV !== 'production';
    if (enableDev && (devUser || devUid)) {
      const email = devUser || (devUid ? `${devUid}@dev.local` : null);
      const uid = devUid || (devUser ? devUser.split('@')[0] : 'dev.user');
      const roles = devRoles ? devRoles.split(',').map((r) => r.trim()).filter(Boolean) : ['agency_admin'];
      return NextResponse.json({ user: { uid, email, roles }, mode: 'dev' });
    }

    return NextResponse.json({ user: null, mode: 'anonymous' });
  } catch (e) {
    return NextResponse.json({ user: null, mode: 'error' }, { status: 500 });
  }
}
