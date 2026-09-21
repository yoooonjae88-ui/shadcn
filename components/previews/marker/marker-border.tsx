"use client"

import { FileTextIcon } from "lucide-react"

import { Marker, MarkerContent, MarkerIcon } from "@/registry/marker/marker"

// The bottom border is decorative, so the semantics stay the same as a default
// marker — use it to close off a row.
export function MarkerBorderExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Marker variant="border">
        <MarkerIcon>
          <FileTextIcon />
        </MarkerIcon>
        <MarkerContent>Opened implementation notes</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Reviewed 3 changed files</MarkerContent>
      </Marker>
    </div>
  )
}
