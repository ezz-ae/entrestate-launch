export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

export async function GET(req: NextRequest) {
  try {
    // For now, we'll allow all authenticated users to fetch chats.
    // In a real scenario, you might want to filter by agentId associated with the user's tenant.
    await requireRole(req, ALL_ROLES); 

    const db = getAdminDb();
    const chatsRef = db.collection('instagram_conversations');
    
    // Order by most recently updated conversations
    const snapshot = await chatsRef.orderBy('updatedAt', 'desc').limit(20).get();

    const conversations = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(conversations);

  } catch (error) {
    console.error('Error fetching chat conversations:', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
