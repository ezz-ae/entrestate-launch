"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import YouTubeGrid from "./youtube-grid"

const ACCENT = "#CBB57A"

type ExamplesDialogProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  planName: string
  price: string
  videoIds: string[]
}

export function ExamplesDialog({ open, onOpenChange, planName, price, videoIds }: ExamplesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] border-white/10 bg-[#081225] p-0 text-white sm:rounded-2xl xl:max-w-[1280px]">
        <div className="border-b border-white/10 bg-[#0d1831]/80 px-5 py-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-semibold" style={{ color: ACCENT }}>
              {planName}
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-400">Pricing: {price}</DialogDescription>
          </DialogHeader>
        </div>
        <div className="max-h-[80vh] overflow-auto px-5 py-5 lg:px-6 lg:py-6">
          <YouTubeGrid videoIds={videoIds} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
