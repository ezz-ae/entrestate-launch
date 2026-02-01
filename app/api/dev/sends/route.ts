import { NextResponse } from 'next/server';

// Use dynamic import at runtime so this route can run even if the
// dev data module triggers different bundler/runtime behavior.
export async function GET() {
  try {
    const mod = await import('../data');
    return NextResponse.json({ recentSends: mod.recentSends || [] });
  } catch (e) {
    return NextResponse.json({ recentSends: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    try {
      const mod = await import('../data');
      const entry = mod.addSend(body);
      return NextResponse.json({ success: true, entry });
    } catch (e) {
      // If import fails, fall back to in-memory via a local variable
      return NextResponse.json({ success: false, error: 'dev store unavailable' }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
