"use client"

import * as React from "react"

import { Splitter, SplitterPanel } from "@/registry/splitter/splitter"

function Pane({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
      {children}
    </div>
  )
}

// Drag the bar; the first panel starts at 40% and is clamped to 20%–70%.
export function SplitterBasicExample() {
  const [sizes, setSizes] = React.useState<number[] | null>(null)

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="h-44 overflow-hidden rounded-lg bg-muted/50">
        <Splitter onResize={setSizes}>
          <SplitterPanel defaultSize="40%" min="20%" max="70%">
            <Pane>First</Pane>
          </SplitterPanel>
          <SplitterPanel>
            <Pane>Second</Pane>
          </SplitterPanel>
        </Splitter>
      </div>
      <p className="text-xs text-muted-foreground">
        {sizes
          ? `sizes: [${sizes.map((s) => Math.round(s)).join(", ")}]`
          : "drag to see onResize sizes"}
      </p>
    </div>
  )
}
