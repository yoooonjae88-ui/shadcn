"use client"

import { CircularProgress } from "@/registry/progress/progress"

export function ProgressCircularExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <CircularProgress value={25} showValue />
      <CircularProgress value={50} showValue variant="success" />
      <CircularProgress value={75} showValue variant="warning" />
      <CircularProgress value={100} showValue variant="info" />
    </div>
  )
}
