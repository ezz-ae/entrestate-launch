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

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {featuredProducts.map((product, index) => (
            <div
              key={product.slug}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/90 via-neutral-950/95 to-black p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(198,255,58,0.25),rgba(0,0,0,0))]" />
              </div>
              <div className="relative flex flex-col gap-6 sm:flex-row">
                <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-white/10 sm:h-48 sm:w-48">
                  <Image
                    src={product.heroImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 12rem, 100vw"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-neutral-400">
                    <span className="rounded-full border border-white/10 px-3 py-1">{product.category}</span>
                    {product.badge && (
                      <span className="rounded-full bg-lime-300/20 px-3 py-1 text-lime-200">{product.badge}</span>
                    )}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{product.title}</h3>
                  <p className="mt-2 text-sm text-neutral-300">{product.tagline}</p>
                  <ul className="mt-4 grid gap-2 text-sm text-neutral-200">
                    {product.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">Starting at</p>
                      <p className="text-lg font-semibold text-white">{product.price}</p>
                      <p className="text-xs text-neutral-400">{product.priceNote}</p>
                    </div>
                    <Button
                      asChild
                      className="rounded-full bg-lime-400 px-5 text-sm font-semibold text-black hover:bg-lime-300"
                    >
                      <Link href={`/products/${product.slug}`}>View product</Link>
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
