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
import { prisma } from '@/server/db';

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
    const lead = await prisma.lead.findFirst({
      where: { id: payload.coldCallId, tenantId },
    });
    if (!lead) {
      return respond(
        { ok: false, error: 'Cold call lead not found', requestId },
        { status: 404 }
      );
    }

    const script = buildScript({
      name: lead.name || null,
      phone: lead.phone || null,
      focus: payload.focus,
      projects: payload.projects || [],
      language: payload.language,
    });

    const scriptId = `script_${Date.now()}`;
    const meta = (lead.metadata as Record<string, any> | null) || {};
    const coldCall = meta.coldCall || {};
    const nextMetadata = {
      ...meta,
      coldCall: {
        ...coldCall,
        lastScriptId: scriptId,
        lastScriptAt: new Date().toISOString(),
        lastScript: {
          language: payload.language,
          focus: payload.focus,
          projects: payload.projects || [],
          script,
        },
      },
    };
    await prisma.lead.update({
      where: { id: lead.id },
      data: { metadata: nextMetadata, updatedAt: new Date() },
    });

    return respond({
      ok: true,
      data: { scriptId, script },
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
