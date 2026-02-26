import { prisma } from '@/server/db';
import { buildBioLinkSiteDoc } from '@/lib/server/deployments/generate/bioLink';
import { buildBrochureLandingDoc } from '@/lib/server/deployments/generate/brochureLanding';

function toPreviewPath(deploymentId: string) {
  return `/preview/${deploymentId}`;
}

export async function buildPreviewForDeployment(deploymentId: string) {
  const deployment = await prisma.deployment.findUnique({
    where: { id: deploymentId },
    include: { product: true },
  });
  if (!deployment) throw new Error('Deployment not found');

  const intake = (deployment.intakeJson as Record<string, unknown>) || {};
  const slug = deployment.product.slug;
  const siteDoc =
    slug === 'project-launch-kit' || slug === 'brokerage-launch-kit'
      ? buildBrochureLandingDoc(intake)
      : buildBioLinkSiteDoc(intake);

  return prisma.deployment.update({
    where: { id: deploymentId },
    data: {
      status: 'preview_ready',
      siteDocJson: siteDoc,
      previewUrl: toPreviewPath(deploymentId),
    },
  });
}
