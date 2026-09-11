"use client"

import { Button } from "@/registry/button/button"

// The ReUI-style neutral variants: mono, dim and foreground.
export function ButtonNeutralExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="mono">Mono</Button>
      <Button variant="dim">Dim</Button>
      <Button variant="foreground">Foreground</Button>
    </div>
  )
}
