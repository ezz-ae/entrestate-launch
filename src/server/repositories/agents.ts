import { Prisma } from '@prisma/client';
import { prisma } from '@/server/db';

export type AgentTrainingFilters = {
  tenantId: string;
  projectId?: string;
  status?: string;
  limit?: number;
  offset?: number;
};

export function listAgentTraining(filters: AgentTrainingFilters) {
  const { tenantId, projectId, status, limit, offset } = filters;
  const where: Prisma.AgentTrainingWhereInput = {
    tenantId,
    projectId,
    status,
  };

  return prisma.agentTraining.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export function createAgentTraining(data: Prisma.AgentTrainingCreateInput) {
  return prisma.agentTraining.create({ data });
}

export function updateAgentTraining(id: string, data: Prisma.AgentTrainingUpdateInput) {
  return prisma.agentTraining.update({
    where: { id },
    data,
  });
}
