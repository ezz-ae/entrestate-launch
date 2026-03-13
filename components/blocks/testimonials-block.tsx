"use client"

import type { WebsiteSettings } from "../types"

interface Testimonial {
  id: string
  text: string
  author: string
  role: string
  image?: string
}

interface TestimonialsBlockProps {
  settings: WebsiteSettings
  title?: string
  testimonials?: Testimonial[]
}

export function TestimonialsBlock({
  settings,
  title = "What Our Clients Say",
  testimonials = [],
}: TestimonialsBlockProps) {
  const defaultTestimonials: Testimonial[] = [
    {
      id: "1",
      text: "Exceptional service! They helped us find our dream home in just 2 weeks.",
      author: "John Smith",
      role: "Happy Homeowner",
    },
    {
      id: "2",
      text: "Professional, knowledgeable, and truly cares about their clients.",
      author: "Sarah Johnson",
      role: "Property Seller",
    },
    {
      id: "3",
      text: "Best real estate experience we've had. Highly recommended!",
      author: "Michael Chen",
      role: "Investor",
    },
  ]

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="container mx-auto">
        {title && (
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: settings.colors.primary }}>
            {title}
          </h2>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {displayTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
