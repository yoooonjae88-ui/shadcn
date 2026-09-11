"use client"

import { AppWindow, BarChart3, List } from "lucide-react"

import { Segmented } from "@/registry/segmented/segmented"

export function SegmentedVerticalExample() {
  return (
    <Segmented
      vertical
      defaultValue="Overview"
      options={[
        { label: "Overview", value: "Overview", icon: <AppWindow /> },
        { label: "Analytics", value: "Analytics", icon: <BarChart3 /> },
        { label: "Reports", value: "Reports", icon: <List /> },
      ]}
    />
  )
}
