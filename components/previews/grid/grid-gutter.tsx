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

// Horizontal and vertical gutters; spans past 24 wrap onto a new line.
export function GridGutterExample() {
  return (
    <Row gutter={[16, 16]} className="w-full max-w-xl">
      {Array.from({ length: 8 }, (_, index) => (
        <Col key={index} span={6}>
          <Box deep={index % 2 === 0}>span 6</Box>
        </Col>
      ))}
    </Row>
  )
}
