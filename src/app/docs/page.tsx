import React from 'react';
import Link from 'next/link';

const DocsPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <header className="bg-navy-700 text-white py-12 px-4 md:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Entrestate Operating Guide</h1>
        <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
          Your comprehensive resource for mastering Entrestate and driving real estate success.
        </p>
      </header>

      <main className="max-w-6xl mx-auto py-16 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Documentation Sections</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Section: Getting Started */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-navy-700 mb-3">Getting Started</h3>
            <p className="text-gray-700 mb-4">Everything you need to set up your Entrestate account and begin your journey.</p>
            <ul className="space-y-2 text-navy-600">
              <li><Link href="/docs/getting-started/account-setup" className="hover:underline">Account Setup</Link></li>
              <li><Link href="/docs/getting-started/platform-overview" className="hover:underline">Platform Overview</Link></li>
            </ul>
          </div>

          {/* Section: Digital Consultant */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-navy-700 mb-3">Digital Consultant</h3>
            <p className="text-gray-700 mb-4">Activate and leverage your dedicated Digital Consultant for seamless client engagement.</p>
            <ul className="space-y-2 text-navy-600">
              <li><Link href="/docs/digital-consultant/activating-your-consultant" className="hover:underline">Activating Your Consultant</Link></li>
              <li><Link href="/docs/digital-consultant/teaching-your-consultant-listings" className="hover:underline">Teaching Your Consultant Listings</Link></li>
              <li><Link href="/docs/digital-consultant/client-engagement-best-practices" className="hover:underline">Client Engagement Best Practices</Link></li>
            </ul>
          </div>

          {/* Section: Site Builder */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-navy-700 mb-3">Site Builder</h3>
            <p className="text-gray-700 mb-4">Build stunning, lead-generating property pages in minutes, with no technical skills.</p>
            <ul className="space-y-2 text-navy-600">
              <li><Link href="/docs/site-builder/creating-your-first-page" className="hover:underline">Creating Your First Page</Link></li>
              <li><Link href="/docs/site-builder/customizing-page-blocks" className="hover:underline">Customizing Page Blocks</Link></li>
              <li><Link href="/docs/site-builder/connecting-custom-domains" className="hover:underline">Connecting Custom Domains</Link></li>
            </ul>
          </div>

          {/* Section: Lead Pipeline */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-navy-700 mb-3">Lead Pipeline</h3>
            <p className="text-gray-700 mb-4">Understand, manage, and engage your leads effectively to maximize conversions.</p>
            <ul className="space-y-2 text-navy-600">
              <li><Link href="/docs/lead-pipeline/understanding-your-leads" className="hover:underline">Understanding Your Leads</Link></li>
              <li><Link href="/docs/lead-pipeline/managing-follow-ups" className="hover:underline">Managing Follow-ups</Link></li>
              <li><Link href="/docs/lead-pipeline/outreach-campaigns" className="hover:underline">Outreach Campaigns</Link></li>
            </ul>
          </div>

          {/* Section: Google Campaigns */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-navy-700 mb-3">Google Campaigns</h3>
            <p className="text-gray-700 mb-4">Launch high-performance property campaigns on Google with ease and confidence.</p>
            <ul className="space-y-2 text-navy-600">
              <li><Link href="/docs/google-campaigns/launching-your-first-campaign" className="hover:underline">Launching Your First Campaign</Link></li>
              <li><Link href="/docs/google-campaigns/optimizing-performance" className="hover:underline">Optimizing Performance</Link></li>
            </ul>
          </div>

          {/* Section: Project Profiles */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-navy-700 mb-3">Project Profiles</h3>
            <p className="text-gray-700 mb-4">Manage your property inventory and leverage built-in sales tools for each listing.</p>
            <ul className="space-y-2 text-navy-600">
              <li><Link href="/docs/project-profiles/managing-project-details" className="hover:underline">Managing Project Details</Link></li>
              <li><Link href="/docs/project-profiles/generating-marketing-assets" className="hover:underline">Generating Marketing Assets</Link></li>
            </ul>
          </div>

          {/* Section: FAQs & Support */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-navy-700 mb-3">FAQs & Support</h3>
            <p className="text-gray-700 mb-4">Find answers to common questions and get assistance when you need it.</p>
            <ul className="space-y-2 text-navy-600">
              <li><Link href="/docs/faqs" className="hover:underline">Frequently Asked Questions</Link></li>
              <li><Link href="/docs/support" className="hover:underline">Contact Support</Link></li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer (Optional, for consistency with other pages) */}
      <footer className="bg-gray-800 text-white py-8 px-4 md:px-8 text-center mt-16">
        <p>&copy; {new Date().getFullYear()} Entrestate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DocsPage;
