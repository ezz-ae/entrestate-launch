import { getUserProjects } from '@/app/actions/google-ads';
import { GoogleAdsDashboard } from '@/components/google-ads-dashboard';
import { Search } from 'lucide-react';

export default async function GoogleAdsPage() {
  const projects = await getUserProjects();

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Google Ads Intelligence</h1>
            <p className="text-zinc-400">AI-managed campaigns. You control the budget, we handle the rest.</p>
          </div>
        </div>

        <GoogleAdsDashboard projects={projects} />
      </div>
    </div>
  );
}