import Link from 'next/link';

export function PublishStatus({ liveUrl }: { liveUrl?: string | null }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Publish</h2>
      {liveUrl ? (
        <Link href={liveUrl} className="inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white">
          Open live site
        </Link>
      ) : (
        <p className="text-sm text-muted-foreground">Publish your deployment to a managed subdomain first.</p>
      )}
    </div>
  );
}
