"use client"

import {
  SliderControl,
  SliderIndicator,
  SliderPrimitive,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@/registry/slider/slider"

// Composed from primitives to add a value readout above the track.
export function SliderValueExample() {
  return (
    <SliderPrimitive.Root defaultValue={65} className="flex max-w-xs flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Volume</span>
        <SliderValue className="text-sm text-muted-foreground" />
      </div>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb index={0} />
        </SliderTrack>
      </SliderControl>
    </SliderPrimitive.Root>
  )
}
