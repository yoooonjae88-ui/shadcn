"use client"

import { TimePicker } from "@/registry/time-picker/time-picker"

function at(h: number, m = 0, s = 0) {
  const d = new Date()
  d.setHours(h, m, s, 0)
  return d
}

// The format token string drives both the display and which columns show.
export function TimePickerFormatExample() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <TimePicker defaultValue={at(10, 20)} format="HH:mm" />
      <TimePicker defaultValue={at(13, 5)} format="h:mm a" />
    </div>
  )
}
