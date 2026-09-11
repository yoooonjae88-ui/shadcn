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

// 24 columns per row.
export function GridBasicExample() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <Row>
        <Col span={24}>
          <Box deep>span 24</Box>
        </Col>
      </Row>
      <Row>
        {[12, 12].map((span, index) => (
          <Col key={index} span={span}>
            <Box deep={index % 2 === 0}>span 12</Box>
          </Col>
        ))}
      </Row>
      <Row>
        {[8, 8, 8].map((span, index) => (
          <Col key={index} span={span}>
            <Box deep={index % 2 === 0}>span 8</Box>
          </Col>
        ))}
      </Row>
      <Row>
        {[6, 6, 6, 6].map((span, index) => (
          <Col key={index} span={span}>
            <Box deep={index % 2 === 0}>span 6</Box>
          </Col>
        ))}
      </Row>
    </div>
  )
}
