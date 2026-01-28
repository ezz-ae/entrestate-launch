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

export async function triggerCampaign(type: 'email' | 'sms') {
  // Simulate API call to email/sms provider
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    message: `Test ${type.toUpperCase()} campaign triggered successfully to recent leads.`
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
    projects?: { headline?: string | null };
    [key: string]: any;
  } => {
    const data = doc.data() as Record<string, any>;
    return {
      id: doc.id,
      ...data,
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

async function resolveTenantForExport() {
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
