"use client"

import * as React from "react"

import { TimePicker } from "@/registry/time-picker/time-picker"

function at(h: number, m = 0, s = 0) {
  const d = new Date()
  d.setHours(h, m, s, 0)
  return d
}

// TimePicker.RangePicker edits a start → end pair; order sorts them on confirm.
export function TimePickerRangeExample() {
  const [value, setValue] = React.useState<[Date | null, Date | null]>([
    at(9, 0),
    at(17, 30),
  ])
  return (
    <div className="flex flex-col items-start gap-1">
      <TimePicker.RangePicker value={value} onChange={setValue} />
      <p className="text-xs text-muted-foreground">
        {value[0] && value[1]
          ? `${value[0].toLocaleTimeString()} → ${value[1].toLocaleTimeString()}`
          : "Pick a start and end time."}
      </p>
    </div>
  )
}
