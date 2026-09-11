"use client"

import * as React from "react"

import { DatePicker } from "@/registry/date-picker/date-picker"

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

// DatePicker.RangePicker fills the field you focused: pick a start and the
// caret moves to the end, and the span previews as you hover.
export function DatePickerRangeExample() {
  const [value, setValue] = React.useState<[Date | null, Date | null]>([
    new Date(),
    addDays(new Date(), 6),
  ])

  return (
    <div className="flex flex-col items-start gap-1">
      <DatePicker.RangePicker value={value} onChange={setValue} />
      <p className="text-xs text-muted-foreground">
        {value[0] && value[1]
          ? `${value[0].toLocaleDateString("en-SG")} → ${value[1].toLocaleDateString("en-SG")}`
          : "Pick a start and end date."}
      </p>
    </div>
  )
}
