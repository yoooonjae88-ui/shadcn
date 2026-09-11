"use client"

import * as React from "react"

import { Calendar } from "@/registry/calendar/calendar"

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Default mode — click a day to select it, click again to clear.
export function CalendarSingleExample() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex flex-col items-start gap-1">
      <Calendar mode="single" selected={date} onSelect={setDate} />
      <p className="px-3 text-xs text-muted-foreground">
        {date ? `Selected: ${formatDate(date)}` : "Pick a date."}
      </p>
    </div>
  )
}
