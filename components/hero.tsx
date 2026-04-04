import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { getProducts } from "@/lib/products"
import { brand } from "@/lib/brand"
import { resolvePreviewSrc } from "@/lib/preview-url"

export async function Hero() {
  const products = await getProducts()
  const phoneData = products.slice(0, 5).map((product) => ({
    title: product.title,
    sub: product.tagline,
    imageSrc: product.heroImage,
    previewSrc: resolvePreviewSrc(product.demoUrl),
  }))
  return (
    <section id="home" className="relative isolate overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          <div className="mb-5 flex items-center gap-2">
            <Image src="/icons/mtc-logo.svg" alt={`${brand.shortName} logo`} width={32} height={32} className="h-8 w-8" />
            <p className="text-sm uppercase tracking-[0.25em] text-[#CBB57A]">mtc</p>
          </div>
          <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Equip Your Brokerage</span>
            <span className="block text-[#CBB57A] drop-shadow-[0_0_20px_rgba(203,181,122,0.3)]">
              With Superpowers.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-center text-lg text-neutral-300 sm:text-xl">
            {brand.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="rounded-full bg-[#CBB57A] px-6 text-[#102347] hover:bg-[#d8c590]">
              <a href={brand.ctaHref} target="_blank" rel="noopener noreferrer">
                {brand.ctaLabel}
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10">
              <Link href={brand.builderHref}>Try the builder</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/15 bg-transparent px-6 text-white hover:bg-white/10">
              <Link href={brand.productsHref}>Explore modules</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-center text-xs uppercase tracking-[0.25em] text-white/50">
            <span className="rounded-full border border-white/10 px-4 py-2">Interactive demo</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Module catalog</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Pricing + rollout paths</span>
          </div>

          {/* Phone grid mimic */}
          <div className="mt-10 grid w-full gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {phoneData.map((p, i) => {
              const visibility = i <= 2 ? "block" : i === 3 ? "hidden md:block" : i === 4 ? "hidden xl:block" : "hidden"

              return (
                <div key={i} className={visibility}>
                  <PhoneCard title={p.title} sub={p.sub} imageSrc={p.imageSrc} previewSrc={p.previewSrc} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function PhoneCard({
  title = "8°",
  sub = "Clear night. Great for render farm runs.",
  imageSrc,
  previewSrc,
}: {
  title?: string
  sub?: string
  imageSrc?: string
  previewSrc?: string
}) {
  return (
    <div className="relative rounded-[28px] glass-border bg-neutral-900 p-2">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
          />
        )}
        {previewSrc && (
          <iframe
            src={previewSrc}
            title={`${title} template preview`}
            className="absolute inset-0 h-full w-full border-none pointer-events-none"
            loading="lazy"
          />
        )}

        <div className="relative z-10 p-3">
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
          <div className="space-y-1 px-1">
            <div className="text-3xl font-bold leading-snug text-white/90">{title}</div>
            <p className="text-xs text-white/70">{sub}</p>
            <div className="mt-3 inline-flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#CBB57A]">
              mtc
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
