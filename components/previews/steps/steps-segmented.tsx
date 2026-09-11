"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Steps,
  StepsIndicator,
  StepsItem,
  StepsTrigger,
} from "@/registry/steps/steps"

// Segments touch (no gap); first/last round the whole bar.
export function StepsSegmentedExample() {
  const [current, setCurrent] = React.useState(1)
  const total = 4

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Steps value={current} onValueChange={setCurrent} variant="progress">
        {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
          <StepsItem
            key={step}
            step={step}
            className="flex-1 overflow-hidden first:rounded-s-full last:rounded-e-full"
          >
            <StepsTrigger className="w-full">
              <StepsIndicator className="rounded-none" />
            </StepsTrigger>
          </StepsItem>
        ))}
      </Steps>

      <div className="flex items-center justify-between gap-2.5">
        <div className="text-sm font-medium">
          <span className="text-foreground">{current}</span>{" "}
          <span className="text-muted-foreground">/ {total}</span>
        </div>
        <div className="flex gap-2.5">
          <Button variant="outline" size="sm" onClick={() => setCurrent((s) => s - 1)} disabled={current === 1}>
            Back
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrent((s) => s + 1)} disabled={current === total}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
