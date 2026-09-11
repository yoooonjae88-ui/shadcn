"use client"

import { Slider } from "@/registry/slider/slider"

export function SliderVerticalExample() {
  return (
    <div className="flex items-end gap-8">
      <Slider defaultValue={60} orientation="vertical" tooltip />
      <Slider defaultValue={[30, 80]} orientation="vertical" />
    </div>
  )
}
