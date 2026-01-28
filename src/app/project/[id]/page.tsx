import React from 'react';
import { FunnelShell } from '@/components/public/funnel-shell';

const LocationMap = ({ projectName }: { projectName: string }) => (
  <div className="w-full h-64 rounded-2xl border border-white/10 bg-[#101829] flex items-center justify-center text-[#94a3b8] text-sm">
    [Interactive Map for {projectName}]
  </div>
);

const ProjectProfilePublicPage = ({ params }: { params: { id: string } }) => {
  const project = {
    id: params.id,
    title: 'Skyline Residences - Unit 1402',
    keyDetails: '3 Bed, 4 Bath, 2,500 sqft. | Downtown Dubai | AED 3.2M',
    summary:
      'A meticulously designed unit offering panoramic city views and premium amenities. Ideal for discerning buyers.',
    location: 'Business Bay, Dubai',
    paymentPlan: '25% Down, 75% Post-Handover (3 years)',
    completionStatus: 'Ready for Occupancy',
    amenities: [
      { icon: '🏊', text: 'Infinity Pool & Fitness Center' },
      { icon: '🚗', text: '2 Dedicated Parking Spaces' },
      { icon: '🛎️', text: '24/7 Security & Concierge' },
      { icon: '🌆', text: 'Panoramic City Views' },
      { icon: '🌳', text: 'Landscaped Gardens' },
      { icon: '🍽️', text: 'Gourmet Dining Options Nearby' },
    ],
    evaluation: [
      { label: 'Price', value: 'AED 3,200,000' },
      { label: 'Service charges', value: 'AED 25,000 / year' },
      { label: 'Delivery', value: 'Ready for occupancy' },
    ],
  };

  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(122,165,255,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(64,201,198,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#7aa5ff]">Project Profile</p>
              <h1 className="mt-4 text-4xl md:text-5xl font-[var(--font-display)] leading-[1.05]">
                {project.title}
              </h1>
              <p className="mt-4 text-sm text-[#b7c3df]">{project.keyDetails}</p>
              <p className="mt-6 text-base text-[#b7c3df] max-w-xl">{project.summary}</p>
              <div className="mt-8 grid gap-3 text-sm text-[#b7c3df]">
                <p>Location: {project.location}</p>
                <p>Payment Plan: {project.paymentPlan}</p>
                <p>Status: {project.completionStatus}</p>
              </div>
              <div className="mt-8 grid gap-3 text-sm text-[#b7c3df]">
                {project.evaluation.map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>{item.label}</span>
                    <span className="text-[#e8edf7]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#101829] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[#7aa5ff]">Decision view</p>
                <p className="mt-4 text-sm text-[#b7c3df]">
                  Evaluate price, payment plan, and completion status before you call anyone. This page is the neutral view of the deal.
                </p>
              </div>
              <LocationMap projectName={project.title} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b1222]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-2xl border border-white/10 bg-[#101829] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7aa5ff]">Amenities</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {project.amenities.map((amenity) => (
                <div key={amenity.text} className="flex items-center gap-3 text-sm text-[#e8edf7]">
                  <span>{amenity.icon}</span>
                  <span>{amenity.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default ProjectProfilePublicPage;
