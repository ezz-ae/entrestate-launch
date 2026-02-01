'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sendLeadNotification } from '@/lib/notifications';
import { screenLeadData, enrichLeadWithApollo } from './leads';

export async function deleteProject(id: string) {
  const supabase = await createSupabaseServerClient();

  // Auth check bypassed for local testing as requested
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) {
  //   throw new Error('Unauthorized');
  // }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error('Failed to delete project');
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function updateProject(id: string, data: any) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from('projects')
    .update(data)
    .eq('id', id);

  if (error) throw new Error('Failed to update project');
  
  revalidatePath(`/projects/${id}`);
  revalidatePath('/dashboard');
}

export async function publishProject(id: string) {
  const supabase = await createSupabaseServerClient();
  
  // Optional: Update status to 'published' if you have a status column
  // await supabase.from('projects').update({ status: 'published' }).eq('id', id);

  // In a real app, you might trigger a Vercel deployment or similar here.
  // For now, we just return the path to the dynamic public page we created.
  // We also return the custom domain format as requested.
  return { 
    urlPath: `/p/${id}`,
    customDomain: `https://${id.slice(0,8)}.site.entrestate.com`
  };
}

export async function submitLead(projectId: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  // Trigger Smart Screening
  const screeningResults = await screenLeadData(email, phone);
  const enrichment = await enrichLeadWithApollo(email);

  const { error } = await supabase.from('leads').insert({
    project_id: projectId,
    name,
    email,
    phone,
    status: 'new',
    source: 'landing_page',
    screening_data: { ...screeningResults, enrichment }
  });

  if (error) throw new Error('Failed to capture lead');

  // Send email notification to the project owner
  await sendLeadNotification(projectId, { name, email, phone });

  return { success: true };
}
