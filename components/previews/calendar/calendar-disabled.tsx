"use client"

import * as React from "react"

import { Calendar } from "@/registry/calendar/calendar"

// Weekends and past days are unselectable via the disabled matchers.
export function CalendarDisabledExample() {
  const [date, setDate] = React.useState<Date | undefined>()

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={[{ dayOfWeek: [0, 6] }, { before: new Date() }]}
    />
  )
}
