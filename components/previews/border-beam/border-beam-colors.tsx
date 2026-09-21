"use client"

import { BorderBeam } from "@/registry/border-beam/border-beam"

export function BorderBeamColorsExample() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Left to itself the beam uses the --border-beam-* tokens; pass
          `colorFrom` / `colorTo` for a one-off pair. */}
      <div className="relative rounded-xl bg-card px-5 py-9 text-sm shadow-sm">
        Theme tokens
        <BorderBeam />
      </div>
      <div className="relative rounded-xl bg-card px-5 py-9 text-sm shadow-sm">
        A pair of its own
        <BorderBeam
          colorFrom="var(--color-emerald-400)"
          colorTo="var(--color-sky-500)"
        />
      </div>
    </div>
  )
}
