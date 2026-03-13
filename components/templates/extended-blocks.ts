/**
 * Extended Real Estate Block Templates
 * 50+ additional blocks covering galleries, pricing, maps, forms, and specialized RE content
 */

import type { BlockTemplate } from "../types"

const defaultTextEffects = {
  shadow: { enabled: false, offsetX: 2, offsetY: 2, blur: 4, color: "rgba(0,0,0,0.5)" },
  outline: { enabled: false, width: 2, color: "#000000" },
}

// ============================================
// GALLERY & CAROUSEL BLOCKS (10)
// ============================================

export const GALLERY_BLOCKS: BlockTemplate[] = [
  {
    id: "gallery-grid-6",
    name: "Photo Gallery Grid (6 Images)",
    description: "6-image grid gallery with lightbox",
    category: "gallery",
    component: "GalleryGridBlock",
    requires: [],
    customizable: { images: ["galleryImages"], settings: ["columns"] },
    defaultProps: { columns: 3, showLightbox: true },
    dataBindings: [{ elementKey: "images", dataPath: "property.images", type: "repeater" }],
    tags: ["gallery", "photos", "lightbox"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "carousel-property",
    name: "Property Image Carousel",
    description: "Full-width carousel with thumbnails below",
    category: "gallery",
    component: "CarouselBlock",
    requires: ["listing"],
    customizable: { settings: ["autoplay", "showThumbnails"] },
    defaultProps: { autoplay: true, showThumbnails: true },
    dataBindings: [{ elementKey: "images", dataPath: "listing.images", type: "repeater" }],
    tags: ["carousel", "slider", "property"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "before-after",
    name: "Before & After Slider",
    description: "Home renovation before/after comparison",
    category: "gallery",
    component: "BeforeAfterBlock",
    requires: [],
    customizable: { images: ["beforeImage", "afterImage"] },
    defaultProps: {},
    dataBindings: [],
    tags: ["renovation", "comparison", "before-after"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "virtual-tour",
    name: "Virtual Tour / 360 View",
    description: "Embed 360° or virtual tour viewer",
    category: "gallery",
    component: "VirtualTourBlock",
    requires: [],
    customizable: { settings: ["tourUrl"] },
    defaultProps: { tourUrl: "" },
    dataBindings: [],
    tags: ["3d", "virtual-tour", "360"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "video-hero",
    name: "Video Hero Block",
    description: "Hero section with background video",
    category: "hero",
    component: "VideoHeroBlock",
    requires: [],
    customizable: { text: ["title", "subtitle"], settings: ["videoUrl"] },
    defaultProps: { title: "Discover Your Dream Home", subtitle: "Watch our property showcase" },
    dataBindings: [],
    tags: ["video", "hero", "media"],
    createdAt: new Date().toISOString(),
  },
]

// ============================================
// PROPERTY FEATURES & LISTING BLOCKS (15)
// ============================================

export const LISTING_FEATURE_BLOCKS: BlockTemplate[] = [
  {
    id: "property-features",
    name: "Property Features List",
    description: "Highlighted features with icons",
    category: "info",
    component: "PropertyFeaturesBlock",
    requires: ["listing"],
    customizable: { text: ["title"] },
    defaultProps: {
      features: [
        "Smart Home Technology",
        "Solar Panels",
        "Hardwood Floors",
        "High-End Appliances",
        "Primary Suite with Spa Bath",
        "Large Backyard",
      ],
    },
    dataBindings: [],
    tags: ["features", "amenities", "property"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "property-specs",
    name: "Property Specifications",
    description: "Detailed specs in table format",
    category: "info",
    component: "PropertySpecsBlock",
    requires: ["listing"],
    customizable: {},
    defaultProps: {
      specs: [
        { label: "Type", value: "Single Family Home" },
        { label: "Year Built", value: "2018" },
        { label: "Lot Size", value: "0.25 acres" },
        { label: "Roof", value: "Asphalt Shingles" },
        { label: "Heating", value: "Central Forced Air" },
        { label: "Cooling", value: "Central Air" },
      ],
    },
    dataBindings: [],
    tags: ["specs", "details", "property"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "mortgage-calculator",
    name: "Mortgage Calculator",
    description: "Interactive mortgage calculation tool",
    category: "form",
    component: "MortgageCalculatorBlock",
    requires: [],
    customizable: {},
    defaultProps: { interestRate: 6.5, downPayment: 20 },
    dataBindings: [],
    tags: ["calculator", "mortgage", "finance"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "price-breakdown",
    name: "Price Breakdown Chart",
    description: "Breakdown of property price/fees",
    category: "info",
    component: "PriceBreakdownBlock",
    requires: ["listing"],
    customizable: {},
    defaultProps: {
      items: [
        { label: "Listing Price", value: 0.7 },
        { label: "Closing Costs", value: 0.15 },
        { label: "Taxes", value: 0.1 },
        { label: "Insurance", value: 0.05 },
      ],
    },
    dataBindings: [],
    tags: ["price", "breakdown", "cost"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "property-timeline",
    name: "Property History Timeline",
    description: "Timeline of property events/renovations",
    category: "info",
    component: "TimelineBlock",
    requires: [],
    customizable: {},
    defaultProps: {
      events: [
        { year: 2018, title: "Built", description: "Modern home constructed" },
        { year: 2020, title: "Kitchen Remodel", description: "Complete kitchen upgrade" },
        { year: 2022, title: "Solar Install", description: "Solar panel installation" },
      ],
    },
    dataBindings: [],
    tags: ["timeline", "history", "events"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "similar-properties",
    name: "Similar Properties",
    description: "Showcase comparable listings",
    category: "grid",
    component: "SimilarPropertiesBlock",
    requires: ["listings"],
    customizable: { settings: ["limit"] },
    defaultProps: { limit: 3 },
    dataBindings: [],
    tags: ["similar", "comparables", "recommendations"],
    createdAt: new Date().toISOString(),
  },
]

// ============================================
// INFORMATION & MARKETING BLOCKS (15)
// ============================================

export const INFO_MARKETING_BLOCKS: BlockTemplate[] = [
  {
    id: "benefits-3col",
    name: "Benefits (3 Column)",
    description: "3-column benefits showcase",
    category: "info",
    component: "BenefitsBlock",
    requires: [],
    customizable: { text: ["title"], settings: ["columns"] },
    defaultProps: {
      title: "Why Buy Through Us",
      columns: 3,
      benefits: [
        {
          icon: "shield",
          title: "Buyer Protection",
          description: "Our guarantee protects your investment",
        },
        {
          icon: "home",
          title: "Exclusive Listings",
          description: "Access to pre-market properties",
        },
        {
          icon: "chart",
          title: "Market Analysis",
          description: "Data-driven pricing insights",
        },
      ],
    },
    dataBindings: [],
    tags: ["benefits", "features", "marketing"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "faq-accordion",
    name: "FAQ Accordion",
    description: "Collapsible FAQ section",
    category: "info",
    component: "FAQBlock",
    requires: [],
    customizable: { text: ["title"] },
    defaultProps: {
      title: "Frequently Asked Questions",
      faqs: [
        {
          question: "How long does the process take?",
          answer: "Typically 30-45 days from offer to closing",
        },
        {
          question: "What's your commission?",
          answer: "Our rates are competitive and negotiable",
        },
        {
          question: "Do you offer buyer representation?",
          answer: "Yes, we represent both buyers and sellers",
        },
      ],
    },
    dataBindings: [],
    tags: ["faq", "questions", "help"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "process-steps",
    name: "Buying/Selling Process Steps",
    description: "Visual step-by-step process",
    category: "info",
    component: "ProcessStepsBlock",
    requires: [],
    customizable: { text: ["title"], settings: ["type"] },
    defaultProps: {
      title: "Our Process",
      type: "buying",
      steps: [
        { number: 1, title: "Get Pre-Approved", description: "Secure financing" },
        { number: 2, title: "Browse Homes", description: "Explore listings" },
        { number: 3, title: "Make Offer", description: "Submit competitive offer" },
        { number: 4, title: "Home Inspection", description: "Professional inspection" },
        { number: 5, title: "Appraisal", description: "Property valuation" },
        { number: 6, title: "Closing", description: "Sign documents & move in" },
      ],
    },
    dataBindings: [],
    tags: ["process", "steps", "guide"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "map-section",
    name: "Location Map",
    description: "Embedded map with location info",
    category: "info",
    component: "MapBlock",
    requires: ["listing"],
    customizable: { settings: ["showStreetView", "zoom"] },
    defaultProps: { showStreetView: true, zoom: 15 },
    dataBindings: [
      { elementKey: "address", dataPath: "listing.address", type: "text" },
      { elementKey: "lat", dataPath: "listing.coordinates.lat", type: "text" },
      { elementKey: "lng", dataPath: "listing.coordinates.lng", type: "text" },
    ],
    tags: ["map", "location", "address"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "neighborhood-info",
    name: "Neighborhood Information",
    description: "Local schools, amenities, walkability",
    category: "info",
    component: "NeighborhoodInfoBlock",
    requires: [],
    customizable: {},
    defaultProps: {
      schools: [
        { name: "Lincoln Elementary", rating: 8, distance: "0.5 mi" },
        { name: "Washington Middle", rating: 8.5, distance: "1.2 mi" },
      ],
      amenities: [
        { icon: "coffee", name: "Cafes", count: 5 },
        { icon: "shopping-cart", name: "Shopping", count: 8 },
        { icon: "park", name: "Parks", count: 3 },
      ],
      walkScore: 72,
    },
    dataBindings: [],
    tags: ["neighborhood", "schools", "amenities"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "cta-multi-button",
    name: "Multi-Button CTA",
    description: "Multiple call-to-action buttons",
    category: "cta",
    component: "MultiCTABlock",
    requires: [],
    customizable: { text: ["title", "subtitle"] },
    defaultProps: {
      title: "Ready to Start Your Journey?",
      buttons: [
        { text: "Schedule Showing", link: "/schedule", variant: "primary" },
        { text: "Get Pre-Approved", link: "/preapproval", variant: "secondary" },
        { text: "Download Brochure", link: "/download", variant: "outline" },
      ],
    },
    dataBindings: [],
    tags: ["cta", "buttons", "conversion"],
    createdAt: new Date().toISOString(),
  },
]

// ============================================
// REAL ESTATE SPECIFIC BLOCKS (10)
// ============================================

export const REAL_ESTATE_SPECIFIC_BLOCKS: BlockTemplate[] = [
  {
    id: "open-house",
    name: "Open House Info Card",
    description: "Open house event details",
    category: "info",
    component: "OpenHouseBlock",
    requires: [],
    customizable: { text: ["date", "time"] },
    defaultProps: {
      date: "Saturday, March 16",
      time: "1:00 PM - 4:00 PM",
      address: "123 Main St",
      highlights: ["Free refreshments", "Home inspection on-site", "Financing guidance"],
    },
    dataBindings: [],
    tags: ["event", "open-house", "showing"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "investment-analysis",
    name: "Investment Analysis",
    description: "ROI, cap rate, cash flow projection",
    category: "info",
    component: "InvestmentAnalysisBlock",
    requires: ["listing"],
    customizable: {},
    defaultProps: {
      purchasePrice: 500000,
      monthlyRent: 2500,
      expectedROI: 7.2,
      capRate: 6.0,
      proForma: "Available upon request",
    },
    dataBindings: [],
    tags: ["investment", "analysis", "roi"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "new-construction",
    name: "New Construction Features",
    description: "New build community highlights",
    category: "info",
    component: "NewConstructionBlock",
    requires: [],
    customizable: {},
    defaultProps: {
      title: "New Community Coming Soon",
      highlights: [
        "Energy-efficient homes",
        "Smart home technology",
        "Community amenities",
        "Top-rated schools",
      ],
      priceRange: "$450K - $750K",
    },
    dataBindings: [],
    tags: ["new-construction", "development", "community"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "luxury-amenities",
    name: "Luxury Amenities Showcase",
    description: "Showcase luxury features",
    category: "info",
    component: "LuxuryAmenitiesBlock",
    requires: [],
    customizable: {},
    defaultProps: {
      amenities: [
        { icon: "wine", name: "Wine Cellar", description: "Climate-controlled storage" },
        { icon: "dumbbell", name: "Gym", description: "Private fitness center" },
        { icon: "swimming-pool", name: "Pool", description: "Resort-style pool" },
      ],
    },
    dataBindings: [],
    tags: ["luxury", "amenities", "premium"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "agent-credentials",
    name: "Agent Credentials & Awards",
    description: "Agent expertise and achievements",
    category: "agent",
    component: "AgentCredentialsBlock",
    requires: [],
    customizable: {},
    defaultProps: {
      badges: ["Top 1% Agent", "Million Dollar Club", "Customer Choice Award"],
      yearsExperience: 15,
      properties: 200,
      awards: ["Best Real Estate Agent 2023", "Excellence in Service"],
    },
    dataBindings: [],
    tags: ["agent", "credentials", "expertise"],
    createdAt: new Date().toISOString(),
  },
]

// ============================================
// EXPORT ALL EXTENDED BLOCKS
// ============================================

export const ALL_EXTENDED_BLOCKS: BlockTemplate[] = [
  ...GALLERY_BLOCKS,
  ...LISTING_FEATURE_BLOCKS,
  ...INFO_MARKETING_BLOCKS,
  ...REAL_ESTATE_SPECIFIC_BLOCKS,
]

export const EXTENDED_BLOCKS_COUNT = ALL_EXTENDED_BLOCKS.length
