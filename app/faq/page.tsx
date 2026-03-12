import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export default function FAQPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-[#0a0a0a] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10 shadow-xl">
              <div className="relative space-y-12">
                <header className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-lime-300">Frequently Asked Questions</h1>
                  <p className="text-neutral-400 text-lg">
                    Answers to common questions about Mashroi templates, the AI builder, and launch flow.
                  </p>
                </header>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">1. What do I get with a template purchase?</h2>
                  <p className="text-neutral-300">
                    A ready-to-use website, a live subdomain, and instant access to the AI builder to customize
                    content, layout, and branding.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">2. How fast is the launch?</h2>
                  <p className="text-neutral-300">
                    You get a live site immediately after payment. The AI builder lets you finish customization in
                    minutes.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">3. Can I start from scratch?</h2>
                  <p className="text-neutral-300">
                    Yes. The builder subscription is $20/month and starts with a blank canvas.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">4. How is pricing calculated?</h2>
                  <p className="text-neutral-300">
                    Templates are priced individually. The Gold Century template is AED 2,399. Builder subscription is
                    $20/month.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">5. Can I customize after purchase?</h2>
                  <p className="text-neutral-300">
                    Yes. Every template opens in the AI builder immediately after purchase.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">6. How do I get started?</h2>
                  <p className="text-neutral-300">
                    Choose a template or start the builder subscription, then publish your first site.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AppverseFooter />
    </>
  )
}
