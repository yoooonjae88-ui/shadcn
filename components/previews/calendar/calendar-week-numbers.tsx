"use client"

import * as React from "react"

import { Calendar } from "@/registry/calendar/calendar"

// showWeekNumber adds an ISO week column; weeks start on Monday.
export function CalendarWeekNumbersExample() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      showWeekNumber
      weekStartsOn={1}
    />
  )
}
