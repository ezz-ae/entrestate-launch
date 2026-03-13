"use client"

import type { Listing, WebsiteSettings } from "../types"
import { formatNumber } from "@/lib/data-binding"

interface ListingsGridBlockProps {
  settings: WebsiteSettings
  title?: string
  description?: string
  columns?: 3 | 4
  data?: {
    listings?: Listing[]
  }
  showFilters?: boolean
  filterByStatus?: "active" | "pending" | "sold"
  featuredOnly?: boolean
  limit?: number
}

export function ListingsGridBlock({
  settings,
  title = "Featured Properties",
  description,
  columns = 3,
  data,
  showFilters = false,
  filterByStatus = "active",
  featuredOnly = false,
  limit = 12,
}: ListingsGridBlockProps) {
  const listings = data?.listings || []

  let filtered = listings.filter((l) => l.status === filterByStatus)

  if (featuredOnly) {
    filtered = filtered.filter((l) => l.featured)
  }

  const displayed = filtered.slice(0, limit)

  const colsClass = {
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          {title && (
            <h2
              className="text-4xl font-bold mb-4"
              style={{
                color: settings.colors.text,
                fontFamily: settings.fonts.heading,
              }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              style={{ fontFamily: settings.fonts.body }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 flex gap-4 justify-center">
            <button className="px-4 py-2 rounded border border-gray-300 hover:border-gray-500">
              Status
            </button>
            <button className="px-4 py-2 rounded border border-gray-300 hover:border-gray-500">
              Price Range
            </button>
            <button className="px-4 py-2 rounded border border-gray-300 hover:border-gray-500">
              Bedrooms
            </button>
          </div>
        )}

        {/* Grid */}
        {displayed.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No listings available
            </p>
          </div>
        ) : (
          <div className={`grid ${colsClass[columns]} gap-6`}>
            {displayed.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                primaryColor={settings.colors.primary}
                accentColor={settings.colors.accent}
                fontFamily={settings.fonts.body}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

interface ListingCardProps {
  listing: Listing
  primaryColor: string
  accentColor: string
  fontFamily: string
}

function ListingCard({
  listing,
  primaryColor,
  accentColor,
  fontFamily,
}: ListingCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <img
          src={listing.images[0] || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={listing.address}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />

        {listing.featured && (
          <div
            className="absolute top-4 right-4 px-3 py-1 rounded text-white text-sm font-semibold"
            style={{ backgroundColor: primaryColor }}
          >
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: primaryColor, fontFamily }}
        >
          ${formatNumber(listing.price)}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {listing.address}
        </p>

        {/* Details */}
        <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Beds</p>
            <p className="text-lg font-semibold">{listing.beds}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Baths</p>
            <p className="text-lg font-semibold">{listing.baths}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Sqft</p>
            <p className="text-lg font-semibold">{formatNumber(listing.sqft)}</p>
          </div>
        </div>

        {/* CTA */}
        <a
          href={`/listing/${listing.id}`}
          className="block w-full py-2 rounded text-center font-semibold transition-colors text-white"
          style={{ backgroundColor: accentColor }}
        >
          View Details
        </a>
      </div>
    </div>
  )
}
