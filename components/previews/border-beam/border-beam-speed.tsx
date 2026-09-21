"use client"

import { BorderBeam } from "@/registry/border-beam/border-beam"

export function BorderBeamSpeedExample() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* `size` is how long the beam is, `duration` how many seconds a lap
          takes — a short beam on a long lap reads as a slow comet. */}
      <div className="relative rounded-xl bg-card px-5 py-9 text-sm shadow-sm">
        Slow and long
        <BorderBeam size={120} duration={10} />
      </div>
      <div className="relative rounded-xl bg-card px-5 py-9 text-sm shadow-sm">
        Quick and short
        <BorderBeam size={40} duration={4} />
      </div>
    </div>
  )
}
