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

export function GridOffsetOrderExample() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <Row>
        <Col span={8}>
          <Box deep>span 8</Box>
        </Col>
        <Col span={8} offset={8}>
          <Box>span 8, offset 8</Box>
        </Col>
      </Row>
      <Row>
        <Col span={6} order={4}>
          <Box>1st child, order 4</Box>
        </Col>
        <Col span={6} order={3}>
          <Box deep>2nd child, order 3</Box>
        </Col>
        <Col span={6} order={2}>
          <Box>3rd child, order 2</Box>
        </Col>
        <Col span={6} order={1}>
          <Box deep>4th child, order 1</Box>
        </Col>
      </Row>
    </div>
  )
}
