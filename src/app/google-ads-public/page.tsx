import React from 'react';
import Link from 'next/link';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { ColdCallDemoCard } from '@/components/public/cold-call-demo-card';
import { BrochureUploadCard } from '@/components/public/brochure-upload-card';

const GoogleAdsPublicPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Above the fold: "Try it now" */}
      <section className="relative bg-gradient-to-br from-slate-50 to-stone-100 py-16 px-4 md:px-8 text-center overflow-hidden flex flex-col items-center justify-center min-h-screen-75vh">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-gray-900">
            Attract Qualified Buyers on Google. Experience Results Now.
          </h1>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <ChatDemoCard
            title="Chat with Your Campaign Planner"
            intro="Tell me what property you're selling or what kind of buyers you're looking for. I'll help you plan your next campaign."
            placeholder="Ask your Campaign Planner anything..."
            buttonLabel="Start Chat"
            context="Google Ads public demo."
            endpoint="/api/agent/demo"
          />

          <ColdCallDemoCard
            title="Request a Call to Plan Your Campaign"
            buttonLabel="Show Call Preview"
            topics={[
              { value: 'property-campaign', label: 'Property Campaign' },
              { value: 'buyer-acquisition', label: 'Buyer Acquisition Strategy' },
              { value: 'market-reach', label: 'Market Reach Expansion' },
            ]}
            context="Google Ads call preview."
          />

          <BrochureUploadCard
            title="Upload Brochure. Plan Ads."
            description="Drop a brochure and we’ll draft a campaign summary."
            ctaLabel="Launch Campaign with this Budget"
          />
        </div>
        <div className="mt-8 text-sm text-gray-600">
          Next step:{' '}
          <Link href="/dashboard/google-ads" className="text-navy-700 font-semibold underline">
            Launch your Google Ads plan
          </Link>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Campaigns that Convert. Brokers Who Trust.</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-stone-50 to-slate-100 p-6 rounded-xl shadow-lg flex items-start space-x-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">SA</div>
            <div>
              <blockquote className="text-lg text-gray-700 italic mb-3">
                "Running effective Google campaigns felt impossible. Now, I just tell Entrestate my budget, and qualified buyers start calling. It's truly effortless and delivers consistent results."
              </blockquote>
              <p className="font-semibold text-gray-900">— Samir Al-Farsi, Visionary Real Estate</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-stone-50 to-slate-100 p-6 rounded-xl shadow-lg flex items-start space-x-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">LN</div>
            <div>
              <blockquote className="text-lg text-gray-700 italic mb-3">
                "Entrestate removed all the guesswork. My campaigns consistently bring in high-quality inquiries for my luxury listings. It’s a direct path to serious buyers."
              </blockquote>
              <p className="font-semibold text-gray-900">— Layla Naji, Prestige Properties</p>
            </div>
          </div>
        </div>
      </section>

      {/* "How it Works" (Explanation of Value) */}
      <section className="py-16 px-4 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">From Idea to Inquiry: Your Campaign, Simplified.</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">1. Define Your Property & Objectives.</h3>
            <p className="text-gray-700">Tell us which property to promote and what success looks like: more calls, direct inquiries, or website visits. Your Campaign Planner aligns strategy for maximum impact.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">2. Set Your Flexible Budget.</h3>
            <p className="text-gray-700">You decide your comfortable daily spend. Our system ensures transparent, prepaid management, so you're always in control with no surprises.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">3. Campaign Optimization & Launch.</h3>
            <p className="text-gray-700">Entrestate expertly crafts your ad content and targets the most relevant buyers on Google. We launch and continuously optimize your campaign for top performance.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">📞</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">4. Receive Qualified Leads.</h3>
            <p className="text-gray-700">Attract high-intent buyers actively searching for properties like yours. Their inquiries arrive directly in your Entrestate Lead Pipeline, ready for your follow-up.</p>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Powerful Reach. Transparent Investment.</h2>
        </div>
        <div className="max-w-md mx-auto bg-gradient-to-br from-stone-50 to-slate-100 p-8 rounded-xl shadow-2xl border border-gray-200">
          <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Google Campaign Accelerator</h3>
          <p className="text-5xl font-extrabold text-center text-navy-700 mb-2">You Set Your Daily Spend</p>
          <p className="text-lg text-center text-gray-600 mb-8">Prepaid. Flexible. No Commitments.</p>
          <ul className="space-y-3 mb-8 text-gray-700">
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Fully Managed Google Buyer Acquisition Campaigns</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Targeted Property Keywords & Audience Matching</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Optimized Ad Creative & Messaging</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Transparent Daily Budget Control</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Seamless Lead Integration to Your Pipeline</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Multi-language Campaign Support (Arabic, English, and more)</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Simplified Performance Reporting</li>
          </ul>
          <button className="w-full bg-navy-700 hover:bg-navy-800 text-white font-bold py-3 rounded-lg text-xl transition-colors duration-300 shadow-lg">
            Launch My Next Campaign
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">Start attracting high-intent buyers today.</p>
        </div>
      </section>

      {/* FAQ (Real Estate Objections) */}
      <section className="py-16 px-4 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Your Campaign Questions, Answered with Clarity.</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              I have no experience with online campaigns. Is this for me?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Absolutely. Entrestate manages the entire process. Our system is designed for real estate professionals who want results without needing prior campaign management expertise.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              How quickly can my property campaign go live?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Once your property is linked and budget is set, your campaign typically goes live within 24 hours, starting to attract interested buyers almost immediately.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              How does Entrestate ensure my budget is spent effectively?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Our system continuously optimizes your campaign for performance, focusing on the most effective buyer searches and targeting to maximize your reach and deliver quality inquiries within your set budget. We provide clear reports so you always understand your spend and its impact.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              What kind of buyers will these campaigns attract?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              We focus on high-intent buyers – individuals actively searching for properties like yours. These are qualified prospects whose inquiries land directly in your Lead Pipeline, ready for your engagement.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              Can I stop or adjust my campaign if market conditions change?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Yes. You have complete flexibility. You can pause, restart, or adjust your daily budget at any point directly from your Entrestate dashboard, without any penalties or long-term commitments.
            </p>
          </details>
        </div>
      </section>

      {/* Final CTA Block */}
      <section className="bg-navy-700 py-16 px-4 md:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Connect with More Qualified Property Buyers?</h2>
          <p className="text-lg md:text-xl mb-8">
            Stop guessing. Start growing. Your next successful campaign is just a budget away with Entrestate.
          </p>
          <button className="bg-white text-navy-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-300 shadow-lg">
            Build My Campaign Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default GoogleAdsPublicPage;
