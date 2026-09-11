"use client"

import { Progress } from "@/registry/progress/progress"

export function ProgressLabelExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Progress label="Uploading files" showValue value={45} />
      <Progress
        label="Storage used"
        showValue
        variant="warning"
        value={82}
        formatValue={(value) => `${value} / 100 GB`}
      />
    </div>
  )
}
