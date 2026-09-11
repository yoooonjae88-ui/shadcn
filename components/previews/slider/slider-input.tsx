"use client"

import * as React from "react"

import { Slider } from "@/registry/slider/slider"

// A number input kept in sync with the slider.
export function SliderInputExample() {
  const [value, setValue] = React.useState(42)
  return (
    <div className="flex max-w-xs flex-col gap-4">
      <div className="flex items-center gap-3">
        <Slider
          value={value}
          onValueChange={(next) => setValue(next as number)}
          className="grow"
        />
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value)
            if (!Number.isNaN(next)) {
              setValue(Math.min(100, Math.max(0, next)))
            }
          }}
          className="w-16 rounded-md bg-muted px-2 py-1 text-right text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </div>
    </div>
  )
}
