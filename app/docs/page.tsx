import Link from 'next/link';
import { getSortedPostsData } from '../../lib/docs';
import { SiteHeader } from "@/components/site-header";
import { AppverseFooter } from "@/components/appverse-footer";
import { ChevronRight, FileText, BookOpen, Sparkles } from "lucide-react";

export default function DocsPage() {
  const allPostsData = getSortedPostsData();

  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(132,204,22,0.1),rgba(0,0,0,0))]" />
        </div>
        
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-80 shrink-0">
              <div className="sticky top-24 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="h-5 w-5 text-lime-400" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-white">Documentation</h2>
                  </div>
                  <nav className="space-y-2">
                    {allPostsData.map(({ id, title }) => (
                      <Link
                        key={id}
                        href={`/docs/${encodeURIComponent(id)}`}
                        className="group flex items-center justify-between rounded-2xl border border-white/5 bg-neutral-900/40 px-4 py-3 text-sm text-neutral-400 transition-all hover:bg-white/5 hover:border-lime-400/30 hover:text-white"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-neutral-500 group-hover:text-lime-400" />
                          {title || id}
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="rounded-[32px] border border-white/5 bg-gradient-to-br from-lime-400/10 to-transparent p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 p-2 mb-4">
                    <Sparkles className="h-full w-full text-black" />
                  </div>
                  <h4 className="text-white font-bold mb-2">Need help?</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    Our AI builder can help you launch in minutes. Stuck? Contact our support.
                  </p>
                  <Link href="/faq" className="text-xs font-bold text-lime-300 hover:text-lime-400 underline underline-offset-4">
                    Visit Support Center
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="relative overflow-hidden rounded-[40px] border border-white/5 bg-neutral-900/40 p-8 sm:p-16 backdrop-blur-xl shadow-2xl">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80 mb-6">Introduction</p>
                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-8">Mashroi OS Guide.</h1>
                  <p className="text-lg text-neutral-400 leading-relaxed mb-12">
                    Welcome to the official documentation for Mashroi. Whether you're a solo agent or a large brokerage, this guide will help you master our AI builder and ready-made templates.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="h-1 bg-lime-400 w-12" />
                      <h3 className="text-xl font-bold text-white">Getting Started</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        Learn how to pick a template, customize it with AI, and connect your custom domain in under 10 minutes.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="h-1 bg-lime-400 w-12 opacity-30" />
                      <h3 className="text-xl font-bold text-white">AI Customization</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        Deep dive into our AI assistant. Learn how to prompt the builder for specific layouts and design languages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  );
}
