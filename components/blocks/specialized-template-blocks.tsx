"use client"

import React, { useState } from "react"
import type { WebsiteSettings } from "../types"

/**
 * AI Chat Widget Block
 */
export function AIChatBlock({
  title = "AI Assistant",
  placeholder = "Ask me anything about properties...",
  data,
  settings,
}: {
  title?: string
  placeholder?: string
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    { role: "ai", text: "Hi! I'm your AI real estate assistant. How can I help you find your perfect property?" },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: "user", text: input }])
    setInput("")
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "I'm analyzing available properties that match your criteria..." },
      ])
    }, 500)
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/40 border-b border-slate-700 p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
        <p className="text-slate-400">Powered by AI Real Estate Intelligence</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-md px-6 py-3 rounded-2xl ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-700 text-slate-100 rounded-bl-none"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-slate-700 p-6 bg-black/20">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={placeholder}
            className="flex-1 bg-slate-800 border border-slate-600 rounded-full px-6 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16147432 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99301575 L3.03521743,10.4340088 C3.03521743,10.5911061 3.34915502,10.7482035 3.50612381,10.7482035 L16.6915026,11.5336905 C16.6915026,11.5336905 17.1624089,11.5336905 17.1624089,12.0049827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Interactive Map Block
 */
export function InteractiveMapBlock({
  title = "Discover Properties",
  subtitle = "Browse available properties on the map",
  center = { lat: 25.2048, lng: 55.2708 }, // Dubai
  data,
  settings,
}: {
  title?: string
  subtitle?: string
  center?: { lat: number; lng: number }
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white p-8 text-center border-b border-gray-200">
        <h2 className="text-4xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-screen">
        {/* Placeholder for actual map (Mapbox, Google Maps, etc.) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-24 h-24 text-blue-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.553-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.553-.894L15 11m0 0V5m0 6v8"
              />
            </svg>
            <p className="text-2xl font-bold text-gray-700 mb-2">Interactive Map</p>
            <p className="text-gray-500">
              {center.lat.toFixed(4)}°N, {center.lng.toFixed(4)}°E
            </p>
            <p className="text-sm text-gray-400 mt-4">Connect Mapbox or Google Maps API</p>
          </div>
        </div>

        {/* Side Panel */}
        <div className="absolute right-0 top-0 w-96 h-full bg-white shadow-lg overflow-y-auto">
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold">Featured Properties</h3>
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition">
                <p className="font-semibold text-gray-900">Property {i}</p>
                <p className="text-sm text-gray-600 mt-1">$500,000</p>
                <p className="text-xs text-gray-500 mt-2">Click to view on map</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Rental-Specific Features Block
 */
export function RentalFeaturesBlock({
  title = "Why Rent Here?",
  features = [
    { icon: "📋", title: "Flexible Lease", description: "1-12 month options" },
    { icon: "🚚", title: "Furnished", description: "Move-in ready" },
    { icon: "👥", title: "Pet Friendly", description: "Pets welcome" },
    { icon: "🔧", title: "Maintenance", description: "24/7 support" },
    { icon: "📸", title: "Virtual Tour", description: "View online" },
    { icon: "💳", title: "Easy Payment", description: "Flexible terms" },
  ],
  data,
  settings,
}: {
  title?: string
  features?: Array<{ icon: string; title: string; description: string }>
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">{feat.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feat.title}</h3>
              <p className="text-gray-600">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Product Launch Block (New Development)
 */
export function ProductLaunchBlock({
  title = "Announcing: Luxury Tower Dubai",
  subtitle = "Opening Q3 2024",
  highlights = [
    { value: "500+", label: "Units" },
    { value: "€800M", label: "Total Value" },
    { value: "15", label: "Floors" },
    { value: "95%", label: "Pre-sold" },
  ],
  ctaText = "Reserve Your Unit",
  data,
  settings,
}: {
  title?: string
  subtitle?: string
  highlights?: Array<{ value: string; label: string }>
  ctaText?: string
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
          🚀 LAUNCHING SOON
        </span>

        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">{title}</h2>
        <p className="text-2xl text-slate-300 mb-12">{subtitle}</p>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {highlights.map((h, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="text-4xl font-bold text-blue-400">{h.value}</div>
              <div className="text-sm text-slate-300 mt-2">{h.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-4 rounded-lg text-lg transition shadow-xl">
          {ctaText}
        </button>
      </div>
    </section>
  )
}

/**
 * Limited Offer Banner
 */
export function LimitedOfferBlock({
  title = "Limited Time Offer",
  subtitle = "20% Discount Ends in",
  days = 5,
  hours = 12,
  minutes = 34,
  offerText = "Save AED 100,000 on this property",
  ctaText = "Claim Offer Now",
  data,
  settings,
}: {
  title?: string
  subtitle?: string
  days?: number
  hours?: number
  minutes?: number
  offerText?: string
  ctaText?: string
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const [timeLeft, setTimeLeft] = React.useState({ days, hours, minutes })

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days: d, hours: h, minutes: m } = prev
        m -= 1
        if (m < 0) {
          m = 59
          h -= 1
        }
        if (h < 0) {
          h = 23
          d -= 1
        }
        return { days: d, hours: h, minutes: m }
      })
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-r from-red-600 via-red-500 to-orange-600 relative overflow-hidden">
      {/* Striped Background */}
      <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)" }} />

      <div className="max-w-4xl mx-auto relative z-10 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
        <p className="text-xl md:text-2xl mb-8 opacity-90">{subtitle}</p>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: "00", label: "Seconds" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-4xl font-bold text-white">{String(item.value).padStart(2, "0")}</div>
              <div className="text-xs text-white/80 mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        <p className="text-2xl font-bold mb-8 bg-white/20 backdrop-blur-sm py-4 rounded-lg">
          {offerText}
        </p>

        <button className="bg-white text-red-600 hover:bg-gray-100 font-bold px-12 py-4 rounded-lg text-lg transition shadow-xl">
          {ctaText}
        </button>
      </div>
    </section>
  )
}

/**
 * Property Report Block
 */
export function PropertyReportBlock({
  title = "Get Your Free Market Report",
  subtitle = "Discover what your property is worth",
  fields = [
    { name: "address", label: "Property Address", type: "text" },
    { name: "email", label: "Email Address", type: "email" },
  ],
  data,
  settings,
}: {
  title?: string
  subtitle?: string
  fields?: Array<{ name: string; label: string; type: string }>
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{title}</h2>
          <p className="text-center text-gray-600 mb-12">{subtitle}</p>

          <form className="space-y-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.label}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                />
              </div>
            ))}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">
                  Send me a free home valuation report
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition text-lg"
            >
              Get Free Report
            </button>

            <p className="text-xs text-center text-gray-600">
              Your report will be emailed to you within 24 hours
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

/**
 * Investment Metrics Dashboard
 */
export function InvestmentMetricsBlock({
  title = "Investment Opportunity",
  metrics = [
    { icon: "📈", label: "Annual ROI", value: "12.5%", color: "green" },
    { icon: "💰", label: "Cap Rate", value: "8.2%", color: "blue" },
    { icon: "📊", label: "Price/SqFt", value: "$450", color: "purple" },
    { icon: "⏱️", label: "Days on Market", value: "15", color: "orange" },
  ],
  data,
  settings,
}: {
  title?: string
  metrics?: Array<{ icon: string; label: string; value: string; color: string }>
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => {
            const colorClass = {
              green: "from-green-500/20 to-green-600/20 border-green-500",
              blue: "from-blue-500/20 to-blue-600/20 border-blue-500",
              purple: "from-purple-500/20 to-purple-600/20 border-purple-500",
              orange: "from-orange-500/20 to-orange-600/20 border-orange-500",
            }[metric.color] || "from-blue-500/20 to-blue-600/20 border-blue-500"

            return (
              <div
                key={idx}
                className={`bg-gradient-to-br ${colorClass} border rounded-lg p-6 text-center text-white`}
              >
                <div className="text-4xl mb-3">{metric.icon}</div>
                <p className="text-sm text-gray-300 mb-2">{metric.label}</p>
                <p className="text-4xl font-bold">{metric.value}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
