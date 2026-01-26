import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('x-mw', '1');
  return res;
}

export const config = {
  matcher: ['/:path*'],
};
