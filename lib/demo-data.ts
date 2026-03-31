/**
 * Demo Data for Block Rendering
 * Provides realistic sample data so blocks render with content in the builder preview
 */

export interface DemoListing {
  id: string
  title: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  type: string
  status: "active" | "pending" | "sold"
  description: string
  features: string[]
  images: string[]
  coordinates: { lat: number; lng: number }
  yearBuilt: number
  lotSize: string
}

export interface DemoAgent {
  id: string
  name: string
  title: string
  bio: string
  phone: string
  email: string
  photo: string
  specialties: string[]
  yearsExperience: number
  propertiesSold: number
}

export interface DemoAgency {
  name: string
  phone: string
  email: string
  address: string
  logo: string
}

export const DEMO_LISTINGS: DemoListing[] = [
  {
    id: "prop-1",
    title: "Modern Waterfront Villa",
    address: "2847 Ocean Drive",
    city: "Miami Beach",
    state: "FL",
    zip: "33139",
    price: 2450000,
    beds: 5,
    baths: 4,
    sqft: 4200,
    type: "Single Family",
    status: "active",
    description: "Stunning modern villa with direct ocean views, private dock, and resort-style pool. Open floor plan with floor-to-ceiling windows, chef's kitchen with Italian marble countertops, and smart home technology throughout.",
    features: ["Ocean View", "Private Pool", "Smart Home", "Wine Cellar", "3-Car Garage", "Solar Panels"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    ],
    coordinates: { lat: 25.7907, lng: -80.1300 },
    yearBuilt: 2022,
    lotSize: "0.45 acres",
  },
  {
    id: "prop-2",
    title: "Downtown Luxury Penthouse",
    address: "1200 Brickell Avenue, PH-42",
    city: "Miami",
    state: "FL",
    zip: "33131",
    price: 1850000,
    beds: 3,
    baths: 3,
    sqft: 2800,
    type: "Condo",
    status: "active",
    description: "Breathtaking penthouse with panoramic city and bay views. Features include a private elevator, wrap-around terrace, custom Italian kitchen, and access to world-class building amenities.",
    features: ["City Views", "Private Elevator", "Terrace", "Concierge", "Rooftop Pool", "Gym"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    ],
    coordinates: { lat: 25.7617, lng: -80.1918 },
    yearBuilt: 2021,
    lotSize: "N/A",
  },
  {
    id: "prop-3",
    title: "Charming Craftsman Bungalow",
    address: "456 Oak Lane",
    city: "Coral Gables",
    state: "FL",
    zip: "33134",
    price: 875000,
    beds: 4,
    baths: 2,
    sqft: 2100,
    type: "Single Family",
    status: "active",
    description: "Beautifully renovated 1930s craftsman with original charm and modern updates. Hardwood floors, updated kitchen, lush tropical garden, and a detached studio perfect for a home office.",
    features: ["Updated Kitchen", "Hardwood Floors", "Garden", "Home Office", "Historic Charm", "New Roof"],
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop",
    ],
    coordinates: { lat: 25.7215, lng: -80.2684 },
    yearBuilt: 1935,
    lotSize: "0.18 acres",
  },
  {
    id: "prop-4",
    title: "Contemporary Smart Home",
    address: "9100 NW 7th Street",
    city: "Doral",
    state: "FL",
    zip: "33172",
    price: 1200000,
    beds: 4,
    baths: 3,
    sqft: 3100,
    type: "Single Family",
    status: "active",
    description: "Brand new construction with cutting-edge smart home features. Tesla solar roof, EV charger, automated blinds, and an AI-controlled climate system. Open-concept living with a dramatic 20-foot ceiling.",
    features: ["Smart Home", "Solar Roof", "EV Charger", "Pool", "Impact Windows", "Modern Design"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7a0fa2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
    ],
    coordinates: { lat: 25.8126, lng: -80.3561 },
    yearBuilt: 2024,
    lotSize: "0.25 acres",
  },
  {
    id: "prop-5",
    title: "Elegant Mediterranean Estate",
    address: "7700 Old Cutler Road",
    city: "Pinecrest",
    state: "FL",
    zip: "33156",
    price: 3200000,
    beds: 6,
    baths: 5,
    sqft: 5500,
    type: "Single Family",
    status: "active",
    description: "Gated Mediterranean estate on over an acre of manicured grounds. Features include a grand foyer, formal living and dining rooms, chef's kitchen, resort pool with waterfall, and a separate guest house.",
    features: ["Gated Entry", "Guest House", "Pool & Waterfall", "Summer Kitchen", "Wine Room", "1+ Acre"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
    ],
    coordinates: { lat: 25.6650, lng: -80.2508 },
    yearBuilt: 2015,
    lotSize: "1.2 acres",
  },
  {
    id: "prop-6",
    title: "Bayfront Townhome",
    address: "350 NE 24th Street, Unit 12",
    city: "Miami",
    state: "FL",
    zip: "33137",
    price: 695000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    type: "Townhome",
    status: "active",
    description: "Modern bayfront townhome in the heart of Edgewater. Private rooftop terrace with stunning bay views, two-car garage, and walking distance to Wynwood, Midtown, and the Design District.",
    features: ["Bay Views", "Rooftop Terrace", "2-Car Garage", "Walk to Wynwood", "Impact Glass", "Pet Friendly"],
    images: [
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    ],
    coordinates: { lat: 25.8025, lng: -80.1873 },
    yearBuilt: 2020,
    lotSize: "0.05 acres",
  },
]

export const DEMO_AGENTS: DemoAgent[] = [
  {
    id: "agent-1",
    name: "Sarah Mitchell",
    title: "Senior Luxury Specialist",
    bio: "With over 15 years in South Florida luxury real estate, Sarah has closed over $500M in transactions. She specializes in waterfront properties and new construction developments.",
    phone: "(305) 555-0142",
    email: "sarah@premierrealty.com",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    specialties: ["Luxury Homes", "Waterfront", "New Construction"],
    yearsExperience: 15,
    propertiesSold: 320,
  },
  {
    id: "agent-2",
    name: "Michael Rodriguez",
    title: "Investment Property Expert",
    bio: "Michael brings a finance background to real estate, helping investors maximize ROI on residential and commercial properties. Licensed in FL and NY with a proven track record.",
    phone: "(305) 555-0198",
    email: "michael@premierrealty.com",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    specialties: ["Investment Properties", "Commercial", "Multi-Family"],
    yearsExperience: 12,
    propertiesSold: 245,
  },
  {
    id: "agent-3",
    name: "Emily Chen",
    title: "Residential Sales Director",
    bio: "Emily is known for her personalized approach and deep knowledge of Miami neighborhoods. From first-time buyers to luxury estates, she guides every client with dedication and expertise.",
    phone: "(305) 555-0167",
    email: "emily@premierrealty.com",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    specialties: ["Residential Sales", "First-Time Buyers", "Relocation"],
    yearsExperience: 8,
    propertiesSold: 180,
  },
]

export const DEMO_AGENCY: DemoAgency = {
  name: "Premier Realty Group",
  phone: "(305) 555-0100",
  email: "info@premierrealty.com",
  address: "1000 Brickell Avenue, Suite 400, Miami, FL 33131",
  logo: "",
}

export const DEMO_TESTIMONIALS = [
  {
    name: "James & Lisa Thompson",
    text: "Sarah helped us find our dream waterfront home in just two weeks. Her market knowledge and negotiation skills saved us over $100K. Couldn't recommend her more!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop",
  },
  {
    name: "David Park",
    text: "Michael's investment analysis was spot-on. He identified properties with 8%+ cap rates that I would have never found on my own. My portfolio has grown significantly.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    name: "Maria Santos",
    text: "As a first-time buyer, Emily made the process so easy. She was patient, always available, and truly cared about finding the right home for my family.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
]

/**
 * Returns all demo data shaped to match the Listing/Agent/Agency types
 * so blocks render correctly in the builder preview
 */
export function getDemoData(): Record<string, unknown> {
  const now = new Date().toISOString()
  return {
    listings: DEMO_LISTINGS.map((l) => ({
      id: l.id,
      agencyId: "demo-agency",
      address: `${l.address}, ${l.city}, ${l.state} ${l.zip}`,
      price: l.price,
      beds: l.beds,
      baths: l.baths,
      sqft: l.sqft,
      description: l.description,
      images: l.images,
      status: l.status,
      featured: l.price > 1500000,
      listedDate: now,
      createdAt: now,
      updatedAt: now,
    })),
    listing: (() => {
      const l = DEMO_LISTINGS[0]
      return {
        id: l.id,
        agencyId: "demo-agency",
        address: `${l.address}, ${l.city}, ${l.state} ${l.zip}`,
        price: l.price,
        beds: l.beds,
        baths: l.baths,
        sqft: l.sqft,
        description: l.description,
        images: l.images,
        status: l.status,
        featured: true,
        listedDate: now,
        createdAt: now,
        updatedAt: now,
      }
    })(),
    agents: DEMO_AGENTS.map((a) => ({
      id: a.id,
      agencyId: "demo-agency",
      name: a.name,
      title: a.title,
      email: a.email,
      phone: a.phone,
      imageUrl: a.photo,
      bio: a.bio,
      specialties: a.specialties,
      createdAt: now,
    })),
    agency: {
      id: "demo-agency",
      name: DEMO_AGENCY.name,
      email: DEMO_AGENCY.email,
      phone: DEMO_AGENCY.phone,
      address: DEMO_AGENCY.address,
      logoUrl: DEMO_AGENCY.logo,
    },
    testimonials: DEMO_TESTIMONIALS,
    marketMetrics: [
      { label: "Off-Plan Projects", value: "954", trend: "↑ 12%" },
      { label: "Average Yield", value: "5.8%", trend: "↑ 0.3%" },
      { label: "Price Growth", value: "8.2%", trend: "↑ YoY" },
      { label: "Active Buyers", value: "15K+", trend: "↑ 23%" },
    ],
    marketInsights: {
      marketTrend: "Strong buyer demand",
      averagePrice: 2500000,
      priceRange: { min: 1800000, max: 3200000 },
      populationGrowth: 3.2,
      averageDaysOnMarket: 18,
      schoolRating: 8,
      crimeRate: "Low",
      walkscore: 78,
      topNeighborhoodTraits: ["Family-friendly", "Great schools", "Parks & recreation", "Shopping & dining"],
    },
  }
}
