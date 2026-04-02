export type InventoryProject = {
  id: string
  title: string
  developer: string
  location?: {
    city?: string
    area?: string
  }
  price?: {
    from?: number
    value?: number
  }
}

export const INVENTORY_FIXTURE: InventoryProject[] = [
  {
    id: "emerald-vista",
    title: "Emerald Vista",
    developer: "Harbor Line Developments",
    location: { city: "Dubai", area: "Business Bay" },
    price: { from: 2400000 },
  },
  {
    id: "metro-park-residences",
    title: "Metro Park Residences",
    developer: "Urban Axis",
    location: { city: "Dubai", area: "JVC" },
    price: { from: 2100000 },
  },
  {
    id: "marina-crest",
    title: "Marina Crest",
    developer: "Blue Coast Properties",
    location: { city: "Dubai", area: "Dubai Marina" },
    price: { from: 2750000 },
  },
  {
    id: "desert-bloom",
    title: "Desert Bloom",
    developer: "Oasis Habitat",
    location: { city: "Abu Dhabi", area: "Saadiyat" },
    price: { from: 3200000 },
  },
]
