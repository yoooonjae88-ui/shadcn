"use client"

import { Moon, Sun, SunMoon } from "lucide-react"

import { Segmented } from "@/registry/segmented/segmented"

export function SegmentedRoundExample() {
  return (
    <Segmented
      shape="round"
      defaultValue="light"
      options={[
        { label: "Light", value: "light", icon: <Sun /> },
        { label: "Dark", value: "dark", icon: <Moon /> },
        { label: "System", value: "system", icon: <SunMoon /> },
      ]}
    />
  )
}
