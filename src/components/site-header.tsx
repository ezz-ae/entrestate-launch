'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
  Sparkles,
  User,
  Menu,
  X,
  ArrowRight,
  Target,
  Library,
  LifeBuoy,
  UploadCloud,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EntrestateLogo } from './icons';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useBrochure } from '@/context/BrochureContext';

const PRODUCT_GROUPS = [
  {
    title: 'SiteBuilder',
    items: [
      { href: '/site-builder-landing', label: 'Landing Page' },
      { href: '/builder?template=full-company', label: 'Brokerage Company Site' },
      { href: '/builder?template=template-ads-launch', label: 'Listing Site' },
      { href: '/builder?template=developer-focus', label: 'Developer Collection' },
      { href: '/chat-agent-public', label: 'ChatAgent Site' },
      { href: '/builder?template=template-roadshow', label: 'Launch Event Site' },
    ],
  },
  {
    title: 'ChatAgent',
    items: [
      { href: '/instagram-assistant-public', label: 'Instagram DM' },
      { href: '/instagram-assistant', label: 'Instagram Bio Link' },
      { href: '/dashboard/chat-agent', label: 'Real Estate Expert' },
      { href: '/dashboard/chat-agent/learning', label: 'Branding & Learning' },
    ],
  },
  {
    title: 'Lead Generation',
    items: [
      { href: '/google-ads-public', label: 'Google Ads' },
      { href: '/dashboard/meta-audience', label: 'Lookalike Audience' },
      { href: '/dashboard/marketing', label: 'Smart Targeting' },
      { href: '/dashboard/leads/cold-calling', label: 'Lead Cold Calling' },
      { href: '/dashboard/leads', label: 'Lead Validating' },
      { href: '/lead-pipeline-overview', label: 'Lead Pipe' },
    ],
  },
  {
    title: 'Smart Sender',
    items: [
      { href: '/dashboard/sms-marketing', label: 'SMS Sender' },
      { href: '/dashboard/email-marketing', label: 'Email Campaign' },
      { href: '/dashboard/email-marketing', label: 'Smart Email Plans' },
    ],
  },
  {
    title: 'Inventory',
    items: [
      { href: '/discover', label: 'Market Inventory' },
      { href: '/discover', label: 'Top Marketing Projects' },
      { href: '/discover', label: 'Dubai Market' },
      { href: '/discover', label: 'Abu Dhabi Market' },
      { href: '/discover', label: 'Investment Map' },
      { href: '/discover', label: 'Market Overview' },
    ],
  },
];

const RESOURCE_LINKS = [
  { href: '/docs', label: 'Documentation', icon: Library },
  { href: '/support', label: 'Support', icon: LifeBuoy },
  { href: '/status', label: 'Smart System', icon: Sparkles },
  { href: '/blog', label: 'Articles', icon: Briefcase },
  { href: '/trending', label: 'Market Updates', icon: TrendingUp },
];

export function SiteHeader() {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<'products' | 'resources' | null>(null);
  const { user, logOut } = useAuth();
  const { setBrochureFile } = useBrochure();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showBrochureUpload = pathname === '/' || pathname === '/site-builder-landing' || pathname === '/builder-funnel';

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleHeaderUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBrochureFile(file);
      // Directly open the builder
      router.push('/builder');
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 z-[100] w-full transition-all duration-500",
        isScrolled 
          ? "h-16 bg-black/80 backdrop-blur-2xl border-b border-white/10" 
          : "h-20 bg-transparent border-b border-transparent"
      )}
    >
      <div className="container h-full flex items-center justify-between px-4 md:px-6 max-w-[1800px]">
        
        <div className="flex items-center gap-10">
          <Link href="/" className="group flex items-center gap-2">
            <EntrestateLogo className="scale-90" />
          </Link>
          
          <nav className="hidden xl:flex items-center space-x-6">
            <button
              onMouseEnter={() => setOpenMenu('products')}
              onMouseLeave={() => setOpenMenu((prev) => (prev === 'products' ? null : prev))}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all"
            >
              Products
            </button>
            <button
              onMouseEnter={() => setOpenMenu('resources')}
              onMouseLeave={() => setOpenMenu((prev) => (prev === 'resources' ? null : prev))}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all"
            >
              Resources
            </button>
            <Link
              href="/discover"
              className={cn(
                "text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-white",
                pathname.startsWith('/discover') ? "text-white border-b border-white/40 pb-1" : "text-zinc-500"
              )}
            >
              Inventory
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {showBrochureUpload && (
            <>
              {/* Brochure upload belongs only on builder entry surfaces */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={handleHeaderUpload}
              />
              <Button
                variant="ghost"
                className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="h-4 w-4" />
                Upload brochure
              </Button>
            </>
          )}

          {/* Auth bypassed for testing */}
          {true || user ? (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                  <Button className="h-10 px-6 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 group border-0">
                      Dashboard <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
              </Link>
              <Link href="/profile" className="hidden lg:block">
                  <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-zinc-500 hover:text-white hover:bg-white/5">
                      <User className="h-5 w-5" />
                  </Button>
              </Link>
            </>
          ) : (
            <Link href="/start" className="hidden sm:block">
                <Button className="h-10 px-6 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 group border-0">
                    Get Started <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
          )}

            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-all z-[120]"
            >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-5 w-5" />}
            </button>
        </div>
      </div>

      <AnimatePresence>
        {(openMenu === 'products' || openMenu === 'resources') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onMouseEnter={() => setOpenMenu(openMenu)}
            onMouseLeave={() => setOpenMenu(null)}
            className="hidden xl:block absolute top-full left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/10"
          >
            <div className="max-w-[1400px] mx-auto px-8 py-10 grid grid-cols-5 gap-8">
              {openMenu === 'products' && PRODUCT_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-4">{group.title}</p>
                  <div className="flex flex-col gap-3">
                    {group.items.map((item) => (
                      <Link key={item.href + item.label} href={item.href} className="text-sm text-white/90 hover:text-white">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {openMenu === 'resources' && (
                <div className="col-span-5 grid grid-cols-3 gap-6">
                  {RESOURCE_LINKS.map((item) => (
                    <Link key={item.href} href={item.href} className="rounded-2xl border border-white/10 p-4 text-sm text-white/90 hover:text-white">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-zinc-400" />
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
        {isMobileMenuOpen && (
          <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[105] xl:hidden"
            />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full sm:w-[400px] z-[110] bg-zinc-950 border-l border-white/10 xl:hidden flex flex-col h-screen"
            >
                <div className="flex-1 overflow-y-auto px-6 pt-24 pb-12">
                    <div className="space-y-10">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6 px-1">Products</p>
                            <div className="space-y-6">
                              {PRODUCT_GROUPS.map((group) => (
                                <div key={group.title}>
                                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">{group.title}</p>
                                  <div className="grid grid-cols-2 gap-3">
                                    {group.items.map((item) => (
                                      <Link
                                        key={item.href + item.label}
                                        href={item.href}
                                        className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-zinc-300 hover:text-white"
                                      >
                                        {item.label}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6 px-1">Resources</p>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  {RESOURCE_LINKS.map((item) => (
                                    <Link key={item.href} href={item.href} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                        <item.icon className="h-5 w-5 text-zinc-500" />
                                        <span className="text-xs font-bold text-zinc-300">{item.label}</span>
                                    </Link>
                                  ))}
                                </div>
                                <Link href={true || user ? "/dashboard" : "/start"} className="block">
                                    <div className="p-6 rounded-[1.5rem] bg-blue-600 text-white shadow-xl shadow-blue-600/20 group">
                                        <div className="flex items-center justify-between mb-3">
                                            <Target className="h-5 w-5" />
                                            <ArrowRight className="h-4 w-4 opacity-50" />
                                        </div>
                                        <h4 className="text-lg font-bold tracking-tight">{true || user ? "Dashboard" : "Get Started"}</h4>
                                        <p className="text-blue-100/60 text-[10px] font-bold uppercase tracking-widest">Your Workspace</p>
                                    </div>
                                </Link>
                                {(true || user) && (
                                  <Link href="/profile" className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                      <User className="h-5 w-5 text-zinc-500" />
                                      <span className="text-xs font-bold text-zinc-300">Profile</span>
                                  </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl">
                    {true || user ? (
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                                {(user?.email || 'DE').substring(0, 2).toUpperCase()}
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-xs truncate">{user?.displayName || user?.email?.split('@')[0] || 'Demo User'}</p>
                                <p className="text-zinc-600 text-[10px] truncate">{user?.email || 'demo@entrestate.com'}</p>
                             </div>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600" onClick={handleLogOut}>
                                <X className="h-4 w-4" />
                             </Button>
                        </div>
                    ) : (
                        <Link href="/start">
                            <Button className="w-full h-14 rounded-xl bg-white text-black font-bold text-sm uppercase tracking-widest shadow-xl border-0">
                                Get Started Free
                            </Button>
                        </Link>
                    )}
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
