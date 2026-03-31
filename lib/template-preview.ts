import type { BlockInstance, Page, PageTemplate, Website, WebsiteTemplate } from "@/components/types"
import { ALL_BLOCK_TEMPLATES } from "@/components/templates/block-registry"
import { ALL_WEBSITE_TEMPLATES } from "@/components/templates/website-templates"

const BLOCK_PAGE_MAP: Record<string, { page: string; title: string }> = {
  "header-sticky": { page: "home", title: "Home" },
  "hero-default": { page: "home", title: "Home" },
  "video-hero": { page: "home", title: "Home" },
  "listings-grid-3col": { page: "listings", title: "Listings" },
  "listings-grid-4col": { page: "listings", title: "Listings" },
  "listing-detail": { page: "listing-detail", title: "Property Detail" },
  "agent-grid": { page: "about", title: "About Us" },
  "agent-credentials": { page: "about", title: "About Us" },
  "testimonials": { page: "about", title: "About Us" },
  "contact-form": { page: "contact", title: "Contact" },
  "footer-default": { page: "home", title: "Home" },
  "gallery-grid-6": { page: "gallery", title: "Gallery" },
  "carousel-property": { page: "gallery", title: "Gallery" },
  "before-after": { page: "gallery", title: "Gallery" },
  "virtual-tour": { page: "gallery", title: "Gallery" },
  "property-features": { page: "listing-detail", title: "Property Detail" },
  "property-specs": { page: "listing-detail", title: "Property Detail" },
  "mortgage-calculator": { page: "tools", title: "Tools" },
  "price-breakdown": { page: "listing-detail", title: "Property Detail" },
  "similar-properties": { page: "listings", title: "Listings" },
  "investment-analysis": { page: "tools", title: "Tools" },
  "market-metrics-block": { page: "tools", title: "Tools" },
  "open-house": { page: "events", title: "Events" },
  "luxury-amenities": { page: "listing-detail", title: "Property Detail" },
  "neighborhood-info": { page: "listing-detail", title: "Property Detail" },
  "faq-accordion": { page: "about", title: "About Us" },
  "process-steps": { page: "about", title: "About Us" },
  "benefits-3col": { page: "about", title: "About Us" },
  "new-construction": { page: "listings", title: "Listings" },
  "services-grid": { page: "about", title: "About Us" },
  "map-section": { page: "contact", title: "Contact" },
  "cta-multi-button": { page: "home", title: "Home" },
}

function groupBlocksIntoPages(blockIds: string[]): Page[] {
  const headerBlock = blockIds.find((id) => id.includes("header"))
  const footerBlock = blockIds.find((id) => id.includes("footer"))
  const contentBlocks = blockIds.filter((id) => !id.includes("header") && !id.includes("footer"))

  const pageMap = new Map<string, { title: string; blockIds: string[] }>()

  for (const blockId of contentBlocks) {
    const mapping = BLOCK_PAGE_MAP[blockId] ?? { page: "home", title: "Home" }
    const existing = pageMap.get(mapping.page)
    if (existing) {
      existing.blockIds.push(blockId)
    } else {
      pageMap.set(mapping.page, { title: mapping.title, blockIds: [blockId] })
    }
  }

  if (!pageMap.has("home")) {
    pageMap.set("home", { title: "Home", blockIds: [] })
  }

  const pages: Page[] = []
  const pageOrder = ["home", "listings", "listing-detail", "gallery", "about", "tools", "events", "contact"]

  for (const slug of pageOrder) {
    const entry = pageMap.get(slug)
    if (!entry) continue

    const allBlockIds: string[] = []
    if (headerBlock) allBlockIds.push(headerBlock)
    allBlockIds.push(...entry.blockIds)
    if (footerBlock) allBlockIds.push(footerBlock)

    const blocks: BlockInstance[] = allBlockIds
      .map((blockId, index) => {
        const bt = ALL_BLOCK_TEMPLATES.find((b) => b.id === blockId)
        if (!bt) return null
        return {
          id: `block-${slug}-${index}`,
          blockTemplateId: bt.id,
          props: { ...(bt.defaultProps ?? {}) },
        } as BlockInstance
      })
      .filter((block): block is BlockInstance => block !== null)

    if (blocks.length > 0) {
      pages.push({ id: `page-${slug}`, title: entry.title, slug, blocks })
    }
  }

  return pages
}

function resolveTemplateSettings(template: WebsiteTemplate) {
  const tAny = template as Record<string, unknown>
  const altSettings = (tAny.settings || {}) as Record<string, string>
  return template.defaultSettings?.colors
    ? template.defaultSettings
    : {
        colors: {
          primary: altSettings.primaryColor || "#2563eb",
          secondary: altSettings.secondaryColor || "#1e40af",
          accent: altSettings.accentColor || "#10b981",
          text: "#1a1a1a",
          background: "#ffffff",
        },
        fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
        branding: {
          logoUrl: altSettings.logoUrl || "",
          companyName: altSettings.logoText || template.name,
          phone: "",
          email: "",
          address: "",
        },
      }
}

function buildPagesFromTemplate(template: WebsiteTemplate): Page[] {
  const templatePages = template.pages as (PageTemplate | string)[]
  const pageObjects = templatePages.filter(
    (page): page is PageTemplate => typeof page === "object",
  )
  const blockIds = templatePages.filter((page): page is string => typeof page === "string")

  if (pageObjects.length > 0) {
    return pageObjects.map((page, index) => ({
      id: `page-${template.id}-${index}`,
      title: page.name,
      slug: page.slug ?? page.category,
      blocks: page.blocks.map((block, blockIndex) => ({
        id: `block-${template.id}-${index}-${blockIndex}`,
        blockTemplateId: block.id,
        props: { ...(block.defaultProps ?? {}) },
      })),
    }))
  }

  return groupBlocksIntoPages(blockIds)
}

export function buildWebsiteFromTemplate(template: WebsiteTemplate, options?: { preview?: boolean }): Website {
  const pages = buildPagesFromTemplate(template)
  const settings = resolveTemplateSettings(template)
  const idPrefix = options?.preview ? "preview" : "website"

  return {
    id: `${idPrefix}-${template.id}`,
    name: template.name,
    pages,
    settings,
    template: template.id,
    category: template.category,
    description: template.description,
  }
}

export function getWebsiteTemplateById(id: string) {
  return ALL_WEBSITE_TEMPLATES.find((template) => template.id === id)
}
