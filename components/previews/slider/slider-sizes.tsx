"use client"

import { Slider } from "@/registry/slider/slider"

export function SliderSizesExample() {
  return (
    <div className="flex max-w-xs flex-col gap-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Slider
          key={size}
          size={size}
          defaultValue={size === "sm" ? 25 : size === "lg" ? 75 : 50}
        />
      ))}
    </div>
  )
}
