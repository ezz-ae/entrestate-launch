import { NextRequest } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { getGoogleModel, FLASH_MODEL } from '@/lib/ai/google';
import { getAdminDb } from '@/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { formatProjectContext } from '@/server/inventory';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import {
  enforceUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
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
  history: z.array(z.object({
    role: z.enum(['user', 'agent']),
    text: z.string(),
  })).optional(),
  siteId: z.string().optional(),
  context: z.string().optional(),
});

const rateLimits = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

function consumeRateLimit(key: string) {
  const now = Date.now();
  const bucket = rateLimits.get(key);
  if (!bucket || bucket.expiresAt < now) {
    rateLimits.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return false;
  }
  bucket.count += 1;
  return true;
}

export async function POST(req: NextRequest, { params: paramsPromise }: { params: Promise<{ botId: string }> }) {
  const scope = 'api/bot/[botId]/chat';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);
  try {
    const params = await paramsPromise;
    const { tenantId } = await requireRole(req, ALL_ROLES);
    await enforceUsageLimit(getAdminDb(), tenantId, 'ai_conversations', 1);
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    if (!consumeRateLimit(`${params.botId}:${ip}`)) {
      return respond(
        {
          ok: false,
          error: { code: 'rate_limited', message: 'Too many requests' },
          requestId,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const payload = requestSchema.parse(body);

    const historyText = (payload.history || [])
      .map((entry) => `${entry.role === 'user' ? 'User' : 'Agent'}: ${entry.text}`)
      .join('\n');

    const relevantProjects = await fetchRelevantProjects(
      req,
      `${payload.message} ${payload.context || ''}`,
      8
    );
    const projectContext = relevantProjects.length
      ? `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`
      : '';

    const prompt = `
Context: ${payload.context || 'web_widget'}.
Use simple, non-technical language. If details are missing, say so and offer next steps.
Ask one question at a time. If the buyer shows interest and contact details are missing, ask for name and WhatsApp or email.
${projectContext}

Conversation so far:
${historyText}

User (${params.botId}): ${payload.message}
`;

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
        system:
          "You are EntreSite's AI sales concierge. Be concise, cite Dubai market data when possible, and always steer toward capturing name/contact if missing.",
        prompt,
      });
      reply = text;
    } catch (error) {
      console.error('[bot/chat] ai error', error);
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

    const db = getAdminDb();
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
          source: 'Chat Widget',
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
          source: 'Chat Widget',
          status: 'New',
          priority: 'Warm',
          touches: 1,
          lastSeenAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          context: { botId: params.botId, siteId: payload.siteId || null },
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
        source: 'chat_widget',
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

    return respond({ ok: true, data: responseData, requestId });
  } catch (error) {
    console.error('[bot/chat] error', error);
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
    if (error instanceof z.ZodError) {
      return respond(
        {
          ok: false,
          error: {
            code: 'invalid_payload',
            message: 'Invalid payload',
            details: error.errors,
          },
          requestId,
        },
        { status: 400 }
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
    logError(scope, error, { requestId });
    return errorResponse(requestId, scope);
  }
}
