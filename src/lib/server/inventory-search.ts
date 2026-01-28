import type { NextRequest } from 'next/server';
import type { ProjectData } from '@/lib/types';

export async function fetchRelevantProjects(
  req: NextRequest,
  query: string,
  limit = 8
): Promise<ProjectData[]> {
  try {
    const origin = new URL(req.url).origin;
    const url = new URL('/api/projects/search', origin);
    url.searchParams.set('query', query);
    const headers = new Headers();
    const authHeader = req.headers.get('authorization');
    if (authHeader) headers.set('authorization', authHeader);
    const response = await fetch(url.toString(), {
      cache: 'no-store',
      headers,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.ok) return [];
    const items = Array.isArray(payload?.data?.items) ? payload.data.items : [];
    return items.slice(0, limit);
  } catch (error) {
    console.error('[inventory-search] fetch failed', error);
    return [];
  }
}
