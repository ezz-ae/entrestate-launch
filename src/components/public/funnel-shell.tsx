'use client';

import React from 'react';
import { Space_Grotesk, IBM_Plex_Serif } from 'next/font/google';

const bodyFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const displayFont = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export function FunnelShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-[#0a0f1c] text-[#e8edf7] font-[var(--font-body)]`}
    >
      {children}
    </div>
  );
}
