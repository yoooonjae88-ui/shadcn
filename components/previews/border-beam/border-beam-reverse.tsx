"use client"

import { BorderBeam } from "@/registry/border-beam/border-beam"

export function BorderBeamReverseExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-xl bg-card p-4 text-sm shadow-sm">
        Clockwise
        <BorderBeam duration={5} />
      </div>
      {/* `reverse` sends it the other way round; `borderWidth` sets how thick
          the ring it travels is. */}
      <div className="relative rounded-xl bg-card p-4 text-sm shadow-sm">
        Anticlockwise, thicker
        <BorderBeam duration={5} reverse borderWidth={3} />
      </div>
    </div>
  )
}
