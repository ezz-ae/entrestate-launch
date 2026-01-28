import React from 'react';
import { Layout, Zap, Database, CreditCard, Check, ArrowRight, Layers } from 'lucide-react';

const BuilderFunnel = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* 1. Hero */}
      <header className="bg-white pt-24 pb-20 px-6 border-b">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-bold">
            No Coding Required
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Build Real Estate Lead Pages <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">in Minutes</span>
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            Drag, drop, and sell. Connect your domain, pull inventory from our database, and start running ads today.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
              Start Building Free
            </button>
            <button className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all">
              View Templates
            </button>
          </div>
        </div>
      </header>

      {/* 2. 4 Ways to Start */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Database, title: "Choose Project", desc: "Select 'Emaar Beachfront' and we auto-fill images & copy." },
            { icon: UploadIcon, title: "Upload Brochure", desc: "AI extracts floor plans and pricing from your PDF." },
            { icon: Layout, title: "Use Template", desc: "Pick from 50+ high-converting real estate layouts." },
            { icon: Zap, title: "AI Generator", desc: "Type 'Luxury villa in Palm Jumeirah' and watch it build." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <item.icon size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Inventory Integration */}
      <section className="py-20 bg-gray-900 text-white px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">3,750+ Projects Integrated</h2>
            <p className="text-gray-400 text-lg mb-8">
              Stop downloading images from Google. Our builder connects directly to the Dubai Land Department and Developer data.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Check className="text-green-400" /> <span>High-res developer renders</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-green-400" /> <span>Verified floor plans</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-green-400" /> <span>Up-to-date payment plans</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500 ml-auto">Data Source: Emaar</span>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-32 bg-gray-700 rounded w-full"></div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-20 bg-gray-700 rounded"></div>
                <div className="h-20 bg-gray-700 rounded"></div>
                <div className="h-20 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">One Price. Unlimited Pages.</h2>
        <div className="bg-white max-w-md mx-auto rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-10">
            <h3 className="text-gray-500 font-medium mb-2">Builder Pro</h3>
            <div className="text-5xl font-bold text-gray-900 mb-2">AED 150<span className="text-lg text-gray-400 font-normal">/mo</span></div>
            <p className="text-sm text-gray-400 mb-8">Billed monthly. Cancel anytime.</p>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mb-6 transition-colors">
              Start Building Now
            </button>
            
            <div className="space-y-3 text-left text-sm text-gray-600">
              <div className="flex gap-2"><Check size={16} className="text-blue-600" /> Unlimited Landing Pages</div>
              <div className="flex gap-2"><Check size={16} className="text-blue-600" /> Free Hosting (yourname.entrestate.com)</div>
              <div className="flex gap-2"><Check size={16} className="text-blue-600" /> Connect Custom Domains</div>
              <div className="flex gap-2"><Check size={16} className="text-blue-600" /> Remove "Made with Entrestate" Badge</div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 text-xs text-gray-500">
            Includes 14-day money-back guarantee
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white text-center px-6">
        <h2 className="text-3xl font-bold mb-6">Stop losing leads to bad websites.</h2>
        <button className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
          Launch Your First Page
        </button>
      </section>
    </div>
  );
};

// Helper icon for the grid
const UploadIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default BuilderFunnel;