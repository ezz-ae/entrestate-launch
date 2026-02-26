import type { Prisma } from '@prisma/client';
import { prisma } from '@/server/db';

export async function updateDeploymentSiteDoc(deploymentId: string, siteDoc: unknown) {
  const siteDocJson =
    siteDoc === null || siteDoc === undefined
      ? undefined
      : (siteDoc as Prisma.InputJsonValue);
  return prisma.deployment.update({
    where: { id: deploymentId },
    data: { siteDocJson },
  });
}
