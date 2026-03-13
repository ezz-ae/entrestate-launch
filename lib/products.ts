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
    slug: "ready-broker-site",
    title: "Ready-Made Broker Site",
    tagline: "A full brokerage website engineered to collect qualified leads fast.",
    description:
      "Launch a polished brokerage presence with listings, lead capture, and an AI-assisted setup. We handle the build, then you personalize everything in the builder.",
    category: "Brokerage Website",
    badge: "Best Seller",
    price: "AED 2,399",
    priceNote: "one-time purchase, hosting included",
    demoUrl: "https://goldcentury.ae/",
    highlights: [
      "12+ conversion-ready sections",
      "Lead capture + WhatsApp routing",
      "AI content tuning in minutes",
    ],
    deliverables: [
      "Custom landing + listings layout",
      "Lead form flows + CRM-ready exports",
      "Brand palette + typography setup",
      "SEO-ready metadata and structure",
    ],
    timeline: [
      { title: "Day 1 · Intake", description: "We ingest your brand, inventory focus, and target audience." },
      { title: "Day 3 · Build", description: "Your full broker site is assembled with AI and human QA." },
      { title: "Day 7 · Launch", description: "You review, tweak, and go live on your subdomain." },
    ],
    outcomes: [
      { label: "Launch time", value: "7 days" },
      { label: "Template depth", value: "12+ sections" },
      { label: "Lead capture", value: "Included" },
    ],
    heroImage: "/images/intuitive-1.png",
  },
  {
    slug: "realtor-bio-link",
    title: "Realtor Bio Link",
    tagline: "A one-link personal brand hub for agents and brokers.",
    description:
      "Share your inventory, highlights, and WhatsApp link in a single page. Great for Instagram, TikTok, and WhatsApp bios.",
    category: "Personal Brand",
    badge: "Fast Launch",
    price: "AED 699",
    priceNote: "one-time purchase",
    highlights: [
      "Mobile-first profile layout",
      "Listings + lead capture tabs",
      "Instant AI copywriting",
    ],
    deliverables: [
      "Personal brand landing page",
      "Inventory blocks + featured listings",
      "Contact + WhatsApp CTA wiring",
      "Lightweight analytics setup",
    ],
    timeline: [
      { title: "Day 1 · Intake", description: "Share your listings, areas, and preferred CTA." },
      { title: "Day 2 · Build", description: "We build the bio link page with your brand style." },
      { title: "Day 3 · Launch", description: "Publish and start sharing the link immediately." },
    ],
    outcomes: [
      { label: "Launch time", value: "3 days" },
      { label: "CTA surfaces", value: "3+" },
      { label: "Mobile score", value: "A+" },
    ],
    heroImage: "/images/intuitive-2.png",
  },
  {
    slug: "brochure-to-landing",
    title: "Brochure to Landing",
    tagline: "Upload a brochure and receive a conversion-ready landing page.",
    description:
      "Turn a PDF brochure into a polished landing page with AI-optimized copy, imagery, and lead capture.",
    category: "Marketing Launch",
    badge: "AI Powered",
    price: "AED 1,499",
    priceNote: "per brochure conversion",
    highlights: [
      "PDF ingestion + content rewrite",
      "Optimized layout for ads",
      "Lead capture and booking CTA",
    ],
    deliverables: [
      "Landing page from brochure content",
      "Conversion-focused hero + CTA stack",
      "Ad-ready metadata and pixel setup",
      "Review & edit in builder",
    ],
    timeline: [
      { title: "Day 1 · Upload", description: "Drop the brochure and share your campaign goal." },
      { title: "Day 2 · Build", description: "We craft the landing page and ad-ready copy." },
      { title: "Day 4 · Launch", description: "Final tweaks + publish for ads." },
    ],
    outcomes: [
      { label: "Launch time", value: "4 days" },
      { label: "Ad ready", value: "Yes" },
      { label: "CTA depth", value: "2 funnels" },
    ],
    heroImage: "/images/top-rated-1.png",
  },
  {
    slug: "instagram-dm-ai",
    title: "Instagram DM AI Agent",
    tagline: "An AI agent that turns DMs into booked viewings.",
    description:
      "Automate property replies, qualify leads, and schedule viewings directly inside Instagram.",
    category: "Conversation AI",
    badge: "Lead Accelerator",
    price: "AED 1,899",
    priceNote: "setup + first month included",
    highlights: [
      "Auto-respond within seconds",
      "Lead scoring and capture",
      "Built-in scripts and prompts",
    ],
    deliverables: [
      "DM agent setup with scripts",
      "Lead capture + scoring rules",
      "FAQ knowledge base ingest",
      "Weekly performance snapshot",
    ],
    timeline: [
      { title: "Day 1 · Setup", description: "We ingest your FAQs, inventory, and desired tone." },
      { title: "Day 3 · Train", description: "Agent is trained and aligned to your sales flow." },
      { title: "Day 5 · Live", description: "Connect and start handling DMs." },
    ],
    outcomes: [
      { label: "Response time", value: "< 10s" },
      { label: "Lead capture", value: "Included" },
      { label: "DM coverage", value: "24/7" },
    ],
    heroImage: "/images/top-rated-2.png",
  },
]

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug)
}
