import type { Prisma } from '@prisma/client';
import { prisma } from '@/server/db';

export async function applyEditTasks(deploymentId: string, tasks: Array<Record<string, unknown>>) {
  const deployment = await prisma.deployment.findUnique({ where: { id: deploymentId } });
  if (!deployment) throw new Error('Deployment not found');

  const existing =
    deployment.siteDocJson &&
    typeof deployment.siteDocJson === 'object' &&
    !Array.isArray(deployment.siteDocJson)
      ? (deployment.siteDocJson as Record<string, unknown>)
      : {};
  const nextSiteDoc = JSON.parse(
    JSON.stringify({
      ...existing,
      lastEditAt: new Date().toISOString(),
      editTasks: [...(((existing.editTasks as Array<Record<string, unknown>>) || [])), ...tasks],
    }),
  ) as Prisma.InputJsonValue;

  return prisma.deployment.update({
    where: { id: deploymentId },
    data: {
      siteDocJson: nextSiteDoc,
      status: 'preview_ready',
    },
  });
}
