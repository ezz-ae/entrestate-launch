'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getGoogleAdsCustomer, validateGoogleAdsCredentials, generateAuthUrl, refreshAccessToken, removeGoogleAdsTokensFromFirestore } from '@/lib/google-ads';

export async function getUserProjects() {
  const supabase = await createSupabaseServerClient();
  // Fetch projects to populate the dropdown
  const { data } = await supabase
    .from('projects')
    .select('id, headline, description, original_filename')
    .order('created_at', { ascending: false });
    
  return data || [];
}

export async function generateAdConfig(projectId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  
  if (!project) throw new Error("Project not found");

  // Default / Fallback Data
  let headlines = [
    project.headline?.slice(0, 30) || "Luxury Apartments",
    "Official Launch",
    "High ROI Investment"
  ];
  let descriptions = [
    project.description?.slice(0, 90) || "Discover premium living spaces designed for comfort and style.",
    "Register your interest today for exclusive offers and payment plans."
  ];
  let baseKeywords = [
    "buy apartment",
    "real estate investment",
    "luxury property",
    "off plan projects"
  ];
  let estimatedCpc = 3.5;

  // Attempt to fetch real data from Google Ads API
  try {
    const customer = await getGoogleAdsCustomer();
    if (customer) {
      // Generate keyword ideas based on the project headline
      const keywordIdeas = await customer.keywordPlanIdeas.generateKeywordIdeas({
        customer_id: customer.credentials.customer_id,
        keyword_seed: {
          keywords: [project.headline || "real estate dubai", "buy property investment"],
        },
        include_adult_keywords: false,
        // geo_target_constants: ['geoTargetConstants/1004074'], // e.g., UAE (1004074)
      });

      if (keywordIdeas.length > 0) {
        // Use the top 10 keywords
        baseKeywords = keywordIdeas.slice(0, 10).map(k => k.text);

        // Calculate average CPC from the returned metrics (micros to currency)
        const validMetrics = keywordIdeas.filter(k => k.keyword_idea_metrics?.avg_monthly_searches);
        if (validMetrics.length > 0) {
          const totalCpc = validMetrics.reduce((sum, k) => {
            const low = k.keyword_idea_metrics?.low_top_of_page_bid_micros || 3000000;
            const high = k.keyword_idea_metrics?.high_top_of_page_bid_micros || 5000000;
            return sum + ((low + high) / 2);
          }, 0);
          estimatedCpc = (totalCpc / validMetrics.length) / 1000000;
        }
      }
    }
  } catch (error) {
    console.warn("Google Ads API fetch failed, using fallback data.", error);
  }

  return {
    headlines,
    descriptions,
    baseKeywords,
    estimatedCpc
  };
}

export async function checkGoogleAdsConnection() {
  return await validateGoogleAdsCredentials();
}

export async function getCompetitorAnalysis(projectId: string) {
  // Simulate fetching Auction Insights from Google Ads API
  await new Promise(resolve => setTimeout(resolve, 1000));

  return [
    { name: 'Damac Properties', impressionShare: '45%', overlapRate: '30%', positionAboveRate: '20%' },
    { name: 'Emaar', impressionShare: '40%', overlapRate: '25%', positionAboveRate: '15%' },
    { name: 'Sobha Realty', impressionShare: '35%', overlapRate: '20%', positionAboveRate: '10%' },
    { name: 'Azizi Developments', impressionShare: '25%', overlapRate: '15%', positionAboveRate: '5%' },
    { name: 'Danube Properties', impressionShare: '15%', overlapRate: '10%', positionAboveRate: '2%' },
  ];
}

export async function generateShareLink(projectId: string) {
  // In a real app, you would generate a secure token and store it in the DB with an expiration.
  // For this demo, we'll just use the project ID as a "token" to demonstrate the flow.
  const token = Buffer.from(projectId).toString('base64');
  
  return { url: `/dashboard/google-ads/share/${token}` };
}

export async function getGoogleAdsAuthUrl() {
  // In production, use the actual callback URL
  const redirectUri = process.env.GOOGLE_ADS_REDIRECT_URI || 'http://localhost:3000/api/ads/google/connect';
  return generateAuthUrl(redirectUri);
}

export async function refreshGoogleAdsToken(refreshToken: string) {
  return await refreshAccessToken(refreshToken);
}

export async function disconnectGoogleAds() {
  // In a real app, you'd get the tenantId from the authenticated user's session
  // For this demo/MVP, we'll assume a default or fetch it from context if available.
  // Since we don't have the full auth context here, we'll use a placeholder or require it passed.
  // However, server actions usually have access to cookies/headers to determine the user.
  
  // Placeholder: Assuming single tenant or dev mode for now as per previous patterns
  const tenantId = 'default-tenant'; 
  const db = (await import('@/server/firebase-admin')).getAdminDb();
  await removeGoogleAdsTokensFromFirestore(tenantId, db);
  return { success: true };
}
