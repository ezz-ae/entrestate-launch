"use client"

import React, { useEffect, useState } from "react"
import type { WebsiteSettings } from "../types"

/**
 * FAQ Accordion Block
 */
export function FAQBlock({
  title = "Frequently Asked Questions",
  faqs = [
    {
      question: "How long does the buying process take?",
      answer: "The typical buying process takes 30-45 days from offer acceptance to closing. However, this can vary depending on financing and inspection results.",
    },
    {
      question: "What should I do to prepare my home for sale?",
      answer: "We recommend cleaning, decluttering, making minor repairs, and staging key areas. Professional photos and virtual tours can significantly increase interest.",
    },
    {
      question: "Do I need a pre-approval before making an offer?",
      answer: "While not required, having a pre-approval letter strengthens your offer and shows sellers you're a serious buyer. Most sellers prefer pre-approved buyers.",
    },
    {
      question: "What are your commission rates?",
      answer: "Commission rates are negotiable, but typically range from 2.5-3% per side. We also offer discounted rates for qualified buyers and sellers.",
    },
    {
      question: "Can you help with investment property analysis?",
      answer: "Yes! We provide detailed investment analysis including cap rates, cash flow projections, and comparable sales data for all property types.",
    },
  ],
  data,
  settings,
}: {
  title?: string
  faqs?: Array<{ question: string; answer: string }>
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-left text-gray-900">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {openIndex === idx && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Why Choose Us Block
 */
export function WhyChooseUsBlock({
  title = "Why Choose Us",
  features = [
    {
      icon: "📊",
      title: "Market Intelligence",
      description: "AI-powered analysis of Dubai real estate market trends and opportunities",
    },
    {
      icon: "🏆",
      title: "Expert Team",
      description: "20+ years of combined experience in luxury real estate",
    },
    {
      icon: "✓",
      title: "Golden Visa Access",
      description: "Exclusive access to Golden Visa approved developments",
    },
    {
      icon: "🚀",
      title: "AI Technology",
      description: "Advanced AI tools for property analysis and market predictions",
    },
  ],
  columns = 4,
  data,
  settings,
}: {
  title?: string
  features?: Array<{ icon: string; title: string; description: string }>
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
    <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          {title}
        </h2>

        <div className={`grid ${colsClass} gap-6`}>
          {features.map((feature, idx) => (
            <div key={idx} className="group">
              <div className="h-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Blog Grid Block
 */
export function BlogGridBlock({
  title = "Latest Blog Posts",
  columns = 3,
  posts = [
    {
      image: "/blog-1.jpg",
      category: "Market Insights",
      title: "Dubai Real Estate Market 2024 Outlook",
      excerpt: "Analyze key trends and opportunities in the Dubai property market",
      date: "Mar 1, 2024",
    },
    {
      image: "/blog-2.jpg",
      category: "Investment Tips",
      title: "5 Tips for First-Time Property Investors",
      excerpt: "Essential advice for investors starting their real estate journey",
      date: "Feb 28, 2024",
    },
    {
      image: "/blog-3.jpg",
      category: "Lifestyle",
      title: "Best Neighborhoods for Expats in Dubai",
      excerpt: "Guide to the most popular areas for international residents",
      date: "Feb 25, 2024",
    },
  ],
  data,
  settings,
}: {
  title?: string
  columns?: number
  posts?: Array<{
    image?: string
    category: string
    title: string
    excerpt: string
    date: string
  }>
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  }[columns] || "grid-cols-3"

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>

        <div className={`grid ${colsClass} gap-8`}>
          {posts.map((post, idx) => (
            <article
              key={idx}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition group cursor-pointer"
            >
              <div className="relative h-48 bg-gray-300 overflow-hidden">
                <img
                  src={post.image || "/placeholder.jpg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                  {post.category}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">{post.date}</span>
                  <a href="#" className="text-blue-600 font-semibold text-sm hover:underline">
                    Read More →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * CTA Banner Block
 */
export function CTABannerBlock({
  title = "Ready to Find Your Dream Property?",
  subtitle = "Get exclusive access to premium listings and market insights",
  primaryCTA = "Start Exploring",
  secondaryCTA = "Schedule Consultation",
  backgroundGradient = "from-blue-600 to-blue-800",
  data,
  settings,
}: {
  title?: string
  subtitle?: string
  primaryCTA?: string
  secondaryCTA?: string
  backgroundGradient?: string
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  return (
    <section className={`w-full py-16 px-4 md:px-8 bg-gradient-to-r ${backgroundGradient}`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        <p className="text-lg text-white/90 mb-8">{subtitle}</p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition shadow-lg">
            {primaryCTA}
          </button>
          <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg transition">
            {secondaryCTA}
          </button>
        </div>
      </div>
    </section>
  )
}

/**
 * Contact Form Block
 */
export function ContactFormBuilderBlock({
  title = "Get In Touch",
  subtitle = "We'd love to hear from you. Send us a message!",
  fields = [
    { name: "fullName", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "tel", required: false },
    { name: "subject", label: "Subject", type: "text", required: true },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      required: true,
      placeholder: "Tell us about your real estate needs...",
    },
  ],
  data,
  settings,
}: {
  title?: string
  subtitle?: string
  fields?: Array<{
    name: string
    label: string
    type: string
    required?: boolean
    placeholder?: string
  }>
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const [formData, setFormData] = React.useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <form className="space-y-6">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {field.label}
                {field.required && <span className="text-red-600">*</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required={field.required}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  )
}

/**
 * Market Metrics / Stats Block
 */
export function MarketMetricsBlock({
  title = "Market Intelligence",
  metrics = [
    { label: "Off-Plan Projects", value: "954", trend: "↑ 12%" },
    { label: "Average Yield", value: "5.8%", trend: "↑ 0.3%" },
    { label: "Price Growth", value: "8.2%", trend: "↑ YoY" },
    { label: "Active Buyers", value: "15K+", trend: "↑ 23%" },
  ],
  backgroundColor = "from-slate-900 to-slate-800",
  address,
  price,
  data,
  settings,
}: {
  title?: string
  metrics?: Array<{ label: string; value: string; trend?: string }>
  backgroundColor?: string
  address?: string
  price?: number
  data?: Record<string, unknown>
  settings?: WebsiteSettings
}) {
  const [liveMetrics, setLiveMetrics] = useState<Array<{ label: string; value: string; trend?: string }> | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(false)

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)

  const resolvedAddress =
    address ||
    (typeof data?.listing === "object" && data?.listing && "address" in data.listing ? (data.listing as Record<string, unknown>).address as string : undefined) ||
    (typeof data?.address === "string" ? data.address : undefined) ||
    (typeof data?.agency === "object" && data?.agency && "address" in data.agency ? (data.agency as Record<string, unknown>).address as string : undefined)

  const resolvedPrice =
    typeof price === "number"
      ? price
      : typeof data?.listing === "object" && data?.listing && "price" in data.listing
        ? Number((data.listing as Record<string, unknown>).price)
        : undefined

  const resolveMetrics = () => {
    const directMetrics = (data?.marketMetrics as Array<{ label: string; value: string; trend?: string }>) ?? null
    if (Array.isArray(directMetrics) && directMetrics.length > 0) {
      return directMetrics
    }

    const insights = (data?.marketInsights ?? data?.marketAnalysis) as Record<string, unknown> | undefined
    if (insights && typeof insights === "object") {
      const averagePrice = insights.averagePrice as number | undefined
      const priceRange = insights.priceRange as { min?: number; max?: number } | undefined
      const avgDays = insights.averageDaysOnMarket as number | undefined
      const trend = insights.marketTrend as string | undefined
      const walkscore = insights.walkscore as number | undefined

      return [
        {
          label: "Average Price",
          value: averagePrice ? formatPrice(averagePrice) : "—",
          trend: trend ? String(trend) : undefined,
        },
        {
          label: "Price Range",
          value:
            priceRange?.min && priceRange?.max
              ? `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`
              : "—",
        },
        {
          label: "Avg Days on Market",
          value: typeof avgDays === "number" ? `${avgDays} days` : "—",
        },
        {
          label: "Walkscore",
          value: typeof walkscore === "number" ? `${walkscore}` : "—",
        },
      ]
    }

    return metrics
  }

  useEffect(() => {
    const hasInlineData = Boolean(data?.marketMetrics || data?.marketInsights || data?.marketAnalysis)
    const hasExplicitInput = typeof address === "string" || typeof price === "number"
    const safeAddress = typeof resolvedAddress === "string" ? resolvedAddress.trim() : ""
    if (!safeAddress) return
    if (hasInlineData && !hasExplicitInput) return

    const controller = new AbortController()

    async function loadMarketMetrics() {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({ address: safeAddress })
        if (typeof resolvedPrice === "number" && Number.isFinite(resolvedPrice)) {
          params.set("price", String(resolvedPrice))
        }
        const response = await fetch(`/api/market-analysis?${params.toString()}`, {
          signal: controller.signal,
        })
        const payload = await response.json()
        if (payload?.success && Array.isArray(payload?.data?.marketMetrics)) {
          setLiveMetrics(payload.data.marketMetrics)
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Market metrics fetch failed:", error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadMarketMetrics()

    return () => controller.abort()
  }, [data, resolvedAddress, resolvedPrice])

  const resolvedMetrics = liveMetrics ?? resolveMetrics()

  return (
    <section className={`w-full py-16 px-4 md:px-8 bg-gradient-to-br ${backgroundColor}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">{title}</h2>

        {isLoading && (
          <p className="text-center text-xs uppercase tracking-[0.3em] text-white/70 mb-6">
            Loading market analysis...
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {resolvedMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center hover:bg-white/20 transition"
            >
              <p className="text-white/80 text-sm font-medium mb-3">{metric.label}</p>
              <p className="text-4xl font-bold text-white mb-2">{metric.value}</p>
              {metric.trend && <p className="text-green-400 text-sm font-semibold">{metric.trend}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
