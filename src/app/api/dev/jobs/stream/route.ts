import { NextResponse } from 'next/server';

// Simple Server-Sent Events (SSE) endpoint for dev job updates.
export async function GET() {
  try {
    const mod = await import('../../data');

    let unsub: (() => void) | null = null;
    let ping: NodeJS.Timeout | null = null;

    const stream = new ReadableStream({
      start(controller) {
        // send a comment to establish the stream
        controller.enqueue(new TextEncoder().encode(':ok\n\n'));

        const sendEvent = (job: any) => {
          try {
            const payload = `data: ${JSON.stringify({ type: 'job:update', job })}\n\n`;
            controller.enqueue(new TextEncoder().encode(payload));
          } catch (e) {
            // ignore
          }
        };

        unsub = mod.addJobListener(sendEvent);

        // keep the stream alive by sending a ping every 20s
        ping = setInterval(() => controller.enqueue(new TextEncoder().encode(': ping\n\n')), 20000);

        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'ready' })}\n\n`));
      },
      cancel() {
        try { if (unsub) unsub(); } catch (e) {}
        try { if (ping) clearInterval(ping); } catch (e) {}
      }
    });

    const headers = new Headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    return new NextResponse(stream, { headers });
  } catch (e) {
    return NextResponse.json({ error: 'dev stream unavailable' }, { status: 500 });
  }
}
