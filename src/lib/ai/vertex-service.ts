import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { getGoogleModel, FLASH_MODEL, PRO_MODEL } from '@/lib/ai/google'; // Import PRO_MODEL if still needed for other functions

// Simulate fetching PDF content and extracting text
// In a real application, this would involve a server-side PDF parsing library
// or an external service that can convert PDF to text from a given URL.
async function fetchPdfContent(url: string): Promise<string> {
    console.log(`Simulating PDF content fetch for: ${url}`);
    // This is a mock implementation.
    // In a real scenario, you'd use a library like 'pdf-parse' or an external API.
    return `
    Brochure Content Summary:
    This luxury property features 3 bedrooms, 4 bathrooms, and a stunning ocean view.
    Located in Palm Jumeirah, Dubai. Amenities include a private pool, gym, and 24/7 concierge service.
    Contact us for exclusive viewing.
    Price: 5,000,000 AED.
    Bedrooms: 3
    Bathrooms: 4
    Area: 3000 sqft
    Developer: Elite Properties
    Keywords: luxury, dubai, palm jumeirah, ocean view, exclusive
    `;
}

export const generateSiteStructure = async (prompt: string, brochureUrl?: string) => {
    let brochureContent = '';
    if (brochureUrl) {
        brochureContent = await fetchPdfContent(brochureUrl);
    }

    let finalPrompt = `Design a high-fidelity landing page for: "${prompt}"`;
    let systemInstructionBrochurePart = '';

    if (brochureContent) {
        finalPrompt = `Design a high-fidelity landing page based on the following brochure content:
        ---
        ${brochureContent}
        ---
        Use this content to generate relevant blocks, text, and SEO data. Prioritize using "ready blocks" for the structure.`;
        systemInstructionBrochurePart = 'Leverage the provided brochure content to inform the page structure, text, and details.';
    } else if (brochureUrl) {
        // Fallback if content extraction failed or was not implemented, still pass URL
        finalPrompt = `Design a high-fidelity landing page based on the content from this brochure: ${brochureUrl}. Use the brochure content to generate relevant blocks, text, and SEO data. Prioritize using "ready blocks" for the structure.`;
        systemInstructionBrochurePart = 'Leverage the provided brochure content to inform the page structure, text, and details.';
    }


    return generateObject({
        model: getGoogleModel(FLASH_MODEL), // Changed to FLASH_MODEL
        schema: z.object({
            title: z.string(),
            description: z.string(),
            blocks: z.array(z.object({
                type: z.enum([
                    'hero', 'launch-hero', 'stats', 'listing-grid',
                    'chat-agent', 'sms-lead', 'roi-calculator',
                    'gallery', 'faq', 'contact-details'
                ]),
                data: z.record(z.any())
            })),
            seo: z.object({
                title: z.string(),
                description: z.string(),
                keywords: z.array(z.string())
            })
        }),
        system: `You are the Entrestate AI Architect. Design high-converting real estate landing pages.
                 Always include a chat-agent and an sms-lead block.
                 ${systemInstructionBrochurePart}
                 Ensure you use "ready blocks" from the available types.`, // Added instruction for ready blocks
        prompt: finalPrompt,
    });
};

export const generateMarketingCopy = async (context: string) => {
    // USE FLASH for marketing copy - much faster and extremely cheap
    const { text } = await generateText({
        model: getGoogleModel(FLASH_MODEL),
        system: "You are a world-class real estate copywriter. Be concise.",
        prompt: `Write 3 ad headlines and 2 descriptions for: ${context}.`,
    });
    return text;
};
