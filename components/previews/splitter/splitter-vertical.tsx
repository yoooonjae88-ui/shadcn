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

export function SplitterVerticalExample() {
  return (
    <div className="h-56 w-full max-w-xl overflow-hidden rounded-lg bg-muted/50">
      <Splitter layout="vertical">
        <SplitterPanel defaultSize="35%">
          <Pane>Top</Pane>
        </SplitterPanel>
        <SplitterPanel>
          <Pane>Bottom</Pane>
        </SplitterPanel>
      </Splitter>
    </div>
  )
}
