import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BookOpen, ChevronRight, FileText } from "lucide-react"

import { AppverseFooter } from "@/components/appverse-footer"
import { SiteHeader } from "@/components/site-header"
import { getMarketingFooter } from "@/lib/marketing"
import { getPostData, getSortedPostsData } from "../../../lib/docs"

export const revalidate = 60

export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts
    .map((post) => post.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0)
    .map((id) => ({ id }))
}

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id) notFound()

  const [allPostsData, postData, footer] = await Promise.all([
    getSortedPostsData(),
    getPostData(id),
    getMarketingFooter(),
  ])

  return (
    <main className="min-h-screen bg-[#081225] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(203,181,122,0.12),rgba(0,0,0,0))]" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="flex flex-col gap-12 lg:flex-row">
            <aside className="w-full shrink-0 lg:w-80">
              <div className="sticky top-24 space-y-8">
                <div>
                  <Link href="/docs" className="group mb-8 flex items-center gap-2 text-[#CBB57A] transition-colors hover:text-white">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Docs</span>
                  </Link>

                  <div className="mb-6 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#CBB57A]" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-white">Articles</h2>
                  </div>
                  <nav className="space-y-2">
                    {allPostsData.map(({ id: docId, title }) => {
                      const isActive = docId === id

                      return (
                        <Link
                          key={docId}
                          href={`/docs/${encodeURIComponent(docId)}`}
                          className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-all ${
                            isActive
                              ? "border-[#CBB57A]/30 bg-[#CBB57A]/10 text-white"
                              : "border-white/5 bg-white/5 text-neutral-400 hover:border-[#CBB57A]/30 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className={`h-4 w-4 ${isActive ? "text-[#CBB57A]" : "text-neutral-500 group-hover:text-[#CBB57A]"}`} />
                            {title || docId}
                          </div>
                          <ChevronRight className={`h-4 w-4 transition-all ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                        </Link>
                      )
                    })}
                  </nav>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-16">
                <div className="max-w-3xl">
                  <header className="mb-12">
                    <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">{postData.title || postData.id}</h1>
                    <div className="h-1 w-12 bg-[#CBB57A]" />
                  </header>

                  <div
                    className="prose prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-lg prose-p:leading-relaxed prose-p:text-neutral-300 prose-li:text-neutral-300 prose-strong:text-white prose-code:text-[#CBB57A]"
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
