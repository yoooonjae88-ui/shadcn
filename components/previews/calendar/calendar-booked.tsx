"use client"

import * as React from "react"

import { Calendar } from "@/registry/calendar/calendar"

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

// Booked days are disabled and struck through via a custom modifier.
export function CalendarBookedExample() {
  const booked = [
    addDays(new Date(), 1),
    addDays(new Date(), 2),
    addDays(new Date(), 3),
    addDays(new Date(), 8),
    addDays(new Date(), 14),
  ]
  const [date, setDate] = React.useState<Date | undefined>()

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={booked}
      modifiers={{ booked }}
      modifiersClassNames={{ booked: "[&>button]:line-through" }}
    />
  )
}
