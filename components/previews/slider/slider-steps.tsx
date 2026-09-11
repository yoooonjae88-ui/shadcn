"use client"

import { Slider } from "@/registry/slider/slider"

export function SliderStepsExample() {
  return <Slider defaultValue={40} step={10} marks className="max-w-xs" />
}
