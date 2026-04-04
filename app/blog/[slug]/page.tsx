import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Container } from "@mantine/core"
import { ArrowLeft, BookOpen } from "lucide-react"
import { notFound } from "next/navigation"

import { AppverseFooter } from "@/components/appverse-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { brand } from "@/lib/brand"
import { getMarketingBlogPostBySlug, getMarketingBlogPosts, getMarketingFooter } from "@/lib/marketing"

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getMarketingBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, footer] = await Promise.all([
    getMarketingBlogPostBySlug(slug),
    getMarketingFooter(),
  ])

  if (!post) {
    notFound()
  }

  const paragraphs = post.content.split("\n\n").filter(Boolean)

  return (
    <main className="min-h-screen bg-[#081225] text-white">
      <SiteHeader />
      <section className="py-24">
        <Container size="md">
          <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#CBB57A] transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to journal
          </Link>

          <div className="relative mb-12 h-[400px] w-full overflow-hidden rounded-[40px] border border-white/10 shadow-2xl">
            <Image
              src={post.frontMatter.image}
              alt={post.frontMatter.title}
              fill
              className="object-cover"
            />
          </div>

          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#CBB57A]">
            {new Date(post.frontMatter.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
          </p>
          <h1 className="mb-8 text-4xl font-black leading-tight tracking-tight md:text-6xl">{post.frontMatter.title}</h1>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
            <div className="prose prose-invert max-w-none">
              <p className="text-xl leading-relaxed text-white/72">{post.frontMatter.description}</p>
              <div className="mt-6 space-y-4">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-neutral-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-[#0d1831] p-8 shadow-2xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">
                  <BookOpen className="h-4 w-4" />
                  Next step
                </div>
                <h2 className="text-2xl font-bold text-white">Turn this thinking into a live brokerage offer.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/72">
                  Browse the product catalog, review the rollout guide, or speak directly with MTC about the offer that fits your market.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-full bg-[#CBB57A] px-6 text-sm font-semibold text-[#102347] hover:bg-[#d8c590]">
                  <Link href="/products">Explore products</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5 px-6 text-sm text-white hover:bg-white/10">
                  <a href={brand.ctaHref} target="_blank" rel="noopener noreferrer">
                    {brand.ctaLabel}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <AppverseFooter content={footer} />
    </main>
  )
}
