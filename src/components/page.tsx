import { createSupabaseServerClient } from '@/lib/supabase/server';
import { GoogleAdsDashboard } from '@/components/google-ads-dashboard';
import { notFound } from 'next/navigation';
import { Search } from 'lucide-react';

interface SharedDashboardPageProps {
  params: {
    token: string;
  };
}

export default async function SharedDashboardPage({ params }: SharedDashboardPageProps) {
  const { token } = params;
  
  // Decode the token (base64 project ID)
  let projectId = '';
  try {
    projectId = Buffer.from(token, 'base64').toString('utf-8');
  } catch (e) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  const { data: project } = await supabase
    .from('projects')
    .select('id, headline, description, original_filename')
    .eq('id', projectId)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl text-center text-blue-200 text-sm mb-8">
          You are viewing a shared read-only report for <strong>{project.headline}</strong>.
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Google Ads Intelligence</h1>
            <p className="text-zinc-400">Campaign projections and insights.</p>
          </div>
        </div>

        <GoogleAdsDashboard projects={[project]} readOnly={true} />
      </div>
    </div>
  );
}