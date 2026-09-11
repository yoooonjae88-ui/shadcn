"use client"

import { TimePicker } from "@/registry/time-picker/time-picker"

function at(h: number, m = 0, s = 0) {
  const d = new Date()
  d.setHours(h, m, s, 0)
  return d
}

export function TimePickerStatusExample() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <TimePicker defaultValue={at(9, 0)} status="error" />
      <TimePicker defaultValue={at(9, 0)} status="warning" />
    </div>
  )
}
