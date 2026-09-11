"use client"

import * as React from "react"

import { Badge } from "@/registry/badge/badge"

function Block() {
  return <span className="inline-block size-11 rounded-md bg-muted" />
}

// The number scrolls as the count changes.
export function BadgeAnimatedExample() {
  const [count, setCount] = React.useState(5)

  return (
    <div className="flex items-center gap-4">
      <Badge count={count} overflowCount={99}>
        <Block />
      </Badge>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground hover:opacity-80"
        >
          +1
        </button>
        <button
          type="button"
          onClick={() => setCount((c) => Math.max(0, c - 1))}
          className="rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground hover:opacity-80"
        >
          −1
        </button>
      </div>
    </div>
  )
}
