"use client"

import { DatePicker } from "@/registry/date-picker/date-picker"

export function DatePickerVariantsExample() {
  const date = new Date(2026, 2, 7)

  return (
    <div className="flex flex-wrap items-start gap-4">
      <DatePicker defaultValue={date} variant="outlined" />
      <DatePicker defaultValue={date} variant="filled" />
      <DatePicker defaultValue={date} variant="borderless" />
      <DatePicker defaultValue={date} variant="underlined" />
    </div>
  )
}
