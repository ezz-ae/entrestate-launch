import { prisma } from '@/server/db';

export async function applyEditTasks(deploymentId: string, tasks: Array<Record<string, unknown>>) {
  const deployment = await prisma.deployment.findUnique({ where: { id: deploymentId } });
  if (!deployment) throw new Error('Deployment not found');

  const existing = (deployment.siteDocJson as Record<string, unknown>) || {};
  const nextSiteDoc = {
    ...existing,
    lastEditAt: new Date().toISOString(),
    editTasks: [...(((existing.editTasks as Array<Record<string, unknown>>) || [])), ...tasks],
  };

  return prisma.deployment.update({
    where: { id: deploymentId },
    data: {
      siteDocJson: nextSiteDoc,
      status: 'preview_ready',
    },
  });
}
