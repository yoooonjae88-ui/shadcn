"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Flex } from "@/registry/flex/flex"

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

export function FlexBasicExample() {
  const [vertical, setVertical] = React.useState(false)

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={vertical ? "outline" : "default"}
          onClick={() => setVertical(false)}
        >
          horizontal
        </Button>
        <Button
          size="sm"
          variant={vertical ? "default" : "outline"}
          onClick={() => setVertical(true)}
        >
          vertical
        </Button>
      </div>
      <Flex vertical={vertical} gap="small">
        {Array.from({ length: 4 }, (_, index) => (
          <Box key={index} deep={index % 2 === 0} className={vertical ? "" : "flex-1"}>
            {index + 1}
          </Box>
        ))}
      </Flex>
    </div>
  )
}
