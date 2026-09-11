"use client"

import { DatePicker } from "@/registry/date-picker/date-picker"

// status colours the field for validation feedback, in every variant.
export function DatePickerStatusExample() {
  const date = new Date(2026, 2, 7)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start gap-4">
        <DatePicker defaultValue={date} status="error" />
        <DatePicker defaultValue={date} status="warning" />
      </div>
      <div className="flex flex-wrap items-start gap-4">
        <DatePicker defaultValue={date} variant="filled" status="error" />
        <DatePicker defaultValue={date} variant="filled" status="warning" />
      </div>
    </div>
  )
}
