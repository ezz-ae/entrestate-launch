"use client"

import type { Listing, WebsiteSettings } from "../types"
import { formatNumber } from "@/lib/data-binding"
import { Bed, Bath, Ruler, MapPin } from "lucide-react"

interface ListingDetailBlockProps {
  settings: WebsiteSettings
  data?: { listing?: Listing }
}

export function ListingDetailBlock({
  settings,
  data,
}: ListingDetailBlockProps) {
  const listing = data?.listing

  if (!listing) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">Listing not found</p>
      </div>
    )
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto max-w-5xl">
        {/* Gallery */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={listing.images[0] || "https://via.placeholder.com/1200x600"}
            alt={listing.address}
            className="w-full h-96 object-cover"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Price & Address */}
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: settings.colors.primary }}
            >
              ${formatNumber(listing.price)}
            </h1>
            <p className="text-xl text-gray-600 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {listing.address}
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Bed className="w-5 h-5" style={{ color: settings.colors.primary }} />
                  <span className="text-gray-600">Bedrooms</span>
                </div>
                <p className="text-3xl font-bold">{listing.beds}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Bath className="w-5 h-5" style={{ color: settings.colors.primary }} />
                  <span className="text-gray-600">Bathrooms</span>
                </div>
                <p className="text-3xl font-bold">{listing.baths}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="w-5 h-5" style={{ color: settings.colors.primary }} />
                  <span className="text-gray-600">Sqft</span>
                </div>
                <p className="text-3xl font-bold">{formatNumber(listing.sqft)}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About This Property</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{listing.description}</p>
            </div>

            {/* Additional Images */}
            {listing.images.length > 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                <div className="grid grid-cols-4 gap-4">
                  {listing.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Contact CTA */}
            <div className="sticky top-24 bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Interested?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Contact our team to schedule a viewing or ask questions about this property.
              </p>

              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded font-semibold text-white"
                  style={{ backgroundColor: settings.colors.primary }}
                >
                  Request Showing
                </button>
              </form>

              {/* Property Info */}
              <div className="mt-6 pt-6 border-t border-gray-300">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Status:</strong> {listing.status}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Listed:</strong> {new Date(listing.listedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
