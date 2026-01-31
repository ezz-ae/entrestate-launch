import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { FIREBASE_AUTH_ENABLED } from '@/lib/server/env';
import { verifyFirebaseIdToken, UnauthorizedError } from '@/lib/server/auth';

const DEV_COOKIE_NAMES = ['dev_user', 'dev_uid'];

type DashboardCookieStore = Awaited<ReturnType<typeof cookies>>;

function buildCookieHeader(cookieStore: DashboardCookieStore) {
    const pairs = cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`);
    return pairs.filter(Boolean).join('; ');
}

export async function requireDashboardAuth() {
    const cookieStore = await cookies();
    const hasDevCookie = DEV_COOKIE_NAMES.some((name) => Boolean(cookieStore.get(name)?.value));
    const isDevEnvironment = process.env.NODE_ENV !== 'production';

    if (hasDevCookie && (isDevEnvironment || !FIREBASE_AUTH_ENABLED)) {
        return;
    }

    if (!FIREBASE_AUTH_ENABLED) {
        if (isDevEnvironment) {
            return; // Allow access in dev if auth is explicitly disabled
        }
        redirect('/login');
    }

    const cookieHeader = buildCookieHeader(cookieStore);
    const headers = cookieHeader ? { cookie: cookieHeader } : undefined;
    try {
        const context = await verifyFirebaseIdToken(
            new Request('https://entrestate.com/dashboard', { headers }),
        );
        if (context.claims?.dev) {
            return;
        }
        if (context.uid && context.uid !== 'anonymous') {
            return;
        }
    } catch (error) {
        // Do nothing; we redirect below.
        if (!(error instanceof UnauthorizedError) && process.env.LOG_AUTH_DEBUG === 'true') {
            console.debug('[dashboard-auth] verification failed', error);
        }
    }

    redirect('/login');
}
