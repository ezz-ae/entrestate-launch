import { prisma } from '@/server/db';
import { resolveWorkspaceEntitlements } from '@/lib/server/entitlements/resolve';

export async function getWorkspaceData(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      product: true,
      tenant: true,
      deployment: true,
    },
  });

  if (!order) return null;

  const entitlements = await resolveWorkspaceEntitlements(orderId);

  return {
    order,
    entitlements,
  };
}
