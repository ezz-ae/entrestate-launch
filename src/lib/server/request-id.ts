import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

export const REQUEST_ID_HEADER = 'x-request-id';

export function createRequestId() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().split('-')[0];
  }
  const randomPart = crypto.randomBytes(4).toString('hex');
  return `${Date.now().toString(36)}-${randomPart}`;
}

function mergeHeaders(requestId: string, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set(REQUEST_ID_HEADER, requestId);
  return headers;
}

export function jsonWithRequestId(
  requestId: string,
  body: unknown,
  init?: ResponseInit
) {
  return NextResponse.json(body, { ...init, headers: mergeHeaders(requestId, init) });
}

export function attachRequestId(response: NextResponse, requestId: string) {
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
}

export function errorResponse(requestId: string, scope: string, status = 500) {
  return jsonWithRequestId(
    requestId,
    { ok: false, requestId, scope },
    { status }
  );
}
