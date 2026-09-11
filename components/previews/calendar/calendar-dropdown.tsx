"use client"

import * as React from "react"

import { Calendar } from "@/registry/calendar/calendar"

// captionLayout="dropdown" swaps the caption for month and year dropdowns.
export function CalendarDropdownExample() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      captionLayout="dropdown"
      defaultMonth={date}
      startMonth={new Date(new Date().getFullYear() - 10, 0)}
      endMonth={new Date(new Date().getFullYear() + 10, 11)}
    />
  )
}
