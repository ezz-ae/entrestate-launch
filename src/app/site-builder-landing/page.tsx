'use client';
import React, { useState } from 'react';
import { FunnelShell } from '@/components/public/funnel-shell';
import { Button } from '@/components/ui/button';
import { Upload, Building, FileText, ArrowRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const SiteBuilderLandingPage = () => {
  const [activeTab, setActiveTab] = useState<'brochure' | 'inventory'>('brochure');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  const inventoryProjects = ["Azure Heights", "Ember Gardens", "Obsidian Tower"];

  return (
    <FunnelShell>
      <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(64,201,198,0.15),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(122,165,255,0.1),_transparent_60%)]" />
        
        <div className="relative w-full max-w-5xl px-6 py-12 lg:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#40c9c6]/10 border border-[#40c9c6]/20 text-[#40c9c6] text-[10px] font-bold uppercase tracking-widest mb-6">
              Site Builder Layer
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-[1.1] text-foreground md:text-6xl">
                Turn inventory into <br/><span className="text-muted-foreground">marketing assets.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Upload a brochure or pick a project from your listings. We organize the details and prepare a page you can share quickly.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-border bg-card/70 shadow-2xl backdrop-blur-sm">
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button 
                onClick={() => setActiveTab('brochure')}
                className={`flex-1 py-6 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'brochure' ? 'bg-muted/50 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Brochure
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 py-6 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-muted/50 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Building className="h-4 w-4" />
                  Pick from Inventory
                </div>
              </button>
            </div>

            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {activeTab === 'brochure' ? (
                  <motion.div
                    key="brochure"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border py-12 transition-colors hover:bg-muted/40"
                  >
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-foreground">Drop your PDF brochure here</h3>
                    <p className="mb-8 text-sm text-muted-foreground">We pull unit types, pricing, and key features from your file.</p>
                    <Button className="h-12 rounded-xl bg-primary px-8 font-bold text-primary-foreground">
                      Select File
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="inventory"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Search 3,500+ UAE projects..." 
                        className="w-full rounded-2xl border border-border bg-background py-4 pl-12 pr-4 text-foreground transition-colors focus:border-[#40c9c6]/50 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {inventoryProjects.map(project => (
                        <button
                          key={project}
                          onClick={() => setSelectedProject(project)}
                          className={`rounded-2xl border p-6 text-left transition-all ${selectedProject === project ? 'border-[#40c9c6]/50 bg-[#40c9c6]/10 ring-1 ring-[#40c9c6]/50' : 'border-border bg-background hover:border-foreground/20'}`}
                        >
                          <h4 className="mb-1 font-bold text-foreground">{project}</h4>
                          <p className="text-xs text-muted-foreground">Dubai Marina</p>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-center pt-4">
                      <Button 
                        disabled={!selectedProject}
                        className="bg-[#40c9c6] text-black font-bold px-10 h-14 rounded-2xl shadow-xl shadow-[#40c9c6]/20 disabled:opacity-50"
                      >
                        Build Site <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have a file? <Link href="/builder?type=landing-page" className="font-medium text-foreground underline">Start from a blank template</Link> or <button className="font-medium text-foreground underline">describe your idea</button>.
            </p>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default SiteBuilderLandingPage;
