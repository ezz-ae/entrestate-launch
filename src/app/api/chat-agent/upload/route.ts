export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import { requireAuth } from '@/lib/server/auth';

export async function POST(request: NextRequest) {
  const requestId = createRequestId();
  const scope = 'api/chat-agent/upload';
  try {
    await requireAuth(request);
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return jsonWithRequestId(
        requestId,
        { ok: false, error: { message: 'file is required', scope }, requestId },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/\s+/g, '-');
    const blob = await put(`agent-knowledge/${Date.now()}-${safeName}`, file, {
      access: 'public',
    });

    return jsonWithRequestId(requestId, {
      ok: true,
      data: {
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        contentType: file.type,
      },
      requestId,
    });
  } catch (error) {
    console.error('[chat-agent] upload error', error);
    return errorResponse(requestId, scope);
  }
}
