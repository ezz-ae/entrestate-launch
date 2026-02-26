import { generateText as aiGenerateText } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
export const generateText = aiGenerateText;

export interface GenerateAdsInput {
  content: string;
  targetAudience?: string;
}

export interface SuggestNextBlocksInput {
  currentBlocks: any[];
  pageContext: string;
}

export async function generateAdsFromPageContent(input: GenerateAdsInput) {
  const prompt = `
    Analyze the following real estate project content and generate Google Search Ad components.
    Content: ${input.content}
    Target Audience: ${input.targetAudience || 'General Investors'}

    Return a JSON object with:
    1. headlines: Array of 5 punchy headlines (max 30 chars each).
    2. descriptions: Array of 3 descriptions (max 90 chars each).
    3. baseKeywords: Array of 10 high-intent search keywords.
    4. estimatedCpc: A realistic estimated CPC in AED (number).
  `;

  const { text } = await aiGenerateText({
    model: google('gemini-1.5-flash'),
    system: "You are a world-class Google Ads strategist for luxury real estate in the UAE.",
    prompt: prompt,
  });

  try {
    // Extract JSON from the response (handling potential markdown blocks)
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse AI ad response:", text);
    return {
      headlines: ["Luxury Living", "Prime Investment"],
      descriptions: ["Discover the pinnacle of luxury."],
      baseKeywords: ["real estate", "investment"],
      estimatedCpc: 3.5
    };
  }
}

export async function suggestNextBlocksFlow(input: SuggestNextBlocksInput) {
  const prompt = `
    Based on the current website blocks and context, suggest the next 3 logical sections to add to this real estate landing page.
    Current Blocks: ${JSON.stringify(input.currentBlocks)}
    Context: ${input.pageContext}

    Return a JSON array of objects, each with:
    1. type: The block type (e.g., 'features', 'testimonials', 'faq', 'pricing', 'cta').
    2. reason: Why this block is suggested for this specific project.
    3. content: A brief description of what the content should be.
  `;

  const { text } = await aiGenerateText({
    model: google('gemini-1.5-flash'),
    system: "You are an expert conversion rate optimization (CRO) specialist for real estate.",
    prompt: prompt,
  });

  try {
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse AI block suggestions:", text);
    return [];
  }
}