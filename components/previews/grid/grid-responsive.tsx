"use client"

import type * as React from "react"

import { Col, Row, useBreakpoint } from "@/registry/grid/grid"

function Box({
  children,
  deep = false,
}: {
  children: React.ReactNode
  deep?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-md py-4 text-sm font-medium text-primary-foreground ${
        deep ? "bg-primary" : "bg-primary/70"
      }`}
    >
      {children}
    </div>
  )
}

// Resize the window: columns pick up different spans per breakpoint, and
// useBreakpoint reports which breakpoints are active.
export function GridResponsiveExample() {
  const screens = useBreakpoint()
  const activeScreens = Object.entries(screens)
    .filter(([, active]) => active)
    .map(([name]) => name)

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Active: {activeScreens.length > 0 ? activeScreens.join(", ") : "base"}
      </p>
      <Row gutter={[8, 8]}>
        {Array.from({ length: 4 }, (_, index) => (
          <Col key={index} span={24} sm={12} lg={6}>
            <Box deep={index % 2 === 0}>24 / sm 12 / lg 6</Box>
          </Col>
        ))}
      </Row>
    </div>
  )
}
