export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/db';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import {
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';

const payloadSchema = z.object({
  site: z.record(z.any()),
});

export async function GET(req: NextRequest) {
  try {
    const { tenantId, uid } = await requireRole(req, ALL_ROLES);
    let sites: any[] = [];
    const records = await prisma.site.findMany({
      where: {
        OR: [{ tenantId }, { ownerUid: uid }],
      },
      take: 50,
      orderBy: { updatedAt: 'desc' },
    });
    sites = records.map((data) => {
      const published = Boolean(data.published);
      const customDomain = data.customDomain || null;
      const publishedUrl = data.publishedUrl || null;
      const url = customDomain ? `https://${customDomain}` : publishedUrl;
      return {
        id: data.id,
        title: data.title || 'Untitled Site',
        subdomain: data.subdomain || null,
        customDomain,
        publishedUrl,
        url,
        published,
      };
    });

    return NextResponse.json({ sites });
  } catch (error) {
    console.error('[sites] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tenantId, uid } = await requireRole(req, ALL_ROLES);
    const payload = payloadSchema.parse(await req.json());
    const site = payload.site || {};
    const siteId = typeof site.id === 'string' && site.id.trim() ? site.id.trim() : null;

    if (siteId) {
      const existing = await prisma.site.findUnique({ where: { id: siteId } });
      if (existing) {
        if (existing.tenantId && existing.tenantId !== tenantId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        if (!existing.tenantId && existing.ownerUid && existing.ownerUid !== uid) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        await prisma.site.update({
          where: { id: siteId },
          data: {
            ...site,
            ownerUid: existing.ownerUid || uid,
            tenantId: existing.tenantId || tenantId,
            dataJson: site,
          },
        });
        return NextResponse.json({ siteId });
      }
    }

    const created = await prisma.site.create({
      data: {
        id: siteId || undefined,
        ownerUid: uid,
        tenantId,
        title: site.title || site.name || null,
        subdomain: site.subdomain || null,
        customDomain: site.customDomain || null,
        published: Boolean(site.published),
        publishedUrl: site.publishedUrl || null,
        status: site.status || null,
        dataJson: site,
      },
    });
    return NextResponse.json({ siteId: created.id }, { status: 201 });
  } catch (error) {
    console.error('[sites] save error', error);
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
    return NextResponse.json({ error: 'Failed to save site' }, { status: 500 });
  }
}
