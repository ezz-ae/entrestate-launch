'use client';

import React from 'react';
import { Manrope, Cormorant_Garamond } from 'next/font/google';

const bodyFont = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export function FunnelShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-[#0b0a09] text-[#f5f1e8] font-[var(--font-body)]`}
    >
      {children}
    </div>
  );
}
