import React from 'react';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { ColdCallDemoCard } from '@/components/public/cold-call-demo-card';
import { BrochureUploadCard } from '@/components/public/brochure-upload-card';
import { FunnelShell } from '@/components/public/funnel-shell';

const LocationMap = ({ projectName }: { projectName: string }) => (
  <div className="w-full h-64 rounded-2xl border border-white/10 bg-[#14110f] flex items-center justify-center text-[#8f8477] text-sm">
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
  };

  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(199,163,107,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(88,103,124,0.25),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#c7a36b]">Project Profile</p>
              <h1 className="mt-4 text-4xl md:text-5xl font-[var(--font-display)] leading-[1.05]">
                {project.title}
              </h1>
              <p className="mt-4 text-sm text-[#b6aca0]">{project.keyDetails}</p>
              <p className="mt-6 text-base text-[#b6aca0] max-w-xl">{project.summary}</p>
              <div className="mt-8 grid gap-3 text-sm text-[#b6aca0]">
                <p>Location: {project.location}</p>
                <p>Payment Plan: {project.paymentPlan}</p>
                <p>Status: {project.completionStatus}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <ChatDemoCard
                title="Chat about this property"
                intro={`Ask anything about ${project.title}. I will answer with listing context.`}
                placeholder="Ask about availability, price, or amenities..."
                buttonLabel="Start Chat"
                context={`Project profile public demo: ${project.title}`}
                endpoint="/api/agent/demo"
              />
              <ColdCallDemoCard
                title="Request a call preview"
                buttonLabel="Show Call Preview"
                topics={[
                  { value: 'property-details', label: 'Property Details' },
                  { value: 'viewing-schedule', label: 'Schedule a Viewing' },
                  { value: 'payment-options', label: 'Payment Options' },
                ]}
                context={`Project profile call preview: ${project.title}`}
              />
              <BrochureUploadCard
                title="Upload a brochure"
                description="Add documents and generate a richer summary."
                ctaLabel="Upload Brochure"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0f0e0c]">
        <div className="mx-auto max-w-6xl px-6 py-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#14110f] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#c7a36b]">Amenities</p>
            <div className="mt-4 grid gap-3">
              {project.amenities.map((amenity) => (
                <div key={amenity.text} className="flex items-center gap-3 text-sm text-[#f5f1e8]">
                  <span>{amenity.icon}</span>
                  <span>{amenity.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#14110f] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#c7a36b]">Location</p>
            <div className="mt-4">
              <LocationMap projectName={project.title} />
            </div>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default ProjectProfilePublicPage;
