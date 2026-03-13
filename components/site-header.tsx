"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import { Menu, Tag, HelpCircle, FileText, Info, ChevronDown, Building2 } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

function HeaderCta() {
  return (
    <Button
      asChild
      className="rounded-full bg-lime-400 px-5 text-sm font-semibold text-black hover:bg-lime-300"
    >
      <a href="https://wa.link/rc25na" target="_blank" rel="noopener noreferrer">
        Get a quote
      </a>
    </Button>
  )
}

export function SiteHeader() {
  const [servicesOpen, setServicesOpen] = useState(false)

  const services = [
    {
      href: "/products",
      label: "Ready Websites",
      icon: Building2,
      description: "Launch a real estate site fast",
    },
    {
      href: "/products",
      label: "Brochure to Landing",
      icon: Building2,
      description: "Upload a brochure, get a page",
    },
    {
      href: "/products",
      label: "Instagram DM Agent",
      icon: Building2,
      description: "AI replies that book viewings",
    },
  ]

  const links = [
    { href: "/pricing", label: "Pricing", icon: Tag },
    { href: "/docs", label: "Docs", icon: HelpCircle },
    { href: "/About", label: "About", icon: Info },
  ]

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-5xl px-4">
      <div className="flex h-16 items-center justify-between px-6 liquid-glass-header rounded-full border border-white/10 shadow-2xl backdrop-blur-2xl">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-lime-400 p-1.5 transition-transform group-hover:scale-110">
            <Image src="/icons/skitbit-white.svg" alt="Mashroi logo" width={32} height={32} className="h-full w-full invert" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-lime-300 transition-colors">Mashroi</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white/70 hover:text-white data-[state=open]:text-lime-300 transition-colors">
                  Products
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                    {services.map((service) => (
                      <li key={service.label}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={service.href}
                            className="flex flex-col gap-1 rounded-xl p-3 hover:bg-white/5 hover:ring-1 hover:ring-lime-300/30 transition-all"
                          >
                            <div className="flex items-center gap-2 text-white font-semibold">
                              <service.icon className="h-4 w-4 text-lime-400" />
                              {service.label}
                            </div>
                            <p className="text-xs text-neutral-400 leading-relaxed">{service.description}</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <HeaderCta />
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10 rounded-full">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-neutral-950 border-white/10 text-white p-8">
              <div className="flex flex-col gap-8 mt-8">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Navigation</p>
                  {links.map((link) => (
                    <Link key={link.href} href={link.href} className="block text-2xl font-bold hover:text-lime-300 transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Products</p>
                  {services.map((service) => (
                    <Link key={service.label} href={service.href} className="block text-xl font-semibold hover:text-lime-300 transition-colors">
                      {service.label}
                    </Link>
                  ))}
                </div>
                <HeaderCta />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
                              <div>
                                <div className="text-sm font-medium text-white group-hover:text-lime-300">
                                  {service.label}
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{service.description}</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-lime-300 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex">
            <HeaderCta />
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-700 bg-gray-900/80 text-gray-200 hover:bg-gray-800"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="liquid-glass border-gray-800 p-0 w-64 flex flex-col">
                {/* Brand Header */}
                <div className="flex items-center gap-1.5 px-4 py-4 border-b border-gray-800">
                  <Image src="/icons/skitbit-white.svg" alt="Mashroi logo" width={24} height={24} className="h-6 w-6" />
                  <span className="font-semibold tracking-wide text-white text-lg">Mashroi</span>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 mt-2 text-gray-200">
                  <Collapsible open={servicesOpen} onOpenChange={setServicesOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-900 hover:text-lime-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-5 h-5 text-gray-400">
                          <Building2 className="h-4 w-4" />
                        </span>
                      <span className="text-sm">Products</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col bg-gray-900/50 border-l-2 border-lime-300/30 ml-4">
                        {services.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            className="flex items-center gap-3 pl-8 pr-4 py-2.5 hover:bg-gray-900 hover:text-lime-300 transition-colors"
                          >
                            <service.icon className="h-4 w-4 text-lime-300/70" />
                            <span className="text-sm">{service.label}</span>
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-900 hover:text-lime-300 transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 text-gray-400">
                        <l.icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm">{l.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* CTA Button at Bottom */}
                <div className="mt-auto border-t border-gray-800 p-4">
                  <HeaderCta />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
