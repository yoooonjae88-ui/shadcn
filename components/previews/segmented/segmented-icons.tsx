"use client"

import { AppWindow, Grid2x2, List } from "lucide-react"

import { Segmented } from "@/registry/segmented/segmented"

export function SegmentedIconsExample() {
  return (
    <Segmented
      defaultValue="List"
      options={[
        { label: "List", value: "List", icon: <List /> },
        { label: "Kanban", value: "Kanban", icon: <AppWindow /> },
        { label: "Grid", value: "Grid", icon: <Grid2x2 /> },
      ]}
    />
  )
}
