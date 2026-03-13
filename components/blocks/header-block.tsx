"use client"

import type { WebsiteSettings } from "../types"
import { Menu } from "lucide-react"
import { useState } from "react"

interface HeaderBlockProps {
  settings: WebsiteSettings
  pages?: Array<{ slug: string; title: string }>
  currentPage?: string
  onNavigate?: (slug: string) => void
}

export function HeaderBlock({
  settings,
  pages = [],
  currentPage = "home",
  onNavigate,
}: HeaderBlockProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md"
      style={{ borderBottom: `3px solid ${settings.colors.primary}` }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {settings.branding.logoUrl && (
            <img
              src={settings.branding.logoUrl}
              alt="Logo"
              className="h-10"
            />
          )}
          <span
            className="font-bold text-lg hidden sm:inline"
            style={{ color: settings.colors.primary }}
          >
            {settings.branding.companyName}
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {pages.map((page) => (
            <button
              key={page.slug}
              onClick={() => onNavigate?.(page.slug)}
              className={`font-medium transition-colors ${
                currentPage === page.slug
                  ? "text-blue-600"
                  : "hover:text-gray-600"
              }`}
              style={{
                color:
                  currentPage === page.slug
                    ? settings.colors.primary
                    : "inherit",
              }}
            >
              {page.title}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        <a
          href={`tel:${settings.branding.phone}`}
          className="hidden md:inline-block px-6 py-2 rounded-lg text-white font-semibold"
          style={{ backgroundColor: settings.colors.primary }}
        >
          Contact
        </a>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-gray-50 dark:bg-gray-700 px-6 py-4 flex flex-col gap-3">
          {pages.map((page) => (
            <button
              key={page.slug}
              onClick={() => {
                onNavigate?.(page.slug)
                setMobileMenuOpen(false)
              }}
              className="text-left py-2"
            >
              {page.title}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}
