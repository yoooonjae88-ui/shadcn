"use client"

import type * as React from "react"

import { Splitter, SplitterPanel } from "@/registry/splitter/splitter"

function Pane({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
      {children}
    </div>
  )
}

// The middle panel is not resizable, so both of its bars are locked.
export function SplitterMultipleExample() {
  return (
    <div className="h-44 w-full max-w-xl overflow-hidden rounded-lg bg-muted/50">
      <Splitter>
        <SplitterPanel min="15%">
          <Pane>Left</Pane>
        </SplitterPanel>
        <SplitterPanel resizable={false}>
          <Pane>Locked</Pane>
        </SplitterPanel>
        <SplitterPanel min="15%">
          <Pane>Right</Pane>
        </SplitterPanel>
      </Splitter>
    </div>
  )
}
