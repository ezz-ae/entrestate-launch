"use client"

import React from "react"
import type { WebsiteSettings } from "../types"

/**
 * Open House Block
 */
export function OpenHouseBlock({
  title = "Open House",
  date = "Saturday, March 8th",
  startTime = "10:00 AM",
  endTime = "2:00 PM",
  description = "Come tour this beautiful home!",
  features = [
    "Light refreshments served",
    "Virtual tour available online",
    "Contact-free entry",
  ],
  data,
  settings,
}: {
  title?: string
  date?: string
  startTime?: string
  endTime?: string
  description?: string
  features?: string[]
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <section className="w-full py-16 px-4 md:px-8">
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-8 md:p-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">🏠 {title}</h2>
          <p className="text-lg text-gray-700 mb-8">{description}</p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 4h10L8 6l4 6z" />
              </svg>
              <span className="text-2xl font-bold text-amber-900">{date}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 5V1h-1v4H8.98v2h5.99V5h-1.98zm6.93 0v2h1.98v-2h-1.98zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm8-4c0 3.31 2.69 6 6 6v-1c-2.76 0-5-2.24-5-5s2.24-5 5-5v-1c-3.31 0-6 2.69-6 6zm-2 0c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z" />
              </svg>
              <span className="text-2xl font-bold text-amber-900">
                {startTime} - {endTime}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 mb-8 space-y-2">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition w-full md:w-auto">
            RSVP Now
          </button>
        </div>
      </div>
    </section>
  )
}

/**
 * Investment Analysis Block
 */
export function InvestmentAnalysisBlock({
  title = "Investment Analysis",
  propertyPrice = 500000,
  monthlyRent = 3500,
  annualCosts = 12000,
  appreciationRate = 3,
  data,
  settings,
}: {
  title?: string
  propertyPrice?: number
  monthlyRent?: number
  annualCosts?: number
  appreciationRate?: number
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const annualRent = monthlyRent * 12
  const capRate = ((annualRent - annualCosts) / propertyPrice) * 100
  const roi = ((annualRent - annualCosts) / propertyPrice) * 100
  const cashOnCash = annualRent - annualCosts

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Cap Rate",
              value: `${capRate.toFixed(2)}%`,
              color: "blue",
            },
            {
              label: "Cash Flow",
              value: `$${cashOnCash.toLocaleString()}/yr`,
              color: "green",
            },
            {
              label: "Annual Rent",
              value: `$${annualRent.toLocaleString()}`,
              color: "indigo",
            },
            {
              label: "Appreciation",
              value: `${appreciationRate}%/yr`,
              color: "purple",
            },
          ].map((metric, idx) => {
            const colorClass = {
              blue: "bg-blue-100 text-blue-900",
              green: "bg-green-100 text-green-900",
              indigo: "bg-indigo-100 text-indigo-900",
              purple: "bg-purple-100 text-purple-900",
            }[metric.color] || "bg-gray-100"

            return (
              <div key={idx} className={`rounded-lg p-6 text-center ${colorClass}`}>
                <p className="text-sm font-medium opacity-75 mb-2">{metric.label}</p>
                <p className="text-3xl font-bold">{metric.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Investment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Purchase Price:</span>
                <span className="font-semibold">${propertyPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent:</span>
                <span className="font-semibold">${monthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Expenses:</span>
                <span className="font-semibold">${annualCosts.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold">Annual Net Income:</span>
                <span className="font-bold text-green-600">
                  ${(annualRent - annualCosts).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">5-Year Projection</h3>
            <div className="space-y-3 text-sm">
              {[1, 2, 3, 4, 5].map((year) => {
                const projectedValue = propertyPrice * Math.pow(1 + appreciationRate / 100, year)
                const cumulativeCashFlow = (annualRent - annualCosts) * year
                return (
                  <div key={year} className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Year {year}</span>
                    <div className="text-right">
                      <div className="font-semibold">${projectedValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                      <div className="text-xs text-gray-500">
                        Cash flow: ${cumulativeCashFlow.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Luxury Amenities Block
 */
export function LuxuryAmenitiesBlock({
  title = "Luxury Amenities",
  amenities = [
    { icon: "🏊", name: "Swimming Pool", description: "Temperature-controlled pool with spa" },
    { icon: "🏋️", name: "Home Gym", description: "Fully equipped fitness center" },
    { icon: "🎬", name: "Theater Room", description: "8-seat home cinema system" },
    { icon: "🍷", name: "Wine Cellar", description: "Climate-controlled wine storage" },
    { icon: "🧖", name: "Sauna & Steam", description: "Luxury spa facilities" },
    { icon: "🌳", name: "Landscaping", description: "Professional grounds maintenance" },
  ],
  columns = 3,
  data,
  settings,
}: {
  title?: string
  amenities?: Array<{ icon: string; name: string; description: string }>
  columns?: number
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  }[columns] || "grid-cols-3"

  return (
    <section className="w-full py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>

        <div className={`grid ${colsClass} gap-8`}>
          {amenities.map((amenity, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{amenity.icon}</div>
              <h3 className="text-xl font-bold mb-2">{amenity.name}</h3>
              <p className="text-gray-600">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Agent Credentials Block
 */
export function AgentCredentialsBlock({
  agentName = "John Smith",
  agentTitle = "Senior Luxury Real Estate Agent",
  yearsExperience = 15,
  salesVolume = "250M+",
  credentials = [
    "Luxury Home Specialist",
    "Certified Negotiation Expert",
    "Million Dollar Club",
    "Top 1% Nationwide",
  ],
  image = "/agent-profile.jpg",
  data,
  settings,
}: {
  agentName?: string
  agentTitle?: string
  yearsExperience?: number
  salesVolume?: string
  credentials?: string[]
  image?: string
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square bg-gray-300 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={agentName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
              {yearsExperience}+ Years
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold mb-2">{agentName}</h2>
            <p className="text-lg text-blue-600 font-semibold mb-6">{agentTitle}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Sales Volume</p>
                <p className="text-2xl font-bold text-gray-900">{salesVolume}</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Experience</p>
                <p className="text-2xl font-bold text-gray-900">{yearsExperience}+ years</p>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4">Certifications & Awards</h3>
            <ul className="space-y-2 mb-8">
              {credentials.map((cred, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>{cred}</span>
                </li>
              ))}
            </ul>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg w-full transition">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Neighborhood Info Block
 */
export function NeighborhoodInfoBlock({
  title = "About the Neighborhood",
  walkScore = 82,
  schools = [
    { name: "Lincoln Elementary", rating: 9 },
    { name: "Central Middle School", rating: 8 },
    { name: "North High School", rating: 9 },
  ],
  amenities = [
    { icon: "🍽️", name: "Restaurants", count: "25+" },
    { icon: "🏪", name: "Shops", count: "30+" },
    { icon: "🏞️", name: "Parks", count: "8+" },
    { icon: "🏥", name: "Hospitals", count: "2" },
  ],
  data,
  settings,
}: {
  title?: string
  walkScore?: number
  schools?: Array<{ name: string; rating: number }>
  amenities?: Array<{ icon: string; name: string; count: string }>
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-12">{title}</h2>

        {/* Walk Score */}
        <div className="mb-12 bg-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6">Walkability Score</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-green-100 flex-shrink-0">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600">{walkScore}</div>
                <div className="text-sm text-gray-600">Very Walkable</div>
              </div>
            </div>
            <p className="text-lg text-gray-700">
              This neighborhood is a Walker's Paradise! Daily errands do not require a car.
            </p>
          </div>
        </div>

        {/* Schools */}
        <div className="mb-12 bg-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6">Top Rated Schools</h3>
          <div className="space-y-4">
            {schools.map((school, idx) => (
              <div key={idx} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                <span className="font-medium text-gray-900">{school.name}</span>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-6 rounded-sm ${
                        i < school.rating ? "bg-yellow-400" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {amenities.map((amenity, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 text-center hover:shadow-md transition"
            >
              <div className="text-4xl mb-3">{amenity.icon}</div>
              <p className="text-sm text-gray-600 mb-1">{amenity.name}</p>
              <p className="text-2xl font-bold text-gray-900">{amenity.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
