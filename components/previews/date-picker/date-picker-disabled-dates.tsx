"use client"

import * as React from "react"

import { DatePicker } from "@/registry/date-picker/date-picker"

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

// minDate / maxDate bound the window; disabledDate knocks out individual days
// inside it — here, weekends. Typed dates are held to the same rules.
export function DatePickerDisabledDatesExample() {
  const today = new Date()
  const [value, setValue] = React.useState<Date | null>(null)

  return (
    <div className="flex flex-col items-start gap-1">
      <DatePicker
        value={value}
        onChange={setValue}
        placeholder="Weekday only"
        minDate={today}
        maxDate={addDays(today, 45)}
        disabledDate={(date) => date.getDay() === 0 || date.getDay() === 6}
      />
      <p className="text-xs text-muted-foreground">
        Weekdays in the next 45 days.
      </p>
    </div>
  )
}
