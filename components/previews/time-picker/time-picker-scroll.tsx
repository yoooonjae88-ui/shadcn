"use client"

import { TimePicker } from "@/registry/time-picker/time-picker"

function at(h: number, m = 0, s = 0) {
  const d = new Date()
  d.setHours(h, m, s, 0)
  return d
}

// changeOnScroll selects the centred cell as you scroll a column.
export function TimePickerScrollExample() {
  return <TimePicker defaultValue={at(8, 0, 0)} changeOnScroll needConfirm />
}
