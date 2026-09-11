"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/registry/calendar/calendar"

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

// A range constrained to at least 3 and at most 7 days.
export function CalendarMinMaxExample() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  })

  return <Calendar mode="range" selected={range} onSelect={setRange} min={3} max={7} />
}
