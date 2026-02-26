import { prisma } from '@/server/db';

export async function captureLead(input: {
  tenantId: string;
  orderId: string;
  deploymentId: string;
  name?: string;
  phone?: string;
  email?: string;
  source?: string;
  notes?: string;
}) {
  return prisma.lead.create({
    data: {
      tenantId: input.tenantId,
      orderId: input.orderId,
      deploymentId: input.deploymentId,
      name: input.name,
      phone: input.phone,
      email: input.email,
      source: input.source || 'deployment_workspace',
      notes: input.notes,
      status: 'new',
    },
  });
}
