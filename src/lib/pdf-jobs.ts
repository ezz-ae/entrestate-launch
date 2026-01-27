export type PdfJobRecord = {
  status: 'uploaded' | 'processing' | 'done' | 'failed';
  text?: string;
  error?: string;
  updatedAt: string;
};

const JOB_STORE_KEY = '__ENTRESTATE_PDF_JOBS__';

export function getPdfJobStore(): Map<string, PdfJobRecord> {
  const globalAny = globalThis as unknown as Record<string, unknown>;
  if (!globalAny[JOB_STORE_KEY]) {
    globalAny[JOB_STORE_KEY] = new Map<string, PdfJobRecord>();
  }
  return globalAny[JOB_STORE_KEY] as Map<string, PdfJobRecord>;
}
