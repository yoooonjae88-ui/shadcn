"use client"

import { Slider } from "@/registry/slider/slider"

const marks = [
  { value: 0, label: "0°C" },
  { value: 25, label: "25°C" },
  { value: 50, label: "50°C" },
  { value: 75, label: "75°C" },
  { value: 100, label: "100°C" },
]

// Reference labels under the track.
export function SliderMarksExample() {
  return <Slider defaultValue={50} step={25} marks={marks} className="max-w-xs" />
}
