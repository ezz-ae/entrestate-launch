import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { MarketingMediaFrame } from "@/components/marketing-media-frame"
import { getProducts } from "@/lib/products"
import { brand } from "@/lib/brand"
import { cn } from "@/lib/utils"

export async function Hero() {
  const products = await getProducts()
  const showcaseProducts = products.slice(0, 5).map((product) => ({
    slug: product.slug,
    title: product.title,
    sub: product.tagline,
    imageSrc: product.heroImage,
    category: product.category,
    badge: product.badge,
    hasDemo: !!product.demoUrl,
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

          <div className="mt-12 grid w-full gap-5 md:grid-cols-2 xl:grid-cols-4">
            {showcaseProducts.map((product, index) => (
              <ShowcaseCard
                key={product.slug}
                slug={product.slug}
                title={product.title}
                sub={product.sub}
                imageSrc={product.imageSrc}
                category={product.category}
                badge={product.badge}
                hasDemo={product.hasDemo}
                featured={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ShowcaseCard({
  slug,
  title,
  sub,
  imageSrc,
  category,
  badge,
  hasDemo,
  featured = false,
}: {
  slug: string
  title: string
  sub: string
  imageSrc: string
  category: string
  badge?: string
  hasDemo: boolean
  featured?: boolean
}) {
  return (
    <Link
      href={`/products/${slug}`}
      className={cn(
        "group relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(3,10,24,0.96))] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CBB57A]/30 hover:shadow-[0_40px_100px_rgba(0,0,0,0.45)]",
        featured && "md:col-span-2 xl:col-span-2",
      )}
    >
      <div className={cn("relative overflow-hidden rounded-[26px] border border-white/10", featured ? "h-72 sm:h-80" : "h-56 sm:h-60")}>
        <MarketingMediaFrame
          src={imageSrc}
          alt={title}
          chrome
          fit="contain"
          priority={featured}
          className="h-full w-full"
          contentClassName={featured ? "p-5 pt-14" : "p-4 pt-12"}
          imageClassName="object-top transition-transform duration-500 group-hover:scale-[1.02]"
          sizes={featured ? "(min-width: 1280px) 44rem, 100vw" : "(min-width: 1280px) 22rem, (min-width: 768px) 28rem, 100vw"}
        />
      </div>

      <div className="px-3 pb-3 pt-5 sm:px-4">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em]">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/60">{category}</span>
          {badge && <span className="rounded-full bg-[#CBB57A]/15 px-3 py-1 text-[#CBB57A]">{badge}</span>}
          {hasDemo && <span className="rounded-full border border-[#CBB57A]/20 bg-[#CBB57A]/10 px-3 py-1 text-[#CBB57A]">Live demo</span>}
        </div>

        <h3 className={cn("mt-4 font-bold tracking-tight text-white", featured ? "max-w-2xl text-3xl sm:text-4xl" : "text-2xl")}>
          {title}
        </h3>
        <p className={cn("mt-3 text-white/72", featured ? "max-w-xl text-base leading-relaxed" : "line-clamp-3 text-sm leading-relaxed")}>
          {sub}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#CBB57A]">
          Open product
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
