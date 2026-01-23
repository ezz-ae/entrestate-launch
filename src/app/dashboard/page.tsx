import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FileText, Plus, ArrowRight, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  // Temporarily disabled auth check for testing
  // if (!user) {
  //   redirect('/start');
  // }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-zinc-400 mt-1">Manage your generated landing pages.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/leads">
              <Button variant="outline" className="rounded-full font-bold border-zinc-700 hover:bg-zinc-800">
                <Users className="mr-2 h-4 w-4" /> Leads Pipeline
              </Button>
            </Link>
            <Link href="/">
              <Button className="rounded-full font-bold bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            </Link>
          </div>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group relative bg-zinc-900/50 border border-white/10 rounded-2xl p-6 hover:bg-zinc-900 transition-all hover:border-blue-500/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-500">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {project.headline || 'Untitled Project'}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-3 mb-6 leading-relaxed">
                  {project.description || 'No description available.'}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {new Date(project.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <Link href={`/projects/${project.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-bold uppercase tracking-wider hover:bg-white/10">
                          View <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">No projects yet</h3>
            <p className="text-zinc-400 mb-6 max-w-sm text-center">Upload a brochure to generate your first landing page.</p>
            <Link href="/">
                <Button className="rounded-full font-bold bg-white text-black hover:bg-zinc-200">
                    Create Project
                </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
