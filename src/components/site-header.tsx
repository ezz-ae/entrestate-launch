'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutGrid, Bot, Hammer, FileText, Home, Menu, X } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/discover', label: 'Market Feed', icon: LayoutGrid },
    { href: '/chat-agent-funnel', label: 'Property Assistant', icon: Bot },
    { href: '/builder-funnel', label: 'Site Builder', icon: Hammer },
    { href: '/docs', label: 'Guides', icon: FileText },
  ];

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden -ml-2 p-2 text-muted-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="text-blue-600">Entrestate</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600",
                pathname === item.href ? "text-blue-600" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/login" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
            Sign In
          </Link>
          <Link href="/start" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90">
            Get Started
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="animate-in slide-in-from-top-5 fixed inset-0 top-16 z-50 bg-background duration-200 md:hidden">
          <nav className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  pathname === item.href 
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <div className="my-4 h-px bg-border" />
            <Link href="/login" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted">
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
