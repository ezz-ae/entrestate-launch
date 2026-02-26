import { ReactNode } from 'react';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { EntitledNav } from '@/components/workspace/EntitledNav';

export function WorkspaceShell({
  orderId,
  title,
  status,
  slaHours,
  entitlements,
  children,
}: {
  orderId: string;
  title: string;
  status: string;
  slaHours?: number;
  entitlements: Array<{ key: string; valueJson: any }>;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8">
        <WorkspaceHeader title={title} status={status} slaHours={slaHours} />
        <EntitledNav orderId={orderId} entitlements={entitlements} />
        <section className="rounded-2xl border border-slate-200 bg-white p-6">{children}</section>
      </section>
    </main>
  );
}
