import { prisma } from '@/server/db';
import { OrdersTable } from '@/components/ops/OrdersTable';

export const dynamic = 'force-dynamic';

export default async function OpsOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { product: true },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Orders</h2>
      <OrdersTable
        rows={orders.map((order) => ({
          id: order.id,
          status: order.status,
          amount: `${order.currency || 'AED'} ${order.amount?.toString() || '0'}`,
          product: order.product?.title || '-',
          customerEmail: order.customerEmail || '-',
          createdAt: order.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
