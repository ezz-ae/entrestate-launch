import { prisma } from '@/server/db';

export async function provisionWorkspace(deploymentId: string) {
  const deployment = await prisma.deployment.findUnique({ where: { id: deploymentId } });
  if (!deployment) throw new Error('Deployment not found');

  if (deployment.status === 'created') {
    return prisma.deployment.update({
      where: { id: deploymentId },
      data: { status: 'building' },
    });
  }

  return deployment;
}
