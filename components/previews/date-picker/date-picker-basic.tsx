"use client"

import * as React from "react"

import { DatePicker } from "@/registry/date-picker/date-picker"

// Click to open the calendar, or type straight into the field.
export function DatePickerBasicExample() {
  const [value, setValue] = React.useState<Date | null>(new Date())

  return (
    <div className="flex flex-col items-start gap-1">
      <DatePicker value={value} onChange={setValue} />
      <p className="text-xs text-muted-foreground">
        {value ? value.toLocaleDateString() : "No date selected."}
      </p>
    </div>
  )
}
