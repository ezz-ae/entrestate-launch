import Link from "next/link"
import { notFound } from "next/navigation"
import { getSortedPostsData, getPostData } from "../../../lib/docs"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { ChevronRight, FileText, BookOpen, Sparkles, ArrowLeft } from "lucide-react"
import { getMarketingFooter } from "@/lib/marketing"

export const revalidate = 60

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts
    .map((post) => post.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0)
    .map((id) => ({ id }));
}

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    notFound();
  }

  const [allPostsData, postData, footer] = await Promise.all([
    getSortedPostsData(),
    getPostData(id),
    getMarketingFooter(),
  ])

  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-80 shrink-0">
              <div className="sticky top-24 space-y-8">
                <div>
                  <Link href="/docs" className="flex items-center gap-2 text-lime-400 mb-8 hover:text-lime-300 transition-colors group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Docs</span>
                  </Link>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="h-5 w-5 text-lime-400" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-white">Articles</h2>
                  </div>
                  <nav className="space-y-2">
                    {allPostsData.map(({ id: docId, title }) => {
                      const isActive = docId === id;
                      return (
                        <Link
                          key={docId}
                          href={`/docs/${encodeURIComponent(docId)}`}
                          className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-all ${
                            isActive 
                              ? "bg-lime-400/10 border-lime-400/30 text-white" 
                              : "border-white/5 bg-neutral-900/40 text-neutral-400 hover:bg-white/5 hover:border-lime-400/30 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className={`h-4 w-4 ${isActive ? "text-lime-400" : "text-neutral-500 group-hover:text-lime-400"}`} />
                            {title || docId}
                          </div>
                          <ChevronRight className={`h-4 w-4 transition-all ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="relative overflow-hidden rounded-[40px] border border-white/5 bg-neutral-900/40 p-8 sm:p-16 backdrop-blur-xl shadow-2xl">
                <div className="max-w-3xl">
                  <header className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">{postData.title || postData.id}</h1>
                    <div className="h-1 bg-lime-400 w-12" />
                  </header>
                  
                  <div
                    className="prose prose-invert prose-lime max-w-none 
                               prose-headings:font-black prose-headings:tracking-tight
                               prose-p:text-neutral-400 prose-p:leading-relaxed prose-p:text-lg
                               prose-li:text-neutral-400
                               prose-strong:text-white
                               prose-code:text-lime-300"
                    dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppverseFooter content={footer} />
    </main>
  )
}
