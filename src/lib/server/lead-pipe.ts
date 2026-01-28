import type { Firestore } from 'firebase-admin/firestore';

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

export async function collectLeadPipeCandidates(db: Firestore, tenantId: string) {
  const leadsRef = db
    .collection('tenants')
    .doc(tenantId)
    .collection('leads')
    .orderBy('createdAt', 'desc')
    .limit(80);
  const chatRef = db
    .collection('tenants')
    .doc(tenantId)
    .collection('chatThreads')
    .orderBy('updatedAt', 'desc')
    .limit(40);

  const [leadSnap, chatSnap] = await Promise.all([
    leadsRef.get(),
    chatRef.get(),
  ]);

  const candidates: LeadPipeCandidate[] = [];
  leadSnap.docs.forEach((doc) => {
    const data = doc.data();
    if (data.pipelineDecision === 'rejected' || data.status === 'ignored') {
      return;
    }
    const createdAt = toIsoString(
      data.createdAt?.toDate?.() ??
        (data.createdAt instanceof Date ? data.createdAt : undefined)
    );
    candidates.push({
      id: `lead:${doc.id}`,
      name: normalizeContact(data.name || data.fullName || ''),
      email: normalizeContact(data.email),
      phone: mapNumber(data.phone),
      message: normalizeContact(data.message || data.source || ''),
      source: 'site',
      intentScore: typeof data.intentScore === 'number' ? data.intentScore : null,
      intentReasoning: data.intentReasoning || null,
      focus: data.intentFocus || null,
      createdAt,
    });
  });

  chatSnap.docs.forEach((doc) => {
    const data = doc.data();
    const createdAt = toIsoString(
      data.updatedAt?.toDate?.() ??
        (data.updatedAt instanceof Date ? data.updatedAt : undefined)
    );
    const lastMessage = normalizeContact(data.lastUserMessage || data.preview || '');
    candidates.push({
      id: `chat:${doc.id}`,
      name: normalizeContact(data.name || data.userName || ''),
      email: null,
      phone: null,
      message: lastMessage,
      source: 'chat',
      createdAt,
    });
  });

  return {
    candidates,
    sourceTotals: {
      site: leadSnap.size,
      chat: chatSnap.size,
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
