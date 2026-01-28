import { NextRequest } from 'next/server';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import { createRequestId, jsonWithRequestId } from '@/lib/server/request-id';
import { z } from 'zod';

const requestSchema = z.object({
  budget: z.number().min(50).max(2000),
  duration: z.number().min(7).max(90),
});

export async function POST(req: NextRequest) {
  const scope = 'api/ads/google/plan/checkout';
  const requestId = createRequestId();
  const respond = (body: Record<string, unknown>, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    await requireRole(req, ALL_ROLES);
    const payload = requestSchema.parse(await req.json());
    const totalSpend = payload.budget * payload.duration;
    const serviceFee = Math.max(99, Math.round(totalSpend * 0.05));
    const platformFee = 150;
    const totalDue = totalSpend + serviceFee + platformFee;
    const perLead = Number((totalSpend / Math.max(payload.duration, 1) / 3).toFixed(2));

    return respond({
      ok: true,
      requestId,
      data: {
        budget: payload.budget,
        duration: payload.duration,
        totalSpend,
        serviceFee,
        platformFee,
        totalDue,
        perLead,
      },
    });
  } catch (error) {
    logError(scope, error, { requestId, path: req.url });
    if (error instanceof z.ZodError) {
      return respond(
        {
          ok: false,
          error: {
            code: 'invalid_payload',
            message: 'Invalid payload',
            details: error.errors,
          },
          requestId,
        },
        { status: 400 }
      );
    }
    return respond(
      {
        ok: false,
        error: { code: 'checkout_failed', message: 'Failed to summarize checkout' },
        requestId,
      },
      { status: 500 }
    );
  }
}
