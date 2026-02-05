export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import { resolveEntitlementsForTenant } from '@/lib/server/entitlements';
import { loadInventoryProjectById } from '@/server/inventory';

const requestSchema = z.object({
  projectId: z.string().min(1),
  action: z.enum(['create_landing_draft', 'draft_listing', 'sales_message', 'lead_pack']),
});

function buildListingCopy(project: any) {
  const title = project?.name || 'New Launch';
  const location = project?.location?.area || project?.location?.city || 'Dubai';
  const developer = project?.developer || 'Trusted developer';
  const price = project?.price?.label || 'Price on request';
  const handover = project?.handover?.year
    ? `Q${project.handover.quarter || 4} ${project.handover.year}`
    : 'TBD';
  const description = project?.description?.short || project?.description?.full || '';
  return [
    `${title} by ${developer} in ${location}.`,
    `Starting from ${price} with handover ${handover}.`,
    description || 'Limited availability. Request the latest brochure and payment plan.',
  ]
    .filter(Boolean)
    .join(' ');
}

function buildSalesMessage(project: any) {
  const title = project?.name || 'this launch';
  const area = project?.location?.area || project?.location?.city || 'Dubai';
  const hook = project?.performance?.roi
    ? `Projected ROI around ${project.performance.roi}%.`
    : 'Limited launch inventory available now.';
  return `Hi! We have new availability for ${title} in ${area}. ${hook} Would you like the brochure and payment plan?`;
}

function buildLeadPack(project: any) {
  const title = project?.name || 'this project';
  const area = project?.location?.area || project?.location?.city || 'Dubai';
  return {
    conversationStarter: `Hi! Quick update on ${title} in ${area}. Are you still looking for opportunities this quarter?`,
    qualificationQuestions: [
      'What budget range are you considering?',
      'Which area or community is your top priority?',
      'Is this for end-use or investment?',
    ],
    cta: 'If you want, I can share the brochure and lock a viewing slot this week.',
  };
}

export async function POST(req: NextRequest) {
  const scope = 'api/projects/action';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const payload = requestSchema.parse(await req.json());
    const db = getAdminDb();
    const entitlements = await resolveEntitlementsForTenant(db, tenantId);
    if (!entitlements.features.inventoryAccess.allowed) {
      return respond(
        {
          ok: false,
          error:
            entitlements.features.inventoryAccess.reason ||
            'Inventory access is restricted to your plan.',
          requestId,
        },
        { status: 403 }
      );
    }

    const project = await loadInventoryProjectById(payload.projectId);
    if (!project) {
      return respond(
        { ok: false, error: 'Project not found', requestId },
        { status: 404 }
      );
    }

    if (payload.action === 'create_landing_draft') {
      const draftRef = db
        .collection('tenants')
        .doc(tenantId)
        .collection('drafts')
        .doc();
      const now = new Date().toISOString();
      await draftRef.set({
        id: draftRef.id,
        owner: tenantId,
        status: 'draft',
        title: project.name || 'New landing page',
        prompt: `Landing page for ${project.name || 'new launch'}`,
        projectId: project.id,
        createdAt: now,
        updatedAt: now,
      });
      return respond({
        ok: true,
        data: {
          draftId: draftRef.id,
          builderUrl: `/builder?project=${encodeURIComponent(project.id)}&draftId=${draftRef.id}`,
        },
        requestId,
      });
    }

    const actionsRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('project_actions');

    if (payload.action === 'draft_listing') {
      const text = buildListingCopy(project);
      const actionRef = await actionsRef.add({
        projectId: project.id,
        type: 'listing_copy',
        text,
        createdAt: FieldValue.serverTimestamp(),
      });
      return respond({
        ok: true,
        data: { artifactId: actionRef.id, text },
        requestId,
      });
    }

    if (payload.action === 'sales_message') {
      const text = buildSalesMessage(project);
      const actionRef = await actionsRef.add({
        projectId: project.id,
        type: 'sales_message',
        text,
        createdAt: FieldValue.serverTimestamp(),
      });
      return respond({
        ok: true,
        data: { artifactId: actionRef.id, text },
        requestId,
      });
    }

    const payloadData = buildLeadPack(project);
    const actionRef = await actionsRef.add({
      projectId: project.id,
      type: 'lead_pack',
      payload: payloadData,
      createdAt: FieldValue.serverTimestamp(),
    });
    return respond({
      ok: true,
      data: { artifactId: actionRef.id, payload: payloadData },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId, path: req.url });
    if (error instanceof z.ZodError) {
      return respond(
        { ok: false, error: 'Invalid payload', details: error.errors, requestId },
        { status: 400 }
      );
    }
    return errorResponse(requestId, scope);
  }
}
