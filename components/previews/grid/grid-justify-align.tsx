"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Col, Row, type RowProps } from "@/registry/grid/grid"

const justifyOptions = [
  "start",
  "center",
  "end",
  "space-between",
  "space-around",
  "space-evenly",
] satisfies RowProps["justify"][]

const alignOptions = ["top", "middle", "bottom"] satisfies RowProps["align"][]

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
      className={`flex items-center justify-center rounded-md py-4 text-sm font-medium text-primary-foreground ${
        deep ? "bg-primary" : "bg-primary/70"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

export function GridJustifyAlignExample() {
  const [justify, setJustify] = React.useState<RowProps["justify"]>("start")
  const [align, setAlign] = React.useState<RowProps["align"]>("top")

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
            key={option}
            size="sm"
            variant={align === option ? "default" : "outline"}
            onClick={() => setAlign(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <Row justify={justify} align={align} className="min-h-28 rounded-lg bg-muted">
        <Col span={4}>
          <Box deep className="py-2">col 4</Box>
        </Col>
        <Col span={4}>
          <Box className="py-6">col 4</Box>
        </Col>
        <Col span={4}>
          <Box deep className="py-2">col 4</Box>
        </Col>
        <Col span={4}>
          <Box className="py-6">col 4</Box>
        </Col>
      </Row>
    </div>
  )
}
