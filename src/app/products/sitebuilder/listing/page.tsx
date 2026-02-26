'use client';
import React from 'react';
import Link from 'next/link';
import { FunnelShell } from '@/components/public/funnel-shell';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Gem, Home, Layers, BarChart, ExternalLink } from 'lucide-react';

const ListingPage = () => {
  const blocks = ['Gallery', 'Details', 'Map', 'Contact'];
  const [activeBlock, setActiveBlock] = React.useState('Gallery');

  return (
    <FunnelShell>
      {/* Hero Section */}
      <section className="relative bg-[#0a0f1c] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-32 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold tracking-tight sm:text-6xl font-[var(--font-display)]"
          >
            The Future of Property Marketing is Here
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-zinc-300 max-w-3xl mx-auto"
          >
            Go beyond static listings. Create intelligent, interactive, and high-converting websites for every property in your portfolio, powered by Google's Gemini.
          </motion.p>
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10"
          >
            <Link href="/builder?template=template-ads-launch">
              <Button size="lg" className="bg-[#00d09c] text-black hover:bg-[#00d09c]/90 rounded-full px-8 py-4 text-base font-bold">
                Generate a Smart Site
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Powered by Gemini Section */}
      <section className="py-24 bg-[#0d1425]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="text-center md:text-left">
              <Gem className="w-16 h-16 text-[#00d09c] mx-auto md:mx-0" />
              <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Powered by Gemini</h2>
              <p className="mt-4 text-lg text-zinc-400">
                Entrestate's listing sites are built on Google's most advanced AI. This allows us to create websites that are not only beautiful but also intelligent, persuasive, and effective.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-zinc-300 p-4 border border-white/10 rounded-lg"><strong>AI-Generated Narratives:</strong> Gemini crafts compelling stories for each property.</p>
              <p className="text-zinc-300 p-4 border border-white/10 rounded-lg"><strong>Smart Lead Insights:</strong> Understand your leads better with AI-powered analysis.</p>
              <p className="text-zinc-300 p-4 border border-white/10 rounded-lg"><strong>Personalized Experiences:</strong> The site adapts to each visitor, showing them the most relevant information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Builder Showcase */}
      <section className="py-24 bg-[#0a0f1c]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Your Vision, Realized Instantly</h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Our intuitive builder makes it easy to create the perfect site.
          </p>
          <div className="mt-12 flex justify-center space-x-4">
            {blocks.map(block => (
              <button 
                key={block} 
                onClick={() => setActiveBlock(block)} 
                className={`px-4 py-2 rounded-full font-semibold ${activeBlock === block ? 'bg-[#00d09c] text-black' : 'bg-white/10 text-white'}`}
              >
                {block}
              </button>
            ))}
          </div>
          <div className="mt-8 h-96 w-full max-w-4xl mx-auto bg-[#0d1425] rounded-lg p-8 border border-white/10">
            <p className="text-white text-2xl">{activeBlock} Block Preview</p>
          </div>
        </div>
      </section>

      {/* Google Analytics Section */}
       <section className="py-24 bg-[#0d1425]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
             <h2 className="text-3xl font-bold text-white sm:text-4xl">Google-Powered Analytics</h2>
             <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              Track your success with our built-in, Google-powered analytics dashboard.
            </p>
          </div>
          <div className="mt-12 w-full max-w-4xl mx-auto bg-[#0a0f1c] rounded-lg p-8 border border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
                  <div><p className="text-3xl font-bold">1,234</p><p className="text-zinc-400">Page Views</p></div>
                  <div><p className="text-3xl font-bold">56</p><p className="text-zinc-400">Leads</p></div>
                  <div><p className="text-3xl font-bold">12%</p><p className="text-zinc-400">Conversion Rate</p></div>
                  <div><p className="text-3xl font-bold">2m 34s</p><p className="text-zinc-400">Avg. Time on Page</p></div>
              </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-32 bg-[#0a0f1c]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-5xl font-[var(--font-display)] text-white">Stop Selling. Start Storytelling.</h2>
          <div className="mt-10">
            <Link href="/builder?template=template-ads-launch">
              <Button size="lg" className="bg-[#00d09c] text-black hover:bg-[#00d09c]/90 rounded-full px-12 py-6 text-xl font-bold">
                Generate Your First Smart Site
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default ListingPage;

