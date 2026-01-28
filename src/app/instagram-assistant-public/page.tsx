import React from 'react';
import Link from 'next/link';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { ColdCallDemoCard } from '@/components/public/cold-call-demo-card';
import { BrochureUploadCard } from '@/components/public/brochure-upload-card';

const InstagramAssistantPublicPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Above the fold: "Try it now" */}
      <section className="relative bg-gradient-to-br from-slate-50 to-stone-100 py-16 px-4 md:px-8 text-center overflow-hidden flex flex-col items-center justify-center min-h-screen-75vh">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-gray-900">
            Experience Instant Engagement. Capture Qualified Leads. Try it Now.
          </h1>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <ChatDemoCard
            title="Chat with Your Assistant"
            intro="Tell me what you're selling or looking for. I'll respond as if I'm already on your team, managing your Instagram inquiries."
            placeholder="Ask your Digital Assistant anything..."
            buttonLabel="Start Chat"
            context="Instagram assistant public demo."
            endpoint="/api/agent/demo"
          />

          <ColdCallDemoCard
            title="Request a Call from Your Assistant"
            buttonLabel="Show Call Preview"
            topics={[
              { value: 'sales-lead-follow-up', label: 'Sales Lead Follow-up' },
              { value: 'new-listing-strategy', label: 'New Listing Strategy' },
              { value: 'buyer-qualification', label: 'Buyer Qualification' },
            ]}
            context="Instagram assistant call preview."
          />

          <BrochureUploadCard
            title="Upload a Brochure → See a Site"
            description="Drop any project brochure and watch a draft summary get generated."
            ctaLabel="Upload Brochure"
          />
        </div>
        <div className="mt-8 text-sm text-gray-600">
          Next step:{' '}
          <Link href="/dashboard/chat-agent" className="text-navy-700 font-semibold underline">
            Activate your assistant
          </Link>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Results that Speak: Brokers Trust Entrestate.</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-stone-50 to-slate-100 p-6 rounded-xl shadow-lg flex items-start space-x-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">AK</div>
            <div>
              <blockquote className="text-lg text-gray-700 italic mb-3">
                "Before Entrestate, Instagram was a scrolling feed. Now, it's a 24/7 lead engine. My Digital Consultant captured 15 qualified leads last month – all while I was showing properties. Game changer."
              </blockquote>
              <p className="font-semibold text-gray-900">— Aisha Khan, Elite Properties</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-stone-50 to-slate-100 p-6 rounded-xl shadow-lg flex items-start space-x-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">RS</div>
            <div>
              <blockquote className="text-lg text-gray-700 italic mb-3">
                "The shift from passive DMs to active, qualified leads is remarkable. My Assistant handles the initial heavy lifting, so I only engage with truly interested buyers. Time saved, deals gained."
              </blockquote>
              <p className="font-semibold text-gray-900">— Rashid Said, Visionary Homes</p>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 text-center">
          <div className="p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-5xl font-bold text-navy-700 mb-2">+30%</p>
            <p className="text-gray-700">Leads Captured Per Month</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-5xl font-bold text-navy-700 mb-2">90s</p>
            <p className="text-gray-700">Avg. Lead Qualification Time</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-5xl font-bold text-navy-700 mb-2">+50%</p>
            <p className="text-gray-700">Meeting Bookings</p>
          </div>
        </div>
      </section>

      {/* "How it Works" (Explanation of Value) */}
      <section className="py-16 px-4 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">From Inquiry to Opportunity: Your Consultant's Simple Path.</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">1. Connect Your Instagram</h3>
            <p className="text-gray-700">Securely link your professional Instagram profile. Your Digital Consultant begins monitoring DMs and comments for new buyer signals, around the clock.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">2. Teach Your Consultant Your Listings</h3>
            <p className="text-gray-700">Upload your property profiles, e-brochures, and FAQs into Entrestate. Your Consultant learns every detail – locations, prices, amenities, and payment plans – ensuring accurate, intelligent responses.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">3. Go Live. Capture & Qualify Leads.</h3>
            <p className="text-gray-700">Activate your Consultant. It answers buyer questions instantly, identifies serious intent, and pre-qualifies leads based on your criteria, directing them straight into your Lead Pipeline.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">📞</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">4. Hands-Free Follow-up.</h3>
            <p className="text-gray-700">For identified high-intent leads, your Consultant can even suggest projects and pre-book meetings, ensuring every warm prospect moves forward without delay.</p>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Unlock Your Instagram's Potential. Unbeatable Value.</h2>
        </div>
        <div className="max-w-md mx-auto bg-gradient-to-br from-stone-50 to-slate-100 p-8 rounded-xl shadow-2xl border border-gray-200">
          <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Digital Consultant for Instagram</h3>
          <p className="text-5xl font-extrabold text-center text-navy-700 mb-2">46 AED</p>
          <p className="text-lg text-center text-gray-600 mb-8">/ month</p>
          <ul className="space-y-3 mb-8 text-gray-700">
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>24/7 Buyer Engagement & Lead Capture</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Full Access to Your Market Inventory</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Dedicated Chat Link (agentname.chat.entrestate.com) & QR Code</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Intelligent Lead Qualification & Intent Scoring</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Seamless Lead Handoff to Your Pipeline</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Deployable on Instagram DM & Your Website</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Multi-language Communication (Arabic, English, and more)</li>
          </ul>
          <button className="w-full bg-navy-700 hover:bg-navy-800 text-white font-bold py-3 rounded-lg text-xl transition-colors duration-300 shadow-lg">
            Activate My Digital Consultant
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">Billed Monthly. No long-term contracts. Pause anytime.</p>
        </div>
      </section>

      {/* FAQ (Real Estate Objections) */}
      <section className="py-16 px-4 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Clarity First: Your Questions, Answered.</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              How quickly can my Digital Consultant start working?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              You can connect your Instagram and teach your Consultant your listings in under 15 minutes. It’s ready to capture leads almost instantly.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              Will this replace my personal interaction with clients?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Never. Your Digital Consultant enhances your reach. It handles initial inquiries, qualifies interest, and ensures you connect with genuinely serious buyers, freeing your time for high-value interactions. You maintain full control and can take over any conversation at any moment.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              What if a lead isn't ready for a call yet?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Your Consultant understands buyer intent. It provides relevant information, suggests suitable projects, and nurtures interest. Only when a lead expresses readiness for a direct conversation or a meeting will it be handed off to your Pipeline with full context.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              How does the 'full market inventory access' work?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Your Consultant is equipped with a comprehensive understanding of your entire Entrestate market inventory. This means it can accurately answer questions and suggest relevant projects based on client preferences without needing manual input for each listing.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              How does Entrestate ensure brand safety and respectful communication?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Your Digital Consultant operates strictly within the communication guidelines you define. It uses your approved tone and terminology, never engages in unsolicited outreach, and respects all opt-out requests, ensuring brand-safe, compliant interactions across all languages.
            </p>
          </details>
        </div>
      </section>

      {/* Final CTA Block */}
      <section className="bg-navy-700 py-16 px-4 md:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Instagram into a Lead Powerhouse?</h2>
          <p className="text-lg md:text-xl mb-8">
            Stop scrolling. Start converting. Your dedicated Digital Consultant is waiting to elevate your social presence and deliver tangible results.
          </p>
          <button className="bg-white text-navy-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-300 shadow-lg">
            Activate My Digital Consultant Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default InstagramAssistantPublicPage;
