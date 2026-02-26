import React from 'react';
import Link from 'next/link';
import { FunnelShell } from '@/components/public/funnel-shell';
import { Button } from '@/components/ui/button';
import { Database, Users, Zap, Layout } from 'lucide-react';

const BrokeragePage = () => {
  const features = [
    {
      title: 'Dynamic Inventory',
      description: 'Your site is a living entity, constantly updated in real-time from your inventory collections. Never show an outdated listing again.',
      visual: <div className="w-full h-full bg-gradient-to-br from-[#007CF0] to-[#00DFD8] rounded-lg" />
    },
    {
      title: 'AI-Crafted Narratives',
      description: 'Our Gemini-powered AI doesn\'t just write copy; it tells the story of your brokerage and your listings, engaging buyers on an emotional level.',
      visual: <div className="w-full h-full bg-gradient-to-br from-[#7928CA] to-[#FF0080] rounded-lg" />
    },
    {
      title: 'Agent-Centric Design',
      description: 'Empower your agents with beautiful, professional profiles that are automatically generated and updated from your agent data.',
      visual: <div className="w-full h-full bg-gradient-to-br from-[#FF4D4D] to-[#F9CB28] rounded-lg" />
    }
  ];

  return (
    <FunnelShell>
      {/* Hero Section */}
      <section className="h-screen w-full relative flex items-center justify-center text-white text-center px-6 overflow-hidden bg-[#0a0f1c]">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-7xl font-bold font-[var(--font-display)]">
            The OS for Your Brokerage
          </h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-zinc-300">
            An AI-powered, data-driven website that automates your marketing, syncs with your inventory, and works as the central hub for your entire operation.
          </p>
          <div className="mt-8">
            <Link href="/builder?template=full-company">
              <Button size="lg" className="bg-[#007CF0] text-white hover:bg-[#007CF0]/90 rounded-full px-10 py-5 text-lg font-bold">
                Build Your OS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="py-24 bg-[#0a0f1c]">
        {features.map((feature, index) => (
          <section key={index} className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
              <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                <h2 className="text-4xl font-bold font-[var(--font-display)] text-white">{feature.title}</h2>
                <p className="mt-4 text-lg text-zinc-400">{feature.description}</p>
              </div>
              <div className="w-full h-80">
                {feature.visual}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* How it Works Section */}
      <section className="py-24 bg-[#0d1425]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold font-[var(--font-display)] text-white">Get Your Smart Site in 3 Simple Steps</h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="p-8 border border-white/10 rounded-lg">
              <h3 className="text-2xl font-bold">1. Connect Your Data</h3>
              <p className="mt-4 text-zinc-400">Link your inventory and agent data. This is a one-time setup that takes just a few minutes.</p>
            </div>
            <div className="p-8 border border-white/10 rounded-lg">
              <h3 className="text-2xl font-bold">2. Choose a Template</h3>
              <p className="mt-4 text-zinc-400">Select one of our professionally designed templates, or let our AI create a custom design for you.</p>
            </div>
            <div className="p-8 border border-white/10 rounded-lg">
              <h3 className="text-2xl font-bold">3. Publish &amp; Go Live</h3>
              <p className="mt-4 text-zinc-400">Publish your site to a custom domain or a free subdomain and start generating leads.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-24 bg-[#0a0f1c]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold font-[var(--font-display)] text-white">A Style for Every Brokerage</h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-80 bg-gradient-to-br from-[#007CF0] to-[#00DFD8] rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white">Modern</h3>
            </div>
            <div className="h-80 bg-gradient-to-br from-[#7928CA] to-[#FF0080] rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white">Elegant</h3>
            </div>
            <div className="h-80 bg-gradient-to-br from-[#FF4D4D] to-[#F9CB28] rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white">Bold</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Blocks Section */}
      <section className="py-24 bg-[#0d1425]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold font-[var(--font-display)] text-white">Build Your Site, Your Way</h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Our builder is packed with all the blocks you need to create a stunning and effective website.
          </p>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
            <div className="p-8 border border-white/10 rounded-lg">
              <h3 className="text-2xl font-bold">Listings</h3>
            </div>
            <div className="p-8 border border-white/10 rounded-lg">
              <h3 className="text-2xl font-bold">Agents</h3>
            </div>
            <div className="p-8 border border-white/10 rounded-lg">
              <h3 className="text-2xl font-bold">Testimonials</h3>
            </div>
            <div className="p-8 border border-white/10 rounded-lg">
              <h3 className="text-2xl font-bold">Contact Forms</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-[#0a0f1c]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-2xl font-semibold text-white">"Entrestate has transformed our online presence. We're getting more leads than ever before, and our agents love how easy it is to use."</p>
          <p className="mt-6 text-lg font-semibold text-[#007CF0]">- Sarah Johnson, CEO of Apex Realty</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#0d1425]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-5xl font-[var(--font-display)] text-white">The last website you'll ever need.</h2>
          <p className="mt-6 text-xl text-zinc-400 max-w-2xl mx-auto">
            Ready to upgrade your brokerage?
          </p>
          <div className="mt-10">
            <Link href="/builder?template=full-company">
              <Button size="lg" className="bg-[#007CF0] text-white hover:bg-[#007CF0]/90 rounded-full px-12 py-6 text-xl font-bold">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default BrokeragePage;

