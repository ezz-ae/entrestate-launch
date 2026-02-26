import { prisma } from '@/server/db';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

export async function publishSubdomain(deploymentId: string) {
  const deployment = await prisma.deployment.findUnique({
    where: { id: deploymentId },
    include: { order: true, product: true },
  });

  if (!deployment) throw new Error('Deployment not found');

  const rawLabel = deployment.order.customerEmail || `${deployment.product.slug}-${deployment.id.slice(0, 6)}`;
  const label = slugify(rawLabel.split('@')[0] || rawLabel);
  const liveUrl = `https://${label}.entrestate.link`;

  return prisma.deployment.update({
    where: { id: deploymentId },
    data: {
      status: 'live',
      liveUrl,
    },
  });
}

export async function connectDomain(deploymentId: string, domain: string) {
  return prisma.deployment.update({
    where: { id: deploymentId },
    data: {
      status: 'live',
      liveUrl: `https://${domain}`,
    },
  });
}
