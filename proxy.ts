import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Minimal Next.js 16 proxy boundary; keep deterministic so Vercel executes this file instead of any middleware artifacts.
export default function proxy(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('x-proxy', '1');
  return res;
}
