"use client"

import { Progress } from "@/registry/progress/progress"

export function ProgressSizesExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress size="sm" value={60} />
      <Progress size="default" value={60} />
      <Progress size="lg" value={60} />
    </div>
  )
}
