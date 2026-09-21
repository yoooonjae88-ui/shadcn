"use client"

import { DatePicker } from "@/registry/date-picker/date-picker"

export function DatePickerDisabledExample() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <DatePicker defaultValue={new Date(2026, 2, 7)} disabled />
      <DatePicker
        defaultValue={new Date(2026, 2, 7)}
        inputReadOnly
        placeholder="Panel only"
      />
    </div>
  )
}
