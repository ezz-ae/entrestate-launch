import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform Status | Entrestate',
  description: 'Live status of platform services and readiness.',
  alternates: {
    canonical: '/status',
  },
  openGraph: {
    title: 'Platform Status | Entrestate',
    description: 'Live status of platform services and readiness.',
    url: '/status',
  },
};

export default function StatusPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-24 text-foreground">
      <div className="w-full max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Status
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">Status Overview</h1>
        <p className="text-lg text-muted-foreground">
          The core platform is online. Some tools are in pilot or still being prepared for launch.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Badge className="bg-green-600/10 border-green-600/20 text-green-400">
            <Link href="/dashboard/sites" className="hover:underline">Website Builder: Live</Link>
          </Badge>
          <Badge className="bg-blue-600/10 border-blue-600/20 text-blue-400">
            <Link href="/dashboard/inventory" className="hover:underline">Inventory: Manage</Link>
          </Badge>
          <Badge className="bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
            <Link href="/dashboard/ads" className="hover:underline">Ads: Ready</Link>
          </Badge>
          <Badge className="bg-purple-600/10 border-purple-600/20 text-purple-400">
            <Link href="/dashboard/messaging" className="hover:underline">Messaging: Configure</Link>
          </Badge>
        </div>
      </div>
    </main>
  );
}
