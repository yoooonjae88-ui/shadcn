"use client"

import {
  Steps,
  StepsIndicator,
  StepsItem,
  StepsTitle,
  StepsTrigger,
} from "@/registry/steps/steps"

const progressSteps = ["User Details", "Payment Info", "Auth OTP", "Preview Form"]

// The progress variant renders a thin bar with titles below.
export function StepsProgressExample() {
  return (
    <Steps defaultValue={2} variant="progress" className="w-full max-w-2xl gap-5">
      {progressSteps.map((title, index) => (
        <StepsItem key={title} step={index + 1} className="flex-1 items-start">
          <StepsTrigger className="flex w-full grow flex-col items-start gap-3.5">
            <StepsIndicator className="h-1" />
            <StepsTitle className="text-start font-semibold">{title}</StepsTitle>
          </StepsTrigger>
        </StepsItem>
      ))}
    </Steps>
  )
}
