"use client"

import { DatePicker } from "@/registry/date-picker/date-picker"

// The format string drives both the display and how typed text is read back,
// so `07/03/2026` in a DD/MM/YYYY field is the 7th of March.
export function DatePickerFormatExample() {
  const date = new Date(2026, 2, 7)

  return (
    <div className="flex flex-wrap items-start gap-4">
      <DatePicker defaultValue={date} format="YYYY-MM-DD" />
      <DatePicker defaultValue={date} format="DD/MM/YYYY" />
      <DatePicker defaultValue={date} format="D MMMM YYYY" className="w-48" />
      <DatePicker defaultValue={date} format="ddd, MMM D" />
    </div>
  )
}
