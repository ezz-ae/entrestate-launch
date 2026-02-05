'use server';

import { getAdminDb } from '@/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sendLeadEmail } from '@/lib/notifications/email';

export async function deleteProject(id: string) {
  const db = getAdminDb();
  await db.collection('sites').doc(id).delete();
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function updateProject(id: string, data: any) {
  const db = getAdminDb();
  await db.collection('sites').doc(id).set(data, { merge: true });
  revalidatePath(`/projects/${id}`);
  revalidatePath('/dashboard');
}

export async function publishProject(id: string) {
  const db = getAdminDb();
  await db.collection('sites').doc(id).set({
    published: true,
    publishedAt: FieldValue.serverTimestamp(),
  }, { merge: true });

  return { 
    urlPath: `/p/${id}`,
    customDomain: `https://${id.slice(0,8)}.site.entrestate.com`
  };
}

export async function submitLead(projectId: string, formData: FormData) {
  const db = getAdminDb();
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  // Resolve tenant from site
  const siteSnap = await db.collection('sites').doc(projectId).get();
  const siteData = siteSnap.data();
  // If site doesn't exist or has no tenant, fallback to 'public' or error
  const tenantId = siteData?.tenantId || siteData?.ownerUid || 'public'; 

  await db.collection('tenants').doc(tenantId).collection('leads').add({
    siteId: projectId,
    name,
    email,
    phone,
    status: 'new',
    source: 'landing_page',
    createdAt: FieldValue.serverTimestamp(),
  });

  // Send email notification to the project owner (or notification email)
  const notificationEmail = siteData?.notificationEmail || process.env.NOTIFY_EMAIL_TO;
  if (notificationEmail) {
    await sendLeadEmail(
        notificationEmail,
        `New Lead: ${siteData?.title || 'Landing Page'}`,
        `<div>Name: ${name}<br>Email: ${email}<br>Phone: ${phone}</div>`
    );
  }

  return { success: true };
}
