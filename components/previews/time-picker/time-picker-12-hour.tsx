"use client"

import * as React from "react"

import { TimePicker } from "@/registry/time-picker/time-picker"

function at(h: number, m = 0, s = 0) {
  const d = new Date()
  d.setHours(h, m, s, 0)
  return d
}

// use12Hours adds an AM/PM column and shows hours 1–12.
export function TimePicker12HourExample() {
  const [value, setValue] = React.useState<Date | null>(at(14, 15, 0))
  return <TimePicker value={value} onChange={setValue} use12Hours />
}
