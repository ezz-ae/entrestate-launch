import { NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from './auth';

/**
 * Standardized error handler for API routes.
 * Maps internal auth errors to proper HTTP status codes and JSON payloads.
 */
export function handleApiError(error: unknown, requestId?: string) {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: error.message,
        },
        requestId,
      },
      { status: 401 }
    );
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'FORBIDDEN',
          message: error.message,
        },
        requestId,
      },
      { status: 403 }
    );
  }

  // Log unexpected errors
  console.error('[api-error]', error);

  return NextResponse.json(
    {
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      requestId,
    },
    { status: 500 }
  );
}