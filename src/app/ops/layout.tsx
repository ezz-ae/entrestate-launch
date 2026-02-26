import Link from 'next/link';
import { ReactNode } from 'react';

export default function OpsLayout({ children }: { children: ReactNode }) {
  const links = [
    { href: '/ops/orders', label: 'Orders' },
    { href: '/ops/deployments', label: 'Deployments' },
    { href: '/ops/jobs', label: 'Jobs' },
    { href: '/ops/edits', label: 'Edits' },
    { href: '/ops/leads', label: 'Leads' },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-5">
          <h1 className="text-2xl font-semibold text-slate-900">Ops Console</h1>
          <nav className="mt-3 flex flex-wrap gap-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700">
                {link.label}
              </Link>
            ))}
          </nav>
        </header>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">{children}</section>
      </section>
    </main>
  );
}
