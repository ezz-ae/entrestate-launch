import React from 'react';
import Link from 'next/link';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { ColdCallDemoCard } from '@/components/public/cold-call-demo-card';
import { BrochureUploadCard } from '@/components/public/brochure-upload-card';

const SiteBuilderLandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Above the fold: "Try it now" */}
      <section className="relative bg-gradient-to-br from-slate-50 to-stone-100 py-16 px-4 md:px-8 text-center overflow-hidden flex flex-col items-center justify-center min-h-screen-75vh">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-gray-900">
            Launch Your Property Page. Instantly. Experience the Power.
          </h1>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <ChatDemoCard
            title="Chat with Your Page Planner"
            intro="Tell me about the property you're launching, or what kind of page you envision. I'll help you get started."
            placeholder="Describe your next property page..."
            buttonLabel="Start Chat"
            context="Site builder public demo."
            endpoint="/api/agent/demo"
          />

          <ColdCallDemoCard
            title="Request a Call to Discuss Your Page"
            buttonLabel="Show Call Preview"
            topics={[
              { value: 'property-launch', label: 'Property Launch Strategy' },
              { value: 'lead-pages', label: 'Lead Capture Pages' },
              { value: 'portfolio-showcase', label: 'Portfolio Showcase' },
            ]}
            context="Site builder call preview."
          />

          <BrochureUploadCard
            title="Upload Brochure. See Your Live Page."
            description="Drop any project brochure and we’ll draft the page summary."
            ctaLabel="Claim This Page & Launch"
          />
        </div>
        <div className="mt-8 text-sm text-gray-600">
          Next step:{' '}
          <Link href="/builder" className="text-navy-700 font-semibold underline">
            Open the Builder
          </Link>
        </div>
      </section>

      {/* Social Proof Section (Before & After Visual) */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Pages that Perform. Brokers Who Lead.</h2>
          <p className="text-lg text-gray-700">Transform your property presentations. Our Site Builder takes your existing brochures and turns them into stunning, lead-capturing pages. See the difference.</p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
            <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-500 italic p-4">
              [Generic Brochure Image/Screenshot]
            </div>
            <p className="p-4 text-center font-semibold text-lg text-gray-900">Your Brochure: Static Presentation</p>
          </div>
          <div className="text-5xl text-navy-600 font-bold hidden md:block">→</div>
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
            <div className="h-64 bg-gray-100 flex items-center justify-center text-navy-700 italic p-4 font-bold text-lg">
              [Screenshot: Dynamic Entrestate Property Page]
            </div>
            <p className="p-4 text-center font-semibold text-lg text-gray-900">Entrestate Page: Lead-Generating Experience</p>
          </div>
        </div>
      </section>

      {/* "How it Works" (Explanation of Value) */}
      <section className="py-16 px-4 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">From Idea to Live: Building Your Lead-Gen Page.</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">1. Start Your Way.</h3>
            <p className="text-gray-700">Begin with your property inventory, upload a brochure, or simply describe your vision. Our Builder adapts to your workflow, making creation intuitive.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">🧱</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">2. Customize with Essential Elements.</h3>
            <p className="text-gray-700">Drag and drop essential real estate blocks: interactive location maps, payment plans, photo galleries, WhatsApp CTAs, and integrated inquiry forms. Everything a buyer needs.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">🌐</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">3. Publish with Your Unique Domain.</h3>
            <p className="text-gray-700">Launch your page instantly with a free, custom Entrestate subdomain (e.g., name.site.entrestate.com), or easily connect your own domain. Your professional online presence, live in moments.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">4. Capture Leads Directly.</h3>
            <p className="text-gray-700">Every page is optimized for lead generation. Inquiries from interested buyers land directly in your Entrestate Lead Pipeline, ensuring no opportunity is missed.</p>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Unlimited Pages. Unlimited Potential. Transparent Investment.</h2>
        </div>
        <div className="max-w-md mx-auto bg-gradient-to-br from-stone-50 to-slate-100 p-8 rounded-xl shadow-2xl border border-gray-200">
          <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Entrestate Site Builder Pro</h3>
          <p className="text-5xl font-extrabold text-center text-navy-700 mb-2">150 AED</p>
          <p className="text-lg text-center text-gray-600 mb-8">/ month</p>
          <ul className="space-y-3 mb-8 text-gray-700">
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Unlimited Lead-Generating Property Pages</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Flexible Creation Methods (Inventory, Brochure, Description)</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Free Custom Subdomain (name.site.entrestate.com)</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Easy Custom Domain Connection & Management</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Comprehensive Real Estate Block Library (Maps, Plans, CTAs)</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Integrated Lead Capture & Performance Tracking</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Multi-language Page Support</li>
          </ul>
          <button className="w-full bg-navy-700 hover:bg-navy-800 text-white font-bold py-3 rounded-lg text-xl transition-colors duration-300 shadow-md">
            Start Building My First Page
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">Billed Monthly. Flexible terms. No long-term contracts.</p>
        </div>
      </section>

      {/* FAQ (Real Estate Objections) */}
      <section className="py-16 px-4 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Your Page Building Questions, Addressed with Clarity.</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              I'm not tech-savvy. Can I truly build a professional page quickly?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Absolutely. Entrestate's Site Builder is designed for real estate professionals. It’s intuitive and requires no technical skills to create stunning, lead-capturing property pages in minutes.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              Will my property pages be mobile-friendly?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Yes, every page created with Entrestate's Site Builder is automatically optimized for mobile responsiveness, ensuring it looks perfect and functions flawlessly on any device – critical for today's buyers.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              How does this help me capture more leads?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Our pages are engineered for conversion. With integrated inquiry forms, direct WhatsApp CTAs, and a focus on one property per page, visitors are guided to become qualified leads, which are then delivered to your Lead Pipeline.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              Can I use my existing domain for these property pages?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Yes. While we provide a free Entrestate subdomain, you can easily connect an existing custom domain or purchase a new one through your dashboard for complete brand alignment.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              What if I need to update my page after it's live?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Updating your page is simple and instant. You can edit any element, change details, or add new content directly from your Entrestate dashboard, and the changes will be reflected immediately.
            </p>
          </details>
        </div>
      </section>

      {/* Final CTA Block */}
      <section className="bg-navy-700 py-16 px-4 md:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Turn Your Properties into Lead-Generating Powerhouses?</h2>
          <p className="text-lg md:text-xl mb-8">
            Stop relying on generic listings. Start launching dedicated property pages that truly sell. Your next successful launch is just a click away.
          </p>
          <button className="bg-white text-navy-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-300 shadow-lg">
            Build My Page Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default SiteBuilderLandingPage;
