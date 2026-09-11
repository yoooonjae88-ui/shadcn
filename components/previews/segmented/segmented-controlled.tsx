"use client"

import * as React from "react"

import { Segmented } from "@/registry/segmented/segmented"

export function SegmentedControlledExample() {
  const [view, setView] = React.useState<string | number>("Daily")
  return (
    <div className="flex flex-col gap-2">
      <Segmented value={view} onChange={setView} options={["Daily", "Weekly", "Monthly"]} />
      <span className="text-xs text-muted-foreground">Selected: {view}</span>
    </div>
  )
}
