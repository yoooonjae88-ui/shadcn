"use client"

import * as React from "react"

import { CircularProgress } from "@/registry/progress/progress"

function useAutoProgress(step = 5, interval = 350) {
  const [value, setValue] = React.useState(12)
  React.useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : Math.min(100, v + step)))
    }, interval)
    return () => clearInterval(id)
  }, [step, interval])
  return value
}

export function ProgressCircularLiveExample() {
  const value = useAutoProgress()
  return (
    <CircularProgress size="lg" variant="success" value={value} showValue strokeWidth={7} />
  )
}
