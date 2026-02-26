export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/db';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const payloadSchema = z.object({
  leadId: z.string().min(1),
  note: z.string().min(1),
});

function parseNotes(raw: string | null | undefined) {
  if (!raw) return [] as Array<{ id: string; content: string; authorId: string; createdAt: string }>;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId, uid } = await requireRole(req, ALL_ROLES);

    const lead = await prisma.lead.findFirst({
      where: { id: payload.leadId, tenantId },
    });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    const currentNotes = parseNotes(lead.notes);
    const note = {
      id: crypto.randomUUID(),
      content: payload.note,
      authorId: uid,
      createdAt: new Date().toISOString(),
    };
    currentNotes.unshift(note);
    await prisma.lead.update({
      where: { id: lead.id },
      data: { notes: JSON.stringify(currentNotes) },
    });
    return NextResponse.json({ id: note.id }, { status: 201 });
  } catch (error) {
    console.error('[leads/notes] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
