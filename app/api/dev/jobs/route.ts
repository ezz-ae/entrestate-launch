import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mod = await import('../data');
    return NextResponse.json({ recentJobs: mod.recentJobs || [] });
  } catch (e) {
    return NextResponse.json({ recentJobs: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // meta actions
    if (body && body.type === 'meta' && body.action === 'clear') {
      try {
        const mod = await import('../data');
        mod.clearJobs();
        return NextResponse.json({ success: true });
      } catch (e) {
        return NextResponse.json({ success: false, error: 'dev store unavailable' }, { status: 500 });
      }
    }

    try {
      const mod = await import('../data');
      const job = mod.addJob(body || {});
      return NextResponse.json({ success: true, job });
    } catch (e) {
      return NextResponse.json({ success: false, error: 'dev store unavailable' }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
