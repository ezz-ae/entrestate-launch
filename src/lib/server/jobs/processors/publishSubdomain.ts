import { prisma } from '@/server/db';
import { publishSubdomain } from '@/lib/server/deployments/publish';

export async function processPublishSubdomain(job: { deploymentId?: string | null; orderId?: string | null }) {
  if (!job.deploymentId || !job.orderId) throw new Error('Missing deployment or order id');

  await prisma.deployment.update({
    where: { id: job.deploymentId },
    data: { status: 'publishing' },
  });

  const deployment = await publishSubdomain(job.deploymentId);

  await prisma.order.update({
    where: { id: job.orderId },
    data: { status: 'published' },
  });

  return {
    deploymentId: deployment.id,
    liveUrl: deployment.liveUrl,
    status: deployment.status,
  };
}
