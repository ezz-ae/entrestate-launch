'use client';

import Link from 'next/link';
import { LabShell } from './lab-shell';

const entries = [
  { href: '/dev/lab/chat-agent', title: 'Chat Agent Funnel', desc: 'Marketing funnel + demo UI.' },
  { href: '/dev/lab/builder', title: 'Builder Funnel', desc: 'Builder landing/funnel UI.' },
  { href: '/dev/lab/pipeline', title: 'Lead Pipeline', desc: 'Lead validator + table mocks.' },
  { href: '/dev/lab/google-ads', title: 'Google Ads Planner', desc: 'Campaign planner funnel (mock).' },
];

export default function LabIndexPage() {
  return (
    <LabShell title="Component Lab">
      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-white/30"
          >
            <h2 className="text-lg font-semibold text-white">{entry.title}</h2>
            <p className="text-sm text-zinc-400">{entry.desc}</p>
            <span className="mt-3 inline-block text-xs uppercase tracking-[0.2em] text-amber-200">
              Open
            </span>
          </Link>
        ))}
      </div>
    </LabShell>
  );
}
