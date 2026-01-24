type LogExtras = Record<string, unknown> | undefined;

function formatErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  if (error === undefined) {
    return 'undefined';
  }
  return String(error);
}

export function logError(scope: string, error: unknown, extras?: LogExtras) {
  const message = formatErrorMessage(error);
  console.error(`[${scope}] ${message}`);
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }
  if (extras) {
    console.error(`[${scope}] extras:`, extras);
  }
}
