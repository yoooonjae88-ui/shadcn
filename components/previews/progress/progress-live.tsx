"use client"

import * as React from "react"

import { Progress } from "@/registry/progress/progress"

// Drives a value from 0→100 on a loop.
function useAutoProgress(step = 4, interval = 400) {
  const [value, setValue] = React.useState(12)
  React.useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : Math.min(100, v + step)))
    }, interval)
    return () => clearInterval(id)
  }, [step, interval])
  return value
}

export function ProgressLiveExample() {
  const value = useAutoProgress()
  return (
    <div className="w-full max-w-sm">
      <Progress label="Downloading update" showValue variant="success" value={value} />
    </div>
  )
}
