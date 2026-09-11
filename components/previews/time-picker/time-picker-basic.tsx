"use client"

import * as React from "react"

import { TimePicker } from "@/registry/time-picker/time-picker"

function at(h: number, m = 0, s = 0) {
  const d = new Date()
  d.setHours(h, m, s, 0)
  return d
}

// Click to open, scroll or click a cell to pick, OK to confirm.
export function TimePickerBasicExample() {
  const [value, setValue] = React.useState<Date | null>(at(9, 30, 0))
  return (
    <div className="flex flex-col items-start gap-1">
      <TimePicker value={value} onChange={setValue} />
      <p className="text-xs text-muted-foreground">
        {value ? value.toLocaleTimeString() : "No time selected."}
      </p>
    </div>
  )
}
