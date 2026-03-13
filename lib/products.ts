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

export const products: Product[] = [
  {
    slug: "gold-century-luxury",
    title: "Gold Century Luxury",
    tagline: "Ultra-high-end brokerage template with a focus on investment yields.",
    description:
      "A flagship luxury template designed for the Dubai market. High-contrast typography, premium animations, and deep inventory integration.",
    category: "Brokerage Website",
    badge: "Most Popular",
    price: "AED 2,399",
    priceNote: "one-time purchase",
    demoUrl: "https://goldcentury.ae/",
    highlights: [
      "Luxury dark mode aesthetic",
      "Investment yield calculators",
      "VIP lead routing",
    ],
    deliverables: [
      "Full site architecture",
      "Investment-focused copy",
      "Curated imagery set",
      "Ready-to-launch SEO",
    ],
    timeline: [
      { title: "Day 1", description: "Brand & Inventory sync" },
      { title: "Day 2", description: "AI Content adaptation" },
      { title: "Day 3", description: "Launch" },
    ],
    outcomes: [
      { label: "Design", value: "Premium" },
      { label: "Focus", value: "Luxury" },
      { label: "ROI", value: "High" },
    ],
    heroImage: "/images/intuitive-1.png",
  },
  {
    slug: "modern-minimalist-broker",
    title: "Modern Minimalist",
    tagline: "Clean, high-speed brokerage site for fast-moving markets.",
    description:
      "A whitespace-heavy, ultra-fast template for brokers who want their listings to speak for themselves.",
    category: "Brokerage Website",
    badge: "High Conversion",
    price: "AED 1,999",
    priceNote: "one-time purchase",
    demoUrl: "https://goldcentury.ae/", // Fallback for demo
    highlights: [
      "Sub-second load times",
      "Mobile-first search experience",
      "One-click WhatsApp lead gen",
    ],
    deliverables: [
      "Minimalist UI framework",
      "Speed-optimized assets",
      "Smart listing filters",
    ],
    timeline: [
      { title: "Day 1", description: "Setup & Config" },
      { title: "Day 2", description: "Live" },
    ],
    outcomes: [
      { label: "Speed", value: "A+" },
      { label: "Leads", value: "+40%" },
      { label: "Style", value: "Modern" },
    ],
    heroImage: "/images/top-rated-1.png",
  },
  {
    slug: "elite-agent-bio",
    title: "Elite Agent Bio",
    tagline: "The ultimate personal brand hub for top-performing agents.",
    description:
      "Showcase your track record, active listings, and social proof in a single high-conversion link.",
    category: "Personal Brand",
    badge: "Trending",
    price: "AED 899",
    priceNote: "one-time purchase",
    demoUrl: "https://goldcentury.ae/", // Fallback
    highlights: [
      "Instagram-optimized layout",
      "Verified track record block",
      "Direct booking integration",
    ],
    deliverables: [
      "Personal brand landing page",
      "Testimonial engine",
      "Active listings carousel",
    ],
    timeline: [
      { title: "Day 1", description: "Onboarding" },
      { title: "Day 2", description: "Go Live" },
    ],
    outcomes: [
      { label: "Auth", value: "Expert" },
      { label: "Reach", value: "Viral" },
      { label: "Conversion", value: "High" },
    ],
    heroImage: "/images/intuitive-2.png",
  },
  {
    slug: "new-development-reveal",
    title: "Development Reveal",
    tagline: "Launch your next project with a high-impact reveal page.",
    description:
      "A high-stakes landing page designed specifically for off-plan launches and new developments.",
    category: "Marketing Launch",
    badge: "Limited Edition",
    price: "AED 1,499",
    priceNote: "per launch",
    demoUrl: "https://goldcentury.ae/", // Fallback
    highlights: [
      "Urgency & Scarcity blocks",
      "3D render showreels",
      "Pre-registration funnel",
    ],
    deliverables: [
      "Immersive launch page",
      "Pre-launch lead capture",
      "Developer dashboard link",
    ],
    timeline: [
      { title: "Day 1", description: "Asset ingest" },
      { title: "Day 3", description: "Launch campaign live" },
    ],
    outcomes: [
      { label: "Impact", value: "10/10" },
      { label: "Waitlist", value: "Smart" },
      { label: "Ads", value: "Optimized" },
    ],
    heroImage: "/images/top-rated-2.png",
  },
  {
    slug: "flash-sale-landing",
    title: "Flash Sale Landing",
    tagline: "Drive high-velocity sales with a focused conversion funnel.",
    description:
      "Engineered for weekend sales events and flash inventory clears. Includes countdown timers and live availability updates.",
    category: "Marketing Launch",
    badge: "Fast Results",
    price: "AED 999",
    priceNote: "one-time event",
    highlights: [
      "Live countdown clock",
      "Unit availability status",
      "Direct reservation engine",
    ],
    deliverables: [
      "High-pressure sales page",
      "Booking confirmation emails",
      "Ad tracking integration",
    ],
    timeline: [
      { title: "Day 1", description: "Config" },
      { title: "Day 2", description: "Live" },
    ],
    outcomes: [
      { label: "Urgency", value: "High" },
      { label: "Leads", value: "Hot" },
      { label: "Setup", value: "Quick" },
    ],
    heroImage: "/images/top-rated-1.png",
  },
  {
    slug: "influencer-agent-link",
    title: "Influencer Hub",
    tagline: "Content-first bio link for agent influencers.",
    description:
      "Connect your TikTok, Instagram, and YouTube content directly to your property listings and contact forms.",
    category: "Personal Brand",
    badge: "Creator Ready",
    price: "AED 799",
    priceNote: "one-time purchase",
    highlights: [
      "Video-first hero section",
      "Social media content grid",
      "Viral lead capture forms",
    ],
    deliverables: [
      "Mobile-optimized link hub",
      "Inventory sync",
      "Social analytics dashboard",
    ],
    timeline: [
      { title: "Day 1", description: "Social Sync" },
      { title: "Day 2", description: "Live" },
    ],
    outcomes: [
      { label: "Reach", value: "Max" },
      { label: "Engagement", value: "High" },
      { label: "Growth", value: "Active" },
    ],
    heroImage: "/images/intuitive-2.png",
  },
]

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug)
}
