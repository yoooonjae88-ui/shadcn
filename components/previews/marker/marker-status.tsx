"use client"

import { Marker, MarkerContent, MarkerIcon } from "@/registry/marker/marker"
import { Spinner } from "@/registry/spinner/spinner"

// role="status" makes assistive tech announce the line as it updates, which is
// what a streaming or long-running step needs.
export function MarkerStatusExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Marker role="status">
        <MarkerIcon>
          <Spinner size="sm" />
        </MarkerIcon>
        <MarkerContent>Compacting conversation</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerIcon>
          <Spinner size="sm" />
        </MarkerIcon>
        <MarkerContent>Running tests</MarkerContent>
      </Marker>
    </div>
  )
}
