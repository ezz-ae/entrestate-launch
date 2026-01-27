
import type { SitePage } from '@/lib/types';
import { authorizedFetch } from '@/lib/auth-fetch';

/**
 * Represents the result of a site publishing operation using Vercel.
 */
export interface VercelPublishResult {
  siteId: string;
  publishedUrl: string;
  deploymentId: string;
  agentId?: string; // Add agentId to the result interface
}

/**
 * Publishes a site by invoking the dedicated Vercel deployment API endpoint.
 *
 * @param {SitePage} page - The site page object to be published.
 * @param {string} [agentId] - The ID of the chat agent to integrate with the published site.
 * @returns {Promise<VercelPublishResult>} A promise that resolves with the publishing result.
 * @throws Will throw an error if the publishing process fails.
 */
export const publishSite = async (page: SitePage, agentId?: string): Promise<VercelPublishResult> => {
  if (!page.id) {
    throw new Error('Site must be saved before publishing.');
  }

  try {
    const response = await authorizedFetch('/api/publish/vercel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ siteId: page.id, agentId }), // Pass agentId in the body
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.ok) {
      const message =
        payload?.error ||
        payload?.message ||
        'An unknown error occurred during publishing.';
      throw new Error(message);
    }

    return payload.data as VercelPublishResult;

  } catch (error) {
    console.error("Publishing Error:", error);
    throw error;
  }
};
