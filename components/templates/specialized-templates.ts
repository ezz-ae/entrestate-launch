import type { Website, BlockInstance, WebsiteSettings } from "../types"

/**
 * Specialized Templates for Niche Real Estate Use Cases
 */

// ============================================
// 1. BLACK THEME - AI CHAT ONLY
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AI_CHAT_TEMPLATE: any = {
  id: "template-ai-chat",
  name: "AI Chat Assistant",
  description: "Black theme with AI chat interface for property discovery",
  category: "specialized",
  pages: [
    {
      slug: "home",
      title: "AI Assistant",
      blocks: [
        {
          id: "block-ai-chat",
          blockTemplateId: "ai-chat-block",
          props: { title: "Property AI Assistant" },
        } as BlockInstance,
      ],
    },
  ],
  settings: {
    primaryColor: "#3B82F6",
    secondaryColor: "#1E293B",
    accentColor: "#0EA5E9",
    fontFamily: "Inter, sans-serif",
    logoUrl: "",
    logoText: "AI Property",
  },
  createdAt: new Date().toISOString(),
}

// ============================================
// 2. MAP DISCOVERY
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MAP_DISCOVERY_TEMPLATE: any = {
  id: "template-map-discovery",
  name: "Map Discovery",
  description: "Browse properties on interactive map with side panel",
  category: "specialized",
  pages: [
    {
      slug: "home",
      title: "Discover Properties",
      blocks: [
        {
          id: "block-map",
          blockTemplateId: "interactive-map-block",
          props: { title: "Find Your Property", subtitle: "Search on the map" },
        } as BlockInstance,
      ],
    },
  ],
  settings: {
    primaryColor: "#0EA5E9",
    secondaryColor: "#FFFFFF",
    accentColor: "#3B82F6",
    fontFamily: "Inter, sans-serif",
    logoUrl: "",
    logoText: "Property Maps",
  },
  createdAt: new Date().toISOString(),
}

// ============================================
// 3. RENTAL PROPERTIES FOCUS
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RENTAL_TEMPLATE: any = {
  id: "template-rental",
  name: "Rental Properties",
  description: "Specialized template for apartment and rental management",
  category: "specialized",
  pages: [
    {
      slug: "home",
      title: "Find Your Apartment",
      blocks: [
        {
          id: "block-hero",
          blockTemplateId: "hero-block",
          props: { title: "Find Your Perfect Apartment", subtitle: "Browse our rental collection" },
        } as BlockInstance,
        {
          id: "block-rental-features",
          blockTemplateId: "rental-features-block",
          props: { title: "Why Rent With Us?" },
        } as BlockInstance,
      ],
    },
    {
      slug: "listings",
      title: "Available Rentals",
      blocks: [
        {
          id: "block-listings",
          blockTemplateId: "listings-grid-block",
          props: { title: "Available Properties" },
        } as BlockInstance,
      ],
    },
    {
      slug: "contact",
      title: "Contact Us",
      blocks: [
        {
          id: "block-contact",
          blockTemplateId: "contact-form-block",
          props: { title: "Request Information" },
        } as BlockInstance,
      ],
    },
  ],
  settings: {
    primaryColor: "#06B6D4",
    secondaryColor: "#F0F9FA",
    accentColor: "#0891B2",
    fontFamily: "Inter, sans-serif",
    logoUrl: "",
    logoText: "RentHub",
  },
  createdAt: new Date().toISOString(),
}

// ============================================
// 4. PRODUCT LAUNCH / NEW DEVELOPMENT
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PRODUCT_LAUNCH_TEMPLATE: any = {
  id: "template-product-launch",
  name: "Product Launch",
  description: "New development project launch with pre-selling focus",
  category: "specialized",
  pages: [
    {
      slug: "home",
      title: "Introducing Our Latest Project",
      blocks: [
        {
          id: "block-product-launch",
          blockTemplateId: "product-launch-block",
          props: { title: "Luxury Tower Dubai", subtitle: "Opening Q3 2024" },
        } as BlockInstance,
        {
          id: "block-features",
          blockTemplateId: "property-features-block",
          props: { title: "Project Highlights" },
        } as BlockInstance,
      ],
    },
    {
      slug: "units",
      title: "Available Units",
      blocks: [
        {
          id: "block-gallery",
          blockTemplateId: "carousel-property",
          props: { title: "Project Gallery" },
        } as BlockInstance,
      ],
    },
    {
      slug: "reserve",
      title: "Reserve Your Unit",
      blocks: [
        {
          id: "block-reserve-form",
          blockTemplateId: "contact-form-block",
          props: { title: "Reserve Your Unit Today" },
        } as BlockInstance,
      ],
    },
  ],
  settings: {
    primaryColor: "#8B5CF6",
    secondaryColor: "#0F172A",
    accentColor: "#A78BFA",
    fontFamily: "Playfair Display, serif",
    logoUrl: "",
    logoText: "Dev Projects",
  },
  createdAt: new Date().toISOString(),
}

// ============================================
// 5. SALES LANDING PAGE
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SALES_LANDING_TEMPLATE: any = {
  id: "template-sales-landing",
  name: "Sales Landing Page",
  description: "High-converting single page for property sales",
  category: "specialized",
  pages: [
    {
      slug: "home",
      title: "Premium Property",
      blocks: [
        {
          id: "block-hero",
          blockTemplateId: "video-hero-block",
          props: { title: "Luxury Beachfront Villa" },
        } as BlockInstance,
        {
          id: "block-specs",
          blockTemplateId: "property-specs-block",
          props: { title: "Property Details" },
        } as BlockInstance,
        {
          id: "block-features",
          blockTemplateId: "property-features-block",
          props: { title: "Amenities" },
        } as BlockInstance,
        {
          id: "block-cta",
          blockTemplateId: "cta-banner-block",
          props: { title: "Ready to Schedule a Viewing?" },
        } as BlockInstance,
        {
          id: "block-contact",
          blockTemplateId: "contact-form-block",
          props: { title: "Get More Information" },
        } as BlockInstance,
      ],
    },
  ],
  settings: {
    primaryColor: "#DC2626",
    secondaryColor: "#FEF2F2",
    accentColor: "#EF4444",
    fontFamily: "Inter, sans-serif",
    logoUrl: "",
    logoText: "Premium Properties",
  },
  createdAt: new Date().toISOString(),
}

// ============================================
// 6. EVENT / OPEN HOUSE
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EVENT_TEMPLATE: any = {
  id: "template-event",
  name: "Event Showcase",
  description: "Open house and event promotion template",
  category: "specialized",
  pages: [
    {
      slug: "home",
      title: "Open House Event",
      blocks: [
        {
          id: "block-hero",
          blockTemplateId: "hero-block",
          props: { title: "You're Invited!", subtitle: "Grand Opening Event" },
        } as BlockInstance,
        {
          id: "block-event",
          blockTemplateId: "open-house-block",
          props: { title: "Open House Event" },
        } as BlockInstance,
        {
          id: "block-gallery",
          blockTemplateId: "gallery-grid-6",
          props: { title: "Property Photos" },
        } as BlockInstance,
      ],
    },
    {
      slug: "rsvp",
      title: "RSVP",
      blocks: [
        {
          id: "block-contact",
          blockTemplateId: "contact-form-block",
          props: { title: "Confirm Your Attendance" },
        } as BlockInstance,
      ],
    },
  ],
  settings: {
    primaryColor: "#EC4899",
    secondaryColor: "#FCE7F3",
    accentColor: "#F43F5E",
    fontFamily: "Inter, sans-serif",
    logoUrl: "",
    logoText: "Events",
  },
  createdAt: new Date().toISOString(),
}

// ============================================
// 7. DEVELOPER / INVESTOR FOCUS
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DEVELOPER_TEMPLATE: any = {
  id: "template-developer",
  name: "Developer Focus",
  description: "Investment-focused template for developers and investors",
  category: "specialized",
  pages: [
    {
      slug: "home",
      title: "Investment Opportunities",
      blocks: [
        {
          id: "block-hero",
          blockTemplateId: "hero-block",
          props: { title: "Investor Portal", subtitle: "Premium Investment Opportunities" },
        } as BlockInstance,
        {
          id: "block-metrics",
          blockTemplateId: "investment-metrics-block",
          props: { title: "Investment Metrics" },
        } as BlockInstance,
        {
          id: "block-analysis",
          blockTemplateId: "investment-analysis-block",
          props: { title: "Detailed Analysis" },
        } as BlockInstance,
      ],
    },
    {
      slug: "portfolio",
      title: "Investment Portfolio",
      blocks: [
        {
          id: "block-similar",
          blockTemplateId: "similar-properties-block",
          props: { title: "Our Investments" },
        } as BlockInstance,
      ],
    },
  ],
  settings: {
    primaryColor: "#059669",
    secondaryColor: "#ECFDF5",
    accentColor: "#10B981",
    fontFamily: "Inter, sans-serif",
    logoUrl: "",
    logoText: "Dev Invest",
  },
  createdAt: new Date().toISOString(),
}

// ============================================
// 8. SPECIAL OFFERS / DEALS
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OFFER_TEMPLATE: any = {
  id: "template-offer",
  name: "Special Offers",
  description: "Limited-time offers and promotional deals",
  category: "specialized",
  pages: [
    {
      slug: "home",
      title: "Special Offer",
      blocks: [
        {
          id: "block-offer",
          blockTemplateId: "limited-offer-block",
          props: { title: "LIMITED TIME OFFER", offerText: "Save 20% on this luxury property" },
        } as BlockInstance,
        {
          id: "block-specs",
          blockTemplateId: "property-specs-block",
          props: { title: "Property Details" },
        } as BlockInstance,
        {
          id: "block-features",
          blockTemplateId: "luxury-amenities-block",
          props: { title: "Exclusive Features" },
        } as BlockInstance,
        {
          id: "block-contact",
          blockTemplateId: "contact-form-block",
          props: { title: "Claim This Offer" },
        } as BlockInstance,
      ],
    },
  ],
  settings: {
    primaryColor: "#DC2626",
    secondaryColor: "#FEF2F2",
    accentColor: "#F97316",
    fontFamily: "Inter, sans-serif",
    logoUrl: "",
    logoText: "Hot Deals",
  },
  createdAt: new Date().toISOString(),
}

// ============================================
// 9. REPORT FUNNEL / LEAD GENERATION
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const REPORT_FUNNEL_TEMPLATE: any = {
  id: "template-report-funnel",
  name: "Report Funnel",
  description: "Lead generation through market reports and valuations",
  category: "specialized",
  pages: [
    {
      slug: "home",
      title: "Market Reports",
      blocks: [
        {
          id: "block-hero",
          blockTemplateId: "hero-block",
          props: { title: "Market Intelligence", subtitle: "Get Your Free Report" },
        } as BlockInstance,
        {
          id: "block-metrics",
          blockTemplateId: "market-metrics-block",
          props: { title: "Market Overview" },
        } as BlockInstance,
      ],
    },
    {
      slug: "valuation",
      title: "Get Your Valuation",
      blocks: [
        {
          id: "block-report",
          blockTemplateId: "property-report-block",
          props: { title: "Free Property Valuation" },
        } as BlockInstance,
      ],
    },
    {
      slug: "about",
      title: "About Our Reports",
      blocks: [
        {
          id: "block-why",
          blockTemplateId: "why-choose-us-block",
          props: { title: "Why Choose Our Reports" },
        } as BlockInstance,
        {
          id: "block-faq",
          blockTemplateId: "faq-block",
          props: { title: "Frequently Asked Questions" },
        } as BlockInstance,
      ],
    },
  ],
  settings: {
    primaryColor: "#2563EB",
    secondaryColor: "#EFF6FF",
    accentColor: "#3B82F6",
    fontFamily: "Inter, sans-serif",
    logoUrl: "",
    logoText: "Market Reports",
  },
  createdAt: new Date().toISOString(),
}

/**
 * All specialized templates
 */
export const SPECIALIZED_TEMPLATES = [
  AI_CHAT_TEMPLATE,
  MAP_DISCOVERY_TEMPLATE,
  RENTAL_TEMPLATE,
  PRODUCT_LAUNCH_TEMPLATE,
  SALES_LANDING_TEMPLATE,
  EVENT_TEMPLATE,
  DEVELOPER_TEMPLATE,
  OFFER_TEMPLATE,
  REPORT_FUNNEL_TEMPLATE,
]
