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
    slug: "gold-century-luxury",
    title: "Gold Century Luxury",
    tagline: "Ultra-high-end brokerage template with a focus on investment yields.",
    description:
      "A flagship luxury template designed for the Dubai market. High-contrast typography, premium animations, and deep inventory integration.",
    category: "Brokerage Website",
    badge: "Most Popular",
    priceLabel: "AED 2,399",
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
    sortOrder: 1,
  },
  {
    slug: "modern-minimalist-broker",
    title: "Modern Minimalist",
    tagline: "Clean, high-speed brokerage site for fast-moving markets.",
    description:
      "A whitespace-heavy, ultra-fast template for brokers who want their listings to speak for themselves.",
    category: "Brokerage Website",
    badge: "High Conversion",
    priceLabel: "AED 1,999",
    priceNote: "one-time purchase",
    demoUrl: "https://goldcentury.ae/",
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
    sortOrder: 2,
  },
  {
    slug: "elite-agent-bio",
    title: "Elite Agent Bio",
    tagline: "The ultimate personal brand hub for top-performing agents.",
    description:
      "Showcase your track record, active listings, and social proof in a single high-conversion link.",
    category: "Personal Brand",
    badge: "Trending",
    priceLabel: "AED 899",
    priceNote: "one-time purchase",
    demoUrl: "https://goldcentury.ae/",
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
    sortOrder: 3,
  },
  {
    slug: "new-development-reveal",
    title: "Development Reveal",
    tagline: "Launch your next project with a high-impact reveal page.",
    description:
      "A high-stakes landing page designed specifically for off-plan launches and new developments.",
    category: "Marketing Launch",
    badge: "Limited Edition",
    priceLabel: "AED 1,499",
    priceNote: "per launch",
    demoUrl: "https://goldcentury.ae/",
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
    sortOrder: 4,
  },
  {
    slug: "flash-sale-landing",
    title: "Flash Sale Landing",
    tagline: "Drive high-velocity sales with a focused conversion funnel.",
    description:
      "Engineered for weekend sales events and flash inventory clears. Includes countdown timers and live availability updates.",
    category: "Marketing Launch",
    badge: "Fast Results",
    priceLabel: "AED 999",
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
    sortOrder: 5,
  },
  {
    slug: "influencer-agent-link",
    title: "Influencer Hub",
    tagline: "Content-first bio link for agent influencers.",
    description:
      "Connect your TikTok, Instagram, and YouTube content directly to your property listings and contact forms.",
    category: "Personal Brand",
    badge: "Creator Ready",
    priceLabel: "AED 799",
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
  title: "Simple, transparent pricing.",
  subtitle:
    "Buy a ready template once, or start from scratch with the AI builder. No hidden fees, just high-performance results.",
  plans: [
    {
      id: "builder",
      name: "AI Builder",
      price: "$20",
      currency: "USD",
      cadence: "/mo",
      tagline: "Perfect for DIYers starting fresh.",
      features: [
        "Start from a blank canvas",
        "AI-assisted content + layout",
        "Publish to a live subdomain",
        "Full control over every page",
      ],
      cta: "Start builder",
    },
    {
      id: "templates",
      name: "Ready Templates",
      price: "AED 2,399",
      currency: "AED",
      tagline: "One-time purchase. Professional setup.",
      features: [
        "Luxury Dubai-ready layouts",
        "Live subdomain + hosting",
        "AI builder customization",
        "Lead capture + CRM wiring",
      ],
      cta: "Buy a template",
      featured: true,
      badge: "Popular",
    },
    {
      id: "custom",
      name: "Custom Solutions",
      price: "Custom",
      currency: "AED",
      tagline: "For large teams and custom needs.",
      features: [
        "Bulk template licenses",
        "White-label options",
        "Custom AI agent training",
        "Dedicated support channel",
      ],
      cta: "Request Quote",
    },
  ],
}

export const defaultFooter: MarketingFooterContent = {
  tagline: "Mashroi launches real estate websites fast - templates, AI builder, and conversion-ready pages.",
  copyright: "Copyright 2025 - Mashroi.com",
}

export const defaultAdminContent: MarketingAdminContent = {
  hero: {
    title: "BUILD REAL ESTATE WEBSITES WITH AI",
    subtitle: "mashroi",
    buttonText: "Start Building",
  },
  features: {
    title: "Why Mashroi closes deals faster.",
    subtitle: "Real estate websites, launched fast and optimized for leads.",
  },
  footer: defaultFooter,
  about: {
    title: "About Mashroi OS",
    description: "The fastest way to build your real estate presence.",
    mission: "To empower real estate professionals with instant, high-end digital solutions.",
    vision: "To be the global standard for real estate web architecture.",
    teamSize: "20+ AI & Design Experts",
    founded: "2024",
    locations: "Dubai, London, New York",
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
    adminEmail: "admin@mashroi.com",
    adminPassword: "Mashroi123!",
  },
}
