"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

export function LogoMarquee() {
  const [pausedRow, setPausedRow] = useState<string | null>(null)

  const logos = [
    { name: "VK", image: "/icons/Supp.png" },
    { name: "TechCrunch", image: "/icons/SHKUP.png" },
    { name: "MailChimp", image: "/icons/Persona.png" },
    { name: "ESJ", image: "/icons/HFFB.png" },
    { name: "Palladio", image: "/icons/Palladio.png" },
    { name: "Victorinox", image: "/icons/Victorinox.png" },
    { name: "Trump", image: "/icons/Trumpp.png" },
    { name: "Poedagar", image: "/icons/Poedagarr.png" },
  ]

  const secondRowLogos = [
    { name: "Kami", image: "/icons/Kami.png" },
    { name: "Neemans", image: "/icons/NEEMANS.png" },
    { name: "Flick", image: "/icons/FLICK.png" },
    { name: "Vandelay", image: "/icons/Vandelay.png" },
    { name: "KejbyKej", image: "/icons/KEJBYKEJ.png" },
    { name: "Skinny", image: "/icons/Skinny.png" },
    { name: "Rico", image: "/icons/RICO.png" },
    { name: "Skyborne", image: "/icons/Skyborne.png" },
  ]

  const LogoCard = ({ logo, rowId }: { logo: any; rowId: string }) => (
    <div
      className="flex-shrink-0 mx-4"
      onMouseEnter={() => setPausedRow(rowId)}
      onMouseLeave={() => setPausedRow(null)}
    >
      <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-2xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-lime-400/30 hover:shadow-[0_0_30px_rgba(132,204,22,0.1)] group">
        <div className="relative w-2/3 h-2/3 transition-transform duration-500 group-hover:scale-110">
          <Image
            src={logo.image || "/placeholder.svg"}
            alt={logo.name}
            fill
            className="object-contain filter grayscale brightness-200 opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all"
            sizes="(min-width: 1024px) 128px, (min-width: 640px) 112px, 96px"
          />
        </div>
      </div>
    </div>
  )

  return (
    <section className="text-white py-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lime-400/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="flex flex-col items-center justify-between mb-16 sm:flex-row sm:items-end">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80 mb-4">Trusted By</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Powering <span className="text-lime-300">elite</span>
              <br />
              real estate teams
            </h2>
          </div>
          <Button
            variant="outline"
            asChild
            className="mt-8 sm:mt-0 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 px-8 py-6"
          >
            <Link href="/About">Our Story</Link>
          </Button>
        </div>

        {/* Logo Marquee */}
        <div className="relative space-y-8">
          {/* First Row - Scrolling Right */}
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div
              className={`flex animate-scroll-right whitespace-nowrap`}
              style={{
                animationPlayState: pausedRow === "first" ? "paused" : "running",
                width: "max-content",
              }}
            >
              {[...logos, ...logos, ...logos].map((logo, index) => (
                <LogoCard key={`first-${index}`} logo={logo} rowId="first" />
              ))}
            </div>
          </div>

          {/* Second Row - Scrolling Left */}
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div
              className={`flex animate-scroll-left whitespace-nowrap`}
              style={{
                animationPlayState: pausedRow === "second" ? "paused" : "running",
                width: "max-content",
              }}
            >
              {[...secondRowLogos, ...secondRowLogos, ...secondRowLogos].map((logo, index) => (
                <LogoCard key={`second-${index}`} logo={logo} rowId="second" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
