"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Flex, type FlexProps } from "@/registry/flex/flex"

const justifyOptions = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
  "space-evenly",
] satisfies FlexProps["justify"][]

const alignOptions = ["flex-start", "center", "flex-end"] satisfies FlexProps["align"][]

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

export function FlexJustifyAlignExample() {
  const [justify, setJustify] = React.useState<FlexProps["justify"]>("flex-start")
  const [align, setAlign] = React.useState<FlexProps["align"]>("flex-start")

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {justifyOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={justify === option ? "default" : "outline"}
            onClick={() => setJustify(option)}
          >
            {option}
          </Button>
        ))}
        {alignOptions.map((option) => (
          <Button
            key={`align-${option}`}
            size="sm"
            variant={align === option ? "default" : "outline"}
            onClick={() => setAlign(option)}
          >
            align {option}
          </Button>
        ))}
      </div>
      <Flex
        justify={justify}
        align={align}
        gap="small"
        className="min-h-32 rounded-lg bg-muted p-2"
      >
        <Box deep className="h-10">1</Box>
        <Box className="h-16">2</Box>
        <Box deep className="h-10">3</Box>
        <Box className="h-16">4</Box>
      </Flex>
    </div>
  )
}
