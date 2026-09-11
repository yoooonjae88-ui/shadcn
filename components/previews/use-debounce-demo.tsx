"use client"

import * as React from "react"

import { useDebounce } from "@/registry/use-debounce/use-debounce"

export function UseDebounceDemo() {
  const [value, setValue] = React.useState("")
  const debounced = useDebounce(value, 500)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
        className="h-9 rounded-lg border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <p className="text-sm text-muted-foreground">
        Debounced value (500ms):{" "}
        <span className="font-mono text-foreground">
          {debounced || "(empty)"}
        </span>
      </p>
    </div>
  )
}
