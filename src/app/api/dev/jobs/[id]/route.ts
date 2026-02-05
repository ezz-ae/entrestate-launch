export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET(req: Request, ctx: any) {
  try {
    const params = ctx?.params && typeof ctx.params.then === 'function' ? await ctx.params : ctx?.params;
    const id = params?.id;
    const mod = await import('../../data');
    const job = (mod.recentJobs || []).find((j: any) => j.id === id);
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ job });
  } catch (e) {
    return NextResponse.json({ error: 'dev store unavailable' }, { status: 500 });
  }
}
