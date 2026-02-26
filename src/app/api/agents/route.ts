export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { prisma } from '@/server/db';

const agentConfigSchema = z.object({
  name: z.string().min(1, "Agent name is required."),
  companyName: z.string().min(1, "Company name is required."),
  knowledgeSource: z.string().min(1, "Knowledge source is required."),
  conversionGoal: z.string().min(1, "Conversion goal is required."),
});

export async function POST(req: NextRequest) {
  try {
    const { tenantId, uid } = await requireRole(req, ADMIN_ROLES);
    const body = await req.json();
    const config = agentConfigSchema.parse(body);

    if (!uid) {
      return NextResponse.json({ error: 'Missing user context' }, { status: 401 });
    }

    const agent = await prisma.chatAgent.create({
      data: {
        tenantId,
        userId: uid,
        name: config.name,
        companyName: config.companyName,
        profile: {
          knowledgeSource: config.knowledgeSource,
          conversionGoal: config.conversionGoal,
        },
      },
    });

    return NextResponse.json({ id: agent.id, ...config });

  } catch (error) {
    console.error('Agent Creation API Error:', error);
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
