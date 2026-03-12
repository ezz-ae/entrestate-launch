// app/about/page.tsx
import React from "react";

export default function AboutPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mashroi",
    url: "https://mashroi.com",
    logo: "https://mashroi.com/logo.png",
    description:
      "Mashroi sells ready-to-use real estate websites with AI customization and instant launch.",
    sameAs: [
      "https://www.instagram.com",
      "https://www.linkedin.com",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressRegion: "DU",
      addressCountry: "AE",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-555-555-5555",
        contactType: "customer service",
      },
    ],
    areaServed: [{ "@type": "Place", name: "Global" }],
  };

  return (
    <>
      {/* SEO Schema for Google + LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 px-6 md:px-12 lg:px-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">About Mashroi</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-80">
          We help real estate teams launch conversion-ready websites in minutes.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-neutral-900 text-white px-6 md:px-12 lg:px-20">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              title: "Ready Templates",
              desc: "Buy a template once and launch your site instantly.",
            },
            {
              title: "AI Builder",
              desc: "Customize copy, layout, and branding with AI.",
            },
            {
              title: "Real Estate Focus",
              desc: "Built for listings, lead capture, and conversion.",
            },
            {
              title: "Brochure to Landing",
              desc: "Upload a brochure and publish a landing page fast.",
            },
            {
              title: "Instagram DM Agent",
              desc: "AI responses that turn DMs into appointments.",
            },
            {
              title: "Fast Launch",
              desc: "Subdomain included with every template purchase.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-neutral-800 p-6 rounded-2xl shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="opacity-80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-center text-white px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to launch your site?</h2>
        <p className="text-lg opacity-80 mb-8">
          Pick a template and customize it with the AI builder.
        </p>
        <a
          href="/#pricing"
          className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-neutral-200 transition-all"
        >
          View pricing
        </a>
      </section>
    </>
  );
}
