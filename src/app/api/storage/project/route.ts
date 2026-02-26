export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { list, put } from '@vercel/blob';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';

export async function POST(request: NextRequest) {
  const requestId = createRequestId();
  const scope = 'api/storage/project';
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const projectId = String(formData.get('projectId') || '');
    const type = String(formData.get('type') || '');
    if (!(file instanceof File) || !projectId || !type) {
      return jsonWithRequestId(
        requestId,
        { ok: false, error: { message: 'file, projectId, and type are required', scope }, requestId },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/\s+/g, '-');
    const blob = await put(`projects/${projectId}/${type}/${Date.now()}-${safeName}`, file, {
      access: 'public',
    });

    return jsonWithRequestId(requestId, {
      ok: true,
      data: { url: blob.url, path: blob.pathname },
      requestId,
    });
  } catch (error) {
    console.error('[storage] project upload error', error);
    return errorResponse(requestId, scope);
  }
}

export async function GET(request: NextRequest) {
  const requestId = createRequestId();
  const scope = 'api/storage/project';
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId') || '';
    const type = searchParams.get('type') || '';
    if (!projectId || !type) {
      return jsonWithRequestId(
        requestId,
        { ok: false, error: { message: 'projectId and type are required', scope }, requestId },
        { status: 400 }
      );
    }

    const { blobs } = await list({ prefix: `projects/${projectId}/${type}` });
    const urls = blobs.map((blob) => blob.url);

    return jsonWithRequestId(requestId, { ok: true, data: { urls }, requestId });
  } catch (error) {
    console.error('[storage] project list error', error);
    return errorResponse(requestId, scope);
  }
}
