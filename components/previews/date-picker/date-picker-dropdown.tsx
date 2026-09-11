"use client"

import { DatePicker } from "@/registry/date-picker/date-picker"

// captionLayout="dropdown" swaps the month label for month & year selects —
// the quickest way to reach a birthday decades back.
export function DatePickerDropdownExample() {
  return (
    <DatePicker
      defaultValue={new Date(1996, 6, 12)}
      captionLayout="dropdown"
      minDate={new Date(1930, 0, 1)}
      maxDate={new Date()}
      showToday={false}
      placeholder="Date of birth"
    />
  )
}
