"use client"

import * as React from "react"

import { Masonry, type MasonryItemPosition } from "@/registry/masonry/masonry"

const HEIGHTS = [96, 168, 64, 200, 120, 88, 152, 72, 176, 104, 136, 80]

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

// Items flow into the shortest column with a responsive column count.
export function MasonryBasicExample() {
  const [layout, setLayout] = React.useState<MasonryItemPosition[]>([])
  const columnsUsed = new Set(layout.map((position) => position.column)).size

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <Masonry
        columns={{ base: 2, md: 3, xl: 4 }}
        gutter={16}
        onLayoutChange={setLayout}
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
      {layout.length > 0 && (
        <p className="text-xs text-muted-foreground">
          onLayoutChange: {layout.length} items across {columnsUsed} columns
        </p>
      )}
    </div>
  )
}
