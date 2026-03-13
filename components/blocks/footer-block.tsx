"use client"

import type { WebsiteSettings } from "../types"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

interface FooterBlockProps {
  settings: WebsiteSettings
  showSocial?: boolean
  showNewsletter?: boolean
  quickLinks?: Array<{ title: string; href: string }>
}

export function FooterBlock({
  settings,
  showSocial = true,
  showNewsletter = true,
  quickLinks = [],
}: FooterBlockProps) {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            {settings.branding.logoUrl && (
              <img
                src={settings.branding.logoUrl}
                alt="Logo"
                className="h-8 mb-4"
              />
            )}
            <p className="text-gray-400 mb-4">{settings.branding.companyName}</p>
            <p className="text-sm text-gray-500">{settings.branding.address}</p>
          </div>

          {/* Quick Links */}
          {quickLinks.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400 text-sm mb-2">
              <a href={`tel:${settings.branding.phone}`} className="hover:text-white">
                {settings.branding.phone}
              </a>
            </p>
            <p className="text-gray-400 text-sm">
              <a href={`mailto:${settings.branding.email}`} className="hover:text-white">
                {settings.branding.email}
              </a>
            </p>
          </div>
        </div>

        {/* Newsletter */}
        {showNewsletter && (
          <div className="py-8 border-t border-gray-800">
            <h3 className="font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded text-black"
              />
              <button
                className="px-6 py-2 rounded font-semibold text-white"
                style={{ backgroundColor: settings.colors.primary }}
              >
                Subscribe
              </button>
            </div>
          </div>
        )}

        {/* Social & Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          {showSocial && (
            <div className="flex gap-4 mb-4 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          )}

          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {settings.branding.companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
