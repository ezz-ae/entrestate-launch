import { prisma } from '@/server/db';

export async function updateDeploymentSiteDoc(deploymentId: string, siteDoc: unknown) {
  return prisma.deployment.update({
    where: { id: deploymentId },
    data: { siteDocJson: siteDoc },
  });
}
