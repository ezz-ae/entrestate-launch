import React from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { BlogCard } from "@/components/blog/blog-card"
import { Search, Filter, Sparkles } from "lucide-react"
import { getMarketingBlogPosts, getMarketingFooter } from "@/lib/marketing"
import { brand } from "@/lib/brand"

export const revalidate = 60

const BlogPage = async () => {
  const [posts, footer] = await Promise.all([getMarketingBlogPosts(), getMarketingFooter()])

  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(132,204,22,0.1),rgba(0,0,0,0))]" />
        </div>
        
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A] mb-6">Insights</p>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-8">MTC Journal.</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-neutral-400 leading-relaxed">
              Notes on brokerage intelligence, buyer intent, data-driven discovery, and what modern teams need to win online.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 group-focus-within:text-lime-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full bg-neutral-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-lime-400/30 transition-all backdrop-blur-xl"
              />
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-4 bg-neutral-900/40 border border-white/5 rounded-2xl text-neutral-400 hover:text-white hover:border-lime-400/30 transition-all backdrop-blur-xl">
                <Filter className="h-5 w-5" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fade-up" style={{ animationDelay: '200ms' }}>
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Newsletter / CTA */}
          <div className="mt-32 relative rounded-[48px] border border-white/5 bg-neutral-900/30 p-8 sm:p-16 text-center overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-lime-400/10 px-4 py-2 text-xs font-bold text-lime-400 mb-8 uppercase tracking-widest border border-lime-400/20">
                <Sparkles className="h-3.5 w-3.5" />
                Stay Ahead
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Get MTC updates.</h2>
              <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
                Get the latest thinking on brokerage intelligence, launch strategy, and data-led buyer journeys.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder={brand.email}
                  className="flex-1 bg-black border border-white/10 rounded-full py-4 px-8 text-white focus:outline-none focus:border-lime-400/50"
                />
                <button className="bg-lime-400 text-black font-bold px-8 py-4 rounded-full hover:bg-lime-300 transition-all shadow-[0_0_20px_rgba(132,204,22,0.3)]">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppverseFooter content={footer} />
    </main>
  )
}

export default BlogPage;
