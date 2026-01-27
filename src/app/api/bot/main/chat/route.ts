import { NextRequest } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { getGoogleModel, PRO_MODEL, FLASH_MODEL } from '@/lib/ai/google';
import { mainSystemPrompt } from '@/config/prompts';
import { formatProjectContext, getRelevantProjects } from '@/server/inventory';
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

class MissingAIKeyError extends Error {}

const LEAD_INTENT_KEYWORDS = [
  'interested',
  'ready to buy',
  'contact',
  'call me',
  'whatsapp',
  'email me',
  'book',
  'visit',
  'show me',
  'proposal',
  'quote',
  'price',
  'schedule',
  'demo',
  'send brochure',
  'availability',
  'call back',
  'follow up',
];

export async function POST(req: NextRequest) {
  const scope = 'api/bot/main/chat';
  const requestId = createRequestId();
  const path = req.url;
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    await enforceUsageLimit(getAdminDb(), tenantId, 'ai_conversations', 1);
    const body = await req.json();
    const payload = requestSchema.parse(body);

    const db = getAdminDb();
    const history = (payload.history || []).map((entry) => ({
      role: entry.role,
      text: entry.text,
    }));

    let agentKnowledge = '';
    try {
      const agentSnapshot = await db
        .collection('tenants')
        .doc(tenantId)
        .collection('agents')
        .limit(1)
        .get();
      if (!agentSnapshot.empty) {
        const agentId = agentSnapshot.docs[0].id;
        const knowledgeSnapshot = await db
          .collection('tenants')
          .doc(tenantId)
          .collection('agents')
          .doc(agentId)
          .collection('knowledge')
          .get();
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
      console.error('[bot/main/chat] agent knowledge scan failed', error);
    }

    let relevantProjects: Awaited<ReturnType<typeof getRelevantProjects>> = [];
    try {
      relevantProjects = await getRelevantProjects(
        payload.message,
        history.map((entry) => `${entry.role}: ${entry.text}`).join('\n'),
        8
      );
    } catch (error) {
      console.error('[bot/main/chat] inventory context failed', error);
    }

    const projectContext = relevantProjects.length
      ? `\nRelevant listings:\n${relevantProjects
          .map(formatProjectContext)
          .join('\n')}`
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

    const messages = history.map((entry) => ({
      role: entry.role === 'user' ? 'user' : 'assistant',
      content: entry.text,
    }));
    messages.push({ role: 'user', content: payload.message });
    const lastAssistantEntry = [...history]
      .reverse()
      .find((entry) => entry.role === 'agent');

    let reply = '';
    try {
      reply = await generateUniqueReply(
        messages,
        systemPrompt,
        lastAssistantEntry?.text
      );
    } catch (generateError) {
      if (generateError instanceof MissingAIKeyError) {
        logError(scope, generateError, { requestId, tenantId, path });
        return respond(
          {
            ok: false,
            error: 'missing_api_key',
            message:
              'AI is not configured. Set GEMINI_API_KEY to enable conversational replies.',
            missing: ['GEMINI_API_KEY'],
            requestId,
          },
          { status: 503 }
        );
      }
      logError(scope, generateError, { requestId, tenantId, path });
      return respond(
        {
          ok: false,
          scope: 'ai',
          message: 'AI is temporarily unavailable. Please try again shortly.',
          requestId,
        },
        { status: 503 }
      );
    }

    const storedMessages = [
      ...history,
      { role: 'user', text: payload.message },
      { role: 'agent', text: reply },
    ];
    const leadIntent = analyzeLeadIntent(storedMessages.map((entry) => entry.text));

    const conversationRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('chatThreads')
      .doc();
    const now = new Date().toISOString();
    await conversationRef.set({
      id: conversationRef.id,
      createdAt: now,
      updatedAt: now,
      lastUserMessage: payload.message,
      messages: storedMessages,
      status: 'active',
      leadIntent: leadIntent.flag,
      leadIntentReason: leadIntent.reason ?? null,
    });

    if (leadIntent.flag) {
      void upsertChatLead(db, tenantId, storedMessages, payload.message, conversationRef.id);
    }

    const responseData = {
      reply,
      threadId: conversationRef.id,
      history: storedMessages,
      leadIntent,
    };

    return respond({
      ok: true,
      data: responseData,
      ...responseData,
      requestId,
    });
  } catch (error: unknown) {
    logError(scope, error, { url: path, requestId });
    if (error instanceof z.ZodError) {
      return respond(
        {
          ok: false,
          scope,
          message: 'Invalid request payload.',
          error: error.errors,
          requestId,
        },
        { status: 400 }
      );
    }
    if (error instanceof PlanLimitError) {
      return respond(
        {
          ok: false,
          scope,
          message: 'Plan limit reached',
          error: planLimitErrorResponse(error),
          requestId,
        },
        { status: 402 }
      );
    }
    if (error instanceof UnauthorizedError) {
      return respond(
        { ok: false, scope: 'auth', message: 'Unauthorized', requestId },
        { status: 401 }
      );
    }
    if (error instanceof ForbiddenError) {
      return respond(
        { ok: false, scope: 'auth', message: 'Forbidden', requestId },
        { status: 403 }
      );
    }
    return errorResponse(requestId, scope);
  }
}

async function upsertChatLead(
  db: ReturnType<typeof getAdminDb>,
  tenantId: string,
  messages: Array<{ role: 'user' | 'agent'; text: string }>,
  latestMessage: string,
  threadId: string
) {
  try {
    const messageText = messages.map((entry) => entry.text).join(' ');
    const emailMatch = messageText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/i)?.[0];
    const phoneMatch = messageText.match(/\\+?\\d[\\d\\s-]{6,}\\d/)?.[0];
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
          message: latestMessage,
          source: 'Chat Agent',
        })
      );
      await db
        .collection('tenants')
        .doc(tenantId)
        .collection('chatThreads')
        .doc(threadId)
        .set({ leadId: existing.id }, { merge: true });
      return;
    }

    await enforceUsageLimit(db, tenantId, 'leads', 1);

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
        message: latestMessage,
        source: 'Chat Agent',
        status: 'New',
        priority: 'Warm',
        touches: 1,
        lastSeenAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        context: { threadId, channel: 'chat' },
      });
    await db
      .collection('tenants')
      .doc(tenantId)
      .collection('chatThreads')
      .doc(threadId)
      .set({ leadId: leadRef.id }, { merge: true });
  } catch (error) {
    console.error('[bot/main/chat] lead upsert failed', error);
  }
}

function analyzeLeadIntent(candidates: string[]) {
  const normalized = candidates.map((value) => value.toLowerCase()).join(' ');
  for (const keyword of LEAD_INTENT_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return { flag: true, reason: `Detected intent: ${keyword}` };
    }
  }
  const emailMatch = normalized.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/i);
  if (emailMatch) {
    return { flag: true, reason: 'Email detected' };
  }
  const phoneMatch = normalized.match(/\\+?\\d[\\d\\s-]{6,}\\d/);
  if (phoneMatch) {
    return { flag: true, reason: 'Phone number detected' };
  }
  return { flag: false };
}

async function generateReply(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string
) {
  try {
    return await attemptModel(PRO_MODEL, systemPrompt, messages);
  } catch (error) {
    if (error instanceof MissingAIKeyError) {
      throw error;
    }
    console.warn('[bot/main/chat] pro model fallback', error);
  }
  return attemptModel(FLASH_MODEL, systemPrompt, messages);
}

async function generateUniqueReply(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string,
  previousAssistantText?: string
) {
  const normalizedPrevious = previousAssistantText?.trim();
  let reply = await generateReply(messages, systemPrompt);
  const trimmedReply = reply.trim();
  if (
    normalizedPrevious &&
    trimmedReply.length > 0 &&
    trimmedReply === normalizedPrevious
  ) {
    console.info('[bot/main/chat] detected repetitive assistant reply, requesting variation');
    const variationPrompt = `${systemPrompt}\nAvoid repeating your previous answer and offer a fresh phrasing while keeping the same guidance.`;
    const variation = await generateReply(messages, variationPrompt);
    if (variation.trim() && variation.trim() !== trimmedReply) {
      reply = variation;
    }
  }
  return reply;
}

async function attemptModel(
  modelId: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
) {
  const model = resolveModel(modelId);
  try {
    const { text } = await generateText({
      model,
      system: `${mainSystemPrompt}\nAlways be clear, helpful, and broker-friendly.\n${systemPrompt}`,
      messages,
    });
    return text;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Google Generative AI API key is not configured')
    ) {
      throw new MissingAIKeyError(error.message);
    }
    throw error;
  }
}

function resolveModel(modelId: string) {
  try {
    return getGoogleModel(modelId);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Google Generative AI API key is not configured')
    ) {
      throw new MissingAIKeyError(error.message);
    }
    throw error;
  }
}
