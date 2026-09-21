"use client"

import * as React from "react"

import { FloatButton } from "@/registry/float-button/float-button"

export function FloatButtonBackTopExample() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-xl bg-muted/40">
      <div ref={scrollerRef} className="h-full overflow-y-auto p-5">
        <p className="text-sm font-medium">Scroll down</p>
        <div className="mt-4 flex flex-col gap-2.5">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full bg-muted-foreground/15"
              style={{ width: `${55 + ((i * 17) % 40)}%` }}
            />
          ))}
        </div>
      </div>

      {/* BackTop watches its target's scroll offset and only appears past
          `visibilityHeight`. It sits outside the scroller so it stays put. */}
      <FloatButton.BackTop
        position="absolute"
        offset={16}
        type="primary"
        target={() => scrollerRef.current ?? window}
        visibilityHeight={80}
        tooltip="Back to top"
      />
    </div>
  )
}
