import { Prisma } from '@prisma/client';
import { prisma } from '@/server/db';

export type CampaignFilters = {
  tenantId: string;
  platform?: string;
  name?: string;
  limit?: number;
  offset?: number;
};

export function listCampaigns(filters: CampaignFilters) {
  const { tenantId, platform, name, limit, offset } = filters;
  const where: Prisma.CampaignWhereInput = {
    tenantId,
    platform,
    name: name ? { contains: name, mode: 'insensitive' } : undefined,
  };

  return prisma.campaign.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export function createCampaign(data: Prisma.CampaignCreateInput) {
  return prisma.campaign.create({ data });
}

export function updateCampaign(id: string, data: Prisma.CampaignUpdateInput) {
  return prisma.campaign.update({
    where: { id },
    data,
  });
}
