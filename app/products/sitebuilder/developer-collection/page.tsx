import React from 'react';
import Link from 'next/link';
import { FunnelShell } from '@/components/public/funnel-shell';
import { Button } from '@/components/ui/button';
import { Building, Award, LineChart, Handshake } from 'lucide-react';

const DeveloperCollectionPage = () => {
  const projects = [
    { name: 'Azure Heights', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Ember Gardens', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Obsidian Tower', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Solstice Residences', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop' },
  ];

  return (
    <FunnelShell>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white text-center px-6 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
        >
          <source src="https://cdn.coverr.co/videos/coverr-a-digital-representation-of-a-city-8404/1080p.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10">
          <h1 
            className="text-4xl md:text-7xl font-bold font-[var(--font-display)]"
          >
            A Testament to Vision
          </h1>
          <p 
            className="mt-4 text-lg max-w-3xl mx-auto text-zinc-300"
          >
            Showcase a developer's entire body of work in a stunning, AI-curated portfolio that tells their story and inspires confidence.
          </p>
          <div 
            className="mt-8"
          >
            <Link href="/builder?template=developer-focus">
              <Button size="lg" className="bg-[#c0c0c0] text-black hover:bg-[#c0c0c0]/90 rounded-full px-10 py-5 text-lg font-bold">
                Build a Developer Showcase
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-[#111111]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-4xl font-bold font-[var(--font-display)] text-white">A Symphony of Projects</h2>
          <div className="mt-16 columns-2 md:columns-3 lg:columns-4 gap-4">
            {projects.map((p, i) => (
              <div key={i} className="mb-4 break-inside-avoid">
                <img src={p.image} alt={p.name} className="w-full h-auto rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-[#191919]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold font-[var(--font-display)] text-white">Build a Legacy of Trust</h2>
              <p className="mt-4 text-lg text-zinc-400">
                A developer's reputation is their most valuable asset. Our portfolio sites are designed to build and reinforce that trust.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-center">
                <Award className="w-10 h-10 text-[#c0c0c0]" />
                <h3 className="mt-4 text-xl font-semibold text-white">Highlight Achievements</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <LineChart className="w-10 h-10 text-[#c0c0c0]" />
                <h3 className="mt-4 text-xl font-semibold text-white">Showcase Growth</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <Handshake className="w-10 h-10 text-[#c0c0c0]" />
                <h3 className="mt-4 text-xl font-semibold text-white">Inspire Confidence</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <Building className="w-10 h-10 text-[#c0c0c0]" />
                <h3 className="mt-4 text-xl font-semibold text-white">Attract Partners</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-32 bg-[#111111]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-5xl font-[var(--font-display)] text-white">Ready to tell your developer's story?</h2>
          <div className="mt-10">
            <Link href="/builder?template=developer-focus">
              <Button size="lg" className="bg-[#c0c0c0] text-black hover:bg-[#c0c0c0]/90 rounded-full px-12 py-6 text-xl font-bold">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default DeveloperCollectionPage;
