import { prisma } from '@/server/db';

export async function processExtractBrochure(job: { deploymentId?: string | null }) {
  if (!job.deploymentId) throw new Error('Missing deployment id');

  const deployment = await prisma.deployment.findUnique({ where: { id: job.deploymentId } });
  if (!deployment) throw new Error('Deployment not found');

  const intake = (deployment.intakeJson as Record<string, unknown>) || {};
  const extracted = {
    projectName: intake.projectName || 'Project Name',
    location: intake.location || 'Dubai, UAE',
    source: 'manual_or_placeholder',
  };

  await prisma.deployment.update({
    where: { id: job.deploymentId },
    data: {
      intakeJson: {
        ...intake,
        extracted,
      },
    },
  });

  return extracted;
}
