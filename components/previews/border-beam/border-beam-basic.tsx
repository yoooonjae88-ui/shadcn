"use client"

import { BorderBeam } from "@/registry/border-beam/border-beam"

export function BorderBeamBasicExample() {
  return (
    // The beam fills its parent and inherits its radius, so the parent just
    // needs `relative` and a corner radius of its own.
    <div className="relative w-full overflow-hidden rounded-xl bg-card p-6 shadow-sm">
      <p className="text-sm font-medium">Pro plan</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Unlimited projects, priority support and a beam around the edge.
      </p>
      <BorderBeam />
    </div>
  )
}
