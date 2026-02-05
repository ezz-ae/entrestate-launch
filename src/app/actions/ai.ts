'use server';

import { generateText } from 'ai';
import { generateAdsFromPageContent, GenerateAdsInput, suggestNextBlocksFlow, SuggestNextBlocksInput } from '@/ai';
import { getGoogleModel, FLASH_MODEL } from '@/lib/ai/google';

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
    const model = getGoogleModel(FLASH_MODEL);
    const { text } = await generateText({
      model,
      prompt: `Generate a landing page structure for a real estate project. Input: ${JSON.stringify(input)}. Return a JSON object with a list of sections (hero, features, gallery, contact).`,
    });
    
    // Attempt to parse JSON if the model returns it wrapped in markdown
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
    
    let sections;
    try {
      sections = JSON.parse(jsonString);
    } catch {
      sections = { raw: text };
    }

    return { success: true, sections };
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
    const model = getGoogleModel(FLASH_MODEL);
    const { text } = await generateText({
      model,
      prompt: `Write a professional real estate email. Context: ${JSON.stringify(input)}. Return JSON with "subject" and "body".`,
    });

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

    let emailContent;
    try {
      emailContent = JSON.parse(jsonString);
    } catch {
        // Fallback if not valid JSON
        const parts = text.split('\n');
        const subject = parts.find(p => p.toLowerCase().startsWith('subject:'))?.replace(/^subject:\s*/i, '') || 'Real Estate Update';
        emailContent = { subject, body: text };
    }

    return { success: true, ...emailContent };
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
    const model = getGoogleModel(FLASH_MODEL);
    const { text } = await generateText({
      model,
      prompt: `Write a short, engaging real estate SMS (under 160 chars). Context: ${JSON.stringify(input)}.`,
    });

    return { success: true, message: text.trim() };
  } catch (error) {
    console.error('Error generating SMS:', error);
    throw new Error('Failed to generate SMS');
  }
}
