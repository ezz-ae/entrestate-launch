import { cache } from "react"
import { prisma } from "@/lib/prisma"
import {
  defaultAdminContent,
  defaultBlogPosts,
  defaultFooter,
  defaultLogos,
  defaultPricing,
  defaultProducts,
  type MarketingAdminContent,
  type MarketingFooterContent,
  type MarketingPricingContent,
} from "@/lib/marketing-defaults"

export type ProductOutcome = {
  label: string
  value: string
}

export type ProductTimelineStep = {
  title: string
  description: string
}

export type Product = {
  slug: string
  title: string
  tagline: string
  description: string
  category: string
  badge?: string
  price: string
  priceNote: string
  highlights: string[]
  deliverables: string[]
  timeline: ProductTimelineStep[]
  outcomes: ProductOutcome[]
  heroImage: string
  demoUrl?: string
}

export type BlogPostSummary = {
  slug: string
  frontMatter: {
    title: string
    date: string
    description: string
    image: string
  }
}

export type BlogPost = BlogPostSummary & {
  content: string
}

export type LogoRow = {
  name: string
  image: string
}

const asStringArray = (value: unknown, fallback: string[] = []) => {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string")
  }
  return fallback
}

const asTimeline = (value: unknown, fallback: ProductTimelineStep[]) => {
  if (!Array.isArray(value)) return fallback
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const record = item as { title?: string; description?: string }
      if (!record.title || !record.description) return null
      return { title: record.title, description: record.description }
    })
    .filter(Boolean) as ProductTimelineStep[]
}

const asOutcomes = (value: unknown, fallback: ProductOutcome[]) => {
  if (!Array.isArray(value)) return fallback
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const record = item as { label?: string; value?: string }
      if (!record.label || !record.value) return null
      return { label: record.label, value: record.value }
    })
    .filter(Boolean) as ProductOutcome[]
}

const hasLegacyProductBranding = (
  row: {
    slug: string
    title: string
    tagline: string
    description: string
    category: string
  }
) => {
  const haystack = [row.slug, row.title, row.tagline, row.description, row.category].join(" ").toLowerCase()
  return [
    "gold-century-luxury",
    "modern-minimalist-broker",
    "elite-agent-bio",
    "new-development-reveal",
    "flash-sale-landing",
    "influencer-agent-link",
    "template",
    "personal brand",
    "marketing launch",
  ].some((token) => haystack.includes(token))
}

export const getMarketingProducts = cache(async (): Promise<Product[]> => {
  try {
    const defaultProductsBySlug = new Map(defaultProducts.map((product) => [product.slug, product]))
    const rows = await prisma.marketingProduct.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })
    if (!rows.length || rows.some(hasLegacyProductBranding)) {
      return defaultProducts.map((product) => ({
        ...product,
        price: product.priceLabel,
        priceNote: product.priceNote ?? "",
      }))
    }

    return rows.map((row) => {
      const fallbackProduct = defaultProductsBySlug.get(row.slug)
      const shouldUseFallbackPrice =
        row.category !== "Launch Path" &&
        !!row.demoUrl &&
        row.priceLabel.trim().toLowerCase() === "custom" &&
        !!fallbackProduct?.priceLabel &&
        fallbackProduct.priceLabel.trim().toLowerCase() !== "custom"

      return {
        slug: row.slug,
        title: row.title,
        tagline: row.tagline,
        description: row.description,
        category: row.category,
        badge: row.badge ?? undefined,
        price: shouldUseFallbackPrice ? fallbackProduct?.priceLabel ?? row.priceLabel : row.priceLabel,
        priceNote: shouldUseFallbackPrice ? fallbackProduct?.priceNote ?? row.priceNote ?? "" : row.priceNote ?? "",
        highlights: asStringArray(row.highlights),
        deliverables: asStringArray(row.deliverables),
        timeline: asTimeline(row.timeline, []),
        outcomes: asOutcomes(row.outcomes, []),
        heroImage: row.heroImage,
        demoUrl: row.demoUrl ?? undefined,
      }
    })
  } catch {
    return defaultProducts.map((product) => ({
      ...product,
      price: product.priceLabel,
      priceNote: product.priceNote ?? "",
    }))
  }
})

export const getMarketingProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const products = await getMarketingProducts()
  return products.find((product) => product.slug === slug) ?? null
})

export const getMarketingBlogPosts = cache(async (): Promise<BlogPostSummary[]> => {
  try {
    const rows = await prisma.marketingBlogPost.findMany({
      orderBy: [{ publishedAt: "desc" }],
    })
    if (!rows.length) {
      return defaultBlogPosts.map((post) => ({
        slug: post.slug,
        frontMatter: {
          title: post.title,
          date: post.publishedAt,
          description: post.description,
          image: post.heroImage,
        },
      }))
    }

    return rows.map((row) => ({
      slug: row.slug,
      frontMatter: {
        title: row.title,
        date: row.publishedAt.toISOString(),
        description: row.description,
        image: row.heroImage,
      },
    }))
  } catch {
    return defaultBlogPosts.map((post) => ({
      slug: post.slug,
      frontMatter: {
        title: post.title,
        date: post.publishedAt,
        description: post.description,
        image: post.heroImage,
      },
    }))
  }
})

export const getMarketingBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const row = await prisma.marketingBlogPost.findUnique({ where: { slug } })
    if (!row) return null
    return {
      slug: row.slug,
      frontMatter: {
        title: row.title,
        date: row.publishedAt.toISOString(),
        description: row.description,
        image: row.heroImage,
      },
      content: row.content ?? row.description,
    }
  } catch {
    const fallback = defaultBlogPosts.find((post) => post.slug === slug)
    if (!fallback) return null
    return {
      slug: fallback.slug,
      frontMatter: {
        title: fallback.title,
        date: fallback.publishedAt,
        description: fallback.description,
        image: fallback.heroImage,
      },
      content: fallback.content,
    }
  }
})

export const getMarketingLogos = cache(async (): Promise<{ first: LogoRow[]; second: LogoRow[] }> => {
  try {
    const rows = await prisma.marketingLogo.findMany({
      orderBy: [{ row: "asc" }, { sortOrder: "asc" }],
    })
    if (!rows.length) {
      const grouped = defaultLogos.reduce(
        (acc, logo) => {
          if (logo.row === "first") acc.first.push({ name: logo.name, image: logo.imageUrl })
          if (logo.row === "second") acc.second.push({ name: logo.name, image: logo.imageUrl })
          return acc
        },
        { first: [] as LogoRow[], second: [] as LogoRow[] }
      )
      return grouped
    }

    return rows.reduce(
      (acc, logo) => {
        if (logo.row === "first") acc.first.push({ name: logo.name, image: logo.imageUrl })
        if (logo.row === "second") acc.second.push({ name: logo.name, image: logo.imageUrl })
        return acc
      },
      { first: [] as LogoRow[], second: [] as LogoRow[] }
    )
  } catch {
    const grouped = defaultLogos.reduce(
      (acc, logo) => {
        if (logo.row === "first") acc.first.push({ name: logo.name, image: logo.imageUrl })
        if (logo.row === "second") acc.second.push({ name: logo.name, image: logo.imageUrl })
        return acc
      },
      { first: [] as LogoRow[], second: [] as LogoRow[] }
    )
    return grouped
  }
})

const getConfig = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const row = await prisma.marketingSiteConfig.findUnique({ where: { key } })
    if (!row) return fallback
    return row.data as T
  } catch {
    return fallback
  }
}

export const getMarketingFooter = cache(async (): Promise<MarketingFooterContent> => {
  return getConfig("footer", defaultFooter)
})

export const getMarketingPricing = cache(async (): Promise<MarketingPricingContent> => {
  return getConfig("pricing", defaultPricing)
})

export const getMarketingAdminContent = cache(async (): Promise<MarketingAdminContent> => {
  return getConfig("admin-content", defaultAdminContent)
})
