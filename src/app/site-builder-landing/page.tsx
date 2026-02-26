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
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] text-white mb-6">
                Turn inventory into <br/><span className="text-zinc-500">marketing assets.</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Upload a brochure or pick a project from live inventory. We extract the data and build a high-conversion landing page in seconds.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button 
                onClick={() => setActiveTab('brochure')}
                className={`flex-1 py-6 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'brochure' ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Brochure
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 py-6 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
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
                    className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/10 rounded-3xl hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Drop your PDF brochure here</h3>
                    <p className="text-zinc-500 text-sm mb-8">The system extracts unit types, pricing, and features.</p>
                    <Button className="bg-white text-black font-bold px-8 h-12 rounded-xl">
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
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="Search 3,500+ UAE projects..." 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#40c9c6]/50 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {inventoryProjects.map(project => (
                        <button
                          key={project}
                          onClick={() => setSelectedProject(project)}
                          className={`p-6 rounded-2xl border text-left transition-all ${selectedProject === project ? 'bg-[#40c9c6]/10 border-[#40c9c6]/50 ring-1 ring-[#40c9c6]/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                        >
                          <h4 className="font-bold text-white mb-1">{project}</h4>
                          <p className="text-xs text-zinc-500">Dubai Marina</p>
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
            <p className="text-zinc-500 text-sm">
              Don't have a file? <Link href="/builder?type=landing-page" className="text-white underline font-medium">Start from a blank template</Link> or <button className="text-white underline font-medium">describe your idea</button>.
            </p>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default SiteBuilderLandingPage;
