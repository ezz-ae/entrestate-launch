'use server'

import { resend, fromEmail } from '@/lib/resend'

interface EmailPayload {
  agentName: string;
  companyName: string;
  userEmail?: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export async function triggerResendEmail(payload: EmailPayload) {
  if (!resend) {
    return { success: false, error: 'Resend is not configured.' }
  }

  const to = payload.userEmail || process.env.NOTIFY_EMAIL_TO || ''
  if (!to) {
    return { success: false, error: 'No recipient available.' }
  }

  try {
    const data = await resend.emails.send({
      from: `Entrestate <${fromEmail()}>`,
      to,
      subject: `New agent request - ${payload.agentName}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin: 0 0 12px;">New Agent Request</h2>
          <p><strong>Agent:</strong> ${payload.agentName}</p>
          <p><strong>Company:</strong> ${payload.companyName}</p>
          <p><strong>Timestamp:</strong> ${payload.timestamp}</p>
          <pre style="background:#f5f5f5;padding:12px;border-radius:8px;">${JSON.stringify(payload.metadata, null, 2)}</pre>
        </div>
      `,
    })
    return { success: true, data }
  } catch (error: any) {
    console.error('Error triggering resend-email function:', error)
    return { success: false, error: error?.message || 'Failed to send email.' }
  }
}
