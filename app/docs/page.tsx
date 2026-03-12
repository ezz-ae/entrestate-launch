import Link from 'next/link';
import { getSortedPostsData } from '../../lib/docs';

export default function DocsPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-semibold">NanoGPT API Documentation</h1>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 md:flex-row">
        <aside className="w-full max-w-xs shrink-0">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Get Started
          </h2>
          <nav className="mt-4 flex flex-col gap-2">
            {allPostsData.map(({ id, title }) => (
              <Link
                key={id}
                href={`/docs/${encodeURIComponent(id)}`}
                className="rounded-md border border-transparent px-3 py-2 text-sm text-slate-700 transition hover:border-slate-200 hover:bg-slate-50"
              >
                {title || id}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1">
          <h2 className="text-3xl font-semibold">Welcome to the Docs</h2>
          <p className="mt-3 text-slate-600">
            Select a document from the sidebar to get started.
          </p>
        </main>
      </div>
    </div>
  );
}
