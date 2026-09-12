"use client"

import {
  CalendarView,
  type CalendarEvent,
} from "@/registry/calendar-view/calendar-view"

const events: CalendarEvent[] = [
  {
    id: "standup",
    title: "Standup",
    start: "2026-07-08T09:00",
    end: "2026-07-08T09:30",
  },
  {
    id: "design-review",
    title: "Design review",
    start: "2026-07-08T12:00",
    end: "2026-07-08T13:00",
  },
  {
    id: "retro",
    title: "Retro",
    start: "2026-07-09T16:00",
    end: "2026-07-09T17:00",
  },
  {
    id: "offsite",
    title: "Offsite",
    start: "2026-07-10",
    status: "out-of-office",
  },
]

// In Week view the time grid keeps one hour at a readable height and scrolls,
// which is right in a page flow. `fitDay` spreads all 24 hours across the
// height instead, so a calendar filling a panel shows the whole day at once.
export function CalendarViewWeekFitExample() {
  return (
    <div className="h-[34rem] w-full rounded-xl border p-3">
      <CalendarView
        fitDay
        defaultView="week"
        defaultMonth={new Date(2026, 6, 8)}
        events={events}
      />
    </div>
  )
}
