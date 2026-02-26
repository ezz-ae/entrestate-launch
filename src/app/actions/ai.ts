'use server';

import { generateAdsFromPageContent, GenerateAdsInput, suggestNextBlocksFlow, SuggestNextBlocksInput, generateText } from '@/ai';
import { resolveTenantForExport } from './leads';
import { prisma } from '@/server/db';

/**
 * Server action to generate Google Ads from page content.
 * This function is executed only on the server.
 */
export async function generateGoogleAdsAction(input: GenerateAdsInput) {
  try {
    const output = await generateAdsFromPageContent(input);
    return output;
  } catch (error) {
    console.error('Error generating Google Ads:', error);
    throw new Error('Failed to generate ads from AI');
  }
}

/**
 * Server action for suggesting the next blocks.
 * This function is executed only on the server.
 */
export async function suggestNextBlocksAction(input: SuggestNextBlocksInput) {
  try {
    const output = await suggestNextBlocksFlow(input);
    return output;
  } catch (error) {
    console.error('Error suggesting next blocks:', error);
    throw new Error('Failed to suggest next blocks from AI');
  }
}

/**
 * Server action to generate a site.
 * This function is executed only on the server.
 */
export async function generateSiteAction(input: any) {
  try {
    const prompt = `Generate a comprehensive website structure and copy for a real estate project based on these inputs: ${JSON.stringify(input)}. Include sections for Hero, Features, Location, and Contact.`;
    const output = await generateText({
      model: 'gemini-1.5-flash',
      system: "You are an expert real estate web conversion strategist.",
      prompt: prompt
    });
    return { success: true, siteData: output };
  } catch (error) {
    console.error('Error generating site:', error);
    throw new Error('Failed to generate site');
  }
}

/**
 * Server action to generate an email.
 * This function is executed only on the server.
 */
export async function generateEmailAction(input: any) {
  try {
    const prompt = `Create a high-converting real estate email campaign for: ${JSON.stringify(input)}. Focus on professional tone and clear CTA.`;
    const output = await generateText({
      model: 'gemini-1.5-flash',
      system: "You are a senior real estate copywriter.",
      prompt: prompt
    });
    return { success: true, emailContent: output };
  } catch (error) {
    console.error('Error generating email:', error);
    throw new Error('Failed to generate email');
  }
}

/**
 * Server action to generate an SMS.
 * This function is executed only on the server.
 */
export async function generateSmsAction(input: any) {
  try {
    const prompt = `Generate a short, punchy real estate SMS for: ${JSON.stringify(input)}. Must be under 160 characters and include a link placeholder.`;
    const output = await generateText({
      model: 'gemini-1.5-flash',
      system: "You are an expert in mobile real estate marketing.",
      prompt: prompt
    });
    return { success: true, smsContent: output };
  } catch (error) {
    console.error('Error generating SMS:', error);
    throw new Error('Failed to generate SMS');
  }
}

/**
 * Generates a system prompt and script for an AI Cold Calling voice agent.
 */
export async function generateColdCallScriptAction(projectId: string, focus: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("Project not found");
  const projectTitle = project.title || (project.dataJson as any)?.headline || 'Project';
  const projectCity = project.city || (project.dataJson as any)?.city || 'UAE';

  const prompt = `
    Generate a cold calling script for an AI voice agent.
    Project: ${projectTitle}
    Location: ${projectCity}
    Focus: ${focus} (e.g., Luxury Investment, First-time Buyer)
    
    The script should include:
    1. A hook that mentions the specific project benefits.
    2. Qualification questions (budget, timeline).
    3. Objection handling for "I'm just looking" or "Market is too high".
    4. A clear CTA to book a WhatsApp viewing or a site visit.
    
    Format the output as a System Prompt for the voice agent, defining its persona and the conversation flow.
  `;

  try {
    // This uses the internal AI utility to call the LLM
    const script = await generateText({
      model: 'gemini-1.5-flash',
      system: "You are an expert real estate sales trainer specializing in UAE markets.",
      prompt: prompt
    });

    return { success: true, script };
  } catch (error) {
    console.error('Error generating cold call script:', error);
    throw new Error('Failed to generate AI script');
  }
}

/**
 * Generates an AI summary of a lead's professional background and interest.
 */
export async function summarizeLeadAction(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) throw new Error("Lead not found");

  const enrichment = (lead.utmJson as any)?.screening?.enrichment;
  if (!enrichment || !enrichment.job_title) {
    return { success: true, summary: "Professional background data not available for this lead." };
  }

  const prompt = `
    Summarize this lead's professional background and potential interest in real estate investment.
    Name: ${lead.name}
    Job Title: ${enrichment.job_title}
    Company: ${enrichment.company_name || 'Unknown'}
    Seniority: ${enrichment.seniority || 'Unknown'}
    
    Provide a concise 2-sentence summary highlighting why they are a high-value prospect for property investment.
  `;

  try {
    const summary = await generateText({
      model: 'gemini-1.5-flash',
      system: "You are a real estate investment analyst.",
      prompt: prompt
    });

    return { success: true, summary };
  } catch (error) {
    console.error('Error summarizing lead:', error);
    throw new Error('Failed to generate lead summary');
  }
}

/**
 * Generates a personalized WhatsApp message to revive a lead.
 */
export async function generateReviveLeadMessageAction(leadId: string, projectId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!lead || !project) throw new Error("Lead or Project not found");

  const jobTitle = (lead.utmJson as any)?.screening?.enrichment?.job_title || 'Investor';
  const name = lead.name || 'there';
  const projectTitle = project.title || (project.dataJson as any)?.headline || 'Project';
  const projectCity = project.city || (project.dataJson as any)?.city || 'UAE';

  const prompt = `
    Write a short, personalized WhatsApp message to re-engage a real estate lead.
    Lead Name: ${name}
    Lead Job Title: ${jobTitle}
    Project: ${projectTitle}
    Location: ${projectCity}
    
    The message should:
    1. Be professional yet conversational (WhatsApp style).
    2. Reference their background as a ${jobTitle} if relevant.
    3. Mention a new update or exclusive insight about ${project.headline}.
    4. End with a low-friction question to start a conversation.
    5. Use emojis sparingly.
    6. Keep it under 300 characters.
  `;

  try {
    const message = await generateText({
      model: 'gemini-1.5-flash',
      system: "You are a high-end real estate consultant in the UAE specializing in personalized follow-ups.",
      prompt: prompt
    });

    return { success: true, message };
  } catch (error) {
    console.error('Error generating revive message:', error);
    throw new Error('Failed to generate AI message');
  }
}

/**
 * Generates a personalized follow-up campaign for a group of high-intent leads.
 */
export async function generateBulkReviveCampaignAction(leadIds: string[], projectId: string) {
  const leads = await prisma.lead.findMany({
    where: { id: { in: leadIds } },
  });
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!leads || !project) throw new Error("Data not found");

  const leadSummaries = leads.map(l => 
    `- ${l.name} (${(l.utmJson as any)?.screening?.enrichment?.job_title || 'Investor'})`
  ).join('\n');
  const projectTitle = project.title || (project.dataJson as any)?.headline || 'Project';
  const projectCity = project.city || (project.dataJson as any)?.city || 'UAE';

  const prompt = `
    Generate a personalized follow-up campaign strategy for the following high-intent leads:
    ${leadSummaries}

    Project: ${projectTitle}
    Location: ${projectCity}

    Provide:
    1. A unified campaign theme.
    2. A template for a personalized email.
    3. A template for a short WhatsApp follow-up.
    
    Focus on the professional background of these leads and why this project fits their portfolio.
  `;

  try {
    const campaign = await generateText({
      model: 'gemini-1.5-flash',
      system: "You are a senior real estate marketing strategist specializing in high-net-worth individuals.",
      prompt: prompt
    });

    return { success: true, campaign };
  } catch (error) {
    console.error('Error generating bulk campaign:', error);
    throw new Error('Failed to generate campaign');
  }
}

/**
 * Generates a smart sequence for a specific campaign type.
 */
export async function generateSmartSequenceAction(leadIds: string[], projectId: string, campaignType: string) {
  const leads = await prisma.lead.findMany({
    where: { id: { in: leadIds } },
  });
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!leads || !project) throw new Error("Data not found");

  const leadContext = leads.map(l => 
    `${l.name} (${(l.utmJson as any)?.screening?.enrichment?.job_title || 'Investor'})`
  ).join(', ');
  const projectTitle = project.title || (project.dataJson as any)?.headline || 'Project';
  const projectCity = project.city || (project.dataJson as any)?.city || 'UAE';

  const prompt = `
    Generate a 3-step smart sequence for a real estate outreach campaign.
    Campaign Type: ${campaignType}
    Leads: ${leadContext}
    Project: ${projectTitle}
    Location: ${projectCity}

    The sequence should include:
    1. Step 1: Immediate Hook (WhatsApp/SMS style)
    2. Step 2: Value Add (Email style with details)
    3. Step 3: Scarcity/Closing (WhatsApp/SMS style)

    Format the output clearly with Step labels.
  `;

  try {
    const sequence = await generateText({
      model: 'gemini-1.5-flash',
      system: "You are a world-class real estate growth hacker and copywriter.",
      prompt: prompt
    });

    return { success: true, sequence };
  } catch (error) {
    console.error('Error generating smart sequence:', error);
    throw new Error('Failed to generate sequence');
  }
}

/**
 * Fetches AI chat conversation logs for a specific project from Firestore.
 */
export async function getChatsAction(projectId: string) {
  const chats = await prisma.chatSession.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });

  return chats.map((chat) => ({
    id: chat.id,
    projectId: chat.projectId,
    humanTakeover: chat.humanTakeover,
    conversation: chat.conversation || [],
    createdAt: chat.createdAt,
  }));
}

/**
 * Toggles human takeover for a chat session.
 */
export async function toggleHumanTakeoverAction(chatId: string, enabled: boolean) {
  await prisma.chatSession.update({
    where: { id: chatId },
    data: { humanTakeover: enabled },
  });
  return { success: true };
}

/**
 * Connects the chat agent to Instagram DMs.
 */
export async function connectInstagramDMAction(projectId: string, handle: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new Error('Project not found');
  }
  const nextData = {
    ...(project.dataJson as any),
    instagramHandle: handle,
    dmConnected: true,
  };
  await prisma.project.update({
    where: { id: projectId },
    data: { dataJson: nextData },
  });
  return { success: true, message: `Successfully connected @${handle} to AI Assistant.` };
}

/**
 * Sends a message as a human agent in a chat session.
 */
export async function sendHumanMessageAction(chatId: string, content: string) {
  const session = await prisma.chatSession.findUnique({ where: { id: chatId } });
  if (!session) {
    throw new Error('Chat not found');
  }
  const conversation = Array.isArray(session.conversation) ? session.conversation : [];
  conversation.push({
    role: 'agent',
    content,
    timestamp: new Date().toISOString(),
    isHuman: true,
  });
  await prisma.chatSession.update({
    where: { id: chatId },
    data: { conversation },
  });
  
  return { success: true };
}

/**
 * Fetches the branding kit for the current user.
 */
export async function getBrandKitAction() {
  const tenantId = await resolveTenantForExport();
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  return tenant?.brandKit || null;
}

/**
 * Updates the branding kit for a user/tenant.
 */
export async function updateBrandKitAction(brandKit: { logo?: string, primaryColor?: string, quickReplies?: string[] }) {
  const tenantId = await resolveTenantForExport();
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { brandKit },
  });
  
  return { success: true };
}

/**
 * Fetches the branding kit for a specific project's owner.
 */
export async function getProjectBrandingAction(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project?.tenantId) return null;
  const tenant = await prisma.tenant.findUnique({ where: { id: project.tenantId } });
  return tenant?.brandKit || null;
}
