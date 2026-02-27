import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/server/db';
import { OpsOrderActions } from '@/components/ops/OpsOrderActions';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ orderId: string }> };

export default async function OpsOrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true, tenant: true, deployment: true },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Order {order.id}</h2>
          <p className="text-sm text-slate-600">{order.product?.title || 'Deployment'} · {order.status}</p>
        </div>
        <Link href="/ops/orders" className="text-sm text-slate-500 hover:text-slate-900">
          Back to orders
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p>Customer: {order.customerEmail || '—'}</p>
        <p>Tenant: {order.tenant.name}</p>
        <p>Preview: {order.deployment?.previewUrl || 'pending'}</p>
        <p>Live: {order.deployment?.liveUrl || 'pending'}</p>
      </div>

      <OpsOrderActions
        orderId={order.id}
        checklist={(order.metaJson as any)?.opsChecklist || {}}
        caseStudyNote={(order.metaJson as any)?.opsCaseStudyNote || ''}
      />
    </div>
  );
}
