import { prisma } from '@/server/db';

export type ChatAgentProfileInput = {
  tenantId?: string | null;
  userId: string;
  name: string;
  companyName?: string | null;
  style?: string | null;
  systemPrompt?: string | null;
  profile?: Record<string, unknown> | null;
  listings?: unknown[] | null;
  tools?: unknown[] | null;
  contact?: Record<string, unknown> | null;
  constraints?: Record<string, unknown> | null;
  fileUrls?: string[] | null;
  state?: string | null;
};

export async function getChatAgentByUserId(userId: string) {
  return prisma.chatAgent.findFirst({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function listChatAgentVersions(agentId: string) {
  return prisma.agentVersion.findMany({
    where: { agentId },
    orderBy: { version: 'desc' },
  });
}

export async function upsertChatAgentProfile(input: ChatAgentProfileInput) {
  const existing = await getChatAgentByUserId(input.userId);
  const nextVersion = (existing?.version ?? 0) + 1;

  const agent = existing
    ? await prisma.chatAgent.update({
        where: { id: existing.id },
        data: {
          tenantId: input.tenantId ?? existing.tenantId,
          name: input.name,
          companyName: input.companyName ?? undefined,
          style: input.style ?? undefined,
          systemPrompt: input.systemPrompt ?? undefined,
          profile: input.profile ?? undefined,
          listings: input.listings ?? undefined,
          tools: input.tools ?? undefined,
          contact: input.contact ?? undefined,
          constraints: input.constraints ?? undefined,
          fileUrls: input.fileUrls ?? undefined,
          state: input.state ?? undefined,
          version: nextVersion,
        },
      })
    : await prisma.chatAgent.create({
        data: {
          tenantId: input.tenantId ?? null,
          userId: input.userId,
          name: input.name,
          companyName: input.companyName ?? undefined,
          style: input.style ?? undefined,
          systemPrompt: input.systemPrompt ?? undefined,
          profile: input.profile ?? undefined,
          listings: input.listings ?? undefined,
          tools: input.tools ?? undefined,
          contact: input.contact ?? undefined,
          constraints: input.constraints ?? undefined,
          fileUrls: input.fileUrls ?? undefined,
          state: input.state ?? undefined,
          version: nextVersion,
        },
      });

  await prisma.agentVersion.create({
    data: {
      agentId: agent.id,
      version: agent.version,
      systemPrompt: agent.systemPrompt ?? null,
      profile: agent.profile ?? null,
      listings: agent.listings ?? null,
      constraints: agent.constraints ?? null,
    },
  });

  return agent;
}
