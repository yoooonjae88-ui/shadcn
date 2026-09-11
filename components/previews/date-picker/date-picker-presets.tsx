"use client"

import * as React from "react"

import { DatePicker } from "@/registry/date-picker/date-picker"

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

// Presets sit beside the calendar and commit in one click.
export function DatePickerPresetsExample() {
  const today = new Date()
  const [value, setValue] = React.useState<Date | null>(today)

  return (
    <div className="flex flex-col items-start gap-1">
      <DatePicker
        value={value}
        onChange={setValue}
        presets={[
          { label: "Today", value: today },
          { label: "Tomorrow", value: addDays(today, 1) },
          { label: "In a week", value: addDays(today, 7) },
          { label: "In a month", value: addDays(today, 30) },
        ]}
      />
      <p className="text-xs text-muted-foreground">
        {value ? value.toLocaleDateString() : "No date selected."}
      </p>
    </div>
  )
}
