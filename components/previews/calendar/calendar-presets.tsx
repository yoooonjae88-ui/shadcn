"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
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

// Preset buttons drive the controlled selection and jump the visible month.
export function CalendarPresetsExample() {
  const today = new Date()
  const [date, setDate] = React.useState<Date | undefined>(today)
  const [month, setMonth] = React.useState<Date>(today)

  const presets: { label: string; date: Date }[] = [
    { label: "Today", date: today },
    { label: "Tomorrow", date: addDays(today, 1) },
    { label: "In 3 days", date: addDays(today, 3) },
    { label: "In a week", date: addDays(today, 7) },
    { label: "In 2 weeks", date: addDays(today, 14) },
    { label: "In a month", date: addDays(today, 30) },
  ]

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col gap-1.5 pt-3">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant={
              date?.toDateString() === preset.date.toDateString()
                ? "default"
                : "secondary"
            }
            size="sm"
            onClick={() => {
              setDate(preset.date)
              setMonth(preset.date)
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-col items-start gap-1">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={month}
          onMonthChange={setMonth}
        />
        <p className="px-3 text-xs text-muted-foreground">
          {date ? `Selected: ${formatDate(date)}` : "Pick a date."}
        </p>
      </div>
    </div>
  )
}
