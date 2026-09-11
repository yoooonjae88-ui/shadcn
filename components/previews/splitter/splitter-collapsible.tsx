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

// The arrows on the bar fold a panel away and bring it back.
export function SplitterCollapsibleExample() {
  return (
    <div className="h-44 w-full max-w-xl overflow-hidden rounded-lg bg-muted/50">
      <Splitter>
        <SplitterPanel defaultSize="30%" collapsible>
          <Pane>Collapsible</Pane>
        </SplitterPanel>
        <SplitterPanel collapsible={{ end: true }}>
          <Pane>Also collapsible (toward end)</Pane>
        </SplitterPanel>
      </Splitter>
    </div>
  )
}
