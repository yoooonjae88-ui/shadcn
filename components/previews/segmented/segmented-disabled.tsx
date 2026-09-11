"use client"

import { Segmented } from "@/registry/segmented/segmented"

export function SegmentedDisabledExample() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Segmented disabled options={["Daily", "Weekly", "Monthly"]} />
      <Segmented
        defaultValue="Weekly"
        options={[
          { label: "Daily", value: "Daily" },
          { label: "Weekly", value: "Weekly" },
          { label: "Monthly", value: "Monthly", disabled: true },
          { label: "Yearly", value: "Yearly", disabled: true },
        ]}
      />
    </div>
  )
}
