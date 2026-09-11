"use client"

import type * as React from "react"

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

export function FlexWrapExample() {
  return (
    <Flex wrap gap="small" className="max-w-xl">
      {Array.from({ length: 16 }, (_, index) => (
        <Box key={index} deep={index % 2 === 0} className="w-24">
          {index + 1}
        </Box>
      ))}
    </Flex>
  )
}
