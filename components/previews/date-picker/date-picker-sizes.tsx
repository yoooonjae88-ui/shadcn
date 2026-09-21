"use client"

import { DatePicker } from "@/registry/date-picker/date-picker"

export function DatePickerSizesExample() {
  const date = new Date(2026, 2, 7)

  return (
    <div className="flex flex-wrap items-start gap-4">
      <DatePicker defaultValue={date} size="small" />
      <DatePicker defaultValue={date} size="middle" />
      <DatePicker defaultValue={date} size="large" />
    </div>
  )
}
