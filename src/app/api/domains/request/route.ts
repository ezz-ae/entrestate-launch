export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { CAP } from '@/lib/capabilities';
import { resend, fromEmail } from '@/lib/resend';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { PlanLimitError, planLimitErrorResponse } from '@/lib/server/billing';
import { prisma } from '@/server/db';

const DOMAIN_REQUEST_EMAIL = process.env.DOMAIN_REQUEST_EMAIL;

const payloadSchema = z.object({
  domain: z.string().min(3),
  provider: z.enum(['namecheap', 'vercel']),
  siteId: z.string().optional(),
});

const normalizeDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/+$/, '');

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId, uid, email } = await requireRole(req, ADMIN_ROLES);
    const normalizedDomain = normalizeDomain(payload.domain);

    if (payload.siteId) {
      const site = await prisma.site.findUnique({ where: { id: payload.siteId } });
      if (!site) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 });
      }
      if (site.tenantId && site.tenantId !== tenantId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (!site.tenantId && site.ownerUid && site.ownerUid !== uid) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const record = await prisma.domainRequest.create({
      data: {
        tenantId,
        domain: normalizedDomain,
        provider: payload.provider,
        siteId: payload.siteId || null,
        status: 'requested',
        requestedBy: {
          uid: uid || null,
          email: email || null,
        },
      },
    });
    const requestId = record.id;

    if (CAP.resend && resend && DOMAIN_REQUEST_EMAIL) {
      await resend.emails.send({
        from: `Entrestate <${fromEmail()}>`,
        to: DOMAIN_REQUEST_EMAIL,
        subject: `Domain purchase request - ${normalizedDomain}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
            <h2 style="margin: 0 0 12px;">Domain Purchase Request</h2>
            <p><strong>Domain:</strong> ${normalizedDomain}</p>
            <p><strong>Provider:</strong> ${payload.provider}</p>
            <p><strong>Tenant:</strong> ${tenantId}</p>
            <p><strong>Requested by:</strong> ${email || uid || 'Unknown'}</p>
            ${payload.siteId ? `<p><strong>Site ID:</strong> ${payload.siteId}</p>` : ''}
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, requestId });
  } catch (error) {
    console.error('[domains/request] error', error);
    if (error instanceof PlanLimitError) {
      return NextResponse.json(planLimitErrorResponse(error), { status: 402 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to submit domain request' }, { status: 500 });
  }
}
