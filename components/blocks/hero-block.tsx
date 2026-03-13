"use client"

import type { WebsiteSettings } from "../types"

interface HeroBlockProps {
  settings: WebsiteSettings
  title?: string
  subtitle?: string
  backgroundImage?: string
  backgroundOverlay?: number
  cta?: {
    text: string
    link: string
  }
  layout?: "center" | "left" | "right"
}

export function HeroBlock({
  settings,
  title = "Find Your Dream Property",
  subtitle = "Browse our exclusive selection of homes",
  backgroundImage,
  backgroundOverlay = 0.4,
  cta,
  layout = "center",
}: HeroBlockProps) {
  const bgStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,${backgroundOverlay}), rgba(0,0,0,${backgroundOverlay})), url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: `linear-gradient(135deg, ${settings.colors.primary} 0%, ${settings.colors.secondary} 100%)`,
      }

  const alignmentClass =
    layout === "center"
      ? "text-center items-center justify-center"
      : layout === "left"
        ? "text-left"
        : "text-right"

  return (
    <section
      className={`relative w-full py-32 flex items-center justify-${layout === "center" ? "center" : layout === "left" ? "start" : "end"} overflow-hidden`}
      style={bgStyle as React.CSSProperties}
    >
      {/* Content */}
      <div className={`container mx-auto px-6 ${alignmentClass}`}>
        <div className="max-w-2xl">
          {title && (
            <h1
              className="text-5xl md:text-6xl font-bold mb-4 text-white"
              style={{ fontFamily: settings.fonts.heading }}
            >
              {title}
            </h1>
          )}

          {subtitle && (
            <p
              className="text-xl md:text-2xl text-gray-200 mb-8"
              style={{ fontFamily: settings.fonts.body }}
            >
              {subtitle}
            </p>
          )}

          {cta && (
            <a
              href={cta.link}
              className="inline-block px-8 py-4 rounded-lg font-semibold transition-transform hover:scale-105"
              style={{
                backgroundColor: settings.colors.accent,
                color: settings.colors.background,
              }}
            >
              {cta.text}
            </a>
          )}
        </div>
      </div>

      {/* Decorative shape */}
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 bg-white transform translate-x-1/4 translate-y-1/4" />
    </section>
  )
}
