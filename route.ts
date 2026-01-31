import { NextResponse } from 'next/server';
import { loadInventoryProjects } from '@/server/inventory';

export const dynamic = 'force-dynamic';

export async function GET() {
  const projects = await loadInventoryProjects();
  return NextResponse.json(projects);
}