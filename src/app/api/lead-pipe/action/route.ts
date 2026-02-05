export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { getAdminDb } from '@/server/firebase-admin';
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
    const db = getAdminDb();

    const resolved = await resolveLeadFromPipe(db, tenantId, payload.leadId);
    if (!resolved) {
      return respond({ ok: false, error: 'Lead not found.', requestId }, { status: 404 });
    }

    const jobRef = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('lead_outreach_jobs')
      .add({
        leadId: resolved.leadId,
        sourceLeadId: payload.leadId,
        channel: payload.channel,
        status: 'draft',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

    return respond({ ok: true, data: { jobId: jobRef.id }, requestId }, { status: 201 });
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

async function resolveLeadFromPipe(
  db: ReturnType<typeof getAdminDb>,
  tenantId: string,
  leadId: string
) {
  if (leadId.startsWith('lead:')) {
    return { leadId: leadId.replace('lead:', '') };
  }

  if (!leadId.startsWith('chat:')) {
    return null;
  }

  const threadId = leadId.replace('chat:', '');
  const threadRef = db
    .collection('tenants')
    .doc(tenantId)
    .collection('chatThreads')
    .doc(threadId);
  const threadSnap = await threadRef.get();
  if (!threadSnap.exists) {
    return null;
  }
  const thread = threadSnap.data() || {};
  const existingLeadId = thread.leadId as string | undefined;
  if (existingLeadId) {
    return { leadId: existingLeadId };
  }

  const message = thread.lastUserMessage as string | undefined;
  const emailMatch = message?.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
  const phoneMatch = message?.match(/\+?\d[\d\s-]{6,}\d/)?.[0] ?? null;

  const emailNormalized = normalizeEmail(emailMatch);
  const phoneNormalized = normalizePhone(phoneMatch);

  const existing = await findExistingLead(db, tenantId, {
    email: emailNormalized,
    phone: phoneNormalized,
  });

  if (existing) {
    await existing.ref.update(
      buildLeadTouchUpdate({
        name: existing.data?.name || null,
        email: emailMatch || existing.data?.email || null,
        phone: phoneMatch || existing.data?.phone || null,
        message: message || null,
        source: 'Chat Agent',
      })
    );
    await threadRef.set({ leadId: existing.id }, { merge: true });
    return { leadId: existing.id };
  }

  const leadRef = await db
    .collection('tenants')
    .doc(tenantId)
    .collection('leads')
    .add({
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
      lastSeenAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      context: { threadId, channel: 'chat' },
    });

  await threadRef.set({ leadId: leadRef.id }, { merge: true });
  return { leadId: leadRef.id };
}
