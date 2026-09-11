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

// × removes an item; drag one to reorder (touch: press and hold first).
export function MasonryDraggableExample() {
  const [resetCount, setResetCount] = React.useState(0)
  const [order, setOrder] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setResetCount((count) => count + 1)
            setOrder(null)
          }}
        >
          reset
        </Button>
        {order && (
          <p className="text-xs text-muted-foreground">onReorder: {order}</p>
        )}
      </div>
      <Masonry
        key={resetCount}
        columns={3}
        gutter={16}
        closable
        draggable
        wobble
        onReorder={(keys) =>
          setOrder(keys.map((key) => Number(key) + 1).join(", "))
        }
      >
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
