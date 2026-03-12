'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import Plasma from '@/components/plasma';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <Suspense fallback={null}>
        <div className="fixed inset-0 z-0 bg-black">
          <Plasma
            color="#8b5cf6"
            speed={0.8}
            direction="forward"
            scale={1.5}
            opacity={0.4}
            mouseInteractive={true}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </Suspense>

      <SpeedInsights />
      <Analytics />
    </SessionProvider>
  );
}
