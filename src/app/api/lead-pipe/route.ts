import { NextRequest } from 'next/server';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { getAdminDb } from '@/server/firebase-admin';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import { CAP } from '@/lib/capabilities';
import {
  collectLeadPipeCandidates,
  deduplicateLeads,
  buildLeadPipeRecords,
} from '@/lib/server/lead-pipe';

const PROVIDER_REASONS = {
  email: 'Set RESEND_API_KEY and FROM_EMAIL to enable email outreach.',
  sms: 'Configure Twilio (account SID, auth token, from number) to enable SMS senders.',
} as const;

export async function GET(req: NextRequest) {
  const scope = 'api/lead-pipe';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const db = getAdminDb();
    const { candidates, sourceTotals } = await collectLeadPipeCandidates(db, tenantId);
    const deduped = deduplicateLeads(candidates);
    const records = buildLeadPipeRecords(deduped).sort(
      (a, b) => b.activeProbability - a.activeProbability
    );

    return respond({
      ok: true,
      data: {
        leads: records,
        summary: {
          total: records.length,
          sourceTotals,
        },
        providers: {
          email: {
            enabled: CAP.resend,
            reason: CAP.resend ? null : PROVIDER_REASONS.email,
          },
          sms: {
            enabled: CAP.twilio,
            reason: CAP.twilio ? null : PROVIDER_REASONS.sms,
          },
        },
      },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId, path: req.url });
    return errorResponse(requestId, scope);
  }
}
