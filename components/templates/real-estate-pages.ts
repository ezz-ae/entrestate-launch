import type { PageTemplate } from "../types"
import {
  HERO_BLOCKS,
  PROPERTY_GRID_BLOCKS,
  PROPERTY_CARD_BLOCKS,
  FORM_BLOCKS,
  AGENT_BLOCKS,
  INFO_BLOCKS,
  HEADER_FOOTER_BLOCKS,
} from "./real-estate-blocks"

// ============================================
// PRE-BUILT PAGE TEMPLATES
// ============================================

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "home-page",
    name: "Home Page",
    description: "Complete home page with hero, featured listings, about, and testimonials",
    category: "home",
    tags: ["home", "landing", "complete"],
    createdAt: new Date().toISOString(),
    blocks: [
      HEADER_FOOTER_BLOCKS[0], // Sticky header
      HERO_BLOCKS[0], // Modern hero with video
      PROPERTY_GRID_BLOCKS[0], // Featured properties grid
      INFO_BLOCKS[1], // Why choose us
      AGENT_BLOCKS[0], // Team grid
      INFO_BLOCKS[4], // Testimonials
      INFO_BLOCKS[6], // CTA banner
      HEADER_FOOTER_BLOCKS[2], // Standard footer
    ],
    defaultSettings: {
      colors: {
        primary: "#2563eb",
        secondary: "#1e40af",
        accent: "#10b981",
        text: "#1a1a1a",
        background: "#ffffff",
      },
      fonts: {
        heading: "Geist, sans-serif",
        body: "Geist, sans-serif",
      },
      branding: {
        logoUrl: "",
        companyName: "Real Estate Agency",
        phone: "",
        email: "",
        address: "",
      },
    },
  },
  {
    id: "listings-page",
    name: "Listings Page",
    description: "All properties with search and filters",
    category: "listings",
    tags: ["listings", "properties", "grid"],
    createdAt: new Date().toISOString(),
    blocks: [
      HEADER_FOOTER_BLOCKS[0], // Header
      HERO_BLOCKS[3], // Search hero
      PROPERTY_GRID_BLOCKS[1], // 4-column grid with filters
      INFO_BLOCKS[6], // CTA banner
      HEADER_FOOTER_BLOCKS[2], // Footer
    ],
  },
  {
    id: "property-detail-page",
    name: "Property Detail Page",
    description: "Single property showcase with gallery, agent, and related listings",
    category: "detail",
    tags: ["property", "detail", "showcase"],
    createdAt: new Date().toISOString(),
    blocks: [
      HEADER_FOOTER_BLOCKS[0], // Header
      PROPERTY_GRID_BLOCKS[2], // Image gallery/carousel
      PROPERTY_CARD_BLOCKS[0], // Property details
      AGENT_BLOCKS[1], // Agent spotlight
      FORM_BLOCKS[2], // Schedule tour form
      PROPERTY_GRID_BLOCKS[0], // Related properties
      HEADER_FOOTER_BLOCKS[2], // Footer
    ],
  },
  {
    id: "about-page",
    name: "About Us Page",
    description: "Agency information, mission, team, and contact",
    category: "about",
    tags: ["about", "team", "company"],
    createdAt: new Date().toISOString(),
    blocks: [
      HEADER_FOOTER_BLOCKS[0], // Header
      HERO_BLOCKS[1], // Simple hero
      INFO_BLOCKS[0], // About section
      INFO_BLOCKS[1], // Why choose us
      AGENT_BLOCKS[0], // Team grid
      INFO_BLOCKS[4], // Testimonials
      FORM_BLOCKS[0], // Contact form
      HEADER_FOOTER_BLOCKS[2], // Footer
    ],
  },
  {
    id: "contact-page",
    name: "Contact Page",
    description: "Contact information, forms, and map",
    category: "contact",
    tags: ["contact", "form", "location"],
    createdAt: new Date().toISOString(),
    blocks: [
      HEADER_FOOTER_BLOCKS[0], // Header
      HERO_BLOCKS[1], // Simple hero
      FORM_BLOCKS[0], // Contact form
      AGENT_BLOCKS[0], // Team for contact
      HEADER_FOOTER_BLOCKS[2], // Footer
    ],
  },
  {
    id: "agent-profile-page",
    name: "Agent Profile Page",
    description: "Individual agent profile with listings and testimonials",
    category: "agent",
    tags: ["agent", "profile", "properties"],
    createdAt: new Date().toISOString(),
    blocks: [
      HEADER_FOOTER_BLOCKS[0], // Header
      AGENT_BLOCKS[1], // Agent spotlight
      PROPERTY_GRID_BLOCKS[0], // Agent's listings
      INFO_BLOCKS[4], // Testimonials from clients
      FORM_BLOCKS[0], // Contact form
      HEADER_FOOTER_BLOCKS[2], // Footer
    ],
  },
]

export const STARTER_WEBSITE = {
  id: "starter-website",
  name: "Starter Real Estate Website",
  agencyId: "demo-agency",
  pages: PAGE_TEMPLATES.map((template, index) => ({
    id: `page-${index}`,
    title: template.name,
    slug: template.name.toLowerCase().replace(/\s+/g, "-"),
    blocks: template.blocks.map((block, blockIndex) => ({
      id: `block-${index}-${blockIndex}`,
      blockTemplateId: block.id,
      position: blockIndex,
      settings: {},
      overrides: {},
    })),
    seo: {
      metaDescription: template.description,
      keywords: template.tags,
      title: template.name,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
  settings: {
    colors: {
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#10b981",
      text: "#1a1a1a",
      background: "#ffffff",
    },
    fonts: {
      heading: "Geist, sans-serif",
      body: "Geist, sans-serif",
    },
    branding: {
      logoUrl: "https://via.placeholder.com/200x60?text=Logo",
      companyName: "Your Real Estate Agency",
      phone: "(555) 123-4567",
      email: "info@youragency.com",
      address: "123 Main Street, San Francisco, CA 94105",
    },
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
