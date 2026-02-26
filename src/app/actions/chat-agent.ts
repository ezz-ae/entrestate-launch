'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'

const ChatAgentSchema = z.object({
  agentName: z.string().min(1, "Name is required"),
  companyName: z.string().min(1, "Company name is required"),
  communicationStyle: z.string(),
  companyDetails: z.string().optional().nullable(),
  exclusiveListing: z.string().optional().nullable(),
  contactDetails: z.string().optional().nullable(),
  textData: z.string().optional().nullable(),
  fileUrls: z.array(z.string()).optional(),
  state: z.enum(['draft', 'configured', 'active', 'paused', 'archived']).optional(),
})

export async function updateChatAgentKnowledge(userId: string, data: any) {
  const result = ChatAgentSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  const validatedData = result.data

  const existing = await prisma.chatAgent.findFirst({ where: { userId } });
  const profile = {
    companyDetails: validatedData.companyDetails ?? null,
    textData: validatedData.textData ?? null,
  };
  const listings = validatedData.exclusiveListing
    ? { notes: validatedData.exclusiveListing }
    : undefined;
  const contact = validatedData.contactDetails
    ? { details: validatedData.contactDetails }
    : undefined;

  const agent = existing
    ? await prisma.chatAgent.update({
        where: { id: existing.id },
        data: {
          name: validatedData.agentName,
          companyName: validatedData.companyName,
          style: validatedData.communicationStyle,
          profile,
          listings,
          contact,
          state: validatedData.state,
          fileUrls: validatedData.fileUrls,
        },
      })
    : await prisma.chatAgent.create({
        data: {
          userId,
          name: validatedData.agentName,
          companyName: validatedData.companyName,
          style: validatedData.communicationStyle,
          profile,
          listings,
          contact,
          state: validatedData.state || 'configured',
          fileUrls: validatedData.fileUrls,
        },
      })

  return { success: true, data: agent }
}
