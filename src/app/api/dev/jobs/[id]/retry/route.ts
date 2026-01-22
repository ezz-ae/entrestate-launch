import { NextResponse } from 'next/server';

export async function POST(req: Request, ctx: any) {
  try {
    const params = ctx?.params && typeof ctx.params.then === 'function' ? await ctx.params : ctx?.params;
    const id = params?.id;
    const mod = await import('../../../data');
    const newJob = mod.retryJob(id);
    if (!newJob) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, job: newJob });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'dev store unavailable' }, { status: 500 });
  }
}
