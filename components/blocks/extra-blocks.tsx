"use client"

import { Calendar, Shield, Home, BarChart3, MapPin, Sparkles, CheckCircle } from "lucide-react"

/** Timeline Block — property history events */
export function TimelineBlock({
  events = [],
  settings,
}: {
  events?: Array<{ year: number; title: string; description: string }>
  settings?: Record<string, unknown>
}) {
  const primary = (settings as any)?.colors?.primary ?? "#2563eb"
  return (
    <section className="py-16 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12" style={{ color: primary }}>
        Property History
      </h2>
      <div className="max-w-2xl mx-auto relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
        {events.map((ev, i) => (
          <div key={i} className="relative pl-16 pb-10 last:pb-0">
            <div
              className="absolute left-4 w-5 h-5 rounded-full border-4 border-white"
              style={{ backgroundColor: primary }}
            />
            <span className="text-sm font-semibold text-gray-400">{ev.year}</span>
            <h3 className="text-lg font-bold text-gray-900">{ev.title}</h3>
            <p className="text-gray-600 text-sm">{ev.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/** Benefits Block — 3‑column value props */
export function BenefitsBlock({
  title = "Why Buy Through Us",
  benefits = [],
  settings,
}: {
  title?: string
  benefits?: Array<{ icon: string; title: string; description: string }>
  settings?: Record<string, unknown>
}) {
  const primary = (settings as any)?.colors?.primary ?? "#2563eb"
  const icons: Record<string, typeof Shield> = { shield: Shield, home: Home, chart: BarChart3 }
  return (
    <section className="py-16 px-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12" style={{ color: primary }}>
        {title}
      </h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((b, i) => {
          const Icon = icons[b.icon] ?? CheckCircle
          return (
            <div key={i} className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${primary}15` }}>
                <Icon className="w-7 h-7" style={{ color: primary }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
              <p className="text-gray-600 text-sm">{b.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/** Map Block — location placeholder */
export function MapBlock({
  settings,
}: {
  showStreetView?: boolean
  zoom?: number
  settings?: Record<string, unknown>
}) {
  const primary = (settings as any)?.colors?.primary ?? "#2563eb"
  return (
    <section className="py-16 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center mb-8" style={{ color: primary }}>
        Location
      </h2>
      <div className="max-w-4xl mx-auto h-80 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
        <div className="text-center text-gray-400">
          <MapPin className="w-12 h-12 mx-auto mb-3" />
          <p className="font-medium">Map will load with property coordinates</p>
          <p className="text-sm">Connect to Google Maps or Mapbox to enable</p>
        </div>
      </div>
    </section>
  )
}

/** Multi-CTA Block — multiple action buttons */
export function MultiCTABlock({
  title = "Ready to Start Your Journey?",
  buttons = [],
  settings,
}: {
  title?: string
  buttons?: Array<{ text: string; link: string; variant: string }>
  settings?: Record<string, unknown>
}) {
  const primary = (settings as any)?.colors?.primary ?? "#2563eb"
  return (
    <section className="py-16 px-6" style={{ backgroundColor: primary }}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {buttons.map((btn, i) => (
            <a
              key={i}
              href={btn.link}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                btn.variant === "primary"
                  ? "bg-white text-gray-900 hover:bg-gray-100"
                  : btn.variant === "outline"
                    ? "border-2 border-white text-white hover:bg-white/10"
                    : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {btn.text}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/** New Construction Block — community highlights */
export function NewConstructionBlock({
  title = "New Community Coming Soon",
  highlights = [],
  priceRange = "",
  settings,
}: {
  title?: string
  highlights?: string[]
  priceRange?: string
  settings?: Record<string, unknown>
}) {
  const primary = (settings as any)?.colors?.primary ?? "#2563eb"
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <Sparkles className="w-10 h-10 mx-auto mb-4" style={{ color: primary }} />
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        {priceRange && (
          <p className="text-xl font-semibold mb-8" style={{ color: primary }}>
            Starting from {priceRange}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: primary }} />
              <span className="text-gray-300">{h}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
