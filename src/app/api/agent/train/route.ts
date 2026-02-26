import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import {
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { put } from '@vercel/blob';
import { prisma } from '@/server/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file type. Only PDF is accepted.' }, { status: 400 });
    }

    const safeName = file.name.replace(/\s+/g, '-');
    const blob = await put(`brochures/${tenantId}/${Date.now()}-${safeName}`, file, {
      access: 'public',
    });
    const publicUrl = blob.url;

    await prisma.upload.create({
      data: {
        tenantId,
        kind: 'brochure',
        filename: file.name,
        mime: file.type,
        size: file.size,
        url: publicUrl,
      },
    });

    // TODO: Integrate AI processing here.
    // Call a service to extract data from the PDF using AI (e.g., Google Gemini).
    // The extracted data would then be used to pre-fill the builder.
    // Example: const processedData = await aiService.processPdf(publicUrl, tenantId);
    // For now, we'll just log and return the URL.

    console.log(`Uploaded training file to: ${publicUrl}`);

    return NextResponse.json({ message: 'File uploaded successfully.', fileUrl: publicUrl, fileName: file.name });

  } catch (error) {
    console.error('Agent Training API Error:', error);
    if (error instanceof PlanLimitError) {
      return NextResponse.json({ error: error.message || 'You have exceeded your plan limit for AI agent training.' }, { status: 402 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Authentication required. Please sign in to upload brochures.' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Access denied. You do not have the necessary permissions to upload brochures (Admin role required).' }, { status: 403 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred during training. Please try again or contact support.' }, { status: 500 });
  }
}
