import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Minimal middleware so Next outputs the middleware bundle for packaging.
export const runtime = 'edge';

export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
