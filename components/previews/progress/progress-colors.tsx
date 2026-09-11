"use client"

import { Progress } from "@/registry/progress/progress"

export function ProgressColorsExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress variant="primary" value={65} />
      <Progress variant="mono" value={65} />
      <Progress variant="success" value={65} />
      <Progress variant="warning" value={65} />
      <Progress variant="destructive" value={65} />
      <Progress variant="info" value={65} />
    </div>
  )
}
