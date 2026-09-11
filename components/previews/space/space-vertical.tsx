"use client"

import type * as React from "react"

import { Space } from "@/registry/space/space"

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

export function SpaceVerticalExample() {
  return (
    <Space direction="vertical">
      <Box deep>item 1</Box>
      <Box>item 2</Box>
      <Box deep>item 3</Box>
    </Space>
  )
}
