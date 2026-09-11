"use client"

import { Progress } from "@/registry/progress/progress"

export function ProgressDefaultExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={40} />
      <Progress value={72} />
    </div>
  )
}
