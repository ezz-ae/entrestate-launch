import { Container } from "@mantine/core"
import React from "react"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { getMarketingBlogPostBySlug, getMarketingBlogPosts, getMarketingFooter } from "@/lib/marketing"
import { notFound } from "next/navigation"

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
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      <section className="py-24">
        <Container size="md">
          <div className="relative h-[400px] w-full overflow-hidden rounded-[40px] border border-white/10 mb-12 shadow-2xl">
            <Image 
              src={post.frontMatter.image} 
              alt={post.frontMatter.title} 
              fill
              className="object-cover"
            />
          </div>
          <p className="text-xs font-bold text-lime-400 uppercase tracking-[0.3em] mb-4">
            {new Date(post.frontMatter.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-tight">
            {post.frontMatter.title}
          </h1>
          <div className="prose prose-invert prose-lime max-w-none">
            <p className="text-xl text-neutral-400 leading-relaxed">
              {post.frontMatter.description}
            </p>
            <div className="mt-6 space-y-4">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base text-neutral-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <AppverseFooter content={footer} />
    </main>
  )
}
