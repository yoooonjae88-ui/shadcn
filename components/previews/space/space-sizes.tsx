"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Space, type SpaceProps } from "@/registry/space/space"

const sizeOptions = ["small", "middle", "large"] satisfies SpaceProps["size"][]

function Box({
  children,
  deep = false,
}: {
  children: React.ReactNode
  deep?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium text-primary-foreground ${
        deep ? "bg-primary" : "bg-primary/70"
      }`}
    >
      {children}
    </div>
  )
}

// Size presets, or any number of pixels.
export function SpaceSizesExample() {
  const [size, setSize] = React.useState<SpaceProps["size"]>("small")

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {sizeOptions.map((option) => (
          <Button
            key={String(option)}
            size="sm"
            variant={size === option ? "default" : "outline"}
            onClick={() => setSize(option)}
          >
            {String(option)}
          </Button>
        ))}
        <Button
          size="sm"
          variant={size === 48 ? "default" : "outline"}
          onClick={() => setSize(48)}
        >
          48px
        </Button>
      </div>
      <Space size={size} wrap>
        {Array.from({ length: 6 }, (_, index) => (
          <Box key={index} deep={index % 2 === 0}>
            {index + 1}
          </Box>
        ))}
      </Space>
    </div>
  )
}
