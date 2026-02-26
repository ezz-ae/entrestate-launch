import { prisma } from '@/server/db';

export type LeadDedupeMatch = {
  id: string;
  data: Record<string, any>;
};

export function normalizeEmail(value?: string | null) {
  const trimmed = value?.trim().toLowerCase();
  return trimmed ? trimmed : null;
}

export function normalizePhone(value?: string | null) {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  if (!digits) return null;
  return digits.length >= 7 ? digits : null;
}

export async function findExistingLead(
  tenantId: string,
  options: { email?: string | null; phone?: string | null }
): Promise<LeadDedupeMatch | null> {
  const emailNormalized = normalizeEmail(options.email);
  if (emailNormalized) {
    const lead = await prisma.lead.findFirst({
      where: { tenantId, emailNormalized },
    });
    if (lead) {
      return { id: lead.id, data: lead as Record<string, any> };
    }
  }

  const phoneNormalized = normalizePhone(options.phone);
  if (phoneNormalized) {
    const lead = await prisma.lead.findFirst({
      where: { tenantId, phoneNormalized },
    });
    if (lead) {
      return { id: lead.id, data: lead as Record<string, any> };
    }
  }

  return null;
}

export function buildLeadTouchUpdate(payload: {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  source?: string | null;
  intentScore?: number | null;
  intentFocus?: string | null;
  intentReasoning?: string | null;
  intentProjectIds?: string[] | null;
  intentNextAction?: string | null;
  siteId?: string | null;
  metadata?: Record<string, any> | null;
}) {
  return {
    lastSeenAt: new Date(),
    updatedAt: new Date(),
    touches: { increment: 1 },
    name: payload.name ?? null,
    email: payload.email ?? null,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
    source: payload.source ?? null,
    intentScore: payload.intentScore ?? null,
    intentFocus: payload.intentFocus ?? null,
    intentReasoning: payload.intentReasoning ?? null,
    intentProjectIds: payload.intentProjectIds ?? undefined,
    intentNextAction: payload.intentNextAction ?? null,
    siteId: payload.siteId ?? null,
    metadata: payload.metadata ?? null,
  };
}
