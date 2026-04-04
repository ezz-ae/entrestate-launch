import { brand } from "@/lib/brand"

export type MarketingProductSeed = {
  slug: string
  title: string
  tagline: string
  description: string
  category: string
  badge?: string
  priceLabel: string
  priceNote?: string
  highlights: string[]
  deliverables: string[]
  timeline: { title: string; description: string }[]
  outcomes: { label: string; value: string }[]
  heroImage: string
  demoUrl?: string
  sortOrder?: number
}

export type MarketingBlogPostSeed = {
  slug: string
  title: string
  description: string
  heroImage: string
  publishedAt: string
  content: string
}

export type MarketingLogoSeed = {
  name: string
  imageUrl: string
  row: string
  sortOrder: number
}

export type MarketingPricingPlan = {
  id: string
  name: string
  price: string
  currency: string
  cadence?: string
  tagline: string
  features: string[]
  cta: string
  href?: string
  featured?: boolean
  badge?: string
}

export type MarketingPricingContent = {
  title: string
  subtitle: string
  plans: MarketingPricingPlan[]
}

export type MarketingFooterContent = {
  tagline: string
  copyright: string
}

export type MarketingAdminContent = {
  hero: {
    title: string
    subtitle: string
    buttonText: string
  }
  features: {
    title: string
    subtitle: string
  }
  footer: MarketingFooterContent
  about: {
    title: string
    description: string
    mission: string
    vision: string
    teamSize: string
    founded: string
    locations: string
  }
  pricing: {
    startup: {
      price_usd: string
      price_inr: string
      features: string[]
      videos: string[]
    }
    pro: {
      price_usd: string
      price_inr: string
      features: string[]
      videos: string[]
    }
    premium: {
      price_usd: string
      price_inr: string
      features: string[]
      videos: string[]
    }
  }
  orderForm: {
    whatsappNumber: string
    modelingOptions: {
      simple: { price_usd: number; price_inr: number; description: string }
      medium: { price_usd: number; price_inr: number; description: string }
      complex: { price_usd: number; price_inr: number; description: string }
    }
    renderOptions: {
      basic: { price_usd: number; price_inr: number; quantity: number }
      standard: { price_usd: number; price_inr: number; quantity: number }
      premium: { price_usd: number; price_inr: number; quantity: number }
    }
    formSteps: {
      enabled: boolean
      title: string
      description: string
    }[]
  }
  settings: {
    adminEmail: string
    adminPassword: string
  }
}

export const defaultProducts: MarketingProductSeed[] = [
  {
    slug: "ore-investor-intelligence-site",
    title: "ORE Investor Intelligence Site",
    tagline: "A premium Dubai brokerage site with AI assistant, live inventory, market reports, and investor briefing capture.",
    description:
      "A ready-made luxury brokerage experience designed for investor-led discovery: searchable property inventory, AI-guided Q&A, market intelligence dashboards, area profiles, and high-intent lead capture built into one polished site.",
    category: "Ready-Made Site",
    badge: "For Sale",
    priceLabel: "AED 24,900",
    priceNote: "one-time white-label site acquisition",
    demoUrl: "https://ore-mu.vercel.app/",
    highlights: [
      "Premium investor-facing homepage and navigation",
      "AI assistant with shortlist and Golden Visa prompts",
      "Live inventory browse flow with filters and ROI cues",
      "Market trends, reports, and consultation capture",
    ],
    deliverables: [
      "White-label premium brokerage site",
      "AI assistant and inquiry journey",
      "Inventory, market, and report pages",
      "WhatsApp, consultation, and briefing capture flows",
      "Deployment handoff with branded content updates",
    ],
    timeline: [
      { title: "Week 1", description: "Branding, content, and lead routing alignment" },
      { title: "Week 2", description: "Delivery polish, QA, and launch handoff" },
    ],
    outcomes: [
      { label: "Offer Type", value: "Ready-Made Site" },
      { label: "Buyer Flow", value: "AI + Inventory" },
      { label: "Market Focus", value: "Dubai Investors" },
    ],
    heroImage: "/images/ore-site.png",
    sortOrder: 0,
  },
  {
    slug: "ultimate-inventory",
    title: "Ultimate Inventory",
    tagline: "Live project intelligence for brokerages that need to look bigger than the portals.",
    description:
      "Instantly plug into a structured, auto-updating database of 2,500+ UAE projects with discovery-ready presentation layers.",
    category: "Intelligence Module",
    badge: "Core Module",
    priceLabel: "AED 2,399",
    priceNote: "pilot launch for one live module",
    demoUrl: "/templates/luxury-boutique",
    highlights: [
      "2,500+ UAE project database",
      "Off-plan to ready inventory coverage",
      "No more manual spreadsheet updates",
    ],
    deliverables: [
      "Structured inventory layer",
      "Search and discovery presentation",
      "Project data sync setup",
      "Brokerage-facing control rules",
    ],
    timeline: [
      { title: "Week 1", description: "Inventory mapping and source audit" },
      { title: "Week 2", description: "Presentation layer configuration" },
      { title: "Launch", description: "Brokerage QA and go-live" },
    ],
    outcomes: [
      { label: "Coverage", value: "2,500+" },
      { label: "Update Mode", value: "Live" },
      { label: "Workflow", value: "Automated" },
    ],
    heroImage: "/images/products/inventory-module.png",
    sortOrder: 1,
  },
  {
    slug: "lead-intelligence",
    title: "Lead Intelligence",
    tagline: "A 24/7 AI sales layer that captures intent before the lead goes cold.",
    description:
      "Qualify buyer behavior, recommend next actions, and route high-intent opportunities automatically.",
    category: "Intelligence Module",
    badge: "High Impact",
    priceLabel: "AED 2,399",
    priceNote: "pilot launch for one live module",
    demoUrl: "/templates/modern-minimalist",
    highlights: [
      "Intent scoring and behavior capture",
      "AI-guided follow-up recommendations",
      "Booking and handoff prompts",
    ],
    deliverables: [
      "Lead qualification widgets",
      "Next-action recommendation flows",
      "Conversation routing logic",
    ],
    timeline: [
      { title: "Week 1", description: "Lead funnel mapping" },
      { title: "Week 2", description: "Qualification and routing setup" },
    ],
    outcomes: [
      { label: "Coverage", value: "24/7" },
      { label: "Signals", value: "Intent" },
      { label: "Outcome", value: "Qualified" },
    ],
    heroImage: "/images/products/lead-intelligence-module.png",
    sortOrder: 2,
  },
  {
    slug: "developer-scorecards",
    title: "Developer Scorecards",
    tagline: "Give buyers confidence with verifiable developer trust signals.",
    description:
      "Showcase delivery reliability, escrow verification, and past performance inside the property journey.",
    category: "Trust Module",
    badge: "Buyer Confidence",
    priceLabel: "AED 2,399",
    priceNote: "pilot launch for one live module",
    demoUrl: "/templates/community-focused",
    highlights: [
      "Delivery history snapshots",
      "Escrow and credibility markers",
      "Yield and performance framing",
    ],
    deliverables: [
      "Developer comparison views",
      "Scorecard visualization blocks",
      "Buyer-facing confidence cues",
    ],
    timeline: [
      { title: "Week 1", description: "Data normalization and scoring model" },
      { title: "Week 2", description: "Visualization and placement" },
    ],
    outcomes: [
      { label: "Trust", value: "Visible" },
      { label: "Proof", value: "Structured" },
      { label: "Buyer Mood", value: "Confident" },
    ],
    heroImage: "/images/products/developer-scorecards-module.png",
    sortOrder: 3,
  },
  {
    slug: "hyper-local-heatmaps",
    title: "Hyper-Local Heatmaps",
    tagline: "Turn Dubai zones into decision-ready map intelligence.",
    description:
      "Display live under-construction density, prominent developers, and zone-level ROI context inside an interactive map experience.",
    category: "Market Module",
    badge: "Local Edge",
    priceLabel: "AED 2,399",
    priceNote: "pilot launch for one live module",
    demoUrl: "/templates/template-product-launch",
    highlights: [
      "Zone-by-zone ROI visibility",
      "Density and developer overlays",
      "Interactive exploration journey",
    ],
    deliverables: [
      "Map-driven discovery experience",
      "Localized investment insight overlays",
      "Area comparison UI",
    ],
    timeline: [
      { title: "Week 1", description: "Zone modeling and data setup" },
      { title: "Week 2", description: "Map and overlay implementation" },
    ],
    outcomes: [
      { label: "Map Focus", value: "Dubai" },
      { label: "Insight", value: "ROI" },
      { label: "Discovery", value: "Guided" },
    ],
    heroImage: "/images/products/heatmaps-module.png",
    sortOrder: 4,
  },
  {
    slug: "current-site-upgrade",
    title: "Current Site Upgrade",
    tagline: "Integrate the MTC intelligence layer into the site you already own.",
    description:
      "Deploy selected modules into your existing brokerage stack without rebuilding everything from zero.",
    category: "Launch Path",
    badge: "Path 1",
    priceLabel: "Custom",
    priceNote: "discovery-based scope",
    demoUrl: "/templates/template-sales-landing",
    highlights: [
      "Modular rollout plan",
      "Works with existing brand and domain",
      "Fastest path to intelligence deployment",
    ],
    deliverables: [
      "Integration roadmap",
      "Selected intelligence modules",
      "Launch QA and handoff",
    ],
    timeline: [
      { title: "Sprint 1", description: "Audit current stack" },
      { title: "Sprint 2", description: "Integrate chosen modules" },
    ],
    outcomes: [
      { label: "Path", value: "Upgrade" },
      { label: "Speed", value: "Fast" },
      { label: "Risk", value: "Low" },
    ],
    heroImage: "/images/products/site-upgrade-path.png",
    sortOrder: 5,
  },
  {
    slug: "exclusive-turnkey-platform",
    title: "Exclusive Turnkey Platform",
    tagline: "Claim the fully integrated MTC brokerage ecosystem.",
    description:
      "A done-for-you platform with the full intelligence stack, sold one time for exclusivity.",
    category: "Launch Path",
    badge: "Path 2",
    priceLabel: "Custom",
    priceNote: "exclusive deployment",
    demoUrl: "/templates/template-offer",
    highlights: [
      "Full intelligence engine included",
      "One buyer, one deployment",
      "Expandable roadmap from transactions to full history",
    ],
    deliverables: [
      "Exclusive platform rollout",
      "Lead routing and discovery system",
      "Brokerage-specific launch playbook",
    ],
    timeline: [
      { title: "Phase 1", description: "Platform strategy and exclusivity lock" },
      { title: "Phase 2", description: "Full-stack deployment" },
    ],
    outcomes: [
      { label: "Model", value: "Turnkey" },
      { label: "Ownership", value: "Exclusive" },
      { label: "Edge", value: "Defensible" },
    ],
    heroImage: "/images/products/turnkey-platform.png",
    sortOrder: 6,
  },
]

export const defaultBlogPosts: MarketingBlogPostSeed[] = [
  {
    slug: "scaling-your-brokerage-with-ai",
    title: "Scaling Your Brokerage with AI: 2026 Strategy",
    description:
      "Learn how modern real estate teams are using AI to automate lead capture and property descriptions at scale.",
    heroImage: "/images/intuitive-1.png",
    publishedAt: "2026-03-12T03:28:38.742Z",
    content:
      "AI changes the economics of brokerage operations when it runs lead intake, qualification, and follow-up. The best teams define a clear workflow: capture, enrich, qualify, and assign. When the system is tuned to the right signals, agents spend time on high-intent conversations instead of manual triage.\n\nTo scale without losing quality, keep the human touch in the final steps. Automations should surface context, urgency, and next actions, while experienced agents handle negotiation and closing. That mix drives volume and protects brand trust.",
  },
  {
    slug: "why-speed-to-lead-matters",
    title: "Why Speed-to-Lead is the Only Metric That Matters",
    description:
      "New data shows that responding to a lead within 5 minutes increases conversion rates by over 400%.",
    heroImage: "/images/top-rated-1.png",
    publishedAt: "2026-03-11T03:43:25.606Z",
    content:
      "Speed-to-lead is the most reliable predictor of conversion. The first response shapes the buyer perception of professionalism and urgency. Teams that respond inside five minutes consistently outperform slower competitors.\n\nThe fastest teams remove human bottlenecks with automated handoffs, smart routing, and predefined playbooks. Even when agents are busy, the lead experiences immediate engagement and a clear next step.",
  },
  {
    slug: "luxury-branding-for-real-estate",
    title: "Luxury Branding: Beyond the Logo",
    description:
      "How to create a high-end digital presence that resonates with ultra-high-net-worth investors.",
    heroImage: "/images/intuitive-2.png",
    publishedAt: "2026-03-10T02:47:46.420Z",
    content:
      "Luxury branding is less about the logo and more about the experience. Your site should feel composed, confident, and editorial. High-contrast typography, curated imagery, and deliberate pacing create trust.\n\nThe strongest luxury brands reduce noise. Every page supports one outcome: clarity, intent, and confidence. When the design aligns with the promise, the market responds.",
  },
]

export const defaultLogos: MarketingLogoSeed[] = [
  { name: "VK", imageUrl: "/icons/Supp.png", row: "first", sortOrder: 1 },
  { name: "TechCrunch", imageUrl: "/icons/SHKUP.png", row: "first", sortOrder: 2 },
  { name: "MailChimp", imageUrl: "/icons/Persona.png", row: "first", sortOrder: 3 },
  { name: "ESJ", imageUrl: "/icons/HFFB.png", row: "first", sortOrder: 4 },
  { name: "Palladio", imageUrl: "/icons/Palladio.png", row: "first", sortOrder: 5 },
  { name: "Victorinox", imageUrl: "/icons/Victorinox.png", row: "first", sortOrder: 6 },
  { name: "Trump", imageUrl: "/icons/Trumpp.png", row: "first", sortOrder: 7 },
  { name: "Poedagar", imageUrl: "/icons/Poedagarr.png", row: "first", sortOrder: 8 },
  { name: "Kami", imageUrl: "/icons/Kami.png", row: "second", sortOrder: 1 },
  { name: "Neemans", imageUrl: "/icons/NEEMANS.png", row: "second", sortOrder: 2 },
  { name: "Flick", imageUrl: "/icons/FLICK.png", row: "second", sortOrder: 3 },
  { name: "Vandelay", imageUrl: "/icons/Vandelay.png", row: "second", sortOrder: 4 },
  { name: "KejbyKej", imageUrl: "/icons/KEJBYKEJ.png", row: "second", sortOrder: 5 },
  { name: "Skinny", imageUrl: "/icons/Skinny.png", row: "second", sortOrder: 6 },
  { name: "Rico", imageUrl: "/icons/RICO.png", row: "second", sortOrder: 7 },
  { name: "Skyborne", imageUrl: "/icons/Skyborne.png", row: "second", sortOrder: 8 },
]

export const defaultPricing: MarketingPricingContent = {
  title: "Choose the MTC launch path that fits your brokerage.",
  subtitle:
    "Start with a paid pilot, integrate the intelligence layer into your current site, or claim the exclusive turnkey platform.",
  plans: [
    {
      id: "pilot",
      name: "Pilot Module",
      price: "AED 2,399",
      currency: "AED",
      tagline: "Best for teams that want to launch one live module fast and validate demand.",
      features: [
        "One production-ready module",
        "Live builder preview and content customization",
        "Checkout handoff and domain connection flow",
        "Launch guidance for the first rollout",
      ],
      cta: "Start pilot",
      href: brand.builderHref,
      badge: "Fastest path",
    },
    {
      id: "integration",
      name: "Upgrade Your Current Site",
      price: "Custom",
      currency: "AED",
      tagline: "Best for brokerages that already have a site and want the intelligence layer fast.",
      features: [
        "AI chat and lead qualification",
        "2500+ UAE project database integration",
        "Hyper-local Dubai map module",
        "Developer scorecards and ROI insights",
      ],
      cta: "View integration path",
      href: "/products/current-site-upgrade",
    },
    {
      id: "turnkey",
      name: "Exclusive Turnkey Platform",
      price: "Custom",
      currency: "AED",
      tagline: "A done-for-you brokerage ecosystem sold once for exclusivity.",
      features: [
        "Fully integrated intelligence engine",
        "Exclusive deployment reserved for one buyer",
        "Lead routing, CRM handoff, and discovery flows",
        "Expandable roadmap from transactions to property history",
      ],
      cta: "See flagship platform",
      href: "/products/exclusive-turnkey-platform",
      featured: true,
      badge: "Flagship",
    },
  ],
}

export const defaultFooter: MarketingFooterContent = {
  tagline: brand.tagline,
  copyright: `Copyright 2025 - ${brand.name}`,
}

export const defaultAdminContent: MarketingAdminContent = {
  hero: {
    title: "EQUIP YOUR BROKERAGE WITH SUPERPOWERS",
    subtitle: "mtc",
    buttonText: brand.ctaLabel,
  },
  features: {
    title: "Why MTC wins the lead race.",
    subtitle: "Live inventory, AI intent tracking, and decision-ready brokerage intelligence.",
  },
  footer: defaultFooter,
  about: {
    title: "About MTC Intelligence Engine",
    description: brand.description,
    mission: "To turn brochure-style brokerage sites into intelligent sales systems.",
    vision: "To become the default digital operating layer for data-driven brokerages.",
    teamSize: "Brokerage, data, and AI specialists",
    founded: "2025",
    locations: "Dubai",
  },
  pricing: {
    startup: {
      price_usd: "$299",
      price_inr: "INR 25,000",
      features: [
        "Up to 15s 3D Animation",
        "2 Revisions",
        "Creative Backgrounds",
        "Simple 3D Animation",
        "7-10 Day Turnaround time",
        "Simple 3D Models Included",
      ],
      videos: [
        "ysz5S6PUM-U",
        "aqz-KE-bpKQ",
        "ScMzIvxBSi4",
        "dQw4w9WgXcQ",
        "VYOjWnS4cMY",
        "9bZkp7q19f0",
        "3JZ_D3ELwOQ",
        "e-ORhEE9VVg",
        "fJ9rUzIMcZQ",
      ],
    },
    pro: {
      price_usd: "$699",
      price_inr: "INR 55,000",
      features: [
        "Up to 25s 3D Animation",
        "4 Revisions",
        "Creative Backgrounds, Lite graphics",
        "Detailed 3D Animation",
        "20-25 Day Turnaround",
        "Pre-built 3D Models",
      ],
      videos: [
        "ASV2myPRfKA",
        "eTfS2lqwf6A",
        "KALbYHmGV4I",
        "Go0AA9hZ4as",
        "sB7RZ9QCOAg",
        "TK2WboJOJaw",
        "5Xq7UdXXOxI",
        "kMjWCidQSK0",
        "RKKdQvwKOhQ",
      ],
    },
    premium: {
      price_usd: "$2,049",
      price_inr: "INR 170,500",
      features: [
        "40-60s 3D Animation",
        "Creative Backgrounds, Lite graphics",
        "Liquid, Smoke, Fire, Cloth Simulations",
        "Lighting, Camera Animation, Depth effects",
        "Priority - 20 Day Turnaround",
        "Highly Complex 3D Models Included",
      ],
      videos: [
        "v2AC41dglnM",
        "pRpeEdMmmQ0",
        "3AtDnEC4zak",
        "JRfuAukYTKg",
        "LsoLEjrDogU",
        "RB-RcX5DS5A",
        "hTWKbfoikeg",
        "YQHsXMglC9A",
        "09R8_2nJtjg",
      ],
    },
  },
  orderForm: {
    whatsappNumber: "+918384092211",
    modelingOptions: {
      simple: { price_usd: 35, price_inr: 3000, description: "Basic shapes, minimal details" },
      medium: { price_usd: 60, price_inr: 5000, description: "Moderate details, textures" },
      complex: { price_usd: 120, price_inr: 10000, description: "High detail, advanced geometry" },
    },
    renderOptions: {
      basic: { price_usd: 25, price_inr: 2000, quantity: 3 },
      standard: { price_usd: 35, price_inr: 3000, quantity: 5 },
      premium: { price_usd: 60, price_inr: 5000, quantity: 10 },
    },
    formSteps: [
      { enabled: true, title: "Package Selection", description: "Choose your animation package" },
      { enabled: true, title: "3D Model Question", description: "Do you have a 3D model? (Pro plan only)" },
      { enabled: true, title: "Modeling Add-on", description: "Select modeling complexity (Pro plan only)" },
      { enabled: true, title: "Render Upsell", description: "Add 3D renders to your order" },
      { enabled: true, title: "Order Summary", description: "Review and confirm your order" },
    ],
  },
  settings: {
    adminEmail: "admin@mtcmartech.com",
    adminPassword: "MTC123!",
  },
}
