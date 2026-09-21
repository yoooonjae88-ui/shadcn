"use client"

import { Marker, MarkerContent } from "@/registry/marker/marker"

// default is an inline note, separator centres the label between two rules,
// and border closes the row with a hairline.
export function MarkerVariantsExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Marker>
        <MarkerContent>A default marker for inline notes.</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>A separator marker</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>A border marker for row boundaries.</MarkerContent>
      </Marker>
    </div>
  )
}
