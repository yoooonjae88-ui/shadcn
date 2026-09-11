"use client"

import { Timer } from "lucide-react"

import { TimePicker } from "@/registry/time-picker/time-picker"

function at(h: number, m = 0, s = 0) {
  const d = new Date()
  d.setHours(h, m, s, 0)
  return d
}

// A custom prefix node and a custom suffixIcon replacing the clock.
export function TimePickerPrefixSuffixExample() {
  return (
    <TimePicker
      defaultValue={at(9, 0)}
      prefix={<Timer className="size-4" />}
      suffixIcon={<Timer className="size-4" />}
    />
  )
}
