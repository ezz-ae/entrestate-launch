import React from 'react';
import Link from 'next/link';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { ColdCallDemoCard } from '@/components/public/cold-call-demo-card';
import { BrochureUploadCard } from '@/components/public/brochure-upload-card';

const LeadPipelineOverviewPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Above the fold: "Try it now" */}
      <section className="relative bg-gradient-to-br from-slate-50 to-stone-100 py-16 px-4 md:px-8 text-center overflow-hidden flex flex-col items-center justify-center min-h-screen-75vh">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-gray-900">
            Unlock the Full Story of Every Lead. Experience Clarity Now.
          </h1>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <ChatDemoCard
            title="Chat to Save a Lead"
            intro="Tell me about a potential buyer. I'll show you how they'd appear in your Pipeline."
            placeholder="Describe a lead..."
            buttonLabel="Simulate Lead Save"
            context="Lead pipeline public demo."
            endpoint="/api/agent/demo"
          />

          <ColdCallDemoCard
            title="Request a Call. Validate a Lead."
            buttonLabel="Show Call Preview"
            topics={[
              { value: 'lead-qualification', label: 'Lead Qualification' },
              { value: 'buyer-intent', label: 'Buyer Intent Validation' },
              { value: 'follow-up-strategy', label: 'Follow-up Strategy' },
            ]}
            context="Lead pipeline call preview."
          />

          <BrochureUploadCard
            title="Upload Lead Info. See it Organized."
            description="Drop any lead PDF and we’ll extract the key details."
            ctaLabel="Add to My Pipeline"
          />
        </div>
        <div className="mt-8 text-sm text-gray-600">
          Next step:{' '}
          <Link href="/dashboard/leads" className="text-navy-700 font-semibold underline">
            Open the lead pipeline
          </Link>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Leads That Make Sense. Brokers Who Thrive.</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-stone-50 to-slate-100 p-6 rounded-xl shadow-lg flex items-start space-x-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">ZA</div>
            <div>
              <blockquote className="text-lg text-gray-700 italic mb-3">
                "My Lead Pipeline is no longer a guessing game. I see who's active, who needs nurturing, and who's ready to buy. It's transformed my follow-up strategy."
              </blockquote>
              <p className="font-semibold text-gray-900">— Zahra A., Prestige Property Group</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-stone-50 to-slate-100 p-6 rounded-xl shadow-lg flex items-start space-x-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">KM</div>
            <div>
              <blockquote className="text-lg text-gray-700 italic mb-3">
                "No more sifting through endless contacts. Entrestate gives me a clear timeline of lead activity and intent. It feels like requesting a senior colleague to call you."
              </blockquote>
              <p className="font-semibold text-gray-900">— Khalid M., Urban Real Estate</p>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 text-center">
          <div className="p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-5xl font-bold text-navy-700 mb-2">+40%</p>
            <p className="text-gray-700">Lead Follow-up Efficiency</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-5xl font-bold text-navy-700 mb-2">95%</p>
            <p className="text-gray-700">Lead Status Clarity</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-5xl font-bold text-navy-700 mb-2">100%</p>
            <p className="text-gray-700">Lead Origin Tracking</p>
          </div>
        </div>
      </section>

      {/* "How it Works" (Explanation of Value) */}
      <section className="py-16 px-4 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Your Leads. Clearly Organized. Intelligently Prioritized.</h2>
          <p className="text-lg text-gray-700">Entrestate brings all your potential buyers into one intuitive system, giving you complete clarity and control.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">📥</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">1. Effortless Lead Consolidation</h3>
            <p className="text-gray-700">Whether from your Digital Assistant, property pages, or manual uploads, every lead is seamlessly integrated into your central Pipeline.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">2. Understand True Buyer Intent</h3>
            <p className="text-gray-700">Each lead is assessed for genuine interest, activity signals, and readiness score, revealing their unique potential and stage.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">3. Focus on Your Best Opportunities</h3>
            <p className="text-gray-700">Quickly identify your warmest leads, understand their specific needs, and engage them at the perfect moment to secure meetings and sales.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl bg-white shadow-md border border-gray-200">
            <div className="text-5xl text-navy-600 mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">4. Expand Your Reach with Lookalike Buyers</h3>
            <p className="text-gray-700">Our system identifies new prospects who share similar profiles and interests with your successful leads, growing your Pipeline automatically (active with 5+ leads).</p>
          </div>
        </div>
      </section>

      {/* Visual Representation of Lead Intelligence - Timeline */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Your Leads, Demystified. Actionable Insights.</h2>
          <p className="text-lg text-gray-700">See a realistic timeline of lead activity and status within your Entrestate Pipeline.</p>
        </div>
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Lead 1 */}
            <div className="relative pl-8 border-l-2 border-navy-300">
              <div className="absolute -left-3 top-0 w-6 h-6 bg-navy-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
              <p className="font-semibold text-lg text-gray-900">Ahmed Al-Mansoori</p>
              <p className="text-gray-700">Source: Digital Consultant (Instagram DM)</p>
              <p className="text-gray-700 italic">"Active" - Responded to Project 'Oasis Towers' query. Needs follow-up.</p>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            {/* Lead 2 */}
            <div className="relative pl-8 border-l-2 border-navy-300">
              <div className="absolute -left-3 top-0 w-6 h-6 bg-navy-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
              <p className="font-semibold text-lg text-gray-900">Layla Hassan</p>
              <p className="text-gray-700">Source: Property Page (Site Builder)</p>
              <p className="text-gray-700 italic">"Responded" - Downloaded 'Luxury Villa' brochure. High interest.</p>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
            {/* Lead 3 */}
            <div className="relative pl-8 border-l-2 border-navy-300">
              <div className="absolute -left-3 top-0 w-6 h-6 bg-navy-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
              <p className="font-semibold text-lg text-gray-900">Omar K. </p>
              <p className="text-gray-700">Source: Manual Upload</p>
              <p className="text-gray-700 italic">"Needs Follow-up" - Provided contact details for 'Downtown Residences'.</p>
              <span className="text-sm text-gray-500">3 days ago</span>
            </div>
          </div>
          <button className="mt-8 w-full bg-navy-600 hover:bg-navy-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 shadow-md">
            View My Full Pipeline
          </button>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-16 px-4 md:px-8 bg-stone-100">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Flexible Pricing. Real Impact.</h2>
        </div>
        <div className="max-w-md mx-auto bg-gradient-to-br from-stone-50 to-slate-100 p-8 rounded-xl shadow-2xl border border-gray-200">
          <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Lead Pipeline Intelligence</h3>
          <p className="text-5xl font-extrabold text-center text-navy-700 mb-2">Core System: Free</p>
          <p className="text-lg text-center text-gray-600 mb-8">Pay Only for Outreach Campaigns</p>
          <ul className="space-y-3 mb-8 text-gray-700">
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Centralized Lead Consolidation (Unlimited)</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Intelligent Lead Assessment & Intent Tracking</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Buyer Activity Signals & Readiness Scoring</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Lookalike Audience Builder (Active with 5+ Leads)</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Seamless Integration with Entrestate Tools</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>SMS + Email Outreach Campaigns (Pay-As-You-Go)</li>
            <li className="flex items-center"><span className="text-navy-600 text-xl mr-2">✓</span>Multi-language Support for Global Leads</li>
          </ul>
          <button className="w-full bg-navy-700 hover:bg-navy-800 text-white font-bold py-3 rounded-lg text-xl transition-colors duration-300 shadow-md">
            View My Pipeline
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">Start managing your leads with clarity today.</p>
        </div>
      </section>

      {/* FAQ (Real Estate Objections) */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Common Questions. Your Clarity.</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              What does 'Pay Only for Outreach Campaigns' mean?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              The core Lead Pipeline system, including all lead consolidation and intelligence features, is provided at no cost. You only incur charges if you choose to send targeted SMS or email campaigns through the system.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              How does Entrestate determine a lead's 'Readiness Score'?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Our system evaluates a combination of factors, including their interactions with your content, questions asked, demographic data, and stated interests, to provide an objective readiness assessment.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              Can I integrate leads from sources outside of Entrestate?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Yes, you can easily upload leads from external sources directly into your Pipeline, ensuring all your potential buyers are managed in one intelligent system.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              Is there a limit to how many leads I can manage?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              No. The Entrestate Lead Pipeline is designed to scale with your business. You can manage an unlimited number of leads efficiently.
            </p>
          </details>
          <details className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer">
            <summary className="flex justify-between items-center font-semibold text-lg text-gray-900 group-hover:text-navy-700 transition-colors duration-200">
              How does this differ from a traditional CRM?
              <span className="text-navy-600 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Entrestate focuses specifically on 'lead intelligence' – helping you understand and prioritize your buyers. While it manages contacts, its core strength is in making sense of intent and readiness, rather than just storing data.
            </p>
          </details>
        </div>
      </section>

      {/* Final CTA Block */}
      <section className="bg-navy-700 py-16 px-4 md:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Lead Management into a Revenue Engine?</h2>
          <p className="text-lg md:text-xl mb-8">
            Gain clarity, prioritize effectively, and close more deals with the Entrestate Lead Pipeline.
          </p>
          <button className="bg-white text-navy-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-300 shadow-lg">
            View My Pipeline
          </button>
        </div>
      </section>
    </div>
  );
};

export default LeadPipelineOverviewPage;
