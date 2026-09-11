"use client"

import * as React from "react"

import {
  SliderControl,
  SliderPrimitive,
  SliderThumb,
  SliderTrack,
} from "@/registry/slider/slider"

// Composed from primitives so the track can carry a gradient fill.
export function SliderTemperatureExample() {
  const [value, setValue] = React.useState(52)
  return (
    <div className="flex max-w-xs flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Color temperature</span>
        <span className="text-muted-foreground tabular-nums">{value}00K</span>
      </div>
      <SliderPrimitive.Root
        value={value}
        onValueChange={(next) => setValue(next as number)}
        min={20}
        max={90}
        className="flex w-full flex-col"
      >
        <SliderControl>
          <SliderTrack
            className="bg-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, #60a5fa, #f8fafc, #fbbf24, #f97316)",
            }}
          >
            {/* Keep the thumb, drop the solid indicator so the gradient shows. */}
            <SliderThumb tooltip={`${value}00K`} className="bg-background" />
          </SliderTrack>
        </SliderControl>
      </SliderPrimitive.Root>
    </div>
  )
}
