import { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { getWorkspaceData } from '@/lib/server/workspace';
import { getWorkspaceCookieName, hasWorkspaceAccess } from '@/lib/server/workspace-access';

type Props = {
  params: Promise<{ orderId: string }>;
  children: ReactNode;
};

export default async function WorkspaceLayout({ params, children }: Props) {
  const { orderId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(getWorkspaceCookieName(orderId))?.value;
  const allowed = await hasWorkspaceAccess(orderId, token);
  if (!allowed) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-20">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Access required</p>
            <h1 className="mt-2 text-2xl font-semibold">Your workspace link is needed</h1>
            <p className="mt-2 text-sm text-slate-600">
              This workspace is protected. Please open it using the access link from your order confirmation.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/success/${orderId}`}
                className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Go back to your access link
              </Link>
              <Link
                href="/support"
                className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Request help
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }
  const data = await getWorkspaceData(orderId);

  if (!data) {
    notFound();
  }

  return (
    <WorkspaceShell
      orderId={orderId}
      title={data.order.product?.title || 'Deployment Workspace'}
      status={data.order.status}
      slaHours={data.order.product?.fulfillmentSlaHours || 24}
      entitlements={data.entitlements}
    >
      {children}
    </WorkspaceShell>
  );
}
