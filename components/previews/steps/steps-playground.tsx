"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Steps,
  StepsContent,
  StepsDescription,
  StepsIndicator,
  StepsItem,
  StepsSeparator,
  StepsTitle,
  StepsTrigger,
} from "@/registry/steps/steps"

const basicSteps = [
  { title: "Account", description: "Create your account" },
  { title: "Profile", description: "Tell us about yourself" },
  { title: "Done", description: "Review and finish" },
]

type Orientation = "horizontal" | "vertical"
type Variant = "default" | "dot"

// A clickable stepper with orientation, dot, loading and error toggles.
export function StepsPlaygroundExample() {
  const [current, setCurrent] = React.useState(2)
  const [orientation, setOrientation] = React.useState<Orientation>("horizontal")
  const [variant, setVariant] = React.useState<Variant>("default")
  const [timeline, setTimeline] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <Button variant={orientation === "horizontal" ? "default" : "outline"} size="sm" onClick={() => setOrientation("horizontal")}>
          Horizontal
        </Button>
        <Button variant={orientation === "vertical" ? "default" : "outline"} size="sm" onClick={() => setOrientation("vertical")}>
          Vertical
        </Button>
        <Button variant={variant === "default" ? "default" : "outline"} size="sm" onClick={() => setVariant("default")}>
          Numbered
        </Button>
        <Button variant={variant === "dot" ? "default" : "outline"} size="sm" onClick={() => setVariant("dot")}>
          Dot
        </Button>
        <Button variant={timeline ? "default" : "outline"} size="sm" onClick={() => setTimeline((on) => !on)}>
          Clock icon
        </Button>
        <Button variant={loading ? "default" : "outline"} size="sm" onClick={() => setLoading((on) => !on)}>
          Loading
        </Button>
        <Button variant={error ? "default" : "outline"} size="sm" onClick={() => setError((on) => !on)}>
          Error
        </Button>
      </div>

      <Steps value={current} onValueChange={setCurrent} orientation={orientation} variant={variant}>
        {basicSteps.map((step, index) => (
          <StepsItem
            key={step.title}
            step={index + 1}
            loading={loading && index + 1 === current}
            error={error && index + 1 === current}
          >
            <StepsTrigger>
              <StepsIndicator>{timeline ? <Clock /> : null}</StepsIndicator>
            </StepsTrigger>
            <StepsContent>
              <StepsTitle>{step.title}</StepsTitle>
              <StepsDescription>{step.description}</StepsDescription>
            </StepsContent>
            <StepsSeparator />
          </StepsItem>
        ))}
      </Steps>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={current <= 1} onClick={() => setCurrent((step) => step - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={current > basicSteps.length} onClick={() => setCurrent((step) => step + 1)}>
          {current >= basicSteps.length ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  )
}
