import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PublicContactForm } from '@/components/public-contact-form';

interface PublicPageProps {
  params: {
    id: string;
  };
}

export default async function PublicLandingPage({ params }: PublicPageProps) {
  const supabase = await createSupabaseServerClient();
  const { id } = params;

  // Fetch project by ID
  // We use the server client here. Ensure your RLS policies allow public read access 
  // to 'published' projects if you want this to be truly public.
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (!project) {
    notFound();
  }

  const features = Array.isArray(project.features) ? project.features : [];
  // Assuming settings are stored in a JSONB column or similar structure. 
  // If columns are flat, access them directly like project.whatsapp_number
  const settings = project.settings || {};
  const brandColor = settings.brand_color || '#2563eb'; // Default blue
  const brandName = settings.brand_name || 'Entrestate';
  const whatsappNumber = settings.whatsapp_number;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.1),transparent_50%)]" />
        
        <div className="container max-w-4xl mx-auto relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Now Selling
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            {project.headline}
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button 
              className="h-12 px-8 rounded-full text-white font-bold text-lg"
              style={{ backgroundColor: brandColor }}
            >
              Request Info
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-zinc-900/30 border-t border-white/5">
        <div className="container max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature: string, i: number) => (
            <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${brandColor}20`, color: brandColor }}>
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span className="text-lg font-medium text-zinc-200">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6">
        <div className="container max-w-md mx-auto">
          <PublicContactForm projectId={project.id} brandColor={brandColor} />
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 text-center text-zinc-600 text-sm border-t border-white/5">
        <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
        <Link href="/" className="inline-block mt-4 hover:text-zinc-400 transition-colors">
          Powered by Entrestate
        </Link>
      </footer>

      {/* WhatsApp Floating Button */}
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-8 w-8 text-white fill-current" />
        </a>
      )}

      {/* Chat Agent Script (Mock) */}
      {settings.chat_agent_enabled && (
        <div className="fixed bottom-24 right-6 z-40">
           {/* In a real scenario, this would be a script tag injected into the head or body */}
           <div className="bg-white text-black p-3 rounded-xl shadow-xl text-xs font-bold max-w-[200px] animate-in slide-in-from-bottom-4 fade-in duration-700">
              👋 Hi! I'm the {brandName} AI agent. How can I help you with {project.headline}?
           </div>
        </div>
      )}
    </div>
  );
}
