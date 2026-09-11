"use client"

import * as React from "react"

import { Calendar } from "@/registry/calendar/calendar"

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

// mode="multiple" collects any number of individual days.
export function CalendarMultipleExample() {
  const [dates, setDates] = React.useState<Date[] | undefined>([
    new Date(),
    addDays(new Date(), 2),
    addDays(new Date(), 5),
  ])

  return (
    <div className="flex flex-col items-start gap-1">
      <Calendar mode="multiple" selected={dates} onSelect={setDates} />
      <p className="px-3 text-xs text-muted-foreground">
        {dates?.length
          ? `${dates.length} day${dates.length > 1 ? "s" : ""} selected`
          : "Pick one or more dates."}
      </p>
    </div>
  )
}
