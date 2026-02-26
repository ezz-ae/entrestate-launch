import React from 'react';
import Link from 'next/link';
import { FunnelShell } from '@/components/public/funnel-shell';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageSquare, Users, Zap, Link2 } from 'lucide-react';

const BioLinkPage = () => {
  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-[#ff9ad5]" />,
      title: 'Instant, AI-Powered Conversations',
      description: "Don't just send followers to a static page. Engage them in a real-time conversation with your AI-powered ChatAgent."
    },
    {
      icon: <Users className="w-8 h-8 text-[#ff9ad5]" />,
      title: 'Automatic Lead Qualification',
      description: "Your ChatAgent will ask qualifying questions and identify the most promising leads, saving them to your 'leads' collection."
    },
    {
      icon: <Zap className="w-8 h-8 text-[#ff9ad5]" />,
      title: 'Works 24/7',
      description: 'Your ChatAgent is always on, ready to engage with your followers and capture leads, even when you\'re sleeping.'
    },
    {
      icon: <Link2 className="w-8 h-8 text-[#ff9ad5]" />,
      title: 'One Link, Unlimited Possibilities',
      description: 'Use your bio link to promote new listings, answer common questions, or run special promotions.'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Create Your Bio Link',
      description: 'Generate a unique bio link in your Entrestate dashboard.'
    },
    {
      step: 2,
      title: 'Add it to Your Instagram Bio',
      description: 'Copy and paste the link into your Instagram profile.'
    },
    {
      step: 3,
      title: 'Engage and Convert',
      description: 'Watch as your followers start engaging with your ChatAgent, and new leads flow into your pipeline.'
    },
  ];

  return (
    <FunnelShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0a0f1c] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,154,213,0.15),_transparent_50%)]" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#ff9ad5]">Smart ChatAgent for Instagram</p>
          <h1 className="mt-4 text-4xl md:text-6xl font-[var(--font-display)] leading-tight">
            The Smartest Link in Your Bio
          </h1>
          <p className="mt-6 text-lg text-zinc-300 max-w-3xl mx-auto">
            Turn your Instagram bio into a lead-generating machine. Our smart bio link connects your followers to an AI-powered ChatAgent that works 24/7 to answer questions, qualify leads, and grow your business.
          </p>
          <div className="mt-10">
            <Link href="/instagram-assistant">
              <Button size="lg" className="h-14 px-10 rounded-full bg-white text-black font-bold text-base uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-white/10 border-0">
                Create Your Free Bio Link
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#0d1425]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-[var(--font-display)] text-white">More Than Just a Link</h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              It's a complete lead generation funnel, right in your Instagram bio.
            </p>
          </div>
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#101829] p-8 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4">
                  {feature.icon}
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                </div>
                <p className="mt-4 text-zinc-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-24 bg-[#0a0f1c]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-[var(--font-display)] text-white">Get Set Up in 3 Simple Steps</h2>
          <div className="mt-12 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" aria-hidden="true" />
            {howItWorks.map((step, index) => (
              <div key={index} className="relative mb-12">
                <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center bg-[#ff9ad5] text-black font-bold rounded-full border-4 border-[#0a0f1c]">
                  {step.step}
                </div>
                <div className={`mt-20 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-zinc-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0d1425]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-[var(--font-display)] text-white">Ready to Supercharge Your Instagram?</h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Create your smart bio link today and start turning followers into leads.
          </p>
          <div className="mt-8">
            <Link href="/instagram-assistant">
              <Button size="lg" className="h-14 px-10 rounded-full bg-white text-black font-bold text-base uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-white/10 border-0">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default BioLinkPage;
