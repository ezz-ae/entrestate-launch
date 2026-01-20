import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { FieldValue } from 'firebase-admin/firestore';

const knowledgeSchema = z.object({
  chatName: z.string().optional(),
  companyDetails: z.string().optional(),
  importantInfo: z.string().optional(),
  exclusiveListing: z.string().optional(),
  contactDetails: z.string().optional(),
});

export async function POST(req: NextRequest, { params }: { params: { agentId: string } }) {
  try {
    const { agentId } = params;
    // Ensure only authorized users can update knowledge for their agents
    const { tenantId } = await requireRole(req, ADMIN_ROLES); 

    const body = await req.json();
    const knowledgeData = knowledgeSchema.parse(body);

    const db = getAdminDb();
    const agentRef = db.collection('tenants').doc(tenantId).collection('agents').doc(agentId);

    // Check if the agent exists and belongs to the tenant
    const agentDoc = await agentRef.get();
    if (!agentDoc.exists) {
      return NextResponse.json({ error: 'Agent not found or does not belong to your tenant.' }, { status: 404 });
    }

    // Add structured knowledge as a document in a subcollection
    const knowledgeRef = await agentRef.collection('knowledge').add({
      ...knowledgeData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: 'Knowledge added successfully.', knowledgeId: knowledgeRef.id });

  } catch (error) {
    console.error('Add Knowledge API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
