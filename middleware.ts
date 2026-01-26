import { NextResponse } from 'next/server';

// Provide a no-op middleware so Next outputs only the trivial bundle with a static matcher.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/__middleware_stub__/:path*'],
};
