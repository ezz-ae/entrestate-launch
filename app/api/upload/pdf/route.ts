import { NextRequest } from 'next/server';
import pdf from 'pdf-parse-fork';
import { nanoid } from 'nanoid';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { logError } from '@/lib/server/log';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import { getPdfJobStore } from '@/lib/pdf-jobs';

const JOB_TIMEOUT_MS = 90_000;

export async function POST(req: NextRequest) {
  const scope = 'api/upload/pdf';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    let authContext: Awaited<ReturnType<typeof requireRole>> | null = null;
    try {
      authContext = await requireRole(req, ALL_ROLES);
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
        authContext = null;
      } else {
        throw error;
      }
    }

    if (!authContext) {
      const ip = getRequestIp(req);
      if (!(await enforceRateLimit(`upload:pdf:public:${ip}`, 6, 60_000))) {
        return respond(
          { ok: false, error: 'Rate limit exceeded', requestId },
          { status: 429 }
        );
      }
    }
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return respond(
        { ok: false, error: 'No file uploaded', requestId },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const jobId = nanoid();
    const jobStore = getPdfJobStore();
    jobStore.set(jobId, { status: 'uploaded', updatedAt: new Date().toISOString() });

    console.log(
      JSON.stringify({
        event: 'pdf.uploaded',
        jobId,
        requestId,
      })
    );

    void processPdfJob(jobId, buffer, requestId);

    return respond({
      ok: true,
      data: { jobId, status: 'uploaded' },
      requestId,
    });
  } catch (error: unknown) {
    logError(scope, error, { requestId });
    return errorResponse(requestId, scope);
  }
}

async function processPdfJob(jobId: string, buffer: Buffer, requestId: string) {
  const jobStore = getPdfJobStore();
  jobStore.set(jobId, { status: 'processing', updatedAt: new Date().toISOString() });
  console.log(
    JSON.stringify({
      event: 'pdf.parse.start',
      jobId,
      requestId,
    })
  );
  try {
    const result = await Promise.race([
      pdf(buffer),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Analysis timed out')), JOB_TIMEOUT_MS)
      ),
    ]);
    jobStore.set(jobId, {
      status: 'done',
      text: (result as { text: string }).text,
      updatedAt: new Date().toISOString(),
    });
    console.log(
      JSON.stringify({
        event: 'pdf.parse.done',
        jobId,
        requestId,
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Processing failed';
    jobStore.set(jobId, {
      status: 'failed',
      error: message,
      updatedAt: new Date().toISOString(),
    });
    console.log(
      JSON.stringify({
        event: 'pdf.parse.failed',
        jobId,
        requestId,
        message,
      })
    );
    logError('api/upload/pdf', error, { requestId, jobId });
  }
}
