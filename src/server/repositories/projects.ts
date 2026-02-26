import { Prisma } from '@prisma/client';
import { prisma } from '@/server/db';

export type ProjectFilters = {
  tenantId: string;
  slug?: string;
  ids?: string[];
  city?: string;
  community?: string;
  firstPage?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
};

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
  });
}

export async function getProjectBySlug(tenantId: string, slug: string) {
  return prisma.project.findFirst({
    where: {
      tenantId,
      slug,
    },
  });
}

export async function listProjects(filters: ProjectFilters) {
  const { tenantId, ids, slug, city, community, firstPage, search, minPrice, maxPrice, limit, offset } = filters;
  const where: Prisma.ProjectWhereInput = {
    tenantId,
    slug,
    city,
    community,
    firstPage,
    priceMin: minPrice !== undefined ? { gte: new Prisma.Decimal(minPrice) } : undefined,
    priceMax: maxPrice !== undefined ? { lte: new Prisma.Decimal(maxPrice) } : undefined,
    id: ids ? { in: ids } : undefined,
    OR: search
      ? [
          { title: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { community: { contains: search, mode: 'insensitive' } },
        ]
      : undefined,
  };

  return prisma.project.findMany({
    where,
    orderBy: { sortScore: 'desc' },
    take: limit,
    skip: offset,
  });
}

export async function createProject(data: Prisma.ProjectCreateInput) {
  return prisma.project.create({ data });
}

export async function updateProject(id: string, data: Prisma.ProjectUpdateInput) {
  return prisma.project.update({
    where: { id },
    data,
  });
}
