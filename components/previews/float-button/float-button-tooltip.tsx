"use client"

import { LifeBuoy } from "lucide-react"

import { FloatButton } from "@/registry/float-button/float-button"

export function FloatButtonTooltipExample() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-xl bg-muted/40">
      {/* Tooltips open to the left by default — pick another with tooltipSide. */}
      <FloatButton
        position="absolute"
        offset={16}
        type="primary"
        icon={<LifeBuoy />}
        tooltip="Contact support"
        aria-label="Contact support"
      />
    </div>
  )
}
