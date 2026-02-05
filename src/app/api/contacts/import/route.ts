'use server';


import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import { tmpdir } from 'os';
import { join } from 'path';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

export async function POST(req: NextRequest) {
  const scope = 'api/contacts/import';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return respond({ ok: false, error: 'No file uploaded.', requestId }, { status: 400 });
    }

    if (file.type !== 'text/csv') {
      return respond(
        { ok: false, error: 'Invalid file type. Only CSV is accepted.', requestId },
        { status: 400 }
      );
    }

    // Read file content
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const tempFilePath = join(tmpdir(), file.name);
    await fs.writeFile(tempFilePath, fileBuffer);
    
    const fileContent = await fs.readFile(tempFilePath, 'utf-8');
    
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as Array<Record<string, string>>;

    // Validate records
    if (!records.length || !records[0].hasOwnProperty('email')) {
        await fs.unlink(tempFilePath);
        return respond(
          { ok: false, error: "CSV must contain an 'email' column.", requestId },
          { status: 400 }
        );
    }

    const db = getAdminDb();
    const batch = db.batch();
    let importedCount = 0;

    records.forEach((record) => {
      const emailRaw = String(record.email || '').trim().toLowerCase();
      if (!emailRaw || !emailRaw.includes('@')) {
        return;
      }

      const nameParts = [
        record.name,
        record.first_name,
        record.last_name,
      ].filter(Boolean);
      const name = nameParts.length ? String(nameParts.join(' ')).trim() : undefined;

      const docId = `${tenantId}_${Buffer.from(emailRaw).toString('base64url')}`;
      const docRef = db.collection('contacts').doc(docId);
      batch.set(
        docRef,
        {
          tenantId,
          channel: 'email',
          email: emailRaw,
          name,
          source: 'import',
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      importedCount += 1;
    });

    if (importedCount > 0) {
      await batch.commit();
    }

    await fs.unlink(tempFilePath);

    return respond({
      ok: true,
      data: { count: importedCount },
      requestId,
    });

  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return respond({ ok: false, error: 'Unauthorized', requestId }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return respond({ ok: false, error: 'Forbidden', requestId }, { status: 403 });
    }
    logError(scope, error, { requestId });
    return errorResponse(requestId, scope);
  }
}
