"use client"

import { DatePicker } from "@/registry/date-picker/date-picker"

// The format drives both the display and how typed text is read back, so
// `07-03-2026` in the default en-SG field is the 7th of March. Tokens can be
// written dayjs-style (DD-MM-YYYY) or the `dd-MM-yyyy` way — both mean the same.
export function DatePickerFormatExample() {
  const date = new Date(2026, 2, 7)

  return (
    <div className="flex flex-wrap items-start gap-4">
      <DatePicker defaultValue={date} />
      <DatePicker defaultValue={date} format="dd/MM/yyyy" />
      <DatePicker defaultValue={date} format="YYYY-MM-DD" />
      <DatePicker defaultValue={date} format="D MMMM YYYY" className="w-48" />
      <DatePicker defaultValue={date} format="ddd, D MMM" />
    </div>
  )
}
