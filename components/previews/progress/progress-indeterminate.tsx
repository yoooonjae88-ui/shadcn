"use client"

import { Progress } from "@/registry/progress/progress"

// value={null} runs an indeterminate animation.
export function ProgressIndeterminateExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={null} />
      <Progress value={null} variant="info" size="sm" />
    </div>
  )
}
