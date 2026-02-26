import { prisma } from '@/server/db';
import { buildPreviewForDeployment } from '@/lib/server/deployments/preview';

export async function processBuildPreview(job: { deploymentId?: string | null; orderId?: string | null }) {
  if (!job.deploymentId || !job.orderId) throw new Error('Missing deployment or order id');

  const deployment = await buildPreviewForDeployment(job.deploymentId);

  await prisma.order.update({
    where: { id: job.orderId },
    data: { status: 'ready_for_review' },
  });

  return {
    deploymentId: deployment.id,
    previewUrl: deployment.previewUrl,
    status: deployment.status,
  };
}
