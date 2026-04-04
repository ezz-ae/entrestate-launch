import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2, CreditCard, Globe, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { brand } from "@/lib/brand"
import { getProducts } from "@/lib/products"
import { resolvePreviewSrc } from "@/lib/preview-url"

export async function BuilderCta() {
  const products = await getProducts()
  const previewProduct = products.find((product) => product.slug === "lead-intelligence") ?? products.find((product) => product.demoUrl) ?? products[0]
  const builderTarget = previewProduct?.slug ? `/products/${previewProduct.slug}#builder` : brand.builderHref
  const previewSrc = resolvePreviewSrc(previewProduct?.demoUrl)

  return (
    <section id="builder" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute right-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(203,181,122,0.14),rgba(0,0,0,0))]" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="overflow-hidden rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(203,181,122,0.12),transparent_35%),rgba(13,24,49,0.85)] p-8 shadow-2xl backdrop-blur-3xl sm:p-12">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#CBB57A]/20 bg-[#CBB57A]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#CBB57A]">
                <Sparkles className="h-3.5 w-3.5" />
                Live builder demo
              </div>
              <h2 className="text-4xl font-black leading-[1.1] text-white sm:text-6xl">
                Let buyers try the product before they contact you.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-300">
                This is where the site becomes useful: visitors can preview a live module, open the AI builder, test the
                domain and checkout flow, and understand the offer before booking a rollout.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: "AI chat edits",
                    description: "Simulate real content and layout updates.",
                    icon: Sparkles,
                  },
                  {
                    title: "Domain handoff",
                    description: "Connect a real domain inside the builder flow.",
                    icon: Globe,
                  },
                  {
                    title: "Checkout ready",
                    description: "Move from demo into a paid pilot path.",
                    icon: CreditCard,
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <item.icon className="h-5 w-5 text-[#CBB57A]" />
                    <h3 className="mt-4 text-sm font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-400">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild className="rounded-full bg-[#CBB57A] px-8 py-6 text-base font-bold text-[#102347] hover:bg-[#d8c590]">
                  <Link href={builderTarget}>
                    Open live builder
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5 px-8 py-6 text-base text-white hover:bg-white/10">
                  <Link href={brand.productsHref}>See all modules</Link>
                </Button>
              </div>
            </div>

            <div className="relative flex items-center justify-center lg:h-[620px]">
              <div className="absolute inset-0 rounded-full bg-[#CBB57A]/15 blur-[120px]" />
              <div className="relative w-full max-w-[440px] overflow-hidden rounded-[42px] border-8 border-[#102347] bg-black shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                <div className="relative aspect-[9/16] bg-neutral-900">
                  {previewProduct?.heroImage && (
                    <Image
                      src={previewProduct.heroImage}
                      alt={`${previewProduct.title} preview`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 22rem, 100vw"
                    />
                  )}
                  {previewSrc && (
                    <iframe
                      src={previewSrc}
                      title={`${previewProduct?.title ?? "Template"} preview`}
                      className="absolute inset-0 h-full w-full border-none"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-x-0 top-0 z-10 flex h-7 items-center justify-center bg-black/55">
                    <div className="h-1.5 w-14 rounded-full bg-white/20" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/70 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#CBB57A]/20 text-[#CBB57A]">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-white/60">Flagship demo</div>
                        <div className="text-sm font-semibold text-white">{previewProduct?.title ?? "Live module"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 top-20 rounded-2xl border border-white/10 bg-[#0d1831]/90 p-4 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#8FA686]" />
                  <span className="text-sm font-semibold text-white">Preview active</span>
                </div>
              </div>
              <div className="absolute -left-5 bottom-24 rounded-2xl border border-white/10 bg-[#0d1831]/90 p-4 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-[#CBB57A]" />
                  <span className="text-sm font-semibold text-white">Pilot checkout ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
