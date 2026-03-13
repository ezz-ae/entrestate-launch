import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What do I get with a template purchase?",
    answer: "A ready-to-use website, a live subdomain, and instant access to the AI builder to customize content, layout, and branding."
  },
  {
    question: "How fast is the launch?",
    answer: "You get a live site immediately after payment. The AI builder lets you finish customization in minutes."
  },
  {
    question: "Can I start from scratch?",
    answer: "Yes. The builder subscription is $20/month and starts with a blank canvas for complete creative control."
  },
  {
    question: "How is pricing calculated?",
    answer: "Templates are priced individually. The Gold Century template is AED 2,399 (one-time). Builder subscription is $20/month."
  },
  {
    question: "Can I customize after purchase?",
    answer: "Absolutely. Every template opens in the AI builder immediately after purchase, allowing you to tweak everything."
  },
  {
    question: "How do I get started?",
    answer: "Choose a template from our catalog or start the builder subscription, then publish your first site in clicks."
  }
]

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(132,204,22,0.1),rgba(0,0,0,0))]" />
        </div>
        
        <div className="container relative mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16 animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80 mb-4">Support</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Frequently Asked Questions</h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about Mashroi templates, the AI builder, and our launch process.
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="rounded-[24px] border border-white/5 bg-neutral-900/40 px-6 py-2 backdrop-blur-xl transition-all hover:border-white/10"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:text-lime-300 transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-400 text-base leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="mt-20 text-center animate-fade-up" style={{ animationDelay: '200ms' }}>
            <p className="text-neutral-500 mb-6">Still have questions?</p>
            <a 
              href="mailto:hello@mashroi.com" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
      
      <AppverseFooter />
    </main>
  )
}
