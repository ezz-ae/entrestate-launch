import { buildPreviewForDeployment } from '@/lib/server/deployments/preview';

export async function processGenerateLanding(job: { deploymentId?: string | null }) {
  if (!job.deploymentId) throw new Error('Missing deployment id');
  const deployment = await buildPreviewForDeployment(job.deploymentId);
  return {
    deploymentId: deployment.id,
    previewUrl: deployment.previewUrl,
  };
}
