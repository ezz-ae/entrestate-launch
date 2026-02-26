'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sendLeadNotification } from '@/lib/notifications';
import { screenLeadData, enrichLeadWithApollo } from './leads';
import { prisma } from '@/server/db';

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function updateProject(id: string, data: any) {
  await prisma.project.update({
    where: { id },
    data: {
      title: data.title ?? undefined,
      city: data.city ?? undefined,
      community: data.community ?? undefined,
      developer: data.developer ?? undefined,
      dataJson: data,
    },
  });
  
  revalidatePath(`/projects/${id}`);
  revalidatePath('/dashboard');
}

export async function publishProject(id: string) {
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
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  // Trigger Smart Screening
  const screeningResults = await screenLeadData(email, phone);
  const enrichment = await enrichLeadWithApollo(email);

  await prisma.lead.create({
    data: {
      tenantId: 'public',
      projectId,
      name,
      email,
      phone,
      status: 'New',
      source: 'landing_page',
      utmJson: { screening: screeningResults, enrichment },
    },
  });

  // Send email notification to the project owner
  await sendLeadNotification(projectId, { name, email, phone });

  return { success: true };
}
