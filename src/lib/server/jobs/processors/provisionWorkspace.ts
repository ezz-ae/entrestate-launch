import { prisma } from '@/server/db';
import { provisionWorkspace } from '@/lib/server/deployments/provision';

export async function processProvisionWorkspace(job: { deploymentId?: string | null; orderId?: string | null }) {
  if (!job.deploymentId || !job.orderId) throw new Error('Missing deployment or order id');

  await prisma.order.update({
    where: { id: job.orderId },
    data: { status: 'provisioning' },
  });

  const deployment = await provisionWorkspace(job.deploymentId);

  await prisma.order.update({
    where: { id: job.orderId },
    data: { status: 'in_build' },
  });

  return { deploymentId: deployment.id, status: deployment.status };
}
