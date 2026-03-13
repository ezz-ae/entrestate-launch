"use client"

import { useState } from "react"
import type { WebsiteSettings } from "../types"

interface ContactFormBlockProps {
  settings: WebsiteSettings
  title?: string
  subtitle?: string
  showPhone?: boolean
  showAddress?: boolean
}

export function ContactFormBlock({
  settings,
  title = "Get In Touch",
  subtitle = "We'd love to help you find your next home",
  showPhone = true,
  showAddress = true,
}: ContactFormBlockProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle form submission
    console.log("Form submitted:", formData)
    alert("Thank you! We'll be in touch soon.")
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  return (
    <section className="py-16 px-6 bg-white dark:bg-gray-800">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
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
          {subtitle && (
            <p
              className="text-lg text-gray-600 dark:text-gray-400"
              style={{ fontFamily: settings.fonts.body }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div>
            {showPhone && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-600 dark:text-gray-400">{settings.branding.phone}</p>
              </div>
            )}

            {showAddress && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-gray-600 dark:text-gray-400">{settings.branding.address}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">{settings.branding.email}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 resize-none"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: settings.colors.primary }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
