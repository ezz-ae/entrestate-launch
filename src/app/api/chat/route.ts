import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { mainSystemPrompt } from '@/config/prompts';
import { getGoogleModel, FLASH_MODEL } from '@/lib/ai/google';
import { formatProjectContext, getRelevantProjects } from '@/server/inventory';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import {
  enforceUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { getAdminDb } from '@/server/firebase-admin';

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
      return NextResponse.json({ reply: 'Invalid request payload.', error: error.errors }, { status: 400 });
    }
    if (error instanceof PlanLimitError) {
      return NextResponse.json(
        { reply: 'Plan limit reached', error: planLimitErrorResponse(error) },
        { status: 402 },
      );
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ reply: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ reply: 'Invalid request payload.' }, { status: 400 });
  }

  const db = getAdminDb();
  let agentKnowledge = '';
  try {
    const agentSnapshot = await db.collection('tenants').doc(tenantId).collection('agents').limit(1).get();
    if (!agentSnapshot.empty) {
      const agentId = agentSnapshot.docs[0].id;
      const knowledgeSnapshot = await db.collection('tenants').doc(tenantId).collection('agents').doc(agentId).collection('knowledge').get();
      if (!knowledgeSnapshot.empty) {
        knowledgeSnapshot.docs.forEach(doc => {
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

  let relevantProjects: Awaited<ReturnType<typeof getRelevantProjects>> = [];
  try {
    relevantProjects = await getRelevantProjects(payload.message, historyText, 8);
  } catch (error) {
    console.error('[chat] inventory context failed', error);
  }

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

  try {
    const { text } = await generateText({
      model: getGoogleModel(FLASH_MODEL),
      system: `${mainSystemPrompt}\nAlways be clear, helpful, and broker-friendly.\n${systemPrompt}`,
      messages,
    });

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('[chat] ai error', error);
    const fallbackList = relevantProjects.slice(0, 3).map(formatProjectContext).join('\n');
    const fallbackReply = fallbackList
      ? `Here are a few options I can share right now:\n${fallbackList}\nTell me your budget and preferred area, and I will narrow it down.`
      : 'I can help with UAE projects, pricing ranges, and next steps. What area and budget should I focus on?';
    return NextResponse.json({ reply: fallbackReply });
  }
}
