import { Prisma } from '@prisma/client';
import { prisma } from '@/server/db';

export function createUpload(data: Prisma.UploadCreateInput) {
  return prisma.upload.create({ data });
}

export function listUploads(filters: {
  tenantId: string;
  kind?: Prisma.UploadWhereInput['kind'];
  limit?: number;
  offset?: number;
}) {
  const { tenantId, kind, limit, offset } = filters;
  return prisma.upload.findMany({
    where: {
      tenantId,
      kind,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export function getUpload(id: string) {
  return prisma.upload.findUnique({ where: { id } });
}
