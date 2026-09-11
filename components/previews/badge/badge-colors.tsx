"use client"

import { Badge, type PresetColor } from "@/registry/badge/badge"

const PRESETS: PresetColor[] = [
  "pink",
  "red",
  "yellow",
  "orange",
  "cyan",
  "green",
  "blue",
  "purple",
  "geekblue",
  "magenta",
  "volcano",
  "gold",
  "lime",
]

export function BadgeColorsExample() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {PRESETS.map((c) => (
        <Badge key={c} color={c} text={c} />
      ))}
      <Badge color="#7c3aed" text="#7c3aed" />
    </div>
  )
}
