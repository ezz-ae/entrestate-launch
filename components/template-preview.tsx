"use client"

import { WebsiteRenderer } from "@/components/block-renderer"
import type { Website } from "@/components/types"

export function TemplatePreview({ website }: { website: Website }) {
  return (
    <div className="min-h-screen bg-white">
      <WebsiteRenderer website={website} />
    </div>
  )
}
