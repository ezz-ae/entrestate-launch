import Link from "next/link"
import { ArrowRight, BookOpen, LayoutPanelTop, Sparkles } from "lucide-react"

import { AppverseFooter } from "@/components/appverse-footer"
import { BlogCard } from "@/components/blog/blog-card"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { brand } from "@/lib/brand"
import { getMarketingBlogPosts, getMarketingFooter } from "@/lib/marketing"

export const revalidate = 60

const learningPaths = [
  {
    href: "/products",
    title: "Browse the catalog",
    description: "Go from insight to action by reviewing the sellable sites, modules, and rollout paths behind the strategy.",
    icon: LayoutPanelTop,
  },
  {
    href: "/docs",
    title: "Read the rollout docs",
    description: "Pair the journal with implementation notes, launch checklists, and operational guidance.",
    icon: BookOpen,
  },
]

export default async function BlogPage() {
  const [posts, footer] = await Promise.all([getMarketingBlogPosts(), getMarketingFooter()])

  return (
    <main className="min-h-screen bg-[#081225] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(203,181,122,0.12),rgba(0,0,0,0))]" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mb-16 text-center animate-fade-up">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A]">Insights</p>
            <h1 className="text-4xl font-black tracking-tight md:text-7xl">MTC Journal.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/72 md:text-xl">
              Notes on brokerage intelligence, buyer intent, market positioning, and what makes premium real estate sites convert.
            </p>
          </div>

          <div className="mb-12 grid gap-6 lg:grid-cols-2">
            {learningPaths.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#CBB57A]/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#102347] text-[#CBB57A]">
                  <path.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-white">{path.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/72">{path.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#CBB57A]">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fade-up" style={{ animationDelay: "120ms" }}>
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          <div className="relative mt-24 overflow-hidden rounded-[48px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(203,181,122,0.14),transparent_35%),rgba(13,24,49,0.9)] p-8 text-center shadow-2xl backdrop-blur-3xl sm:p-16">
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#CBB57A]/20 bg-[#CBB57A]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#CBB57A]">
                <Sparkles className="h-3.5 w-3.5" />
                Turn insight into action
              </div>
              <h2 className="mb-6 text-3xl font-black text-white sm:text-5xl">Ready to launch the right offer?</h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/72">
                Browse the live catalog, review the rollout docs, or book a strategy session and move from ideas into a sellable brokerage experience.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild className="rounded-full bg-[#CBB57A] px-8 py-6 text-base font-semibold text-[#102347] hover:bg-[#d8c590]">
                  <Link href="/products">Explore products</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5 px-8 py-6 text-base text-white hover:bg-white/10">
                  <a href={brand.ctaHref} target="_blank" rel="noopener noreferrer">
                    {brand.ctaLabel}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppverseFooter content={footer} />
    </main>
  )
}
