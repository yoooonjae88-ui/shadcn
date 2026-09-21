"use client"

import { ExternalLinkIcon, RotateCwIcon } from "lucide-react"

import { Marker, MarkerContent, MarkerIcon } from "@/registry/marker/marker"

// `render` swaps the element for a real <a> or <button>, so the marker is
// focusable and exposes the right role. The text becomes its accessible name.
export function MarkerLinkButtonExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Marker render={<a href="#pull-request" />}>
        <MarkerIcon>
          <ExternalLinkIcon />
        </MarkerIcon>
        <MarkerContent>View the pull request</MarkerContent>
      </Marker>
      <Marker
        render={<button type="button" />}
        onClick={() => window.alert("Retrying…")}
      >
        <MarkerIcon>
          <RotateCwIcon />
        </MarkerIcon>
        <MarkerContent>Retry the failed step</MarkerContent>
      </Marker>
    </div>
  )
}
