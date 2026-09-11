"use client"

import type * as React from "react"

import { Col, Row } from "@/registry/grid/grid"

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

// A fixed sidebar column plus fluid content.
export function GridFlexFillExample() {
  return (
    <Row gutter={8} className="w-full max-w-xl">
      <Col flex="96px">
        <Box deep>96px</Box>
      </Col>
      <Col flex={1}>
        <Box>fill</Box>
      </Col>
    </Row>
  )
}
