'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

interface EmailPayload {
  agentName: string;
  companyName: string;
  userEmail?: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export async function triggerResendEmail(payload: EmailPayload) {
  const supabase = await createSupabaseServerClient()
  
  const { data, error } = await supabase.functions.invoke('resend-email', {
    body: payload,
  })

  if (error) {
    console.error('Error triggering resend-email function:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}