"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Space, type SpaceProps } from "@/registry/space/space"

const alignOptions = ["start", "center", "end", "baseline"] satisfies SpaceProps["align"][]

// Cross-axis alignment of mixed-height items.
export function SpaceAlignExample() {
  const [align, setAlign] = React.useState<SpaceProps["align"]>("center")

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {alignOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={align === option ? "default" : "outline"}
            onClick={() => setAlign(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <Space align={align} className="min-h-28 w-full rounded-lg bg-muted p-2">
        <span className="text-sm">text</span>
        <Button size="sm">button</Button>
        <div className="flex h-20 items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
          tall block
        </div>
      </Space>
    </div>
  )
}
