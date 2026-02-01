import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Resend } from "https://esm.sh/resend@2.0.0"

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

interface EmailPayload {
  agentName: string;
  companyName: string;
  userEmail?: string;
  timestamp: string;
  metadata: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const payload: EmailPayload = await req.json()
    const { agentName, companyName, metadata } = payload

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Entrestate <onboarding@resend.dev>',
      to: [payload.userEmail || user.email!],
      subject: `Knowledge Base Updated: ${agentName}`,
      html: `<div>...</div>`,
    })

    if (emailError) throw emailError

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})