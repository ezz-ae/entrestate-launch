'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminDb } from '@/server/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/server/auth';
import { resolveEntitlementsForTenant } from '@/lib/server/entitlements';

export async function generateLookalikeAudience() {
  const supabase = await createSupabaseServerClient();
  
  // Auth check disabled as requested
  // const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch all leads to simulate processing
  const { data: leads } = await supabase.from('leads').select('id');
  const count = leads?.length || 0;

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
  const supabase = await createSupabaseServerClient();
  
  // Fetch recent leads (limit to 50 for this demo)
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

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
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId);

  if (error) throw new Error('Failed to update status');
  
  revalidatePath('/dashboard/leads');
  return { success: true };
}

export async function deleteLeads(leadIds: string[]) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from('leads')
    .delete()
    .in('id', leadIds);

  if (error) throw new Error('Failed to delete leads');
  
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

  const supabase = await createSupabaseServerClient();
  
  let leadsQuery = supabase
    .from('leads')
    .select('*, projects(headline)')
    .order('created_at', { ascending: false });

  if (query) {
    leadsQuery = leadsQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%`);
  }

  const { data, error } = await leadsQuery;
  
  if (error) throw new Error(error.message);
  return data;
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
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from('leads')
    .update({ notes })
    .eq('id', leadId);

  if (error) throw new Error('Failed to update notes');
  
  revalidatePath('/dashboard/leads');
  return { success: true };
}
