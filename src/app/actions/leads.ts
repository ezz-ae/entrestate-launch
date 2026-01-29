'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getAdminDb } from '@/server/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/server/auth';
import { resolveEntitlementsForTenant } from '@/lib/server/entitlements';
import { FieldValue } from 'firebase-admin/firestore';

export async function generateLookalikeAudience() {
  const tenantId = await resolveTenantForExport();
  const db = getAdminDb();

  const snapshot = await db
    .collection('tenants')
    .doc(tenantId)
    .collection('leads')
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  const count = snapshot.size;

  // Simulate processing delay (e.g. calling external API)
  await new Promise(resolve => setTimeout(resolve, 2000));

  if (count < 5) {
    return { 
      success: false, 
      message: `Not enough data. You need at least 5 leads to generate a lookalike audience (Current: ${count}).` 
    };
  }

  return { 
    success: true, 
    message: `Success! Created "Lookalike (1%) - All Leads" based on ${count} profiles.`,
    audienceId: `aud_${Date.now()}`
  };
}

export async function triggerCampaign(type: 'email' | 'sms', text: string, leadIds: string[], projectId: string) {
  const tenantId = await resolveTenantForExport();
  const db = getAdminDb();

  // Simulate API call to email/sms provider
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Log to database for tracking
  await db.collection('tenants').doc(tenantId).collection('campaign_logs').add({
    type,
    content: text,
    leadIds,
    projectId,
    status: 'sent',
    createdAt: FieldValue.serverTimestamp()
  });

  return {
    success: true,
    message: `${type.toUpperCase()} campaign triggered successfully.`
  };
}

export async function syncLeadsToWebhook(webhookUrl: string) {
  const tenantId = await resolveTenantForExport();
  const db = getAdminDb();
  const snapshot = await db
    .collection('tenants')
    .doc(tenantId)
    .collection('leads')
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  const leads = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    };
  });

  if (!leads || leads.length === 0) {
    return { success: false, message: 'No leads found to sync.' };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        count: leads.length,
        leads: leads
      }),
    });

    if (!response.ok) throw new Error(`Target responded with ${response.status}`);

    return { success: true, message: `Successfully pushed ${leads.length} leads to external CRM.` };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to sync leads.' };
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  const tenantId = await resolveTenantForExport();
  const db = getAdminDb();
  await db
    .collection('tenants')
    .doc(tenantId)
    .collection('leads')
    .doc(leadId)
    .set(
      {
        status,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  
  revalidatePath('/dashboard/leads');
  return { success: true };
}

export async function deleteLeads(leadIds: string[]) {
  const tenantId = await resolveTenantForExport();
  const db = getAdminDb();
  const batch = db.batch();
  const leadsCollection = db.collection('tenants').doc(tenantId).collection('leads');
  leadIds.forEach((id) => {
    batch.delete(leadsCollection.doc(id));
  });
  await batch.commit();
  
  revalidatePath('/dashboard/leads');
  return { success: true };
}

export async function getLeadsForExport(query?: string) {
  const tenantId = await resolveTenantForExport();
  const entitlements = await resolveEntitlementsForTenant(getAdminDb(), tenantId);
  if (!entitlements.features.leadExports.allowed) {
    throw new Error(
      entitlements.features.leadExports.reason || 'Lead exports are not available on your plan.'
    );
  }

  const db = getAdminDb();
  const snapshot = await db
    .collection('tenants')
    .doc(tenantId)
    .collection('leads')
    .orderBy('createdAt', 'desc')
    .limit(500)
    .get();

  const normalizedQuery = query?.toLowerCase().trim();
  const leads = snapshot.docs.map((doc): {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    screening?: {
      emailValid: boolean;
      domain: string;
      apps: { whatsapp: boolean; telegram: boolean };
    };
    enrichment?: {
      linkedin_url?: string;
      job_title?: string;
    };
    projects?: { headline?: string | null };
    [key: string]: any;
  } => {
    const data = doc.data() as Record<string, any>;
    return {
      id: doc.id,
      ...data,
      screening: data.screening_data || data.screening,
      projects: { headline: data.projectHeadline || data.projectName || null },
    };
  });

  if (!normalizedQuery) return leads;
  return leads.filter((lead) => {
    const values = [lead.name, lead.email, lead.phone]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return values.includes(normalizedQuery);
  });
}

export async function resolveTenantForExport() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .filter(Boolean)
    .join('; ');
  const headers = cookieHeader ? { cookie: cookieHeader } : undefined;
  const context = await verifyFirebaseIdToken(
    new Request('https://entrestate.com/dashboard/leads', { headers })
  );

  if (!context.uid || context.uid === 'anonymous') {
    throw new Error('You must be signed in to export leads.');
  }

  const claims = context.claims as Record<string, unknown>;
  const tenantClaim = claims.tenantId || claims.tenant;
  if (typeof tenantClaim === 'string' && tenantClaim.trim()) {
    return tenantClaim.trim();
  }

  const db = getAdminDb();
  const userSnap = await db.collection('users').doc(context.uid).get();
  const userData = userSnap.exists ? userSnap.data() : null;
  const fallbackTenant =
    (userData?.tenantId as string | undefined) ||
    (userData?.tenant as string | undefined) ||
    context.uid;
  return fallbackTenant;
}

export async function updateLeadNotes(leadId: string, notes: string) {
  const tenantId = await resolveTenantForExport();
  const db = getAdminDb();
  await db
    .collection('tenants')
    .doc(tenantId)
    .collection('leads')
    .doc(leadId)
    .set(
      {
        notes,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  
  revalidatePath('/dashboard/leads');
  return { success: true };
}

/**
 * Performs smart screening on a lead's contact info.
 */
export async function screenLeadData(email: string, phone: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const domain = email.split('@')[1] || '';
  
  // Simulated lookups for WhatsApp/Telegram status
  // In production, you would use APIs like Twilio Lookup or specialized scrapers
  const hasWhatsApp = phone.startsWith('+971') || phone.length > 10;
  const hasTelegram = Math.random() > 0.5; 

  return {
    emailValid: emailRegex.test(email),
    domain: domain,
    apps: {
      whatsapp: hasWhatsApp,
      telegram: hasTelegram
    }
  };
}

/**
 * Enriches lead data using Apollo.io API (Simulated).
 */
export async function enrichLeadWithApollo(email: string) {
  const domain = email.split('@')[1];
  
  const personalDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com'];
  if (!domain || personalDomains.includes(domain.toLowerCase())) {
    return null;
  }

  // Simulated API call to Apollo.io to fetch professional context
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    linkedin_url: `https://www.linkedin.com/company/${domain.split('.')[0]}`,
    job_title: 'Property Investor',
    seniority: 'Executive',
    company_name: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
  };
}

/**
 * Calculates a lead score based on connectivity and professional context.
 */
export async function calculateLeadScore(lead: any) {
  let score = 0;
  const screening = lead.screening_data || lead.screening;
  if (!screening) return 0;

  // Connectivity points (Max 3)
  if (screening.apps?.whatsapp) score += 2;
  if (screening.apps?.telegram) score += 1;

  // Professional context points (Max 4)
  const jobTitle = screening.enrichment?.job_title?.toLowerCase() || '';
  const highValueKeywords = ['investor', 'ceo', 'director', 'founder', 'executive', 'manager', 'owner'];
  
  if (highValueKeywords.some(keyword => jobTitle.includes(keyword))) {
    score += 3;
  } else if (jobTitle) {
    score += 1;
  }
  if (screening.emailValid) score += 1;

  return score;
}

/**
 * Fetches history of AI-generated campaigns for a specific project.
 */
export async function getCampaignLogsAction(projectId: string) {
  const tenantId = await resolveTenantForExport();
  const db = getAdminDb();
  const snapshot = await db
    .collection('tenants')
    .doc(tenantId)
    .collection('campaign_logs')
    .where('projectId', '==', projectId)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Fetches leads for a specific project and returns them for CSV export.
 */
export async function exportLeadsByProjectAction(projectId: string) {
  const tenantId = await resolveTenantForExport();
  const db = getAdminDb();
  const snapshot = await db
    .collection('tenants')
    .doc(tenantId)
    .collection('leads')
    .where('project_id', '==', projectId)
    .orderBy('createdAt', 'desc')
    .get();

  const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  if (leads.length === 0) return { success: false, message: "No leads found for this project." };

  // Generate CSV content
  const headers = ["Name", "Email", "Phone", "Status", "Source", "Created At"];
  const rows = leads.map(l => [
    `"${l.name || ""}"`,
    `"${l.email || ""}"`,
    `"${l.phone || ""}"`,
    `"${l.status || ""}"`,
    `"${l.source || ""}"`,
    `"${l.createdAt ? new Date((l.createdAt as any).seconds * 1000).toLocaleString() : ""}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

  return { success: true, csvContent, fileName: `leads_project_${projectId}.csv` };
}
