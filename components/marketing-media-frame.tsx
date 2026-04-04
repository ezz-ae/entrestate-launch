import Image from "next/image"

import { cn } from "@/lib/utils"

type MarketingMediaFrameProps = {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  fit?: "contain" | "cover"
  chrome?: boolean
  className?: string
  contentClassName?: string
  imageClassName?: string
}

export function MarketingMediaFrame({
  src,
  alt,
  sizes,
  priority = false,
  fit = "contain",
  chrome = true,
  className,
  contentClassName,
  imageClassName,
}: MarketingMediaFrameProps) {
  return (
    <div className={cn("relative isolate h-full w-full overflow-hidden bg-[#0d1831]", className)}>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        className="scale-110 object-cover opacity-30 blur-2xl saturate-[0.75]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(203,181,122,0.18),transparent_48%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-[#102347]/10 to-[#081225]/82" />

      {chrome && (
        <div className="absolute inset-x-4 top-4 z-10 flex h-7 items-center gap-2 rounded-full border border-white/10 bg-[#081225]/70 px-3 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-white/35" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <div className="ml-2 h-2 flex-1 rounded-full bg-white/10" />
        </div>
      )}

      <div className={cn("absolute inset-0", chrome ? "p-4 pt-12" : "p-4", contentClassName)}>
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={cn(fit === "cover" ? "object-cover" : "object-contain", imageClassName)}
          />
        </div>
      </div>

      <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
    </div>
  )
}
