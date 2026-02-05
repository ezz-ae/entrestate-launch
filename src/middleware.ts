import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard'];
const AUTH_COOKIE = 'entrestate_auth_token';
const DEV_COOKIE_NAMES = ['dev_user', 'dev_uid'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected) {
    const hasAuthCookie = request.cookies.has(AUTH_COOKIE);
    const hasDevCookie = DEV_COOKIE_NAMES.some((name) => request.cookies.has(name));
    
    // In production, we strictly require the auth cookie.
    // In development, we allow dev cookies as well.
    const isDev = process.env.NODE_ENV !== 'production';
    const isAuthenticated = hasAuthCookie || (isDev && hasDevCookie);

    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      // Redirect to login, preserving the return URL
      loginUrl.searchParams.set('return_to', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/dashboard/:path*',
  ],
};
