"use client"

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"

import { Segmented } from "@/registry/segmented/segmented"

export function SegmentedIconOnlyExample() {
  return (
    <Segmented
      defaultValue="left"
      options={[
        { value: "left", icon: <AlignLeft />, title: "Align left" },
        { value: "center", icon: <AlignCenter />, title: "Align center" },
        { value: "right", icon: <AlignRight />, title: "Align right" },
      ]}
    />
  )
}
