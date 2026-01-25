'use client';

import * as Sentry from '@sentry/nextjs';

const REQUEST_ID_PATTERN = /requestId=([\w-]+)/;
const SCOPE_PATTERN = /scope=([\w/-]+)/;

export default function GlobalError({ error }: { error: Error }) {
  Sentry.captureException(error);
  const errorCode = error?.name ?? 'UnknownError';
  const digest = (error as any).digest;
  const requestId =
    (error as any).requestId ?? error.message.match(REQUEST_ID_PATTERN)?.[1];
  const scope = (error as any).scope ?? error.message.match(SCOPE_PATTERN)?.[1];

  return (
    <html lang="en">
      <body>
        <h2>Something went wrong.</h2>
        <p>
          Error: {errorCode}. Please check Vercel logs for the full stack trace and error details.
        </p>
        {digest && (
          <p>
            Digest: {digest}
          </p>
        )}
        {(requestId || scope) && (
          <p>
            {scope && <>Scope: {scope}. </>}
            {requestId && <>Request ID: {requestId}. </>}
          </p>
        )}
      </body>
    </html>
  );
}
