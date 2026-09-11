"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Masonry } from "@/registry/masonry/masonry"

const HEIGHTS = [96, 168, 64, 200, 120, 88, 152, 72, 176]

function Brick({
  index,
  height,
  deep,
}: {
  index: number
  height: number
  deep?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-md text-sm font-medium text-primary-foreground ${
        deep ? "bg-primary" : "bg-primary/70"
      }`}
      style={{ height }}
    >
      {index}
    </div>
  )
}

// Sequential keeps source order across columns instead of packing.
export function MasonrySequentialExample() {
  const [sequential, setSequential] = React.useState(false)

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={sequential ? "outline" : "default"}
          onClick={() => setSequential(false)}
        >
          shortest column
        </Button>
        <Button
          size="sm"
          variant={sequential ? "default" : "outline"}
          onClick={() => setSequential(true)}
        >
          sequential
        </Button>
      </div>
      <Masonry columns={3} gutter={[16, 8]} sequential={sequential}>
        {HEIGHTS.map((height, index) => (
          <Brick
            key={index}
            index={index + 1}
            height={height}
            deep={index % 2 === 0}
          />
        ))}
      </Masonry>
    </div>
  )
}
