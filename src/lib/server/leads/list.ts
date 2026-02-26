import { prisma } from '@/server/db';

export async function listLeadsForOrder(orderId: string) {
  return prisma.lead.findMany({
    where: { orderId },
    orderBy: { createdAt: 'desc' },
  });
}
