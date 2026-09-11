"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Divider, type DividerProps } from "@/registry/divider/divider"

const sizeOptions = ["small", "middle", "large"] satisfies DividerProps["size"][]

const paragraph =
  "A design is not just what it looks like and feels like — a design is how it works."

export function DividerSizesExample() {
  const [size, setSize] = React.useState<DividerProps["size"]>("large")

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {sizeOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={size === option ? "default" : "outline"}
            onClick={() => setSize(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <div className="text-sm">
        <p>{paragraph}</p>
        <Divider size={size} />
        <p>{paragraph}</p>
        <Divider size={size}>Title</Divider>
        <p>{paragraph}</p>
      </div>
    </div>
  )
}
