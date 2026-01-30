import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProjectEditableView } from '@/components/project-editable-view';
import { GoogleAdsDashboard } from '@/components/GoogleAdsDashboard';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const supabase = await createSupabaseServerClient();
  const { id } = params;

  // Fetch project by ID
  // Note: If RLS is enabled and you are not logged in, this might return null.
  // Ensure you are logged in or RLS is disabled for testing.
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-12 pb-20">
      <ProjectEditableView project={project} />
      <GoogleAdsDashboard projects={[project]} />
    </div>
  );
}
