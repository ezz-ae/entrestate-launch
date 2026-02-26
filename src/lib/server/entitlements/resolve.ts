import { prisma } from '@/server/db';

export async function resolveWorkspaceEntitlements(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { tenantId: true },
  });

  if (!order) return [];

  return prisma.entitlement.findMany({
    where: {
      tenantId: order.tenantId,
      OR: [{ orderId }, { orderId: null }],
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function hasEntitlement(orderId: string, key: string) {
  const entitlements = await resolveWorkspaceEntitlements(orderId);
  return entitlements.some((entry) => entry.key === key && (entry.valueJson as any)?.allowed !== false);
}
