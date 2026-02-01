import { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

const requestSchema = z.object({
  coldCallId: z.string().min(1),
  language: z.enum(['en', 'ar']),
  focus: z.string().min(1),
  projects: z.array(z.string()).optional(),
});

function buildScript({
  name,
  phone,
  focus,
  projects,
  language,
}: {
  name?: string | null;
  phone?: string | null;
  focus: string;
  projects: string[];
  language: 'en' | 'ar';
}) {
  const projectLine = projects.length
    ? projects.map((project) => `- ${project}`).join('\n')
    : 'No specific projects selected.';

  if (language === 'ar') {
    return `مرحبا ${name || 'هناك'}، معك فريق إنترستيت.\n\nالسبب: ${focus}.\n\nمشاريع مقترحة:\n${projectLine}\n\nسؤال سريع: ما هو نطاق ميزانيتك والمنطقة المفضلة؟ يمكنني إرسال التفاصيل على واتساب.\n\nإذا لم يكن هذا مناسباً، أخبرني وسأقوم بإيقاف المتابعة.`;
  }

  return `Hi ${name || 'there'}, this is the Entrestate team.\n\nReason for the call: ${focus}.\n\nSuggested projects:\n${projectLine}\n\nQuick question: what budget range and preferred area should I focus on? I can share details via WhatsApp (${phone || 'your number'}).\n\nIf this is not a fit, let me know and I will stop following up.`;
}

export async function POST(req: NextRequest) {
  const scope = 'api/cold-calling/script';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const payload = requestSchema.parse(await req.json());
    const db = getAdminDb();
    const leadRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('cold_call_leads')
      .doc(payload.coldCallId);
    const leadSnap = await leadRef.get();
    if (!leadSnap.exists) {
      return respond(
        { ok: false, error: 'Cold call lead not found', requestId },
        { status: 404 }
      );
    }

    const lead = leadSnap.data() || {};
    const script = buildScript({
      name: lead.name || null,
      phone: lead.phone || null,
      focus: payload.focus,
      projects: payload.projects || [],
      language: payload.language,
    });

    const scriptRef = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('cold_call_scripts')
      .add({
        coldCallId: payload.coldCallId,
        language: payload.language,
        focus: payload.focus,
        projects: payload.projects || [],
        script,
        createdAt: FieldValue.serverTimestamp(),
      });

    await leadRef.set(
      {
        lastScriptId: scriptRef.id,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return respond({
      ok: true,
      data: { scriptId: scriptRef.id, script },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId, path: req.url });
    if (error instanceof z.ZodError) {
      return respond(
        { ok: false, error: 'Invalid payload', details: error.errors, requestId },
        { status: 400 }
      );
    }
    return errorResponse(requestId, scope);
  }
}
