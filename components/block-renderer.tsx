"use client"

import { Suspense, lazy } from "react"
import type { BlockInstance, Website, BlockTemplate } from "./types"
import { ALL_BLOCK_TEMPLATES } from "./templates/block-registry"
import { getDemoData } from "@/lib/demo-data"

// Dynamic block components (lazy load)
const HeroBlock = lazy(() => import("./blocks/hero-block").then((m) => ({ default: m.HeroBlock })))
const ListingsGridBlock = lazy(() =>
  import("./blocks/listings-grid-block").then((m) => ({ default: m.ListingsGridBlock })),
)
const ContactFormBlock = lazy(() =>
  import("./blocks/contact-form-block").then((m) => ({ default: m.ContactFormBlock })),
)
const HeaderBlock = lazy(() => import("./blocks/header-block").then((m) => ({ default: m.HeaderBlock })))
const FooterBlock = lazy(() => import("./blocks/footer-block").then((m) => ({ default: m.FooterBlock })))
const AgentGridBlock = lazy(() =>
  import("./blocks/agent-grid-block").then((m) => ({ default: m.AgentGridBlock })),
)
const TestimonialsBlock = lazy(() =>
  import("./blocks/testimonials-block").then((m) => ({ default: m.TestimonialsBlock })),
)
const ListingDetailBlock = lazy(() =>
  import("./blocks/listing-detail-block").then((m) => ({ default: m.ListingDetailBlock })),
)

// Gallery blocks
const GalleryGridBlock = lazy(() =>
  import("./blocks/gallery-blocks").then((m) => ({ default: m.GalleryGridBlock })),
)
const CarouselBlock = lazy(() =>
  import("./blocks/gallery-blocks").then((m) => ({ default: m.CarouselBlock })),
)
const BeforeAfterBlock = lazy(() =>
  import("./blocks/gallery-blocks").then((m) => ({ default: m.BeforeAfterBlock })),
)
const VirtualTourBlock = lazy(() =>
  import("./blocks/gallery-blocks").then((m) => ({ default: m.VirtualTourBlock })),
)
const VideoHeroBlock = lazy(() =>
  import("./blocks/gallery-blocks").then((m) => ({ default: m.VideoHeroBlock })),
)

// Feature blocks
const PropertyFeaturesBlock = lazy(() =>
  import("./blocks/feature-blocks").then((m) => ({ default: m.PropertyFeaturesBlock })),
)
const PropertySpecsBlock = lazy(() =>
  import("./blocks/feature-blocks").then((m) => ({ default: m.PropertySpecsBlock })),
)
const MortgageCalculatorBlock = lazy(() =>
  import("./blocks/feature-blocks").then((m) => ({ default: m.MortgageCalculatorBlock })),
)
const PriceBreakdownBlock = lazy(() =>
  import("./blocks/feature-blocks").then((m) => ({ default: m.PriceBreakdownBlock })),
)
const ProcessStepsBlock = lazy(() =>
  import("./blocks/feature-blocks").then((m) => ({ default: m.ProcessStepsBlock })),
)
const SimilarPropertiesBlock = lazy(() =>
  import("./blocks/feature-blocks").then((m) => ({ default: m.SimilarPropertiesBlock })),
)

// Specialized real estate blocks
const OpenHouseBlock = lazy(() =>
  import("./blocks/specialized-re-blocks").then((m) => ({ default: m.OpenHouseBlock })),
)
const InvestmentAnalysisBlock = lazy(() =>
  import("./blocks/specialized-re-blocks").then((m) => ({ default: m.InvestmentAnalysisBlock })),
)
const LuxuryAmenitiesBlock = lazy(() =>
  import("./blocks/specialized-re-blocks").then((m) => ({ default: m.LuxuryAmenitiesBlock })),
)
const AgentCredentialsBlock = lazy(() =>
  import("./blocks/specialized-re-blocks").then((m) => ({ default: m.AgentCredentialsBlock })),
)
const NeighborhoodInfoBlock = lazy(() =>
  import("./blocks/specialized-re-blocks").then((m) => ({ default: m.NeighborhoodInfoBlock })),
)

// Info and CTA blocks
const FAQBlock = lazy(() =>
  import("./blocks/info-cta-blocks").then((m) => ({ default: m.FAQBlock })),
)
const WhyChooseUsBlock = lazy(() =>
  import("./blocks/info-cta-blocks").then((m) => ({ default: m.WhyChooseUsBlock })),
)
const BlogGridBlock = lazy(() =>
  import("./blocks/info-cta-blocks").then((m) => ({ default: m.BlogGridBlock })),
)
const CTABannerBlock = lazy(() =>
  import("./blocks/info-cta-blocks").then((m) => ({ default: m.CTABannerBlock })),
)
const ContactFormBuilderBlock = lazy(() =>
  import("./blocks/info-cta-blocks").then((m) => ({ default: m.ContactFormBuilderBlock })),
)
const MarketMetricsBlock = lazy(() =>
  import("./blocks/info-cta-blocks").then((m) => ({ default: m.MarketMetricsBlock })),
)

// Specialized template blocks
const AIChatBlock = lazy(() =>
  import("./blocks/specialized-template-blocks").then((m) => ({ default: m.AIChatBlock })),
)
const InteractiveMapBlock = lazy(() =>
  import("./blocks/specialized-template-blocks").then((m) => ({ default: m.InteractiveMapBlock })),
)
const RentalFeaturesBlock = lazy(() =>
  import("./blocks/specialized-template-blocks").then((m) => ({ default: m.RentalFeaturesBlock })),
)
const ProductLaunchBlock = lazy(() =>
  import("./blocks/specialized-template-blocks").then((m) => ({ default: m.ProductLaunchBlock })),
)
const LimitedOfferBlock = lazy(() =>
  import("./blocks/specialized-template-blocks").then((m) => ({ default: m.LimitedOfferBlock })),
)
const PropertyReportBlock = lazy(() =>
  import("./blocks/specialized-template-blocks").then((m) => ({ default: m.PropertyReportBlock })),
)
const InvestmentMetricsBlock = lazy(() =>
  import("./blocks/specialized-template-blocks").then((m) => ({ default: m.InvestmentMetricsBlock })),
)

// Extra blocks (timeline, benefits, map, multi-cta, new construction)
const TimelineBlock = lazy(() =>
  import("./blocks/extra-blocks").then((m) => ({ default: m.TimelineBlock })),
)
const BenefitsBlock = lazy(() =>
  import("./blocks/extra-blocks").then((m) => ({ default: m.BenefitsBlock })),
)
const MapBlock = lazy(() =>
  import("./blocks/extra-blocks").then((m) => ({ default: m.MapBlock })),
)
const MultiCTABlock = lazy(() =>
  import("./blocks/extra-blocks").then((m) => ({ default: m.MultiCTABlock })),
)
const NewConstructionBlock = lazy(() =>
  import("./blocks/extra-blocks").then((m) => ({ default: m.NewConstructionBlock })),
)

// Map component names to actual components
const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
  HeroBlock,
  ListingsGridBlock,
  ContactFormBlock,
  HeaderBlock,
  FooterBlock,
  AgentGridBlock,
  TestimonialsBlock,
  ListingDetailBlock,
  GalleryGridBlock,
  CarouselBlock,
  BeforeAfterBlock,
  VirtualTourBlock,
  VideoHeroBlock,
  PropertyFeaturesBlock,
  PropertySpecsBlock,
  MortgageCalculatorBlock,
  PriceBreakdownBlock,
  ProcessStepsBlock,
  SimilarPropertiesBlock,
  OpenHouseBlock,
  InvestmentAnalysisBlock,
  LuxuryAmenitiesBlock,
  AgentCredentialsBlock,
  NeighborhoodInfoBlock,
  FAQBlock,
  WhyChooseUsBlock,
  BlogGridBlock,
  CTABannerBlock,
  ContactFormBuilderBlock,
  MarketMetricsBlock,
  AIChatBlock,
  InteractiveMapBlock,
  RentalFeaturesBlock,
  ProductLaunchBlock,
  LimitedOfferBlock,
  PropertyReportBlock,
  InvestmentMetricsBlock,
  TimelineBlock,
  BenefitsBlock,
  MapBlock,
  MultiCTABlock,
  NewConstructionBlock,
}

interface BlockRendererProps {
  block: BlockInstance
  website: Website
  template?: BlockTemplate
  editMode?: boolean
  onSelectBlock?: (blockId: string) => void
  data?: Record<string, unknown>
}

/**
 * BlockRenderer - Renders a single block instance as HTML
 */
export function BlockRenderer({
  block,
  website,
  template,
  editMode = false,
  onSelectBlock,
  data,
}: BlockRendererProps) {
  // Find the block template definition
  const blockTemplate =
    template || ALL_BLOCK_TEMPLATES.find((t) => t.id === block.blockTemplateId)

  if (!blockTemplate) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded text-center text-red-700">
        <p className="font-semibold">Block not found: {block.blockTemplateId}</p>
      </div>
    )
  }

  const Component = BLOCK_COMPONENTS[blockTemplate.component ?? ""]

  if (!Component) {
    return (
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded text-center text-yellow-700">
        <p className="font-semibold">Component not implemented: {blockTemplate.component}</p>
      </div>
    )
  }

  const blockProps = {
    ...blockTemplate.defaultProps,
    ...block.props,
    settings: website.settings,
  }

  return (
    <Suspense
      fallback={
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded" />
      }
    >
      <div
        className={`relative group transition-all ${editMode ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}
        onClick={() => editMode && onSelectBlock?.(block.id)}
        role={editMode ? "button" : undefined}
        tabIndex={editMode ? 0 : undefined}
      >
        <Component {...blockProps} data={data} />

        {editMode && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded pointer-events-none">
            {blockTemplate.name}
          </div>
        )}
      </div>
    </Suspense>
  )
}

interface PageRendererProps {
  website: Website
  pageSlug?: string
  editMode?: boolean
  onSelectBlock?: (blockId: string) => void
  data?: Record<string, unknown>
}

/**
 * PageRenderer - Renders a full page from blocks
 */
export function PageRenderer({
  website,
  pageSlug = "home",
  editMode = false,
  onSelectBlock,
  data,
}: PageRendererProps) {
  const page = website.pages.find((p) => p.slug === pageSlug)

  if (!page) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Page not found: {pageSlug}</p>
      </div>
    )
  }

  // Inject demo data when no external data is provided
  const resolvedData = data || getDemoData()

  return (
    <div className={`w-full ${editMode ? "bg-gray-100" : ""}`}>
      {page.blocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          website={website}
          editMode={editMode}
          onSelectBlock={onSelectBlock}
          data={resolvedData}
        />
      ))}
    </div>
  )
}

/**
 * WebsiteRenderer - Full website preview
 */
interface WebsiteRendererProps {
  website: Website
  currentPage?: string
  data?: Record<string, unknown>
}

export function WebsiteRenderer({
  website,
  currentPage = "home",
  data,
}: WebsiteRendererProps) {
  return (
    <div className="w-full">
      <PageRenderer
        website={website}
        pageSlug={currentPage}
        data={data}
      />
    </div>
  )
}
