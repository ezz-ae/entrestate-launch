import { getUserProjects } from '@/app/actions/google-ads';
import { GoogleAdsDashboard } from '@/components/google-ads-dashboard';

export default async function GoogleAdsPage() {
  const projects = await getUserProjects();
  return (
    <div className="h-full bg-zinc-950">
      <GoogleAdsDashboard projects={projects} />
    </div>
  );
}
