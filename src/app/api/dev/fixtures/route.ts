export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

// Return deterministic dev fixtures. Keep this file free of heavy imports
// (like fs) to avoid runtime issues in different Next runtimes.
export async function GET() {
  const now = new Date();
  const projects = [
    {
      id: 'dev-project-1',
      headline: 'Demo Project — Sky Residences',
      description: 'A beautiful modern condominium with sea views and great amenities.',
      created_at: now.toISOString(),
    },
    {
      id: 'dev-project-2',
      headline: 'Demo Project — Oak Villas',
      description: 'Family homes in a quiet suburban neighborhood.',
      created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const leads = [
    { id: 'lead-1', name: 'Sarah Miller', email: 'sarah@example.com', phone: '+15551230001', projectId: 'dev-project-1', status: 'New', createdAt: now.toISOString() },
    { id: 'lead-2', name: 'Mike Ross', email: 'mike@example.com', phone: '+15551230002', projectId: 'dev-project-2', status: 'Contacted', createdAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString() },
    { id: 'lead-3', name: 'Ahmed Ali', email: 'ahmed@example.com', phone: '+15551230003', projectId: 'dev-project-1', status: 'New', createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString() },
  ];

  return NextResponse.json({ projects, leads });
}
