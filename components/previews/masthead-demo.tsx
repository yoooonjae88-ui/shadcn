"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Masthead } from "@/registry/masthead/masthead"

type Orientation = "horizontal" | "vertical"
type Side = "left" | "right"

export function MastheadDemo() {
  const [orientation, setOrientation] = React.useState<Orientation>("horizontal")
  const [side, setSide] = React.useState<Side>("left")
  const [hideText, setHideText] = React.useState(false)

  const masthead = (
    <Masthead
      orientation={orientation}
      side={side}
      hideText={hideText}
      text="Placeholder text"
    />
  )

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          size="sm"
          variant={orientation === "horizontal" ? "default" : "outline"}
          onClick={() => setOrientation("horizontal")}
        >
          Horizontal
        </Button>
        <Button
          size="sm"
          variant={orientation === "vertical" ? "default" : "outline"}
          onClick={() => setOrientation("vertical")}
        >
          Vertical
        </Button>
        <Button
          size="sm"
          variant={side === "left" ? "default" : "outline"}
          onClick={() => setSide("left")}
          disabled={orientation === "horizontal"}
        >
          Dock left
        </Button>
        <Button
          size="sm"
          variant={side === "right" ? "default" : "outline"}
          onClick={() => setSide("right")}
          disabled={orientation === "horizontal"}
        >
          Dock right
        </Button>
        <Button
          size="sm"
          variant={hideText ? "default" : "outline"}
          onClick={() => setHideText((h) => !h)}
          disabled={orientation === "horizontal"}
        >
          {hideText ? "Show text" : "Hide text"}
        </Button>
      </div>

      {orientation === "horizontal" ? (
        <div className="flex items-center overflow-hidden border">{masthead}</div>
      ) : (
        // The container is roughly as tall as the horizontal band is wide so the
        // rotated blocks come out the same size.
        <div className="flex h-[640px] overflow-hidden border bg-background">
          {side === "left" && masthead}
          <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
            Page content
          </div>
          {side === "right" && masthead}
        </div>
      )}
    </div>
  )
}
