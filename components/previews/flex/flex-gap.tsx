"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Flex, type FlexProps } from "@/registry/flex/flex"

const gapOptions = ["small", "middle", "large"] satisfies FlexProps["gap"][]

function Box({
  children,
  deep = false,
  className,
}: {
  children: React.ReactNode
  deep?: boolean
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium text-primary-foreground ${
        deep ? "bg-primary" : "bg-primary/70"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

// Gap accepts the presets plus any number or CSS value.
export function FlexGapExample() {
  const [gap, setGap] = React.useState<FlexProps["gap"]>("small")

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {gapOptions.map((option) => (
          <Button
            key={String(option)}
            size="sm"
            variant={gap === option ? "default" : "outline"}
            onClick={() => setGap(option)}
          >
            {String(option)}
          </Button>
        ))}
        <Button
          size="sm"
          variant={gap === 48 ? "default" : "outline"}
          onClick={() => setGap(48)}
        >
          48px
        </Button>
      </div>
      <Flex gap={gap}>
        {Array.from({ length: 4 }, (_, index) => (
          <Box key={index} deep={index % 2 === 0} className="flex-1">
            {index + 1}
          </Box>
        ))}
      </Flex>
    </div>
  )
}
