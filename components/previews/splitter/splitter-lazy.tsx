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

// A ghost bar previews the drag; sizes apply on release.
export function SplitterLazyExample() {
  return (
    <div className="h-44 w-full max-w-xl overflow-hidden rounded-lg bg-muted/50">
      <Splitter lazy>
        <SplitterPanel defaultSize="50%">
          <Pane>First</Pane>
        </SplitterPanel>
        <SplitterPanel>
          <Pane>Second</Pane>
        </SplitterPanel>
      </Splitter>
    </div>
  )
}
