import { connectDomain } from '@/lib/server/deployments/publish';

export async function processConnectDomain(job: { deploymentId?: string | null; payload?: any }) {
  if (!job.deploymentId) throw new Error('Missing deployment id');
  const domain = job.payload?.domain;
  if (!domain) throw new Error('Missing domain');

  const deployment = await connectDomain(job.deploymentId, domain);
  return {
    deploymentId: deployment.id,
    liveUrl: deployment.liveUrl,
  };
}
