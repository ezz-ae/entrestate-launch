import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Button } from "@/components/ui/button"
import { products, getProductBySlug } from "@/lib/products"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3)

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,255,58,0.16),rgba(0,0,0,0))]" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center animate-fade-up">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-neutral-400">
                <span className="rounded-full border border-white/10 px-3 py-1">{product.category}</span>
                {product.badge && (
                  <span className="rounded-full bg-lime-300/15 px-3 py-1 text-lime-200">{product.badge}</span>
                )}
              </div>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">{product.title}</h1>
              <p className="mt-4 text-lg text-neutral-200">{product.tagline}</p>
              <p className="mt-4 text-sm text-neutral-300">{product.description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="rounded-full bg-lime-400 px-6 text-sm font-semibold text-black hover:bg-lime-300"
                >
                  <Link href="/#pricing">Reserve this product</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full border border-white/15 bg-white/5 px-6 text-sm text-white hover:bg-white/10"
                >
                  <Link href="/products">Back to catalog</Link>
                </Button>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {product.outcomes.map((outcome) => (
                  <div
                    key={outcome.label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center"
                  >
                    <div className="text-sm text-neutral-400">{outcome.label}</div>
                    <div className="mt-2 text-xl font-semibold text-white">{outcome.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/70 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={product.heroImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 28rem, 100vw"
                />
              </div>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">What you get</p>
                <ul className="mt-4 grid gap-3 text-sm text-neutral-200">
                  {product.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-lime-300" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Starting at</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{product.price}</p>
                  <p className="text-xs text-neutral-400">{product.priceNote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-lime-300/80">Execution</p>
              <h2 className="mt-4 text-3xl font-extrabold">How we deliver</h2>
              <p className="mt-3 text-sm text-neutral-300">
                Every product follows a predictable launch rhythm, so you can align approvals and campaigns.
              </p>
            </div>
            <div className="grid gap-4">
              {product.timeline.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5"
                >
                  <div className="text-xs uppercase tracking-[0.3em] text-neutral-400">Step {index + 1}</div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-neutral-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">More options</p>
              <h2 className="mt-2 text-3xl font-extrabold">Other products teams love</h2>
            </div>
            <Button
              asChild
              className="rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white hover:bg-white/10"
            >
              <Link href="/products">See all products</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="group rounded-3xl border border-white/10 bg-neutral-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-lime-300/40"
              >
                <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={item.heroImage}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 20rem, 100vw"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-300">{item.tagline}</p>
                <div className="mt-4 text-sm text-lime-300">View product →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}
