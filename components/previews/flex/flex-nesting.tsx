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

// A fixed header row above a fluid content row.
export function FlexNestingExample() {
  return (
    <Flex vertical gap="small" className="min-h-40 w-full max-w-xl rounded-lg bg-muted p-2">
      <Flex justify="space-between" align="center" gap="small">
        <Box deep>logo</Box>
        <Box>actions</Box>
      </Flex>
      <Flex gap="small" flex={1} align="stretch">
        <Box deep className="w-28">nav</Box>
        <Box className="flex-1">content</Box>
      </Flex>
    </Flex>
  )
}
