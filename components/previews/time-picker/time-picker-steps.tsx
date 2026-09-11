"use client"

import { TimePicker } from "@/registry/time-picker/time-picker"

function at(h: number, m = 0, s = 0) {
  const d = new Date()
  d.setHours(h, m, s, 0)
  return d
}

// hourStep / minuteStep / secondStep thin out each column.
export function TimePickerStepsExample() {
  return (
    <TimePicker
      defaultValue={at(10, 30, 0)}
      hourStep={2}
      minuteStep={15}
      secondStep={10}
    />
  )
}
