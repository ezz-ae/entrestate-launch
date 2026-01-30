import { createSupabaseServerClient } from '@/lib/supabase/server';
import { GoogleAdsDashboard } from '@/components/GoogleAdsDashboard';
import { notFound } from 'next/navigation';
import { Search, ShieldCheck, Zap } from 'lucide-react';

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
    .select('id, headline, description, original_filename, chat_agents(state, version, name)')
    .eq('id', projectId)
    .single();

  if (!project) {
    notFound();
  }

  const agent = project.chat_agents?.[0];

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl text-center text-blue-200 text-sm mb-8">
          You are viewing a shared read-only report for <strong>{project.headline}</strong>.
        </div>

        {agent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-emerald-500 h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">Agent Status</p>
                <p className="text-lg font-bold capitalize">{agent.state} <span className="text-xs font-normal opacity-50">v{agent.version}</span></p>
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Zap className="text-blue-500 h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">Consultant Name</p>
                <p className="text-lg font-bold">{agent.name}</p>
              </div>
            </div>
          </div>
        )}

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