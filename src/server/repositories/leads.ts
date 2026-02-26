import { Prisma } from '@prisma/client';
import { prisma } from '@/server/db';

export type LeadFilters = {
  tenantId: string;
  projectId?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export function listLeads(filters: LeadFilters) {
  const { tenantId, projectId, status, search, limit, offset } = filters;
  const where: Prisma.LeadWhereInput = {
    tenantId,
    projectId,
    status,
    OR: search
      ? [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ]
      : undefined,
  };

  return prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export function getLead(leadId: string) {
  return prisma.lead.findUnique({
    where: { id: leadId },
  });
}

export function createLead(data: Prisma.LeadCreateInput) {
  return prisma.lead.create({ data });
}

export function updateLead(leadId: string, data: Prisma.LeadUpdateInput) {
  return prisma.lead.update({
    where: { id: leadId },
    data,
  });
}
