import Link from 'next/link';

export function PreviewPanel({ previewUrl }: { previewUrl?: string | null }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Preview</h2>
      <p className="text-sm text-slate-600">Validate copy, contact details, lead form, and CTA before publishing.</p>
      {previewUrl ? (
        <Link href={previewUrl} className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
          Open preview
        </Link>
      ) : (
        <p className="text-sm text-amber-700">No preview generated yet.</p>
      )}
    </div>
  );
}
