"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/registry/calendar/calendar"

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// mode="range" selects a from/to span; the ends are filled, the middle tinted.
export function CalendarRangeExample() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 6),
  })

  return (
    <div className="flex flex-col items-start gap-1">
      <Calendar mode="range" selected={range} onSelect={setRange} />
      <p className="px-3 text-xs text-muted-foreground">
        {range?.from
          ? `${formatDate(range.from)} → ${range.to ? formatDate(range.to) : "…"}`
          : "Pick a start and end date."}
      </p>
    </div>
  )
}
