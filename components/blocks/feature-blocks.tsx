"use client"

import React from "react"
import type { WebsiteSettings } from "../types"

/**
 * Property Features Block - Showcase key features
 */
export function PropertyFeaturesBlock({
  title = "Property Highlights",
  features = [
    { icon: "🏠", label: "Spacious Layout", description: "Open floor plan design" },
    { icon: "🌳", label: "Large Yard", description: "Perfect for entertaining" },
    { icon: "🚗", label: "2-Car Garage", description: "Attached garage" },
    { icon: "🔐", label: "Security System", description: "24/7 monitoring" },
  ],
  columns = 4,
  data,
  settings,
}: {
  title?: string
  features?: Array<{ icon?: string; label: string; description: string }>
  columns?: number
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns] || "grid-cols-4"

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>
        <div className={`grid ${colsClass} gap-8`}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{feature.icon || "✨"}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.label}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Property Specs Block - Display key property information
 */
export function PropertySpecsBlock({
  specs = [
    { label: "Beds", value: "4" },
    { label: "Baths", value: "2.5" },
    { label: "SqFt", value: "3,500" },
    { label: "Year Built", value: "2019" },
    { label: "Lot Size", value: "0.5 acres" },
    { label: "Property Tax", value: "$4,800/yr" },
  ],
  data,
  settings,
}: {
  specs?: Array<{ label: string; value: string }>
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <section className="w-full py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-8">Property Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {specs.map((spec, idx) => (
            <div key={idx}>
              <p className="text-gray-600 text-sm font-medium mb-2">{spec.label}</p>
              <p className="text-2xl font-bold text-gray-900">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Mortgage Calculator Block
 */
export function MortgageCalculatorBlock({
  defaultPrice = 500000,
  defaultDownPayment = 100000,
  defaultRate = 6.5,
  data,
  settings,
}: {
  defaultPrice?: number
  defaultDownPayment?: number
  defaultRate?: number
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const [price, setPrice] = React.useState(defaultPrice)
  const [downPayment, setDownPayment] = React.useState(defaultDownPayment)
  const [rate, setRate] = React.useState(defaultRate)
  const [loanTerm, setLoanTerm] = React.useState(30)

  const monthlyRate = rate / 100 / 12
  const numPayments = loanTerm * 12
  const principal = price - downPayment
  const monthlyPayment =
    principal *
    ((monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1))

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Mortgage Calculator</h2>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Home Price: ${price.toLocaleString()}
            </label>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="10000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Down Payment Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment: ${downPayment.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max={price}
              step="10000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-sm text-gray-600 mt-2">
              {((downPayment / price) * 100).toFixed(1)}% down
            </p>
          </div>

          {/* Interest Rate Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate: {rate.toFixed(2)}%
            </label>
            <input
              type="range"
              min="2"
              max="10"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term: {loanTerm} years
            </label>
            <div className="flex gap-2">
              {[15, 20, 30].map((term) => (
                <button
                  key={term}
                  onClick={() => setLoanTerm(term)}
                  className={`flex-1 py-2 rounded-lg font-medium transition ${
                    loanTerm === term
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {term}Y
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Principal Amount:</span>
              <span className="text-xl font-bold">${principal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Payment:</span>
              <span className="text-3xl font-bold text-blue-600">
                ${monthlyPayment.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Total Interest:</span>
              <span>${(monthlyPayment * numPayments - principal).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Price Breakdown Block - Show what's included
 */
export function PriceBreakdownBlock({
  price = 500000,
  items = [
    { label: "Land Value", percentage: 30 },
    { label: "Structure", percentage: 50 },
    { label: "Improvements", percentage: 15 },
    { label: "Other", percentage: 5 },
  ],
  data,
  settings,
}: {
  price?: number
  items?: Array<{ label: string; percentage: number }>
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const total = items.reduce((sum, item) => sum + item.percentage, 0)

  return (
    <section className="w-full py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Price Breakdown</h2>

        <div className="space-y-4">
          {items.map((item, idx) => {
            const itemPrice = (price * item.percentage) / 100
            return (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${itemPrice.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{item.percentage}%</span>
              </div>
            )
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total Price</span>
            <span className="text-3xl font-bold text-blue-600">${price.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Timeline / Process Steps Block
 */
export function ProcessStepsBlock({
  title = "Our Process",
  steps = [
    {
      step: 1,
      title: "Schedule Viewing",
      description: "Book a time that works for you",
    },
    { step: 2, title: "Home Inspection", description: "Professional inspection & report" },
    {
      step: 3,
      title: "Make Offer",
      description: "Submit your offer with terms",
    },
    { step: 4, title: "Closing", description: "Finalize and get keys" },
  ],
  data,
  settings,
}: {
  title?: string
  steps?: Array<{ step: number; title: string; description: string }>
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-12 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-blue-300 hidden md:block" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((item, idx) => (
              <div key={idx} className={`flex gap-8 ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                {/* Timeline dot */}
                <div className="flex justify-center md:flex-1">
                  <div className="relative z-10 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Similar Properties Block
 */
export function SimilarPropertiesBlock({
  title = "Similar Properties",
  properties = [
    {
      address: "123 Oak Street",
      price: 450000,
      beds: 3,
      baths: 2,
      image: "/similar-1.jpg",
    },
    {
      address: "456 Maple Ave",
      price: 475000,
      beds: 4,
      baths: 2.5,
      image: "/similar-2.jpg",
    },
    {
      address: "789 Elm Drive",
      price: 495000,
      beds: 4,
      baths: 2,
      image: "/similar-3.jpg",
    },
  ],
  data,
  settings,
}: {
  title?: string
  properties?: Array<{
    address: string
    price: number
    beds: number
    baths: number
    image?: string
  }>
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map((prop, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative h-48 bg-gray-300 overflow-hidden">
                <img
                  src={prop.image || "/placeholder.jpg"}
                  alt={prop.address}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-2">{prop.address}</p>
                <p className="text-2xl font-bold mb-4">${prop.price.toLocaleString()}</p>
                <div className="flex gap-6 text-gray-700 text-sm">
                  <span>{prop.beds} Beds</span>
                  <span>{prop.baths} Baths</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
