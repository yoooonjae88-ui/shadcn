"use client"

import { TimePicker } from "@/registry/time-picker/time-picker"

function at(h: number, m = 0, s = 0) {
  const d = new Date()
  d.setHours(h, m, s, 0)
  return d
}

// disabledTime greys out early/late hours and specific minutes for 11 o'clock.
export function TimePickerDisabledTimeExample() {
  return (
    <TimePicker
      defaultValue={at(11, 30)}
      disabledTime={() => ({
        disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 22, 23],
        disabledMinutes: (h) => (h === 11 ? [0, 15, 30] : []),
        disabledSeconds: () => [],
      })}
    />
  )
}
