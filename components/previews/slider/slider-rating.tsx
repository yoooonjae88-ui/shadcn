"use client"

import * as React from "react"

import { Slider } from "@/registry/slider/slider"

const RATINGS = ["😞", "🙁", "😐", "🙂", "😍"]

export function SliderRatingExample() {
  const [value, setValue] = React.useState(3)
  return (
    <div className="flex max-w-xs flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">How was your experience?</span>
        <span className="text-2xl leading-none" aria-hidden="true">
          {RATINGS[value - 1]}
        </span>
      </div>
      <Slider
        value={value}
        onValueChange={(next) => setValue(next as number)}
        min={1}
        max={5}
        step={1}
        marks
        tooltip={(v) => RATINGS[v - 1]}
      />
    </div>
  )
}
