'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block font-bold text-2xl tracking-tight mb-4">
              <span className="text-blue-600">Entrestate</span> OS
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6">
              The operating system for modern real estate entrepreneurs. 
              Connect inventory, capture intent, and close deals with AI.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={Twitter} />
              <SocialLink href="#" icon={Github} />
              <SocialLink href="#" icon={Linkedin} />
              <SocialLink href="#" icon={Instagram} />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/discover" className="hover:text-blue-600 transition-colors">Market Feed</Link></li>
              <li><Link href="/chat-agent-funnel" className="hover:text-blue-600 transition-colors">AI Agents</Link></li>
              <li><Link href="/builder-funnel" className="hover:text-blue-600 transition-colors">Stack Builder</Link></li>
              <li><Link href="/google-ads-public" className="hover:text-blue-600 transition-colors">Intent Engine</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/docs" className="hover:text-blue-600 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Legal</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Entrestate Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <Link 
      href={href} 
      className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all"
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}