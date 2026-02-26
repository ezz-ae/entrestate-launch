import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWorkspaceData } from '@/lib/server/workspace';

type Props = { params: Promise<{ orderId: string }> };

function nextActionHref(orderId: string, status: string) {
  if (status === 'pending_payment') return `/success/${orderId}`;
  if (status === 'paid' || status === 'provisioning' || status === 'in_build') return `/w/${orderId}/build`;
  if (status === 'ready_for_review') return `/w/${orderId}/preview`;
  if (status === 'published') return `/w/${orderId}/publish`;
  return `/w/${orderId}/preview`;
}

export default async function WorkspaceHomePage({ params }: Props) {
  const { orderId } = await params;
  const data = await getWorkspaceData(orderId);

  if (!data) notFound();

  const actionHref = nextActionHref(orderId, data.order.status);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Order status</h2>
        <p className="mt-2 text-sm text-slate-600">
          Tenant: {data.order.tenant.name} | Order: <span className="font-mono">{data.order.id}</span>
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-700">Current status: <strong>{data.order.status}</strong></p>
        <p className="mt-1 text-sm text-slate-600">
          Preview: {data.order.deployment?.previewUrl || 'pending'} | Live: {data.order.deployment?.liveUrl || 'pending'}
        </p>
      </div>

      <Link href={actionHref} className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
        Continue
      </Link>
    </div>
  );
}
