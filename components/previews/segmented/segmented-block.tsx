"use client"

import { Segmented } from "@/registry/segmented/segmented"

// block makes the control fill its parent width.
export function SegmentedBlockExample() {
  return (
    <div className="w-full max-w-md">
      <Segmented block options={["Daily", "Weekly", "Monthly", "Quarterly"]} />
    </div>
  )
}
