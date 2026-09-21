"use client"

import { BorderBeam } from "@/registry/border-beam/border-beam"

export function BorderBeamControlsExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* On a small control, match `radius` to the control's own corner so the
          beam hugs it. A pill needs no more than half its height. */}
      <button
        type="button"
        className="relative rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Upgrade
        <BorderBeam size={40} duration={4} radius={8} />
      </button>

      <span className="relative inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
        Beta
        <BorderBeam size={28} duration={4} radius={12} borderWidth={1} />
      </span>
    </div>
  )
}
