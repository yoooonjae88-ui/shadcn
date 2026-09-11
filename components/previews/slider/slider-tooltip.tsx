"use client"

import { Slider } from "@/registry/slider/slider"

export function SliderTooltipExample() {
  return (
    <div className="flex max-w-xs flex-col gap-8">
      <Slider defaultValue={30} tooltip />
      <Slider defaultValue={[20, 70]} tooltip={(value) => `${value}%`} />
    </div>
  )
}
