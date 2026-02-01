import { NextRequest } from 'next/server';
import { generateText } from 'ai';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { mainSystemPrompt } from '@/config/prompts';
import { getGoogleModel, FLASH_MODEL } from '@/lib/ai/google';
import { formatProjectContext } from '@/server/inventory';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import {
  enforceUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { getAdminDb } from '@/server/firebase-admin';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import { fetchRelevantProjects } from '@/lib/server/inventory-search';
import { scoreLeadIntent } from '@/lib/server/lead-intent';
import {
  buildLeadTouchUpdate,
  findExistingLead,
  normalizeEmail,
  normalizePhone,
} from '@/lib/server/lead-dedupe';

const requestSchema = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'agent']),
        text: z.string(),
      })
    )
    .optional(),
});

export async function POST(req: NextRequest) {
  const scope = 'api/chat';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);
  let payload: z.infer<typeof requestSchema> | null = null;
  let tenantId: string;
  try {
    const authResult = await requireRole(req, ALL_ROLES);
    tenantId = authResult.tenantId;
    await enforceUsageLimit(getAdminDb(), tenantId, 'ai_conversations', 1);
    const body = await req.json();
    payload = requestSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return respond(
        {
          ok: false,
          error: {
            code: 'invalid_payload',
            message: 'Invalid request payload.',
            details: error.errors,
          },
          requestId,
        },
        { status: 400 }
      );
    }
    if (error instanceof PlanLimitError) {
      return respond(
        {
          ok: false,
          error: {
            code: 'plan_limit',
            message: 'Plan limit reached',
            details: planLimitErrorResponse(error),
          },
          requestId,
        },
        { status: 402 }
      );
    }
    if (error instanceof UnauthorizedError) {
      return respond(
        { ok: false, error: { code: 'unauthorized', message: 'Unauthorized' }, requestId },
        { status: 401 }
      );
    }
    if (error instanceof ForbiddenError) {
      return respond(
        { ok: false, error: { code: 'forbidden', message: 'Forbidden' }, requestId },
        { status: 403 }
      );
    }
    return errorResponse(requestId, scope, 400);
  }

  const db = getAdminDb();
  let agentKnowledge = '';
  try {
    const agentSnapshot = await db.collection('tenants').doc(tenantId).collection('agents').limit(1).get();
    if (!agentSnapshot.empty) {
      const agentId = agentSnapshot.docs[0].id;
      const knowledgeSnapshot = await db.collection('tenants').doc(tenantId).collection('agents').doc(agentId).collection('knowledge').get();
      if (!knowledgeSnapshot.empty) {
        knowledgeSnapshot.docs.forEach((doc: any) => {
          const data = doc.data();
          agentKnowledge += `\n- Chat Name: ${data.chatName || 'N/A'}`;
          agentKnowledge += `\n- Company Details: ${data.companyDetails || 'N/A'}`;
          agentKnowledge += `\n- Important Info: ${data.importantInfo || 'N/A'}`;
          agentKnowledge += `\n- Exclusive Listing: ${data.exclusiveListing || 'N/A'}`;
          agentKnowledge += `\n- Contact Details: ${data.contactDetails || 'N/A'}`;
        });
      }
    }
  } catch (error) {
    console.error('[chat] Error fetching agent knowledge:', error);
  }

  const historyText = (payload.history || [])
    .map((entry) => `${entry.role === 'user' ? 'Client' : 'Agent'}: ${entry.text}`)
    .join('\n');

  const relevantProjects = await fetchRelevantProjects(
    req,
    `${payload.message} ${historyText}`,
    8
  );

  const projectContext = relevantProjects.length
    ? `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`
    : '';

  const systemPrompt = `
Role & Context:
You are Entrestate's real estate assistant for UAE brokers.
Speak in simple, non-technical language and keep answers concise.
Use the listing context below when available.
If asked about Dubai/UAE investment topics (fees, visas, payment plans, ROI, financing), give high-level guidance and say details should be confirmed with the broker.
If you mention pricing or returns, note they are estimates.
If you are unsure, say so and offer a next step (brochure, viewing, or a call).
Ask one question at a time. If the buyer shows interest and contact details are missing, ask for name and WhatsApp or email.
Avoid repetition and try to keep the conversation flowing naturally, providing diverse responses.
${projectContext}
${agentKnowledge}
`;

  const messages: any[] = (payload.history || []).map(entry => ({
    role: (entry.role === 'user' ? 'user' : 'assistant'),
    content: entry.text,
  }));
  messages.push({ role: 'user', content: payload.message });

  const contactText = `${payload.message} ${historyText}`;
  const emailMatch = contactText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const phoneMatch = contactText.match(/\+?\d[\d\s-]{6,}\d/)?.[0];
  const emailNormalized = normalizeEmail(emailMatch);
  const phoneNormalized = normalizePhone(phoneMatch);
  const projectIds = relevantProjects.map((project) => project.id).filter(Boolean);
  const intent = scoreLeadIntent({
    text: contactText,
    hasEmail: Boolean(emailNormalized),
    hasPhone: Boolean(phoneNormalized),
    projectIds,
  });

  let reply = '';
  let aiFailure: { error: string; message: string; missing?: string[] } | null = null;
  try {
    const { text } = await generateText({
      model: getGoogleModel(FLASH_MODEL),
      system: `${mainSystemPrompt}\nAlways be clear, helpful, and broker-friendly.\n${systemPrompt}`,
      messages,
    });
    reply = text;
  } catch (error) {
    console.error('[chat] ai error', error);
    if (
      error instanceof Error &&
      error.message.includes('Google Generative AI API key is not configured')
    ) {
      aiFailure = {
        error: 'missing_api_key',
        message: 'AI is not configured.',
        missing: ['GEMINI_API_KEY'],
      };
    } else {
      aiFailure = {
        error: 'ai_unavailable',
        message: 'AI is temporarily unavailable. Please try again shortly.',
      };
    }
    const fallbackList = relevantProjects.slice(0, 3).map(formatProjectContext).join('\n');
    reply = fallbackList
      ? `Here are a few options I can share right now:\n${fallbackList}\nTell me your budget and preferred area, and I will narrow it down.`
      : 'I can help with UAE projects, pricing ranges, and next steps. What area and budget should I focus on?';
  }

  const existing = await findExistingLead(db, tenantId, {
    email: emailNormalized,
    phone: phoneNormalized,
  });

  let leadId = '';
  if (existing) {
    await existing.ref.update(
      buildLeadTouchUpdate({
        name: existing.data?.name || null,
        email: emailMatch || existing.data?.email || null,
        phone: phoneMatch || existing.data?.phone || null,
        message: payload.message,
        source: 'Chat Agent',
        intentScore: intent.intent_score,
        intentFocus: intent.focus,
        intentReasoning: intent.reasoning,
        intentProjectIds: projectIds,
        intentNextAction: intent.next_action,
      })
    );
    leadId = existing.id;
  } else {
    const leadRef = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .add({
        tenantId,
        name: null,
        email: emailMatch || null,
        emailNormalized,
        phone: phoneMatch || null,
        phoneNormalized,
        message: payload.message,
        source: 'Chat Agent',
        status: 'New',
        priority: 'Warm',
        touches: 1,
        lastSeenAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        context: { channel: 'chat' },
        intentScore: intent.intent_score,
        intentFocus: intent.focus,
        intentReasoning: intent.reasoning,
        intentProjectIds: projectIds,
        intentNextAction: intent.next_action,
      });
    leadId = leadRef.id;
  }

  console.log(
    JSON.stringify({
      event: 'lead.created',
      source: 'chat',
      tenantId,
      leadId,
      intentScore: intent.intent_score,
      nextAction: intent.next_action,
      requestId,
    })
  );

  const responseData = {
    reply,
    lead_id: leadId,
    intent_score: intent.intent_score,
    focus: intent.focus,
    project_ids: projectIds,
    next_action: intent.next_action,
  };

  if (aiFailure) {
    return respond(
      {
        ok: false,
        error: {
          code: aiFailure.error,
          message: aiFailure.message,
          missing: aiFailure.missing,
        },
        data: responseData,
        requestId,
      },
      { status: 503 }
    );
  }

  return respond({
    ok: true,
    data: responseData,
    requestId,
  });
}
