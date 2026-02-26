import Link from 'next/link';

function asMap(entitlements: Array<{ key: string; valueJson: any }>) {
  return entitlements.reduce<Record<string, any>>((acc, item) => {
    acc[item.key] = item.valueJson || {};
    return acc;
  }, {});
}

export function EntitledNav({
  orderId,
  entitlements,
}: {
  orderId: string;
  entitlements: Array<{ key: string; valueJson: any }>;
}) {
  const map = asMap(entitlements);
  const links = [
    { href: `/w/${orderId}`, label: 'Status', key: null },
    { href: `/w/${orderId}/build`, label: 'Build', key: 'workspace.build' },
    { href: `/w/${orderId}/preview`, label: 'Preview', key: 'workspace.preview' },
    { href: `/w/${orderId}/publish`, label: 'Publish', key: 'workspace.publish' },
    { href: `/w/${orderId}/edits`, label: 'Edits', key: 'workspace.edits' },
    { href: `/w/${orderId}/leads`, label: 'Leads', key: 'lead.capture' },
    { href: `/w/${orderId}/support`, label: 'Support', key: null },
  ].filter((item) => !item.key || map[item.key]?.allowed !== false);

  return (
    <nav className="rounded-2xl border border-slate-200 bg-white p-3">
      <ul className="flex flex-wrap gap-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="inline-flex rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
