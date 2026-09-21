"use client"

import { BorderBeam } from "@/registry/border-beam/border-beam"

export function BorderBeamPairExample() {
  return (
    <div className="relative w-full rounded-xl bg-card p-6 shadow-sm">
      <p className="text-sm font-medium">Two beams</p>
      <p className="mt-1 text-sm text-muted-foreground">
        A second beam started half a lap along keeps both ends of the card lit.
      </p>

      {/* `initialOffset` is how far round the lap a beam begins, so the pair
          stay exactly opposite each other. */}
      <BorderBeam duration={8} />
      <BorderBeam duration={8} initialOffset={50} />
    </div>
  )
}
