import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const normalizeDomain = (domain: string) => domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');

const ROOT_DOMAIN = normalizeDomain(process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com');
const SITE_DOMAIN = normalizeDomain(process.env.NEXT_PUBLIC_SITE_DOMAIN || `site.${ROOT_DOMAIN}`);

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/start', req.url));
  }

  const hostHeader = req.headers.get('host') || '';
  const host = hostHeader.split(':')[0];

  if (!host || req.nextUrl.pathname.startsWith('/p/')) {
    return response;
  }

  if (
    host === ROOT_DOMAIN ||
    host === `www.${ROOT_DOMAIN}` ||
    host.endsWith('.vercel.app') ||
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.startsWith('127.')
  ) {
    return response;
  }

  if (host.endsWith(`.${SITE_DOMAIN}`)) {
    return response;
  }

  const url = req.nextUrl.clone();
  url.pathname = `/p/${host}`;
  url.searchParams.set('domain', host);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
