'use client';

import Link from 'next/link';
import React from 'react';

interface LabShellProps {
  title: string;
  children: React.ReactNode;
}

const links = [
  { href: '/dev/lab', label: 'Lab Index' },
  { href: '/dev/lab/chat-agent', label: 'Chat Agent' },
  { href: '/dev/lab/builder', label: 'Builder' },
  { href: '/dev/lab/pipeline', label: 'Pipeline' },
  { href: '/dev/lab/google-ads', label: 'Google Ads' },
];

export function LabShell({ title, children }: LabShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 text-xs uppercase tracking-[0.3em]">
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-200">
            Internal QA
          </span>
          <nav className="flex flex-wrap gap-3 text-[11px] text-zinc-300">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/10 px-3 py-1 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-zinc-400">Mock-safe rendering for QA verification.</p>
        </div>
        {children}
      </main>
    </div>
  );
}
