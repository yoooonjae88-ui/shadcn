"use client"

import { GitBranchIcon, SearchIcon } from "lucide-react"

import { Marker, MarkerContent, MarkerIcon } from "@/registry/marker/marker"
import { Spinner } from "@/registry/spinner/spinner"

// Markers as they appear in a conversation: a note, a live status, a labelled
// separator, and a result line.
export function MarkerDemoExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Marker>
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Switched to a new branch</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerIcon>
          <Spinner size="sm" />
        </MarkerIcon>
        <MarkerContent>Thinking...</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Conversation compacted</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>
    </div>
  )
}
