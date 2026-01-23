'use client';

import { useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/AuthContext';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const HIDDEN_PREFIXES = ['/dashboard', '/builder', '/admin', '/api'];
const HIDDEN_ROUTES = new Set(['/init', '/profile']);

function shouldShowPublicChrome(pathname: string) {
  if (HIDDEN_ROUTES.has(pathname)) {
    return false;
  }

  if (pathname.startsWith('/p/')) {
    return false;
  }

  return !HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showPublicChrome = useMemo(() => shouldShowPublicChrome(pathname ?? ''), [pathname]);

  // Workaround for an intermittent DevTool runtime error where
  // performance.measure gets negative timestamps. Run this patch inside a
  // client-side effect so we don't modify external values during render.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const perf = window.performance as any;
      if (perf && typeof perf.measure === 'function' && !(perf as any).__measurePatched) {
        const origMeasure = perf.measure.bind(perf);
        perf.measure = function (name: string, optionsOrStart?: any, maybeEnd?: any) {
          try {
            if (typeof optionsOrStart === 'object' && optionsOrStart !== null) {
              if (typeof optionsOrStart.start === 'number' && optionsOrStart.start < 0) optionsOrStart.start = 0;
              if (typeof optionsOrStart.end === 'number' && optionsOrStart.end < 0) optionsOrStart.end = 0;
            }
            // legacy signature: measure(name, start, end)
            if (typeof optionsOrStart === 'number' && typeof maybeEnd === 'number') {
              if (optionsOrStart < 0) optionsOrStart = 0;
              if (maybeEnd < 0) maybeEnd = 0;
            }
          } catch (e) {
            // swallow
          }
          return origMeasure(name, optionsOrStart as any, maybeEnd as any);
        };
        try { (perf as any).__measurePatched = true; } catch (e) { /* ignore */ }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <AuthProvider>
      {showPublicChrome && <SiteHeader />}
      {children}
      {showPublicChrome && <SiteFooter />}
    </AuthProvider>
  );
}
