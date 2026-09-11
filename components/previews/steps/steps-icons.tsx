"use client"

import * as React from "react"
import { Check, CreditCard, Lock, UserRound } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Steps,
  StepsIndicator,
  StepsItem,
  StepsTitle,
  StepsTrigger,
} from "@/registry/steps/steps"

// A per-step state pill toggled via group-data-[state=…]/step.
function StatePill({
  state,
  children,
}: {
  state: "active" | "complete" | "upcoming"
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "hidden rounded-full px-2 py-0.5 text-[11px] font-medium",
        state === "active" && "group-data-[state=active]/step:inline-flex bg-primary/10 text-primary",
        state === "complete" && "group-data-[state=complete]/step:inline-flex bg-tag-success/10 text-tag-success",
        state === "upcoming" && "group-data-[state=upcoming]/step:inline-flex bg-muted text-muted-foreground"
      )}
    >
      {children}
    </span>
  )
}

const iconSteps = [
  { title: "User Details", icon: <UserRound /> },
  { title: "Payment Info", icon: <CreditCard /> },
  { title: "Auth OTP", icon: <Lock /> },
]

export function StepsIconsExample() {
  const [current, setCurrent] = React.useState(2)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <Steps
        value={current}
        onValueChange={setCurrent}
        indicators={{ complete: <Check className="size-4" /> }}
      >
        {iconSteps.map((step, index) => (
          <StepsItem key={step.title} step={index + 1} className="flex-1 items-start">
            <StepsTrigger className="flex w-full grow flex-col items-start gap-2.5">
              <StepsIndicator className="size-8">{step.icon}</StepsIndicator>
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Step {index + 1}
                </span>
                <StepsTitle className="text-start text-base font-semibold">
                  {step.title}
                </StepsTitle>
                <StatePill state="active">In Progress</StatePill>
                <StatePill state="complete">Completed</StatePill>
                <StatePill state="upcoming">Pending</StatePill>
              </div>
            </StepsTrigger>
          </StepsItem>
        ))}
      </Steps>

      <div className="flex items-center justify-between gap-2.5">
        <Button variant="outline" size="sm" onClick={() => setCurrent((s) => s - 1)} disabled={current === 1}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => setCurrent((s) => s + 1)} disabled={current === iconSteps.length}>
          Next
        </Button>
      </div>
    </div>
  )
}
