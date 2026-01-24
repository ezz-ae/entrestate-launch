'use client';

import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error }: { error: Error }) {
  Sentry.captureException(error);
  const errorCode = error?.name ?? 'UnknownError';

  return (
    <html lang="en">
      <body>
        <h2>Something went wrong.</h2>
        <p>
          Error: {errorCode}. Please check Vercel logs for the full stack trace and error details.
        </p>
      </body>
    </html>
  );
}
