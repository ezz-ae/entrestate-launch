import { Suspense } from 'react';
import BuilderClient from './builder-client';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function BuilderPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ projectId?: string }> 
}) {
  const { projectId } = await searchParams;
  let initialData = null;

  if (projectId) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    initialData = data;
  }

  return (
    <Suspense fallback={null}>
      <BuilderClient initialProjectData={initialData} />
    </Suspense>
  );
}