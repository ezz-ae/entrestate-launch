export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { prisma } from '@/server/db';

type RouteContext = { params: Promise<{ agentId: string }> };

const knowledgeSchema = z.object({
  chatName: z.string().optional(),
  companyDetails: z.string().optional(),
  importantInfo: z.string().optional(),
  exclusiveListing: z.string().optional(),
  contactDetails: z.string().optional(),
});

export async function POST(req: NextRequest, context: RouteContext) {
  const { agentId } = await context.params;

  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const body = await req.json();
    const knowledgeData = knowledgeSchema.parse(body);

    const agent = await prisma.chatAgent.findFirst({
      where: { id: agentId, tenantId },
    });
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found or does not belong to your tenant.' }, { status: 404 });
    }

    const profile = (agent.profile as Record<string, unknown> | null) || {};
    const entries = Array.isArray((profile as any).knowledgeEntries)
      ? [...(profile as any).knowledgeEntries]
      : [];
    const entryId = `knowledge_${Date.now()}`;
    entries.push({
      id: entryId,
      ...knowledgeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await prisma.chatAgent.update({
      where: { id: agent.id },
      data: { profile: { ...profile, knowledgeEntries: entries } },
    });

    return NextResponse.json({ message: 'Knowledge added successfully.', knowledgeId: entryId });

  } catch (error) {
    console.error('Add Knowledge API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
