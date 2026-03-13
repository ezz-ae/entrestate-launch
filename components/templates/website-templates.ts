/**
 * Pre-Built Website Templates
 * 20+ complete website bundles organized by use case
 * Each template includes all necessary pages and blocks
 */

import type { WebsiteTemplate } from "../types"
import { SPECIALIZED_TEMPLATES as NEW_SPECIALIZED_TEMPLATES } from "./specialized-templates"

// ============================================
// PREMIUM / LUXURY REAL ESTATE TEMPLATES (4)
// ============================================

export const LUXURY_TEMPLATES: WebsiteTemplate[] = [
  {
    id: "luxury-boutique",
    name: "Luxury Boutique Agency",
    description: "High-end properties with video tours and investment analysis",
    pages: [
      "header-sticky",
      "hero-default",
      "video-hero",
      "listings-grid-3col",
      "luxury-amenities",
      "testimonials",
      "agent-grid",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#1a1a2e",
        secondary: "#d4af37",
        accent: "#e8d5a5",
        text: "#2c3e50",
        background: "#ffffff",
      },
      fonts: { heading: "Georgia, serif", body: "Geist, sans-serif" },
      branding: {
        logoUrl: "",
        companyName: "Luxury Realty",
        phone: "",
        email: "",
        address: "",
      },
    },
    category: "luxury",
    tags: ["luxury", "boutique", "premium", "high-end"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "luxury-investment",
    name: "Luxury Investment Portfolio",
    description: "Investment properties with detailed financial analysis",
    pages: [
      "header-sticky",
      "hero-default",
      "listings-grid-4col",
      "investment-analysis",
      "price-breakdown",
      "mortgage-calculator",
      "agent-credentials",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#003d82",
        secondary: "#0066cc",
        accent: "#ff9500",
        text: "#1a1a1a",
        background: "#f8f9fa",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Investment Properties Inc", phone: "", email: "", address: "" },
    },
    category: "luxury",
    tags: ["investment", "portfolio", "financial", "analytics"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "luxury-new-construction",
    name: "New Construction Developer",
    description: "New build communities with community amenities showcase",
    pages: [
      "header-sticky",
      "hero-default",
      "new-construction",
      "benefits-3col",
      "neighborhood-info",
      "gallery-grid-6",
      "process-steps",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#2196f3",
        secondary: "#1976d2",
        accent: "#ff6f00",
        text: "#212121",
        background: "#ffffff",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "New Homes Developer", phone: "", email: "", address: "" },
    },
    category: "luxury",
    tags: ["new-construction", "development", "community", "builder"],
    createdAt: new Date().toISOString(),
  },
]

// ============================================
// MAINSTREAM REAL ESTATE TEMPLATES (6)
// ============================================

export const MAINSTREAM_TEMPLATES: WebsiteTemplate[] = [
  {
    id: "full-service-agency",
    name: "Full Service Real Estate Agency",
    description: "Complete agency website with buyer/seller resources",
    pages: [
      "header-sticky",
      "hero-default",
      "listings-grid-3col",
      "process-steps",
      "benefits-3col",
      "agent-grid",
      "testimonials",
      "faq-accordion",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#2563eb",
        secondary: "#1e40af",
        accent: "#10b981",
        text: "#1a1a1a",
        background: "#ffffff",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Premier Realty", phone: "", email: "", address: "" },
    },
    category: "mainstream",
    tags: ["full-service", "agency", "residential", "commercial"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "buyers-focused",
    name: "Buyers-Focused Agency",
    description: "Site optimized for home buyers with tools and resources",
    pages: [
      "header-sticky",
      "hero-default",
      "listings-grid-4col",
      "mortgage-calculator",
      "neighborhood-info",
      "benefits-3col",
      "process-steps",
      "faq-accordion",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#059669",
        secondary: "#047857",
        accent: "#0891b2",
        text: "#1f2937",
        background: "#f3f4f6",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Your Home Experts", phone: "", email: "", address: "" },
    },
    category: "mainstream",
    tags: ["buyers", "focused", "tools", "resources"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "sellers-focused",
    name: "Sellers-Focused Agency",
    description: "Marketing-heavy site for home sellers",
    pages: [
      "header-sticky",
      "hero-default",
      "benefits-3col",
      "process-steps",
      "gallery-grid-6",
      "price-breakdown",
      "agent-credentials",
      "testimonials",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#dc2626",
        secondary: "#b91c1c",
        accent: "#f59e0b",
        text: "#111827",
        background: "#ffffff",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Sell Smart Realty", phone: "", email: "", address: "" },
    },
    category: "mainstream",
    tags: ["sellers", "marketing", "exposure", "value"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "community-focused",
    name: "Community Real Estate",
    description: "Emphasizes local market knowledge and community",
    pages: [
      "header-sticky",
      "hero-default",
      "listings-grid-3col",
      "neighborhood-info",
      "agent-grid",
      "testimonials",
      "benefits-3col",
      "open-house",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#7c3aed",
        secondary: "#6d28d9",
        accent: "#ec4899",
        text: "#1f2937",
        background: "#fafafa",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Local Community Realty", phone: "", email: "", address: "" },
    },
    category: "mainstream",
    tags: ["community", "local", "neighborhood", "connection"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    description: "Clean, contemporary design with focus on properties",
    pages: [
      "header-sticky",
      "hero-default",
      "listings-grid-3col",
      "property-features",
      "carousel-property",
      "agent-grid",
      "testimonials",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#000000",
        secondary: "#404040",
        accent: "#ffffff",
        text: "#1a1a1a",
        background: "#ffffff",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Minimalist Properties", phone: "", email: "", address: "" },
    },
    category: "mainstream",
    tags: ["modern", "minimalist", "contemporary", "clean"],
    createdAt: new Date().toISOString(),
  },
]

// ============================================
// SPECIALIZED TEMPLATES (6)
// ============================================

export const SPECIALIZED_TEMPLATES: WebsiteTemplate[] = [
  {
    id: "luxury-rentals",
    name: "Luxury Rental Properties",
    description: "Vacation/corporate rental properties showcase",
    pages: [
      "header-sticky",
      "hero-default",
      "listings-grid-3col",
      "property-features",
      "gallery-grid-6",
      "neighborhood-info",
      "testimonials",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#f59e0b",
        secondary: "#d97706",
        accent: "#1f2937",
        text: "#1f2937",
        background: "#fffbeb",
      },
      fonts: { heading: "Georgia, serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Luxury Stays", phone: "", email: "", address: "" },
    },
    category: "specialized",
    tags: ["rental", "vacation", "corporate", "luxury"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "property-management",
    name: "Property Management Company",
    description: "Manage residential/commercial properties",
    pages: [
      "header-sticky",
      "hero-default",
      "services-grid",
      "testimonials",
      "benefits-3col",
      "agent-grid",
      "faq-accordion",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#0891b2",
        secondary: "#0e7490",
        accent: "#06b6d4",
        text: "#164e63",
        background: "#ecf0f1",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Property Management Pro", phone: "", email: "", address: "" },
    },
    category: "specialized",
    tags: ["property-management", "tenant", "landlord", "maintenance"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "mortgage-brokerage",
    name: "Mortgage Brokerage",
    description: "Financing and mortgage services",
    pages: [
      "header-sticky",
      "hero-default",
      "benefits-3col",
      "mortgage-calculator",
      "process-steps",
      "testimonials",
      "faq-accordion",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#1e40af",
        secondary: "#1e3a8a",
        accent: "#0ea5e9",
        text: "#0f172a",
        background: "#ffffff",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Smart Mortgages", phone: "", email: "", address: "" },
    },
    category: "specialized",
    tags: ["mortgage", "financing", "loans", "broker"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "international-relocation",
    name: "International Relocation Services",
    description: "Help relocate families to new countries",
    pages: [
      "header-sticky",
      "hero-default",
      "benefits-3col",
      "process-steps",
      "testimonials",
      "neighborhood-info",
      "agent-grid",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#7c3aed",
        secondary: "#5b21b6",
        accent: "#ec4899",
        text: "#2d1b69",
        background: "#f3e8ff",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Global Relocations", phone: "", email: "", address: "" },
    },
    category: "specialized",
    tags: ["international", "relocation", "expat", "global"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "commercial-real-estate",
    name: "Commercial Real Estate",
    description: "Office, retail, and industrial properties",
    pages: [
      "header-sticky",
      "hero-default",
      "listings-grid-4col",
      "property-specs",
      "investment-analysis",
      "price-breakdown",
      "agent-credentials",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#1f2937",
        secondary: "#374151",
        accent: "#3b82f6",
        text: "#111827",
        background: "#f9fafb",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Commercial Properties LLC", phone: "", email: "", address: "" },
    },
    category: "specialized",
    tags: ["commercial", "office", "retail", "industrial"],
    createdAt: new Date().toISOString(),
  },
]

// ============================================
// INDUSTRY-SPECIFIC TEMPLATES (4)
// ============================================

export const INDUSTRY_TEMPLATES: WebsiteTemplate[] = [
  {
    id: "short-term-rental",
    name: "Short-Term Rental Management",
    description: "Airbnb/VRBO property management and bookings",
    pages: [
      "header-sticky",
      "hero-default",
      "listings-grid-3col",
      "property-features",
      "carousel-property",
      "testimonials",
      "benefits-3col",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#ff385c",
        secondary: "#e31c23",
        accent: "#222222",
        text: "#222222",
        background: "#ffffff",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Vacation Rental Co", phone: "", email: "", address: "" },
    },
    category: "industry",
    tags: ["short-term", "vacation", "airbnb", "booking"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "mobile-home-park",
    name: "Mobile Home Park",
    description: "Manufactured home communities",
    pages: [
      "header-sticky",
      "hero-default",
      "listings-grid-3col",
      "property-features",
      "neighborhood-info",
      "open-house",
      "testimonials",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#78350f",
        secondary: "#92400e",
        accent: "#f59e0b",
        text: "#1f2937",
        background: "#fef3c7",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Happy Homes Parks", phone: "", email: "", address: "" },
    },
    category: "industry",
    tags: ["mobile-home", "manufactured", "park", "community"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "land-sales",
    name: "Land & Development",
    description: "Raw land and development opportunities",
    pages: [
      "header-sticky",
      "hero-default",
      "listings-grid-4col",
      "property-specs",
      "map-section",
      "investment-analysis",
      "process-steps",
      "contact-form",
      "footer-default",
    ],
    defaultSettings: {
      colors: {
        primary: "#16a34a",
        secondary: "#15803d",
        accent: "#ca8a04",
        text: "#1b4332",
        background: "#f0fdf4",
      },
      fonts: { heading: "Geist, sans-serif", body: "Geist, sans-serif" },
      branding: { logoUrl: "", companyName: "Land Development Group", phone: "", email: "", address: "" },
    },
    category: "industry",
    tags: ["land", "development", "investment", "opportunity"],
    createdAt: new Date().toISOString(),
  },
]

// ============================================
// EXPORT ALL TEMPLATES
// ============================================

export const ALL_WEBSITE_TEMPLATES = [
  ...LUXURY_TEMPLATES,
  ...MAINSTREAM_TEMPLATES,
  ...SPECIALIZED_TEMPLATES,
  ...INDUSTRY_TEMPLATES,
  ...NEW_SPECIALIZED_TEMPLATES,
]

export const WEBSITE_TEMPLATES_COUNT = ALL_WEBSITE_TEMPLATES.length
