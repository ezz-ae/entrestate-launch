// app/about/page.tsx
import React from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { AppverseFooter } from "@/components/appverse-footer";
import { Button } from "@/components/ui/button";

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
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      
      {/* SEO Schema for Google + LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(132,204,22,0.15),rgba(0,0,0,0))]" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80 mb-6 animate-fade-up">Our Mission</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 animate-fade-up">
            Launch your <span className="text-lime-300">vision</span><br />in minutes.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-neutral-400 leading-relaxed animate-fade-up">
            Mashroi was built to bridge the gap between high-end design and instant deployment. We provide real estate professionals with the tools to dominate their digital market without the technical overhead.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Ready Templates",
                desc: "Polished, conversion-optimized layouts for luxury brokerage, personal brands, and new developments.",
              },
              {
                title: "AI Builder",
                desc: "An intuitive engine that adapts copy, imagery, and layout to your unique brand voice instantly.",
              },
              {
                title: "Conversion First",
                desc: "Wired with lead capture, WhatsApp routing, and tracking pixels out of the box.",
              },
              {
                title: "Brochure to Landing",
                desc: "Upload a PDF brochure and watch our AI transform it into a high-converting landing page.",
              },
              {
                title: "Instagram DM Agent",
                desc: "Automate your lead funnel with AI agents that handle property inquiries directly in your DMs.",
              },
              {
                title: "Instant Hosting",
                desc: "Every template includes managed hosting and a live subdomain so you can go live immediately.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[32px] border border-white/5 bg-neutral-900/40 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-lime-400/30 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-lime-300 transition-colors">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,204,22,0.1),transparent)] pointer-events-none" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to transform your brand?</h2>
          <p className="text-xl text-neutral-400 mb-10 max-w-xl mx-auto">
            Join the elite real estate teams using Mashroi to close more deals.
          </p>
          <Button asChild className="rounded-full bg-lime-400 text-black font-bold px-10 py-7 text-lg hover:bg-lime-300 hover:scale-105 transition-all shadow-[0_0_30px_rgba(132,204,22,0.3)]">
            <Link href="/#pricing">Get Started Now</Link>
          </Button>
        </div>
      </section>

      <AppverseFooter />
    </main>
  );
}
        >
          View pricing
        </Link>
      </section>
    </>
  );
}
