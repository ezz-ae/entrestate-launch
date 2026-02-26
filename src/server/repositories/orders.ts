import { Prisma } from '@prisma/client';
import { prisma } from '@/server/db';

export type OrderFilters = {
  tenantId: string;
  projectId?: string;
  status?: string;
  limit?: number;
  offset?: number;
};

export function listOrders(filters: OrderFilters) {
  const { tenantId, projectId, status, limit, offset } = filters;
  return prisma.order.findMany({
    where: {
      tenantId,
      projectId,
      status,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export function createOrder(data: Prisma.OrderCreateInput) {
  return prisma.order.create({ data });
}

export function updateOrder(id: string, data: Prisma.OrderUpdateInput) {
  return prisma.order.update({
    where: { id },
    data,
  });
}
