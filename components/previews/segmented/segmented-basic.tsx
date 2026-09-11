"use client"

import { Segmented } from "@/registry/segmented/segmented"

export function SegmentedBasicExample() {
  return <Segmented options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]} />
}
