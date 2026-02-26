import { prisma } from '@/server/db';

interface LeadData {
  name: string;
  email: string;
  phone: string;
}

export async function sendLeadNotification(projectId: string, lead: LeadData) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { title: true },
    });

    const projectName = project?.title || 'Untitled Project';

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
