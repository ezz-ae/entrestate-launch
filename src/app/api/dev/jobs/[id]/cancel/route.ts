export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(req: Request, ctx: any) {
  try {
    const params = ctx?.params && typeof ctx.params.then === 'function' ? await ctx.params : ctx?.params;
    const id = params?.id;
  const mod = await import('../../../data');
    const ok = mod.cancelJob(id);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'dev store unavailable' }, { status: 500 });
  }
}
