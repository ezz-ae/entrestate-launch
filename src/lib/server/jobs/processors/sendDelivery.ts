import { prisma } from '@/server/db';

export async function processSendDelivery(job: { orderId?: string | null; deploymentId?: string | null }) {
  if (!job.orderId) throw new Error('Missing order id');

  const order = await prisma.order.findUnique({ where: { id: job.orderId } });
  if (!order) throw new Error('Order not found');

  if (job.deploymentId) {
    const deployment = await prisma.deployment.findUnique({ where: { id: job.deploymentId } });
    if (deployment?.liveUrl) {
      await prisma.order.update({ where: { id: job.orderId }, data: { status: 'delivered' } });
    }
  }

  return {
    orderId: order.id,
    deliveryMessageQueued: true,
    customerEmail: order.customerEmail,
  };
}
