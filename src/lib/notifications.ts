import { createSupabaseServerClient } from '@/lib/supabase/server';

interface LeadData {
  name: string;
  email: string;
  phone: string;
}

export async function sendLeadNotification(projectId: string, lead: LeadData) {
  try {
    const supabase = createSupabaseServerClient();
    
    // Fetch project details to customize the email
    const { data: project } = await supabase
      .from('projects')
      .select('headline')
      .eq('id', projectId)
      .single();

    const projectName = project?.headline || 'Untitled Project';

    // TODO: Integrate with a real email service like Resend, SendGrid, or AWS SES.
    // Example: await resend.emails.send({ ... })
    
    console.log('------------------------------------------------');
    console.log(`📧 [EMAIL NOTIFICATION] New Lead Captured`);
    console.log(`Project: ${projectName}`);
    console.log(`Lead: ${lead.name} (${lead.email})`);
    console.log('------------------------------------------------');

  } catch (error) {
    console.error('Failed to send lead notification:', error);
  }
}