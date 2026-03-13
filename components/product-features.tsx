import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/products"

type ProductFeaturesProps = {
  title?: string
  subtitle?: string
  limit?: number
  showCta?: boolean
}

export function ProductFeatures({
  title = "Products engineered for faster real estate launches",
  subtitle = "Choose a ready-made template or an AI-first flow. Every product ships with conversion wiring and a launch plan.",
  limit,
  showCta = true,
}: ProductFeaturesProps) {
  const featuredProducts = typeof limit === "number" ? products.slice(0, limit) : products

  return (
    <section className="relative py-20" id="products">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,255,58,0.15),rgba(0,0,0,0))]" />
      </div>
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80">Products</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h2>
          <p className="mt-4 text-sm text-neutral-300 sm:text-base">{subtitle}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {featuredProducts.map((product, index) => (
            <div
              key={product.slug}
              className="group relative overflow-hidden rounded-[32px] border border-white/5 bg-neutral-900/40 p-1 transition-all duration-500 hover:border-lime-400/30 hover:shadow-[0_0_40px_rgba(132,204,22,0.1)] hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative flex flex-col gap-8 p-6 sm:flex-row sm:p-8">
                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:h-56 sm:w-56">
                  <Image
                    src={product.heroImage}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(min-width: 640px) 14rem, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <span className="rounded-full bg-white/5 px-3 py-1 text-neutral-400">{product.category}</span>
                    {product.badge && (
                      <span className="rounded-full bg-lime-400/20 px-3 py-1 text-lime-400">{product.badge}</span>
                    )}
                    {product.demoUrl && (
                      <span className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-400 border border-blue-500/30">Live Demo</span>
                    )}
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-white group-hover:text-lime-300 transition-colors">{product.title}</h3>
                  <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{product.tagline}</p>
                  <ul className="mt-6 space-y-2">
                    {product.highlights.slice(0, 3).map((highlight) => (
                      <li key={highlight} className="flex items-center gap-3 text-sm text-neutral-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(132,204,22,0.6)]" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/5">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-neutral-500">Price</p>
                      <p className="text-xl font-black text-white">{product.price}</p>
                    </div>
                    <Button
                      asChild
                      className="rounded-full bg-white text-black hover:bg-lime-400 transition-colors px-6 py-5 font-bold"
                    >
                      <Link href={`/products/${product.slug}`}>Launch Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showCta && (
          <div className="mt-12 text-center">
            <Button
              asChild
              className="rounded-full border border-white/15 bg-white/5 px-6 text-sm text-white hover:bg-white/10"
            >
              <Link href="/products">Browse full catalog</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
