import { prisma } from '@/server/db';

const ACTIVE_KEYWORDS = [
  'buy',
  'purchase',
  'interested',
  'ready',
  'call',
  'whatsapp',
  'email',
  'schedule',
  'visit',
  'demo',
  'book',
  'quote',
  'available',
];

const CONTACT_REGEX = /(\+?\d[\d\s-]{6,}\d)/;

export type LeadPipeCandidate = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  source: 'site' | 'chat';
  createdAt: string;
  intentScore?: number | null;
  intentReasoning?: string | null;
  focus?: string | null;
};

export type LeadPipeRecord = LeadPipeCandidate & {
  activeProbability: number;
  reasoning: string;
  focus?: string | null;
};

function toIsoString(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

function normalizeContact(value?: string | null) {
  if (!value) return null;
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function mapNumber(value?: string | null) {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 ? `+${digits}` : value;
}

function normalizeConversation(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) return [];
  return value.filter((entry) => entry && typeof entry === 'object' && !Array.isArray(entry)) as Array<
    Record<string, unknown>
  >;
}

function buildDedupeKey(candidate: LeadPipeCandidate) {
  if (candidate.email) {
    return `email:${candidate.email.toLowerCase()}`;
  }
  if (candidate.phone) {
    return `phone:${candidate.phone.replace(/\D/g, '')}`;
  }
  if (candidate.message) {
    return `message:${candidate.message.slice(0, 40).toLowerCase()}`;
  }
  return `id:${candidate.id}`;
}

function analyzeLead(candidate: LeadPipeCandidate): Pick<LeadPipeRecord, 'activeProbability' | 'reasoning'> {
  const reasons: string[] = [];
  let score = 0.2;

  if (candidate.email) {
    score += 0.2;
    reasons.push('Email provided');
  }
  if (candidate.phone) {
    score += 0.2;
    reasons.push('Phone number provided');
  }

  const message = candidate.message?.toLowerCase() ?? '';
  const foundKeywords = ACTIVE_KEYWORDS.filter((keyword) => message.includes(keyword));
  if (foundKeywords.length) {
    const unique = Array.from(new Set(foundKeywords));
    score += 0.15 * Math.min(unique.length, 3);
    reasons.push(`Mentioned ${unique.slice(0, 3).join(', ')}`);
  }

  const phoneMatch = CONTACT_REGEX.exec(candidate.message || '');
  if (phoneMatch) {
    score += 0.1;
    reasons.push('Detected phone number in message');
  }

  if (!reasons.length) {
    reasons.push('No clear signals yet');
  }

  return {
    activeProbability: Math.min(score, 1),
    reasoning: reasons.join(' · '),
  };
}

export async function collectLeadPipeCandidates(tenantId: string) {
  const [leadRows, chatRows] = await Promise.all([
    prisma.lead.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 80,
    }),
    prisma.chatSession.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' },
      take: 40,
    }),
  ]);

  const candidates: LeadPipeCandidate[] = [];
  leadRows.forEach((lead) => {
    if (
      lead.pipelineDecision === 'reject' ||
      lead.pipelineDecision === 'rejected' ||
      lead.status === 'ignored'
    ) {
      return;
    }
    candidates.push({
      id: `lead:${lead.id}`,
      name: normalizeContact(lead.name || ''),
      email: normalizeContact(lead.email),
      phone: mapNumber(lead.phone),
      message: normalizeContact(lead.message || lead.source || ''),
      source: 'site',
      intentScore: typeof lead.intentScore === 'number' ? lead.intentScore : null,
      intentReasoning: lead.intentReasoning || null,
      focus: lead.intentFocus || null,
      createdAt: toIsoString(lead.createdAt),
    });
  });

  chatRows.forEach((session) => {
    const conversation = normalizeConversation(session.conversation);
    const lastUserMessage = [...conversation].reverse().find((entry) => {
      const role = typeof entry.role === 'string' ? entry.role : '';
      return role === 'user' || role === 'client';
    });
    const preview =
      (typeof lastUserMessage?.content === 'string' && lastUserMessage.content) ||
      (typeof lastUserMessage?.text === 'string' && lastUserMessage.text) ||
      '';
    const name = typeof lastUserMessage?.name === 'string' ? lastUserMessage.name : '';
    candidates.push({
      id: `chat:${session.id}`,
      name: normalizeContact(name),
      email: null,
      phone: null,
      message: normalizeContact(preview),
      source: 'chat',
      createdAt: toIsoString(session.updatedAt),
    });
  });

  return {
    candidates,
    sourceTotals: {
      site: leadRows.length,
      chat: chatRows.length,
    },
  };
}

export function deduplicateLeads(candidates: LeadPipeCandidate[]) {
  const seen = new Map<string, LeadPipeCandidate>();
  candidates.forEach((candidate) => {
    const key = buildDedupeKey(candidate);
    if (!seen.has(key)) {
      seen.set(key, candidate);
    }
  });
  return Array.from(seen.values());
}

export function buildLeadPipeRecords(candidates: LeadPipeCandidate[]): LeadPipeRecord[] {
  return candidates.map((candidate) => {
    const analysis =
      typeof candidate.intentScore === 'number'
        ? {
            activeProbability: Math.min(Math.max(candidate.intentScore, 0), 1),
            reasoning: candidate.intentReasoning || 'Intent score from chat.',
          }
        : analyzeLead(candidate);
    return {
      ...candidate,
      activeProbability: analysis.activeProbability,
      reasoning: analysis.reasoning,
    };
  });
}
