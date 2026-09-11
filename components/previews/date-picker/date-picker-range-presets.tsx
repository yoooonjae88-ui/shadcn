"use client"

import * as React from "react"

import { DatePicker } from "@/registry/date-picker/date-picker"

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

// Range presets commit both ends at once — the usual reporting shortcuts.
export function DatePickerRangePresetsExample() {
  const today = new Date()
  const [value, setValue] = React.useState<[Date | null, Date | null]>([
    addDays(today, -6),
    today,
  ])

  return (
    <div className="flex flex-col items-start gap-1">
      <DatePicker.RangePicker
        value={value}
        onChange={setValue}
        presets={[
          { label: "Last 7 days", value: [addDays(today, -6), today] },
          { label: "Last 30 days", value: [addDays(today, -29), today] },
          { label: "Next 7 days", value: [today, addDays(today, 6)] },
          { label: "This month", value: [
            new Date(today.getFullYear(), today.getMonth(), 1),
            new Date(today.getFullYear(), today.getMonth() + 1, 0),
          ] },
        ]}
      />
      <p className="text-xs text-muted-foreground">
        {value[0] && value[1]
          ? `${value[0].toLocaleDateString("en-SG")} → ${value[1].toLocaleDateString("en-SG")}`
          : "Pick a range."}
      </p>
    </div>
  )
}
