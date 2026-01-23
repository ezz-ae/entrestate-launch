import { getUserProjects } from '@/app/actions/google-ads';
import { GoogleAdsDashboard } from '@/components/google-ads-dashboard';

export default async function GoogleAdsPage() {
  const projects = await getUserProjects();
  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <GoogleAdsDashboard projects={projects} />
      </div>
    </div>
  );
}
