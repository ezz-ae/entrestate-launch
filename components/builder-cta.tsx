import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Zap, Shield, Globe, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function BuilderCta() {
  return (
    <section className="py-24 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(132,204,22,0.1),transparent)] pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <div className="relative rounded-[48px] border border-white/5 bg-neutral-900/30 p-8 sm:p-16 overflow-hidden backdrop-blur-3xl shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-lime-400/10 px-4 py-2 text-xs font-bold text-lime-400 mb-8 uppercase tracking-widest border border-lime-400/20">
                <Sparkles className="h-3.5 w-3.5" />
                Zero Experience Required
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] mb-8">
                Build your empire.<br />
                <span className="text-lime-300">AI does the heavy lifting.</span>
              </h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed max-w-xl">
                Don't worry about hosting, SEO, or design. Tell our AI what you need, or pick a template and watch it adapt to your brand in seconds.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <Zap className="h-5 w-5 text-lime-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Instant Build</h4>
                    <p className="text-xs text-neutral-500">Go from idea to live site in under 10 minutes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <Globe className="h-5 w-5 text-lime-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Custom Domain</h4>
                    <p className="text-xs text-neutral-500">Launch on your own .com or .ae domain instantly.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild className="rounded-full bg-lime-400 text-black font-black px-10 py-7 text-lg hover:bg-lime-300 hover:scale-105 transition-all shadow-[0_0_30px_rgba(132,204,22,0.3)]">
                  <Link href="/products/ready-broker-site#builder">
                    Try the Builder
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="rounded-full border-white/10 bg-white/5 text-white px-8 py-7 text-lg hover:bg-white/10">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>

            <div className="relative group lg:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-lime-400/20 blur-[120px] rounded-full transition-all group-hover:bg-lime-400/30" />
              <div className="relative w-full max-w-[440px] aspect-[9/16] rounded-[48px] border-8 border-neutral-800 bg-black overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:rotate-1">
                {/* Simulated Builder Mobile Preview */}
                <div className="h-full w-full bg-neutral-900 flex flex-col">
                  <div className="h-6 w-full bg-black/40 flex items-center justify-center">
                    <div className="h-1 w-12 rounded-full bg-white/10" />
                  </div>
                  <div className="flex-1 p-6 space-y-6">
                    <div className="h-4 w-2/3 bg-lime-400/20 rounded-full" />
                    <div className="h-32 w-full bg-white/5 rounded-2xl border border-white/10" />
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-white/10 rounded-full" />
                      <div className="h-2 w-full bg-white/10 rounded-full" />
                      <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                    </div>
                    <div className="pt-8">
                      <div className="h-10 w-full bg-lime-400 rounded-xl flex items-center justify-center">
                        <div className="h-2 w-16 bg-black/20 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-black/60 backdrop-blur-md border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-lime-400/20 border border-lime-400/30 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-lime-400" />
                      </div>
                      <div className="h-2 w-1/2 bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -right-4 top-20 bg-neutral-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-lime-400" />
                  <span className="text-sm font-bold text-white">SEO Optimized</span>
                </div>
              </div>
              <div className="absolute -left-8 bottom-24 bg-neutral-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl animate-pulse">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-lime-400" />
                  <span className="text-sm font-bold text-white">SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
