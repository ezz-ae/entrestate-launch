export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import { requireAuth } from '@/lib/server/auth';
import { getChatAgentByUserId, listChatAgentVersions, upsertChatAgentProfile } from '@/server/repositories';

const profileSchema = z.object({
  agentName: z.string().min(1),
  companyName: z.string().optional(),
  communicationStyle: z.string().optional(),
  companyDetails: z.string().optional(),
  exclusiveListing: z.string().optional(),
  contactDetails: z.string().optional(),
  textData: z.string().optional(),
  state: z.string().optional(),
  fileUrls: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  const requestId = createRequestId();
  const scope = 'api/chat-agent/profile';
  try {
    const auth = await requireAuth(req);
    const agent = await getChatAgentByUserId(auth.uid);
    const versions = agent ? await listChatAgentVersions(agent.id) : [];
    return jsonWithRequestId(requestId, { ok: true, data: { agent, versions }, requestId });
  } catch (error) {
    console.error('[chat-agent] profile get error', error);
    return errorResponse(requestId, scope);
  }
}

export async function POST(req: NextRequest) {
  const requestId = createRequestId();
  const scope = 'api/chat-agent/profile';
  try {
    const auth = await requireAuth(req);
    const payload = profileSchema.parse(await req.json().catch(() => ({})));

    const agent = await upsertChatAgentProfile({
      tenantId: auth.tenantId,
      userId: auth.uid,
      name: payload.agentName,
      companyName: payload.companyName ?? null,
      style: payload.communicationStyle ?? null,
      systemPrompt: payload.textData ?? null,
      profile: payload.companyDetails ? { details: payload.companyDetails } : {},
      listings: payload.exclusiveListing ? [payload.exclusiveListing] : [],
      contact: payload.contactDetails ? { info: payload.contactDetails } : {},
      fileUrls: payload.fileUrls ?? [],
      state: payload.state ?? 'active',
    });

    const versions = await listChatAgentVersions(agent.id);

    return jsonWithRequestId(requestId, { ok: true, data: { agent, versions }, requestId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonWithRequestId(
        requestId,
        { ok: false, error: { message: 'Invalid payload', scope, details: error.errors }, requestId },
        { status: 400 }
      );
    }
    console.error('[chat-agent] profile update error', error);
    return errorResponse(requestId, scope);
  }
}
