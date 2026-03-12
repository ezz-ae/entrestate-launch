import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSortedPostsData, getPostData } from '../../../lib/docs';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts
    .map((post) => post.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0)
    .map((id) => ({ id }));
}

export default async function DocPage({ params }: { params: { id: string } }) {
  if (!params?.id) {
    notFound();
  }

  const allPostsData = getSortedPostsData();
  const postData = await getPostData(params.id);

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
            {allPostsData.map(({ id, title }) => {
              const href = `/docs/${encodeURIComponent(id)}`;
              const isActive = id === params.id;
              return (
                <Link
                  key={id}
                  href={href}
                  className={`rounded-md px-3 py-2 text-sm transition ${
                    isActive
                      ? 'border border-slate-200 bg-slate-100 text-slate-900'
                      : 'border border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {title || id}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1">
          <h2 className="text-3xl font-semibold">{postData.title || postData.id}</h2>
          <div
            className="prose prose-slate mt-4 max-w-none"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />
        </main>
      </div>
    </div>
  );
}
