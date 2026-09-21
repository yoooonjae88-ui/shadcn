"use client"

import { AspectRatio } from "@/registry/aspect-ratio/aspect-ratio"

// `ratio` is a plain number, so any ratio works — pass it as a division and it
// reads like the name of the shape.
const ratios: { label: string; value: number; width: string }[] = [
  { label: "21 / 9", value: 21 / 9, width: "w-56" },
  { label: "16 / 9", value: 16 / 9, width: "w-48" },
  { label: "4 / 3", value: 4 / 3, width: "w-40" },
  { label: "1 / 1", value: 1 / 1, width: "w-28" },
  { label: "3 / 4", value: 3 / 4, width: "w-24" },
]

export function AspectRatioRatiosExample() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {ratios.map((ratio) => (
        <div key={ratio.label} className={ratio.width}>
          <AspectRatio ratio={ratio.value} className="rounded-lg bg-muted">
            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
              {ratio.label}
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  )
}
