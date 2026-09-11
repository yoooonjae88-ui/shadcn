"use client"

import { CircularProgress } from "@/registry/progress/progress"

export function ProgressCircularSizesExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <CircularProgress size="sm" value={60} showValue />
      <CircularProgress size="default" value={60} showValue />
      <CircularProgress size="lg" value={60} showValue />
      <CircularProgress size={104} strokeWidth={6} value={60} showValue />
    </div>
  )
}
