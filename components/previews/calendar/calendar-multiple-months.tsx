"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/registry/calendar/calendar"

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

// numberOfMonths={2} with pagedNavigation pages two months at a time.
export function CalendarMultipleMonthsExample() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), 10),
    to: addDays(new Date(), 34),
  })

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      pagedNavigation
    />
  )
}
