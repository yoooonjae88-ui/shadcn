"use client"

import { BorderBeam } from "@/registry/border-beam/border-beam"

export function BorderBeamControlsExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Nothing to set on a small control: a browser clamps the lap's
          rounding to half the box, so on anything this short the beam simply
          orbits it. */}
      <button
        type="button"
        className="relative rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Upgrade
        <BorderBeam size={24} duration={4} />
      </button>

      <span className="relative inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
        Beta
        <BorderBeam size={16} duration={4} borderWidth={1} />
      </span>
    </div>
  )
}
