"use client"

import { Marker, MarkerContent } from "@/registry/marker/marker"

// A labelled divider between stretches of a thread. The rules are decorative
// pseudo-elements, so no role is needed — and role="separator" would actually
// hide the label from screen readers.
export function MarkerSeparatorExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Yesterday</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>11 September 2026</MarkerContent>
      </Marker>
    </div>
  )
}
