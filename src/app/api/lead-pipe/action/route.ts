export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import {
  buildLeadTouchUpdate,
  findExistingLead,
  normalizeEmail,
  normalizePhone,
} from '@/lib/server/lead-dedupe';
import { prisma } from '@/server/db';

const requestSchema = z.object({
  leadId: z.string().min(1),
  channel: z.enum(['email', 'sms']),
});

export async function POST(req: NextRequest) {
  const scope = 'api/lead-pipe/action';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const payload = requestSchema.parse(await req.json());

    const resolved = await resolveLeadFromPipe(tenantId, payload.leadId);
    if (!resolved) {
      return respond({ ok: false, error: 'Lead not found.', requestId }, { status: 404 });
    }

    const job = await prisma.job.create({
      data: {
        tenantId,
        type: 'lead_outreach',
        status: 'draft',
        payload: {
          leadId: resolved.leadId,
          sourceLeadId: payload.leadId,
          channel: payload.channel,
        },
      },
    });

    return respond({ ok: true, data: { jobId: job.id }, requestId }, { status: 201 });
  } catch (error) {
    logError(scope, error, { requestId });
    if (error instanceof z.ZodError) {
      return respond(
        { ok: false, error: 'Invalid payload', details: error.errors, requestId },
        { status: 400 }
      );
    }
    return errorResponse(requestId, scope);
  }
}

async function resolveLeadFromPipe(tenantId: string, leadId: string) {
  if (leadId.startsWith('lead:')) {
    return { leadId: leadId.replace('lead:', '') };
  }

  if (!leadId.startsWith('chat:')) {
    return null;
  }

  const threadId = leadId.replace('chat:', '');
  const session = await prisma.chatSession.findUnique({ where: { id: threadId } });
  if (!session) {
    return null;
  }
  const conversation = Array.isArray(session.conversation) ? session.conversation : [];
  const lastUserMessage = [...conversation]
    .reverse()
    .find((entry: any) => entry?.role === 'user' || entry?.role === 'client');
  const message = (lastUserMessage?.content || lastUserMessage?.text) as string | undefined;
  const emailMatch = message?.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
  const phoneMatch = message?.match(/\+?\d[\d\s-]{6,}\d/)?.[0] ?? null;

  const emailNormalized = normalizeEmail(emailMatch);
  const phoneNormalized = normalizePhone(phoneMatch);

  const existing = await findExistingLead(tenantId, {
    email: emailNormalized,
    phone: phoneNormalized,
  });

  if (existing) {
    await prisma.lead.update({
      where: { id: existing.id },
      data: buildLeadTouchUpdate({
        name: existing.data?.name || null,
        email: emailMatch || existing.data?.email || null,
        phone: phoneMatch || existing.data?.phone || null,
        message: message || null,
        source: 'Chat Agent',
      }),
    });
    return { leadId: existing.id };
  }

  const lead = await prisma.lead.create({
    data: {
      tenantId,
      name: null,
      email: emailMatch,
      emailNormalized,
      phone: phoneMatch,
      phoneNormalized,
      message: message || null,
      source: 'Chat Agent',
      status: 'New',
      priority: 'Warm',
      touches: 1,
      lastSeenAt: new Date(),
      context: { threadId, channel: 'chat' },
    },
  });

  return { leadId: lead.id };
}
