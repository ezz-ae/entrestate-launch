import React from 'react';
import Link from 'next/link';
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
        <div className="relative mx-auto max-w-5xl px-6 py-20 lg:py-28">
            <p className="text-xs uppercase tracking-[0.4em] text-[#7aa5ff]">Project Profile</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-[var(--font-display)] leading-[1.05]">
                {project.title}
            </h1>
            <p className="mt-4 text-lg text-[#b7c3df]">{project.keyDetails}</p>
            
            <div className="mt-8 grid gap-10 lg:grid-cols-2 items-start">
                <div className="space-y-6">
                    <p className="text-base text-[#b7c3df] max-w-xl">{project.summary}</p>
                    <div className="grid gap-3 text-sm text-[#b7c3df]">
                        <p><strong>Location:</strong> {project.location}</p>
                        <p><strong>Payment Plan:</strong> {project.paymentPlan}</p>
                        <p><strong>Status:</strong> {project.completionStatus}</p>
                    </div>

                    <div className="grid gap-3 text-sm">
                        {project.evaluation.map((item) => (
                        <div key={item.label} className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="text-[#b7c3df]">{item.label}</span>
                            <span className="text-[#e8edf7] font-semibold">{item.value}</span>
                        </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <LocationMap projectName={project.title} />
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
            </div>

            <div className="mt-12 text-center">
                <Link
                    href={`/builder?project=${project.id}`}
                    className="inline-flex items-center rounded-xl bg-[#7aa5ff] px-8 py-4 text-base uppercase tracking-[0.2em] font-semibold text-[#0a0f1c]"
                >
                    Generate Landing Page
                </Link>
            </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default ProjectProfilePublicPage;
