import { FieldValue, type Firestore } from 'firebase-admin/firestore';

export type LeadDedupeMatch = {
  id: string;
  ref: FirebaseFirestore.DocumentReference;
  data: FirebaseFirestore.DocumentData;
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
  db: Firestore,
  tenantId: string,
  options: { email?: string | null; phone?: string | null }
): Promise<LeadDedupeMatch | null> {
  const emailNormalized = normalizeEmail(options.email);
  if (emailNormalized) {
    const snapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .where('emailNormalized', '==', emailNormalized)
      .limit(1)
      .get();
    const doc = snapshot.docs[0];
    if (doc) {
      return { id: doc.id, ref: doc.ref, data: doc.data() };
    }
  }

  const phoneNormalized = normalizePhone(options.phone);
  if (phoneNormalized) {
    const snapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .where('phoneNormalized', '==', phoneNormalized)
      .limit(1)
      .get();
    const doc = snapshot.docs[0];
    if (doc) {
      return { id: doc.id, ref: doc.ref, data: doc.data() };
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
}) {
  return {
    lastSeenAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    touches: FieldValue.increment(1),
    name: payload.name ?? null,
    email: payload.email ?? null,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
    source: payload.source ?? null,
    intentScore: payload.intentScore ?? null,
    intentFocus: payload.intentFocus ?? null,
    intentReasoning: payload.intentReasoning ?? null,
    intentProjectIds: payload.intentProjectIds ?? null,
    intentNextAction: payload.intentNextAction ?? null,
  };
}
