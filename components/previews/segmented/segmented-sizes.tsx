"use client"

import { Segmented } from "@/registry/segmented/segmented"

export function SegmentedSizesExample() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Segmented size="large" options={["Daily", "Weekly", "Monthly"]} />
      <Segmented size="middle" options={["Daily", "Weekly", "Monthly"]} />
      <Segmented size="small" options={["Daily", "Weekly", "Monthly"]} />
    </div>
  )
}
