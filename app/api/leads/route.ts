import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, project_id, source } = body;

    // Basic validation
    if (!project_id) {
      return NextResponse.json(
        { error: 'Missing required field: project_id' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Insert lead into Supabase
    const { data, error } = await supabase.from('leads').insert({
      project_id,
      name: name || 'Unknown Lead',
      email: email || null,
      phone: phone || null,
      status: 'new',
      source: source || 'external_webhook'
    }).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}