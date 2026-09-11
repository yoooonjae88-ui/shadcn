"use client"

import * as React from "react"

import { Pigeon } from "@/registry/pigeon/pigeon"

export function PigeonDemo() {
  const [paused, setPaused] = React.useState(false)
  const [flapSpeed, setFlapSpeed] = React.useState(1)

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Pigeon
        paused={paused}
        flapSpeed={flapSpeed}
        className="h-72 rounded-xl bg-muted/40"
      />
      <div className="flex items-center justify-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="rounded-md bg-muted px-3 py-1.5 text-foreground transition-colors hover:bg-muted/70"
        >
          {paused ? "Play" : "Pause"}
        </button>
        <button
          type="button"
          onClick={() => setFlapSpeed((f) => (f === 1 ? 1.8 : 1))}
          className="rounded-md bg-muted px-3 py-1.5 text-foreground transition-colors hover:bg-muted/70"
        >
          {flapSpeed === 1 ? "Faster flap" : "Normal flap"}
        </button>
      </div>
    </div>
  )
}
