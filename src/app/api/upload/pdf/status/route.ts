export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { logError } from '@/lib/server/log';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import { getPdfJobStore } from '@/lib/pdf-jobs';

export async function GET(req: NextRequest) {
  const scope = 'api/upload/pdf/status';
  const requestId = createRequestId();
  const path = req.url;
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const jobId = req.nextUrl.searchParams.get('jobId');
    if (!jobId) {
      return respond(
        { ok: false, error: 'jobId is required', requestId },
        { status: 400 }
      );
    }

    const record = getPdfJobStore().get(jobId);
    if (!record) {
      return respond(
        { ok: false, error: 'Job not found', requestId },
        { status: 404 }
      );
    }

    return respond({
      ok: true,
      data: {
        jobId,
        status: record.status,
        text: record.text,
        error: record.error,
        updatedAt: record.updatedAt,
      },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { url: path, requestId });
    return errorResponse(requestId, scope);
  }
}
