export interface Position {
  x: number
  y: number
}

export interface TextEffects {
  shadow: {
    enabled: boolean
    offsetX: number
    offsetY: number
    blur: number
    color: string
  }
  outline: {
    enabled: boolean
    width: number
    color: string
  }
}

export interface TextElement {
  id: string
  type: "name" | "email" | "phone" | "website" | "twitter" | "linkedin" | "github" | "instagram" | "custom"
  content: string
  position: Position
  fontFamily: string
  fontSize: number
  fontWeight: number
  color: string
  backgroundColor: string
  showBackground: boolean
  textAlign: "left" | "center" | "right"
  showIcon: boolean
  rotation: number
  letterSpacing: number
  lineHeight: number
  locked: boolean
  zIndex: number
  effects: TextEffects
}

export interface ShapeElement {
  id: string
  type: "rectangle" | "circle" | "line" | "divider-horizontal" | "divider-vertical"
  position: Position
  width: number
  height: number
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  rotation: number
  locked: boolean
  zIndex: number
  borderRadius?: number
}

export interface ImageElement {
  id: string
  type: "image"
  position: Position
  width: number
  height: number
  imageUrl: string
  opacity: number
  rotation: number
  locked: boolean
  zIndex: number
  borderRadius: number
  objectFit: "cover" | "contain" | "fill"
}

export type CanvasElement = TextElement | ShapeElement | ImageElement

export function isTextElement(element: CanvasElement | null | undefined): element is TextElement {
  return element != null && "content" in element && "fontFamily" in element
}

export function isShapeElement(element: CanvasElement | null | undefined): element is ShapeElement {
  return element != null && "fill" in element && "stroke" in element
}

export function isImageElement(element: CanvasElement | null | undefined): element is ImageElement {
  return element != null && "imageUrl" in element && "objectFit" in element
}

export interface BackgroundConfig {
  type: "solid" | "gradient" | "image" | "pattern"
  color: string
  gradient: string
  imageUrl: string
  imagePosition: "cover" | "contain" | "center"
  imageBlur: number
  blur?: number
  overlay: {
    enabled?: boolean
    color: string
    opacity: number
  }
  pattern: {
    type: "dots" | "grid" | "waves" | "diagonal" | "cross"
    color: string
    size: number
    opacity: number
    backgroundColor?: string
  }
}

export interface HistoryState {
  elements: CanvasElement[]
  background: BackgroundConfig
}

export interface Template {
  id: string
  name: string
  description: string
  background: BackgroundConfig
  elements: CanvasElement[]
}

export interface ProjectData {
  version: string
  name: string
  elements: CanvasElement[]
  background: BackgroundConfig
  createdAt: string
  updatedAt: string
}

// ============================================
// REAL ESTATE BUILDER TYPES (Pages + Blocks)
// Architecture: Pages are vertical stacks of responsive Blocks
// Blocks render as real HTML/CSS (not canvas), supporting data binding
// ============================================

/**
 * Data Binding - Maps element text/image to data sources
 * e.g., bind price field to listings.price or agents.agentName
 */
export interface DataBinding {
  elementKey?: string // Identifier for element in block (e.g., "title", "price", "mainImage")
  dataPath?: string // Path to data source (e.g., "listing.price", "agent.name")
  type: "text" | "image" | "attribute" | "repeater" // What to bind
  formatFn?: string // Optional transform (e.g., "price" → "$123,456")
  transformFn?: string // Alias for formatFn
  propertyPath?: string // Optional specific property path
  elementId?: string // Optional element identifier
}

/**
 * Block Template - A reusable content section
 * Renders as real responsive HTML/CSS (flex, grid, breakpoints)
 * NOT a fixed-size canvas like OG generator
 */
export interface BlockTemplate {
  id: string
  name: string
  description: string
  category:
    | "hero"
    | "listings-grid"
    | "listing-detail"
    | "agent-grid"
    | "contact-form"
    | "testimonials"
    | "cta"
    | "header"
    | "footer"
    | "about"
    | "faq"
    | "gallery"
    | "info"
    | "form"
    | "grid"
    | "card"
    | "agent"
  component?: string // React component name (e.g., "HeroBlock", "ListingsGridBlock")
  requires?: ("listings" | "listing" | "agents" | "agent" | "agency")[] // Data requirements
  customizable?: {
    // Which props can be edited in the builder
    colors?: string[] // Can user change these color fields?
    text?: string[] // Can user edit these text fields?
    images?: string[] // Can user upload/change these images?
    settings?: string[] // Can user configure these settings?
  }
  defaultProps?: Record<string, unknown> // Default configuration
  dataBindings?: DataBinding[]
  previewImage?: string
  tags: string[]
  createdAt?: string
  width?: string | number
  minHeight?: string | number
  responsive?: boolean
  elements?: unknown[]
}

/**
 * Block Instance - A placed, configured instance of a block on a page
 */
export interface BlockInstance {
  id: string
  blockTemplateId: string // Reference to BlockTemplate
  position?: number // Order on page (0 = top)
  props: Record<string, unknown> // Configuration overrides
  dataSource?: {
    // Where to fetch data for this block
    type: "neon" | "entrestate" | "manual"
    query?: string // e.g., "active_listings", "featured_properties"
    filters?: Record<string, unknown>
    limit?: number
  }
}

/**
 * Page - A vertical stack of blocks
 * Renders as a real responsive website page (HTML+CSS)
 */
export interface Page {
  id?: string
  title: string
  slug: string // e.g., "home", "listings", "about-us"
  blocks: BlockInstance[] // Ordered list of blocks
  seo?: {
    metaDescription: string
    keywords: string[]
    title?: string
    ogImage?: string
  }
  settings?: {
    hideHeader?: boolean
    hideFooter?: boolean
  }
  createdAt?: string
  updatedAt?: string
}

/**
 * Website Theme & Branding
 */
export interface WebsiteSettings {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  fontFamily?: string
  logoUrl?: string
  logoText?: string
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
  }
  fonts: {
    heading: string
    body: string
  }
  branding: {
    logoUrl: string
    companyName: string
    phone: string
    email: string
    address: string
  }
}

/**
 * Website - Top-level container
 */
export interface Website {
  id: string
  name: string
  agencyId?: string
  pages: Page[]
  settings: WebsiteSettings
  template?: string // Starter template used
  category?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Page Template - Pre-built full page (Home, Listings, etc.)
 * Gives users a starting point
 */
export interface PageTemplate {
  id: string
  name: string
  description: string
  slug?: string
  category: "home" | "listings" | "listing-detail" | "detail" | "about" | "contact" | "agent" | "gallery"
  thumbnail?: string
  blocks: BlockTemplate[] // The blocks that make up this page
  defaultSettings?: Partial<WebsiteSettings>
  tags: string[]
  createdAt?: string
}

/**
 * Website Template - Full starting website (Home + Listings + About + Contact)
 * Users pick one and it creates a 5-page starter website
 */
export interface WebsiteTemplate {
  id: string
  name: string
  description: string
  category?: string
  pages: (PageTemplate | string)[] // Full page templates or block IDs
  defaultSettings: WebsiteSettings
  tags: string[]
  thumbnail?: string
  createdAt?: string
}

/**
 * Real Estate Data Types (from Neon + Entrestate)
 */
export interface Listing {
  id: string
  agencyId: string
  address: string
  price: number
  beds: number
  baths: number
  sqft: number
  lotSize?: number
  description: string
  images: string[]
  status: "active" | "pending" | "sold"
  agentId?: string
  featured?: boolean
  listedDate: string
  analysis?: ListingAnalysis // From Entrestate
  createdAt: string
  updatedAt: string
}

export interface ListingAnalysis {
  pricePerSqft: number
  priceHistory: Array<{ date: string; price: number }>
  marketTrend: "up" | "stable" | "down"
  daysOnMarket: number
  priceReduction?: number
  similarListings: number
  investmentScore?: number // 1-10
  insights: string[]
}

export interface InventoryItem {
  id: string
  agencyId?: string
  propertyName: string
  address: string
  price: number
  beds?: number
  baths?: number
  sqft?: number
  status?: string
  heroImage?: string
  createdAt?: string
  updatedAt?: string
}

export interface Agent {
  id: string
  agencyId: string
  name: string
  title: string
  email: string
  phone: string
  imageUrl: string
  bio: string
  license?: string
  specialties?: string[]
  createdAt: string
}

export interface Agency {
  id: string
  name: string
  email: string
  phone: string
  address: string
  logoUrl: string
  website?: string
  description?: string
  createdAt: string
}

export const FONT_OPTIONS = [
  { label: "Geist Sans", value: "Geist, sans-serif" },
  { label: "Geist Mono", value: "Geist Mono, monospace" },
  { label: "System UI", value: "system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, serif" },
]

export const FONT_SIZES = [
  { label: "XS", value: 14 },
  { label: "SM", value: 18 },
  { label: "MD", value: 24 },
  { label: "LG", value: 32 },
  { label: "XL", value: 48 },
  { label: "2XL", value: 64 },
]

export const FONT_WEIGHTS = [
  { label: "Normal", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semibold", value: 600 },
  { label: "Bold", value: 700 },
]

export const GRADIENT_PRESETS = [
  { name: "Midnight", value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" },
  { name: "Sunset", value: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)" },
  { name: "Ocean", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Forest", value: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
  { name: "Coral", value: "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)" },
  { name: "Slate", value: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)" },
  { name: "Aurora", value: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)" },
  { name: "Ember", value: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
]

export const PATTERN_PRESETS = [
  { name: "Dots", type: "dots" as const },
  { name: "Grid", type: "grid" as const },
  { name: "Waves", type: "waves" as const },
  { name: "Diagonal", type: "diagonal" as const },
  { name: "Cross", type: "cross" as const },
]

export const DEFAULT_TEXT_EFFECTS: TextEffects = {
  shadow: {
    enabled: false,
    offsetX: 2,
    offsetY: 2,
    blur: 4,
    color: "rgba(0,0,0,0.5)",
  },
  outline: {
    enabled: false,
    width: 2,
    color: "#000000",
  },
}

export const DEFAULT_BACKGROUND: BackgroundConfig = {
  type: "gradient",
  color: "#1a1a2e",
  gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
  imageUrl: "",
  imagePosition: "cover",
  imageBlur: 0,
  overlay: {
    enabled: false,
    color: "#000000",
    opacity: 0.5,
  },
  pattern: {
    type: "dots",
    color: "#ffffff",
    size: 20,
    opacity: 0.1,
  },
}
